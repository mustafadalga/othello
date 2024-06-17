import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { MutationFunction, useMutation, useQuery, useSubscription } from "@apollo/client";
import { toast } from "react-toastify";
import createBoard from "@/_utilities/createBoard";
import createHints from "@/_utilities/createHints";
import reverseOpponentStones from "@/_utilities/reverseOpponentStones";
import graphQLError from "@/_utilities/graphQLError";
import { GET_GAME_BY_ID, GET_GAMERS_STONE_COUNT, GET_MOVES_BY_GAME_ID } from "@/_graphql/queries";
import { CREATE_MOVES, UPDATE_GAME } from "@/_graphql/mutations";
import { GAME_MOVED, GAME_RESTARTED, GAME_UPDATED, GAMERS_STONE_COUNT_UPDATED } from "@/_graphql/subscriptions";
import getActiveGamerData, { IActiveGamerData } from "@/_utilities/getActiveGamerData";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import { DIMENSION } from "@/_constants";
import { EGamer, ELocalStorage } from "@/_enums";
import {
    IGame,
    IGamersStoneCount,
    IMove,
    IMutationUpdateGame,
    IMutationUpdateGameVariables,
    IStone,
    IStones,
    SubscriptionGameMovedData,
    SubscriptionGameRestartedData,
    SubscriptionGamersStoneCountUpdatedData,
    SubscriptionGameUpdatedData
} from "@/_types";
import Cell from "./Cell";


export default function Board() {
    const { id } = useParams()
    const [ game, setGame ] = useState<IGame>()
    const [ board, setBoard ] = useState<IStones>(createBoard);
    const memoizedGame = useDeepCompareMemoize<IGame>(game as IGame);
    const activeMoveOrder = useDeepCompareMemoize<IActiveGamerData>(getActiveGamerData(game as IGame));
    const opponent = activeMoveOrder.gamer.color == EGamer.BLACK ? EGamer.WHITE : EGamer.BLACK;
    const opponentStones = board.filter(cell => cell.gamer === opponent)
    const hints = activeMoveOrder.isYourTurn ? createHints(board, opponentStones, activeMoveOrder.gamer.color) : [];
    const hasValidMove: boolean = !!hints.length;
    const isAllStoneReversed: boolean = board.every(cell => cell.gamer);

    useQuery<{ game: IGame }>(GET_GAME_BY_ID, {
        variables: {
            id,
        },
        onCompleted: ({ game }) => {
            if (game) {
                setGame(game);
            }
        }
    })

    useQuery<{ moves: IMove[] }>(GET_MOVES_BY_GAME_ID, {
        variables: {
            gameID: id
        },
        onCompleted: ({ moves }) => {
            if (moves) {
                setBoard(prevState => prevState.map(cell => {
                    const move = moves.find(move => move.row == cell.row && move.col == cell.col);
                    return move ? move : cell;
                }))
            }
        }
    });

    useQuery<{ game: IGamersStoneCount }>(GET_GAMERS_STONE_COUNT, {
        variables: {
            gameID: id,
        },
        onCompleted: ({ game }) => {
            if (game) {
                handleWinnerGamer(game, updateGame)
            }
        }
    });

    const [ createMove ] = useMutation(CREATE_MOVES, {
        onError: graphQLError
    });

    const [ updateGame ] = useMutation<IMutationUpdateGame, IMutationUpdateGameVariables>(UPDATE_GAME, {
        onError: graphQLError
    });

    useSubscription<SubscriptionGameUpdatedData>(GAME_UPDATED, {
        variables: {
            gameID: id as string
        },
        onData: ({ data: { data } }) => {
            if (data?.game) {
                setGame(data.game);
            }
        },
        onError: graphQLError
    });

    useSubscription<SubscriptionGameMovedData>(GAME_MOVED, {
        variables: {
            gameID: id
        },
        onData: ({ data: { data } }) => {
            if (data?.moves) {
                const moves = data.moves;
                setBoard(prevState => prevState.map(cell => {
                    const move = moves.find(move => move.row == cell.row && move.col == cell.col);
                    return move ? move : cell
                }))
            }
        },
        onError: graphQLError
    });

    useSubscription<SubscriptionGameRestartedData>(GAME_RESTARTED, {
        variables: {
            gameID: id
        },
        onData: ({ data: { data } }) => {
            if (data?.game) {
                setBoard(createBoard)
            }
        },
        onError: graphQLError
    });

    useSubscription<SubscriptionGamersStoneCountUpdatedData>(GAMERS_STONE_COUNT_UPDATED, {
        variables: {
            gameID: id
        },
        onData: ({ data: { data } }) => {
            if (data?.game) {
                handleWinnerGamer(data.game, updateGame)
            }
        },
        onError: graphQLError
    });

    const handleHint = useCallback(async (move: IStone) => {
        if (!memoizedGame?.isGameStarted) {
            return toast.info("Game has not started yet!");
        }
        if (memoizedGame.isGameFinished) {
            return toast.info("Game has finished!");
        }
        if (!activeMoveOrder.isYourTurn) {
            return toast.warn("It's not your turn!");
        }

        const reversedStone: IStone[] = reverseOpponentStones(board, move, activeMoveOrder.gamer.color);
        const moves = [
            {
                ...move,
                gamer: activeMoveOrder.gamer.color,
                gameID: id
            },
            ...(reversedStone.map(stone => ({
                ...stone,
                gamer: activeMoveOrder.gamer.color,
                gameID: id
            })))
        ];

        createMove({
            variables: {
                moves
            }
        });

    }, [ memoizedGame, board, activeMoveOrder ]);


    // handle no valid move and consecutive moves
    useEffect(() => {
        if (!
                (memoizedGame?.isGameStarted == true &&
                    memoizedGame?.isGameFinished == false)
            || !activeMoveOrder.isYourTurn
            || isAllStoneReversed) return;
        const updatedGamers = memoizedGame.gamers.map(gamer => {
            if (gamer.id == activeMoveOrder.gamer.id) {
                return {
                    ...gamer,
                    canMove: false
                }
            }
            return gamer
        });

        const hasConsecutiveNoMove: boolean = updatedGamers.every(gamer => !gamer.canMove);

        if (hasConsecutiveNoMove) {
            updateGame({
                variables: {
                    data: {
                        _id: id as string,
                        isGameFinished: true,
                        moveOrder: null,
                        gamers: updatedGamers
                    }
                }
            })
            toast.info("There is consecutive noMove. Game is tie!", {
                toastId: "consecutiveNoMove"
            })
        } else if (!hasValidMove) {
            updateGame({
                variables: {
                    data: {
                        _id: id as string,
                        moveOrder: nextMoveOrderID(memoizedGame as IGame),
                        gamers: updatedGamers
                    }
                }
            })
            toast.info("There is no valid move. So it turn to rival gamer!", {
                toastId: "noValidMove"
            })
        }

    }, [ memoizedGame, activeMoveOrder, hasValidMove, isAllStoneReversed ])

    return (
        <div className="grid grid-cols-8 grid-rows-8 max-w-xl mx-4 sm:max-0 bg-[#038947] border border-gray-900">
            {board.map((cell, index) => <Cell key={`${cell.row}${cell.col}$`}
                                              onClick={handleHint}
                                              hasHint={hints.includes(index)}
                                              stone={cell}
                                              activeGamer={activeMoveOrder.gamer.color}/>)}
        </div>
    )
}

