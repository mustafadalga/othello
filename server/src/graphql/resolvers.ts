import { GraphQLError } from 'graphql';
import { isValidObjectId } from "mongoose";
import Game from "@/models/Game";
import Move from "@/models/Move"
import type { Move as IMove } from "@/types"
import { MongoError } from "mongodb";
import { Gamer, SubscriptionMessages, GamerStatus } from "@/enums";
import { GAMERS_THRESHOLD } from "@/constansts";

import { PubSub } from "graphql-subscriptions";

const pubsub = new PubSub();

interface AddPlayer {
    roomID: string
    gamerID: string
}

interface ExitGame {
    roomID: string
    gamerID: string
}

interface FinishGame {
    _id: string
    winnerGamer: string,
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
                    extensions: { code: 'BAD_USER_INPUT' },
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
                            extensions: { code: 'NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input.", {
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
                    extensions: { code: 'BAD_USER_INPUT' },
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
                            extensions: { code: 'NOT_FOUND' },
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
        createGame: (parent, { playAgainstComputer }: { playAgainstComputer: boolean }) => {
            try {
                const game = new Game({
                    playAgainstComputer
                });
                return game.save();
            } catch (e) {
                throw new GraphQLError("Failed to create the game due to invalid input.", {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
        addPlayer: async (parent: unknown, { data }: { data: AddPlayer }) => {
            if (!data.roomID || !data.gamerID) {
                throw new GraphQLError("Game id and gamer is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(data.roomID)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            try {
                const game = await Game.findById({ _id: data.roomID });
                if (!game) {
                    throw new Error('Game not found');
                }

                if (game.gamers.length >= 2) {
                    throw new Error('Room is full');
                }

                const hasPlayer = game.gamers.some(gamer => gamer.id === data.gamerID);
                if (hasPlayer) {
                    throw new Error('Player already exists');
                }

                const hasBlackPlayer = game.gamers.some(gamer => gamer.color === Gamer.BLACK);
                const gamerData = {
                    id: data.gamerID,
                    color: hasBlackPlayer ? Gamer.WHITE : Gamer.BLACK,
                    status: GamerStatus.CONNECTED
                }
                game.gamers.push(gamerData);

                if (game.gamers.length == GAMERS_THRESHOLD) {
                    pubsub.publish(SubscriptionMessages.GAME_STARTED, { gameStarted: true })
                    game.isGameStarted = true;
                }

                return game.save();
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'NOT_FOUND' },
                        });
                    case 'Room is full':
                        throw new GraphQLError('Room is full. Please provide a valid game ID.', {
                            extensions: { code: "ROOM_IS_FULL" },
                        });
                    case "Player already exists":
                        throw new GraphQLError('Player already exists. Please provide a valid game ID.', {
                            extensions: { code: "PLAYER_ALREADY_EXISTS" },
                        })
                    default:
                        throw new GraphQLError("Failed to create the game due to invalid input.", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        createMove: async (parent: unknown, { move }: { move: IMove }) => {

             try {
                const newMove = new Move(move);
                const response = await newMove.save();

                if (response instanceof MongoError) {
                    throw response;
                }

                 const topic = `${SubscriptionMessages.GAME_MOVE}_${move.gameID}`;
                 pubsub.publish(topic, { gameMove: move });

                return response;
            } catch (error) {
                if (error instanceof MongoError && error.code == 11000) {
                    throw new GraphQLError(`A move with the same row (${move.row}), col (${move.col}), and gameID (${move.gameID}) already exists.`, {
                        extensions: { code: 'DUPLICATE_MOVE' },
                    });
                }

                throw new GraphQLError("Failed to create the game due to invalid input.", {
                    extensions: { code: 'INTERNAL_SERVER_ERROR' },
                });
            }
        },
        finishGame: async (parent: unknown, { data }: { data: FinishGame }) => {
            if (!data._id) {
                throw new GraphQLError("Game id is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(data._id)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }


            try {
                const game = await Game.findOneAndUpdate({ _id: data._id }, {
                    winnerGamer: data.winnerGamer,
                    isGameStarted: false,
                    isGameFinished: true,
                    moveOrder: null
                });

                if (!game) {
                    throw new Error('Game not found');
                }
                pubsub.publish(SubscriptionMessages.GAME_FINISHED, { gameFinished: true })
                return game;
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'NOT_FOUND' },
                        });
                    default:
                        throw new GraphQLError("Failed to finish the game", {
                            extensions: { code: 'INTERNAL_SERVER_ERROR' },
                        });
                }
            }
        },
        exitGame: async (parent: unknown, { data }: { data: ExitGame }) => {
            if (!data.roomID || !data.gamerID) {
                throw new GraphQLError("Game id and gamer is required", {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            if (!isValidObjectId(data.roomID)) {
                throw new GraphQLError('Invalid game ID. Please provide a valid game ID.', {
                    extensions: { code: 'BAD_USER_INPUT' },
                });
            }

            try {
                const game = await Game.findById({ _id: data.roomID });
                if (!game) {
                    throw new Error('Game not found');
                }
                game.exitGamer = data.gamerID;
                game.isGameFinished = true;
                game.moveOrder = null;
                game.save();
                pubsub.publish(SubscriptionMessages.GAME_EXIT, { gameExit: data.gamerID })
                return game;
            } catch (error) {
                throw new GraphQLError("Failed to exit the game", {
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
                const game = await Game.findOneAndUpdate({ _id }, {
                    winnerGamer: null,
                    isGameStarted: true,
                    isGameFinished: false,
                    moveOrder: Gamer.BLACK
                });

                if (!game) {
                    throw new Error('Game not found');
                }

                await Move.deleteMany({ gameID: _id });

                pubsub.publish(SubscriptionMessages.GAME_FINISHED, { gameFinished: true })
                return game;
            } catch (error) {
                switch (error.message) {
                    case 'Game not found':
                        throw new GraphQLError('Game not found. Please provide a valid game ID.', {
                            extensions: { code: 'NOT_FOUND' },
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
        gameMove: {
            subscribe: (parent, { gameID }) => {
                const topic = `${SubscriptionMessages.GAME_MOVE}_${gameID}`;
                return pubsub.asyncIterator([topic]);
            },
        },
        gameStarted: {
            subscribe: () => pubsub.asyncIterator(SubscriptionMessages.GAME_STARTED)
        },
        gameFinished: {
            subscribe: () => pubsub.asyncIterator(SubscriptionMessages.GAME_FINISHED)
        },
        gameExit: {
            subscribe: () => pubsub.asyncIterator(SubscriptionMessages.GAME_EXIT)
        },
        gamerConnected: {
            subscribe: () => pubsub.asyncIterator(SubscriptionMessages.GAMER_CONNECTED)
        },
        gamerDisconnected: {
            subscribe: () => pubsub.asyncIterator(SubscriptionMessages.GAMER_DISCONNECTED)
        }
    }
}