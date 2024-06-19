import { GraphQLError } from 'graphql';
import { MongoError } from "mongodb";
import { isValidObjectId, ObjectId, Types } from "mongoose";
import Game from "@/models/Game";
import Move from "@/models/Move"
import handleWinnerGamer from "@/utilities/handleWinnerGamer";
import updateGameMoveOrder from "@/utilities/updateGameMoveOrder";
import bulkUpdateMoves from "@/utilities/bulkUpdateMoves";
import isAllStoneReversed from "@/utilities/isAllStoneReversed";
import restartMoves from "@/utilities/restartMoves";
import restartGame from "@/utilities/restartGame";
import getNextGamerSide from "@/utilities/getNextGamerSide";
import getGamersStoneCount from "@/utilities/getGamersStoneCount";
import pubsub from "@/pubsub"
import {
    MAX_GAMER_COUNT,
    INITIAL__STONES,
    GRAPHQL_ERROR_MESSAGES
} from "@/constansts";
import {
    EGamer,
    EGamerStatus,
    ESubscriptionMessages,
    GRAPHQL_ERROR_CODES
} from "@/enums";
import type { IGameDocument, IGamer, IMove } from "@/types"

interface AddPlayer {
    gameID: string
    gamerID: string
}

interface UpdateGame {
    _id: ObjectId
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
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }
            if (!isValidObjectId(_id)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                });
            }

            try {
                const game = await Game.findById({ _id });
                if (!game) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND);
                }
                return game
            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND:
                        throw new GraphQLError(error.message, {
                            extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GET_GAMES_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                        });
                }
            }
        },
        movesByGameID: async (parent: unknown, { gameID }: { gameID: string }) => {
            if (!gameID) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }
            if (!isValidObjectId(gameID)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                });
            }

            try {
                const moves = await Move.find({ gameID });
                if (!moves) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.MOVES_NOT_FOUND);
                }

                return moves
            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.MOVES_NOT_FOUND:
                        throw new GraphQLError(error.response, {
                            extensions: { code: GRAPHQL_ERROR_CODES.MOVES_NOT_FOUND },
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GET_MOVES_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                        });
                }
            }
        },
        gamersStoneCountByGameID: async (parent: unknown, { gameID }: { gameID: string }) => {
            if (!gameID) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }
            if (!isValidObjectId(gameID)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                });
            }

            try {
                const game = await Game.findById(gameID);
                if (!game) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND);
                }

                const moves = await Move.find({ gameID });
                if (!moves) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.MOVES_NOT_FOUND);
                }

                return {
                    game: game,
                    count: getGamersStoneCount(moves)
                }

            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND:
                    case GRAPHQL_ERROR_MESSAGES.MOVES_NOT_FOUND:
                        throw new GraphQLError(error.message, {
                            extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GET_STONE_COUNTS_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
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
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.CREATE_GAME_FAILED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                });
            }
        },
        addPlayer: async (parent: unknown, { data }: { data: AddPlayer }) => {
            if (!data.gameID || !data.gamerID) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_AND_GAMER_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }

            if (!isValidObjectId(data.gameID)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                });
            }

            try {
                const game = await Game.findById({ _id: data.gameID });
                if (!game) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND);
                }

                if (game.gamers.length >= MAX_GAMER_COUNT) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.ROOM_IS_FULL);
                }

                const hasPlayer = game.gamers.some(gamer => gamer.id === data.gamerID);
                if (hasPlayer) {
                    return game;
                }

                const color = getNextGamerSide(game.gamers as IGamer[]);
                game.gamers.push({
                    id: data.gamerID,
                    color,
                    status: EGamerStatus.CONNECTED,
                    canMove: true
                });


                // sent initial moves data to subscribers
                const moves = await Move.find({ gameID: data.gameID });

                pubsub.publish(`${ESubscriptionMessages.GAME_MOVED}_${data.gameID}`, {
                    gameMoved: {
                        moves
                    }
                });

                if (game.gamers.length == MAX_GAMER_COUNT) {
                    // start game with black gamer
                    game.isGameStarted = true;
                    const gamer = game.gamers.find(gamer => gamer.color == EGamer.BLACK);
                    if (gamer?.id) {
                        game.moveOrder = gamer.id;
                    }

                    pubsub.publish(`${ESubscriptionMessages.GAME_UPDATED}_${data.gameID}`, { gameUpdated: game });
                }

                return game.save();
            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND:
                        throw new GraphQLError(error.response, {
                            extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                        });
                    case GRAPHQL_ERROR_MESSAGES.ROOM_IS_FULL:
                        throw new GraphQLError(error.response, {
                            extensions: { code: GRAPHQL_ERROR_CODES.ROOM_FULL},
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.ADD_PLAYER_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                        });
                }
            }
        },
        updateGame: async (parent: unknown, { data }: { data: UpdateGame }) => {
            if (!data._id) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }

            if (!isValidObjectId(data._id)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                });
            }

            try {
                const game = await Game.findById({ _id: data._id });
                if (!game) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND);
                }

                if (data.isGameStarted !== undefined) game.isGameStarted = data.isGameStarted;
                if (data.moveOrder !== undefined) game.moveOrder = data.moveOrder;
                if (data.winnerGamer !== undefined) game.winnerGamer = data.winnerGamer;
                if (data.exitGamer !== undefined) game.exitGamer = data.exitGamer;
                if (data.gamers !== undefined) game.gamers = data.gamers;


                await (async function handleGameFinish() {
                    if (data.isGameStarted == undefined) return;

                    game.isGameFinished = true;
                    await handleWinnerGamer(game, data._id);
                    const allMoves = await Move.find({ gameID: data._id });
                    // Send players' stone counts to subscribers for winner calculation upon game completion
                    pubsub.publish(`${ESubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${data._id}`, {
                        gamersStoneCountUpdated: {
                            game,
                            count: getGamersStoneCount(allMoves)
                        }
                    });
                })()

                pubsub.publish(`${ESubscriptionMessages.GAME_UPDATED}_${data._id}`, { gameUpdated: game });

                return game.save();
            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND:
                        throw new GraphQLError(error.response, {
                            extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.UPDATE_GAME_STATE_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                        });
                }
            }
        },
        createMoves: async (parent: unknown, { moves }: { moves: IMove[] }) => {
            try {
                const gameID: ObjectId = moves[0].gameID;
                const gamer: EGamer = moves[0].gamer;
                const handleGameFinish = async () => {
                    const game = await Game.findById(gameID);
                    game.isGameFinished = true;
                    game.isGameStarted = false;
                    game.moveOrder = null;
                    return handleWinnerGamer(game, gameID)
                }

                await bulkUpdateMoves(moves);
                const game: IGameDocument = await isAllStoneReversed(gameID) ? await handleGameFinish() : await updateGameMoveOrder(gameID, gamer)
                const allMoves = await Move.find({ gameID });

                pubsub.publish(`${ESubscriptionMessages.GAME_MOVED}_${gameID}`, { gameMoved: { moves: allMoves } });
                pubsub.publish(`${ESubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${gameID}`, {
                    gamersStoneCountUpdated: {
                        game,
                        count: getGamersStoneCount(allMoves)
                    }
                });

                //  a small delay to ensure `moves` is processed first
                setTimeout(() => {
                    pubsub.publish(`${ESubscriptionMessages.GAME_UPDATED}_${gameID}`, { gameUpdated: game });
                }, 50)

                return moves;
            } catch (error) {
                if (error instanceof MongoError && error.code == 11000) {
                    const move = moves[0]
                    throw new GraphQLError(`A move with the same row (${move.row}), col (${move.col}), and gameID (${move.gameID}) already exists.`, {
                        extensions: { code: GRAPHQL_ERROR_CODES.DUPLICATE_MOVE },
                    });
                }

                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.MAKE_MOVE_FAILED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                });
            }
        },
        restartGame: async (parent: unknown, { _id }: { _id: ObjectId }) => {
            if (!_id) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.GAME_ID_REQUIRED, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }

            if (!isValidObjectId(_id)) {
                throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.INVALID_GAME_ID, {
                    extensions: { code: GRAPHQL_ERROR_CODES.BAD_USER_INPUT },
                });
            }

            try {

                const game = await Game.findById(_id);
                if (!game) {
                    throw new Error(GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND);
                }

                if (game.gamers.length != MAX_GAMER_COUNT) return game;

                await restartGame(game);
                const moves = await restartMoves(_id);
                pubsub.publish(`${ESubscriptionMessages.GAME_MOVED}_${_id}`, {
                    gameMoved: {
                        moves,
                        isGameRestarted: true,
                    }
                });
                pubsub.publish(`${ESubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${_id}`, {
                    gamersStoneCountUpdated: {
                        game,
                        count: getGamersStoneCount(moves)
                    }
                });
                pubsub.publish(`${ESubscriptionMessages.GAME_UPDATED}_${_id}`, { gameUpdated: game });

                return game;
            } catch (error) {
                switch (error.message) {
                    case GRAPHQL_ERROR_MESSAGES.GAME_NOT_FOUND:
                        throw new GraphQLError(error.response, {
                            extensions: { code: GRAPHQL_ERROR_CODES.GAME_NOT_FOUND },
                        });
                    default:
                        throw new GraphQLError(GRAPHQL_ERROR_MESSAGES.FINISH_GAME_FAILED, {
                            extensions: { code: GRAPHQL_ERROR_CODES.INTERNAL_SERVER_ERROR },
                        });
                }
            }
        }
    },
    Subscription: {
        gameMoved: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${ESubscriptionMessages.GAME_MOVED}_${gameID}` ]),
        },
        gameStarted: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${ESubscriptionMessages.GAME_STARTED}_${gameID}` ])
        },
        gameUpdated: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${ESubscriptionMessages.GAME_UPDATED}_${gameID}` ])
        },
        gamersStoneCountUpdated: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${ESubscriptionMessages.GAMERS_STONE_COUNT_UPDATED}_${gameID}` ])
        },
        gamerConnection: {
            subscribe: (parent, { gameID }) => pubsub.asyncIterator([ `${ESubscriptionMessages.GAMER_CONNECTION}_${gameID}` ])
        },
    }
}