import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import usePlayWithComputerStore from "@/_store/usePlayWithComputerStore";
import useGameResultModal from "@/_store/useGameResultModal";
import useDeepCompareMemoize from "@/_hooks/useDeepCompareMemoize";
import createHints from "@/_utilities/createHints";
import reverseOpponentStones from "@/_utilities/reverseOpponentStones";
import getActiveGamerData, { IActiveGamerData } from "@/_utilities/getActiveGamerData";
import nextMoveOrderID from "@/_utilities/nextMoveOrderID";
import isAllStoneReversed from "@/_utilities/isAllStoneReversed";
import getWinnerGamer from "@/_utilities/getWinnerGamer";
import { EGamer } from "@/_enums";
import { IGame, IMove, } from "@/_types";
import GameResultModal from "../modal/GameResultModal";
import Cell from "../Cell";
import ComputerThinkingLoader from "./ComputerThinkingLoader";


export default function Board() {
    const { game, board, updateGame, updateBoard } = usePlayWithComputerStore();
    const { onOpen } = useGameResultModal()


    const [ clickedHint, setClickedHint ] = useState<IMove | null>(null);
    const cellRefs = useRef<(HTMLDivElement | null)[]>([]);
    const activeMoveOrder = useDeepCompareMemoize<IActiveGamerData>(getActiveGamerData(game as IGame));
    const opponent: EGamer = activeMoveOrder.gamer.color == EGamer.BLACK ? EGamer.WHITE : EGamer.BLACK;
    const opponentStones: IMove[] = board.filter(cell => cell.gamer === opponent)
    const isComputerTurn: boolean = !activeMoveOrder.isYourTurn;
    const hints: number[] = createHints(board, opponentStones, activeMoveOrder.gamer.color);
    const hasValidMove: boolean = !!hints.length;
    const winnerGamerColor: EGamer | null = game?.winnerGamer ? game.gamers.find(gamer => gamer.id == game.winnerGamer)?.color || null : null;

    const handlePlayAsComputer = useCallback(async () => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const randomIndex: number = Math.floor(Math.random() * hints.length);
        const hintIndex: number = hints[randomIndex];
        cellRefs.current[hintIndex]?.click()
    }, [ hints ]);

    const handleHint = useCallback(async (move: IMove) => {
        if (clickedHint) return;
        if (!game?.isGameStarted) {
            return toast.info("Game has not started yet!");
        }
        if (game.isGameFinished) {
            return toast.info("Game has finished!");
        }

        const reversedStone: IMove[] = reverseOpponentStones(board, move, activeMoveOrder.gamer.color);
        const moves = [
            {
                ...move,
                gamer: activeMoveOrder.gamer.color,
            },
            ...(reversedStone.map(stone => ({
                ...stone,
                gamer: activeMoveOrder.gamer.color,
            })))
        ];
        setClickedHint(move);

        setTimeout(() => {
            updateBoard(board.map(cell => {
                const move = moves.find(move => move.row == cell.row && move.col == cell.col);
                return move ? move : cell
            }))

            updateGame({
                ...game,
                moveOrder: nextMoveOrderID(game as IGame)
            });
        }, 500);// set timeout is for hint animation

    }, [ game, board, activeMoveOrder, clickedHint ]);

    const handleGameFinish = useCallback(() => {
        const winnerGamer: string | null = getWinnerGamer(game as IGame, board);
        updateGame({
            ...(game as IGame),
            isGameFinished: true,
            isGameStarted: false,
            moveOrder: null,
            winnerGamer
        });

        onOpen()//show game result modal.

    }, [ game, board ])

    // handle no valid move and consecutive moves
    useEffect(() => {
        if (!(game?.isGameStarted == true &&
                game?.isGameFinished == false)
            || hasValidMove) return;
        const updatedGamers = game.gamers.map(gamer => {
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
                ...(game as IGame),
                isGameFinished: true,
                isGameStarted: false,
                moveOrder: null,
                gamers: updatedGamers
            })

            toast.info("There is consecutive noMove. Game is tie!", {
                toastId: "consecutiveNoMove"
            })
        } else if (!hasValidMove) {

            updateGame({
                ...(game as IGame),
                moveOrder: nextMoveOrderID(game as IGame)
            })

            if (!isComputerTurn && !game.isGameStarted) {
                toast.info("There is no valid move. So it turn to computer !", {
                    toastId: "noValidMove"
                })
            }
        }

    }, [ game, activeMoveOrder, hasValidMove, isComputerTurn ]);

    // Make a move as computer
    useEffect(() => {
        if (game?.isGameStarted && isComputerTurn && !isAllStoneReversed(board)) {
            handlePlayAsComputer();
        }
    }, [ isComputerTurn, board, game?.isGameStarted ]);

    // set to initial state when active move order change
    useEffect(() => {
        setClickedHint(null);
    }, [ activeMoveOrder ]);


    // Handle game finish if all stones are reversed or the game is finished
    useEffect(() => {
        if (isAllStoneReversed(board) || game?.isGameFinished) {
            handleGameFinish()
        }
    }, [ board, game?.isGameFinished ]);


    return (
        <section
            className="relative grid grid-cols-8 grid-rows-8 gap-0.5 sm:gap-1 bg-white">
            {board.map((cell, index) => <Cell key={`${cell.row}${cell.col}`}
                                              onClick={handleHint}
                                              hasHint={hints.includes(index)}
                                              stone={cell}
                                              activeGamer={activeMoveOrder.gamer.color}
                                              clickedHint={clickedHint}
                                              ref={(element: HTMLDivElement) => {
                                                  cellRefs.current[index] = element
                                              }}/>)}

            {game?.isGameFinished && !game.exitGamer &&
                <GameResultModal winnerGamer={winnerGamerColor} gamerColor={EGamer.BLACK}/>}

            {isComputerTurn && game?.isGameStarted && <ComputerThinkingLoader/>}
        </section>
    )
}