function nextMoveOrderID(game: IGame): string {
    if (game) {
        if (game.moveOrder === game.gamers[0].id) {
            return game.gamers[1].id
        } else {
            return game.gamers[0].id
        }
    }
    return "";
}

function handleWinnerGamer(gamersStoneCount: IGamersStoneCount, updateGame: MutationFunction<IMutationUpdateGame, IMutationUpdateGameVariables>) {
    const MAX_STONE_COUNT: number = DIMENSION * DIMENSION;
    const isAllStoneReversed: boolean = gamersStoneCount.count.BLACK + gamersStoneCount.count.WHITE == MAX_STONE_COUNT;

    if (!isAllStoneReversed) return;

    let message: string = "";
    const whiteGamerID: string = gamersStoneCount.game.gamers.find(gamer => gamer.color == EGamer.WHITE)?.id!;
    const blackGamerID: string = gamersStoneCount.game.gamers.find(gamer => gamer.color == EGamer.BLACK)?.id!;
    const userID: string = localStorage.getItem(ELocalStorage.USERID)!;
    let winnerID: string | null = "";

    if (gamersStoneCount.count.BLACK > gamersStoneCount.count.WHITE) {
        message = blackGamerID == userID ? "Game finished! You won! 🎉" : "Game finished! You lost! 😢";
        winnerID = blackGamerID;
    } else if (gamersStoneCount.count.WHITE > gamersStoneCount.count.BLACK) {
        message = whiteGamerID == userID ? "Game finished! You won! 🎉" : "Game finished! You lost! 😢"
        winnerID = whiteGamerID;
    } else {
        message = "Game finished! It's a tie! 🤝"
    }

    updateGame({
        variables: {
            data: {
                _id: gamersStoneCount.game._id,
                isGameStarted: false,
                isGameFinished: true,
                moveOrder: null,
                winnerGamer: winnerID,
            }
        }
    })

    toast.success(message, {
        toastId: message
    });
}