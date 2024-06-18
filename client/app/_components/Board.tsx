import { useCallback, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { toast } from "react-toastify";
import createBoard from "@/_utilities/createBoard";
import createHints from "@/_utilities/createHints";
import reverseOpponentStones from "@/_utilities/reverseOpponentStones";
import graphQLError from "@/_utilities/graphQLError";
import { GET_GAME_BY_ID, GET_MOVES_BY_GAME_ID } from "@/_graphql/queries";
import { CREATE_MOVES, UPDATE_GAME } from "@/_graphql/mutations";
import { GAME_MOVED, GAME_RESTARTED, GAME_UPDATED } from "@/_graphql/subscriptions";
import getActiveGamerData, { IActiveGamerData } from "@/_utilities/getActiveGamerData";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import useGameResultModal from "@/_store/useGameResultModal";
import { EGamer, ELocalStorage } from "@/_enums";
import {
    IGame,
    IMove,
    IMutationUpdateGame,
    IMutationUpdateGameVariables,
    IStone,
    IStones,
    SubscriptionGameMovedData,
    SubscriptionGameRestartedData,
    SubscriptionGameUpdatedData
} from "@/_types";
import GameResultModal from "./modal/GameResultModal";
import Cell from "./Cell";


export default function Board() {
    const { id } = useParams()
    const [ game, setGame ] = useState<IGame>()
    const { onOpen } = useGameResultModal()
    const [ board, setBoard ] = useState<IStones>(createBoard);
    const [ isHintClicked, setIsHintClicked ] = useState<boolean>(false)
    const memoizedGame = useDeepCompareMemoize<IGame>(game as IGame);
    const activeMoveOrder = useDeepCompareMemoize<IActiveGamerData>(getActiveGamerData(game as IGame));
    const opponent = activeMoveOrder.gamer.color == EGamer.BLACK ? EGamer.WHITE : EGamer.BLACK;
    const opponentStones = board.filter(cell => cell.gamer === opponent)
    const hints = activeMoveOrder.isYourTurn ? createHints(board, opponentStones, activeMoveOrder.gamer.color) : [];
    const hasValidMove: boolean = !!hints.length;
    const winnerGamer: EGamer | null = game?.winnerGamer ? game.gamers.find(gamer => gamer.id == game.winnerGamer)?.color || null : null;
    const gamerColor: EGamer | null = game ? game?.gamers.find(gamer => gamer.id == localStorage.getItem(ELocalStorage.USERID))?.color || null : null;

    useQuery<{ game: IGame }>(GET_GAME_BY_ID, {
        variables: {
            id,
        },
        onCompleted: ({ game }) => {
            if (game) {
                setGame(game);
                if (game.isGameFinished) {
                    onOpen();
                }
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
                if (data.game.isGameFinished) {
                    onOpen();
                }
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

    const handleHint = useCallback(async (move: IStone) => {
        if (isHintClicked) return;
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

        setIsHintClicked(true);
        createMove({
            variables: {
                moves
            }
        });

    }, [ memoizedGame, board, activeMoveOrder, isHintClicked ]);


    // handle no valid move and consecutive moves
    useEffect(() => {
        if (!(memoizedGame?.isGameStarted == true &&
                memoizedGame?.isGameFinished == false)
            || !activeMoveOrder.isYourTurn || hasValidMove) return;
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
                        isGameStarted: false,
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

    }, [ memoizedGame, activeMoveOrder, hasValidMove ])

    // set to initial state
    useEffect(() => {
        setIsHintClicked(false);
    }, [ activeMoveOrder ])

    return (
        <section
            className={`${isHintClicked ? 'pointer-events-none' : ''} relative grid grid-cols-8 grid-rows-8 max-w-xl mx-4 sm:max-0 bg-[#038947] border border-gray-900`}>
            {board.map((cell, index) => <Cell key={`${cell.row}${cell.col}`}
                                              onClick={handleHint}
                                              hasHint={hints.includes(index)}
                                              stone={cell}
                                              activeGamer={activeMoveOrder.gamer.color}/>)}

            {game?.isGameFinished && !game.exitGamer && <GameResultModal winnerGamer={winnerGamer} gamerColor={gamerColor as EGamer}/>}
        </section>
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