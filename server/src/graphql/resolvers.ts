import { GraphQLError } from 'graphql';
import { MongoError } from "mongodb";
import { isValidObjectId, Types } from "mongoose";
import Game from "@/models/Game";
import Move from "@/models/Move"
import {
    MAX_GAMER_COUNT,
    INITIAL__STONES,
    INITIAL_GAMER_STONE_COUNT,
} from "@/constansts";
import getNextGamerSide from "@/utilities/getNextGamerSide";
import pubsub from "@/pubsub"
import { EGamer, GamerStatus, SubscriptionMessages } from "@/enums";
import type { IGamer, IMove } from "@/types"

interface AddPlayer {
    gameID: string
    gamerID: string
}

interface UpdateGame {
    _id: string
    isGameFinished: boolean
    isGameStarted: boolean
    moveOrder: string
    winnerGamer: string
    exitGamer: string
    gamers: Types.DocumentArray<IGamer>
}

export default {
    Query: {
        gameByID: async (parent, { _id }: { _id: string }) => {
            if (!_id) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            if (!isValidObjectId(_id)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'GAME_NOT_FOUND' },
                });
            }

            try {
                const game = await Game.findById({ _id });
                if (!game) {
                    throw new Error('Game not found');
                }
                return game
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input. Please check your entries and try again.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        movesByGameID: async (parent: unknown, { gameID }: { gameID: string }) => {
            if (!gameID) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            if (!isValidObjectId(gameID)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'GAME_NOT_FOUND' },
                });
            }

            try {
                const moves = await Move.find({ gameID });
                if (!moves) {
                    throw new Error('Moves not found');
                }

                return moves
            } catch (error) {
                switch (error.message) {
                    case 'Moves not found':
                        throw new GraphQLError('Moves not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        gamersStoneCountByGameID: async (parent: unknown, { gameID }: { gameID: string }) => {
            if (!gameID) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }
            if (!isValidObjectId(gameID)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'GAME_NOT_FOUND' },
                });
            }

            try {
                const game = await Game.findById(gameID);
                if (!game) {
                    throw new Error('Game not found');
                }

                const moves = await Move.find({ gameID });
                if (!moves) {
                    throw new Error('Moves not found');
                }

                return {
                    game: game,
                    count: {
                        [EGamer.BLACK]: moves.filter(move => move.gamer == EGamer.BLACK).length,
                        [EGamer.WHITE]: moves.filter(move => move.gamer == EGamer.WHITE).length,
                    }
                }

            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    case 'Moves not found':
                        throw new GraphQLError('Moves not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        }
    },
    Mutation: {
        createGame: () => {
            try {
                const game = new Game();
                Move.insertMany(INITIAL__STONES.map(stone => ({ ...stone, gameID: game._id })));
                return game.save();
            } catch (e) {
                throw new GraphQLError("Failed to create the game due to invalid input.", {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
        addPlayer: async (parent: unknown, { data }: { data: AddPlayer }) => {
            if (!data.gameID || !data.gamerID) {
                throw new GraphQLError("Game id and gamer is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(data.gameID)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'GAME_NOT_FOUND' },
                });
            }

            try {
                const game = await Game.findById({ _id: data.gameID });
                if (!game) {
                    throw new Error('Game not found');
                }

                if (game.gamers.length >= MAX_GAMER_COUNT) {
                    throw new Error('Room is full');
                }

                const hasPlayer = game.gamers.some(gamer => gamer.id === data.gamerID);
                if (hasPlayer) {
                    return game;
                }

                const color = getNextGamerSide(game.gamers as IGamer[]);
                game.gamers.push({
                    id: data.gamerID,
                    color,
                    status: GamerStatus.CONNECTED
                });


                // sent initial moves data to subscribers
                const allMoves = await Move.find({ gameID: data.gameID });

                pubsub.publish(`${SubscriptionMessages.GAME_MOVED}_${data.gameID}`, { gameMoved: allMoves });

                if (game.gamers.length == MAX_GAMER_COUNT) {
                    // start game with black gamer
                    game.isGameStarted = true;
                    const gamer = game.gamers.find(gamer => gamer.color == EGamer.BLACK);
                    if (gamer?.id) {
                        game.moveOrder = gamer.id;
                    }

                    pubsub.publish(`${SubscriptionMessages.GAME_UPDATED}_${data.gameID}`, { gameUpdated: game });
                }

                return game.save();
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    case 'Room is full':
                        throw new GraphQLError('Room is full. Please provide a valid game ID.', {
                            extensions: { code: "GAME_FULL" },
                        });
                    case "Player already exists":
                        throw new GraphQLError('Player already exists!', {
                            extensions: { code: "PLAYER_ALREADY_EXISTS" },
                        })
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input. Please check your entries and try again.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        updateGame: async (parent: unknown, { data }: { data: UpdateGame }) => {
            if (!data._id) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(data._id)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'GAME_NOT_FOUND' },
                });
            }

            try {
                const game = await Game.findById({ _id: data._id });
                if (!game) {
                    throw new Error('Game not found');
                }

                if (data.isGameFinished !== undefined) game.isGameFinished = data.isGameFinished;
                if (data.isGameStarted !== undefined) game.isGameStarted = data.isGameStarted;
                if (data.moveOrder !== undefined) game.moveOrder = data.moveOrder;
                if (data.winnerGamer !== undefined) game.winnerGamer = data.winnerGamer;
                if (data.exitGamer !== undefined) game.exitGamer = data.exitGamer;
                if (data.gamers !== undefined) game.gamers = data.gamers;

                pubsub.publish(`${SubscriptionMessages.GAME_UPDATED}_${data._id}`, { gameUpdated: game });

                return game.save();
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input. Please check your entries and try again.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        createMoves: async (parent: unknown, { moves }: { moves: IMove[] }) => {
            try {
                const gameID = moves[0].gameID;
                const gamer = moves[0].gamer
                const updateGameMoveOrder = async () => {
                    const game = await Game.findById({ _id: gameID });
                    const index = game.gamers.findIndex(gamerItem => gamerItem.color == gamer);
                    game.moveOrder = game.gamers[index == 0 ? 1 : 0].id
                    return await game.save();
                }
                const bulkUpdateMoves = () => {
                    return Move.bulkWrite(moves.map(move => ({
                        updateOne: {
                            filter: { row: move.row, col: move.col, gameID: move.gameID },
                            update: { $set: move },
                            upsert: true
                        }
                    })))
                }

                const [ _, gameResponse ] = await Promise.all([ bulkUpdateMoves(), updateGameMoveOrder() ]);
                const allMoves = await Move.find({ gameID });

                pubsub.publish(`${SubscriptionMessages.GAME_MOVED}_${gameID}`, { gameMoved: moves });
                pubsub.publish(`${SubscriptionMessages.GAME_UPDATED}_${gameID}`, { gameUpdated: gameResponse });
                pubsub.publish(`${SubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${gameID}`, {
                    gamersStoneCountUpdated: {
                        game: gameResponse,
                        count: {
                            [EGamer.BLACK]: allMoves.filter(move => move.gamer == EGamer.BLACK).length,
                            [EGamer.WHITE]: allMoves.filter(move => move.gamer == EGamer.WHITE).length,
                        }
                    }
                });

                return moves;
            } catch (error) {
                if (error instanceof MongoError && error.code == 11000) {
                    const move = moves[0]
                    throw new GraphQLError(`A move with the same row (${move.row}), col (${move.col}), and gameID (${move.gameID}) already exists.`, {
                        extensions: { code: 'DUPLICATE_MOVE' },
                    });
                }

                throw new GraphQLError("Failed to create the game due to invalid input.", {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
        restartGame: async (parent: unknown, { _id }: { _id: string }) => {
            if (!_id) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(_id)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            try {

                const game = await Game.findById(_id);
                if (!game) {
                    throw new Error('Game not found');
                }

                if (game.gamers.length != MAX_GAMER_COUNT) return game;

                const restartGame = () => {
                    game.moveOrder = game.gamers.find(gamer => gamer.color == EGamer.BLACK)?.id || null;
                    game.gamers.forEach(gamer => gamer.canMove = true)
                    game.isGameStarted = true;
                    game.isGameFinished = false;
                    game.winnerGamer = null;
                    game.exitGamer = null;
                    game.save();
                };

                const restartMoves = async () => {
                    const bulkOps = [
                        // Add the delete operation to remove all moves for the specific gameID
                        {
                            deleteMany: {
                                filter: { gameID: _id }
                            }
                        },
                        // Add insert operations for each initial stone
                        ...INITIAL__STONES.map(stone => ({
                            insertOne: {
                                document: {
                                    gameID: _id,
                                    row: stone.row,
                                    col: stone.col,
                                    gamer: stone.gamer
                                }
                            }
                        }))
                    ];

                    await Move.bulkWrite(bulkOps);
                    return await Move.find({ gameID: _id });
                }

                restartGame();
                const allMoves = await restartMoves();
                pubsub.publish(`${SubscriptionMessages.GAME_UPDATED}_${_id}`, { gameUpdated: game });
                pubsub.publish(`${SubscriptionMessages.GAME_RESTARTED}_${_id}`, { gameRestarted: game });
                pubsub.publish(`${SubscriptionMessages.GAME_MOVED}_${_id}`, { gameMoved: allMoves });
                pubsub.publish(`${SubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${_id}`, {
                    gamersStoneCountUpdated: {
                        game,
                        count: {
                            [EGamer.BLACK]: INITIAL_GAMER_STONE_COUNT,
                            [EGamer.WHITE]: INITIAL_GAMER_STONE_COUNT,
                        }
                    }
                });

                return game;
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'GAME_NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to finish the game", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        }
    },
    Subscription: {
        gameMoved: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAME_MOVED}_${gameID}` ]),
        },
        gameStarted: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAME_STARTED}_${gameID}` ])
        },
        gameRestarted: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAME_RESTARTED}_${gameID}` ])
        },
        gameUpdated: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAME_UPDATED}_${gameID}` ])
        },
        gamersStoneCountUpdated: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${gameID}` ])
        },
        gamerConnection: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${SubscriptionMessages.GAMER_CONNECTION}_${gameID}` ])
        },
    }
}