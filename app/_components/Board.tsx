"use client";
import { useCallback, useEffect, useState } from "react";
import { Gamer } from "@/_enums";
import createBoard from "@/_utilities/createBoard";
import { Stone, Stones } from "@/_types";
import createHints from "@/_utilities/createHints";
import reverseOpponentStones from "@/_utilities/reverseOpponentStones";
import { DIMENSION } from "@/_constants";
import Cell from "./Cell";

export default function Board() {
    const [ activeGamer, setActiveGamer ] = useState<Gamer>(Gamer.BLACK);
    const [ noMoveCount, setNoMoveCount ] = useState<number>(0);
    const [ board, setBoard ] = useState<Stones>(createBoard);
    const opponent = activeGamer == Gamer.BLACK ? Gamer.WHITE : Gamer.BLACK;
    const opponentStones = board.filter(cell => cell.value === opponent)
    const hints = createHints(board, opponentStones, activeGamer);
    const hasValidMove: boolean = !!hints.length
    const hasConsecutiveNoMove: boolean = noMoveCount == 2;

    const handleHint = useCallback((move: Stone) => {
        const reversedStone = reverseOpponentStones(board, move, activeGamer);
        const selectedCellIndex = move.row * DIMENSION + move.col
        const reversedStoneIndex = [
            ...reversedStone.map(item => item.row * DIMENSION + item.col),
            selectedCellIndex
        ];

        setBoard(prevState => {
            return prevState.map((cell, index) => {
                if (reversedStoneIndex.includes(index)) {
                    return {
                        ...cell,
                        value: activeGamer
                    }
                }
                return cell;
            })
        })

        setActiveGamer(opponent)
    }, [ activeGamer, board, opponent ]);

    useEffect(() => {
        if (hasConsecutiveNoMove) {
            console.log("there is consecutive noMove, game over");
            return;
        }
        if (!hasValidMove) {
            console.log("there is no move , so it turn to rival gamer");
            setActiveGamer(opponent);
            setNoMoveCount(prevState => prevState + 1);
        }

    }, [ hasConsecutiveNoMove, hasValidMove, opponent ])


    return (
        <div className="grid grid-cols-8 grid-rows-8 max-w-xl mx-4 sm:max-0 bg-[#038947] border border-gray-900">
            {board.map((c, index) => <Cell key={`${c.row}${c.col}$`} onClick={handleHint}
                                           hasHint={hints.includes(index)}
                                           stone={c}/>)}
        </div>
    )
}