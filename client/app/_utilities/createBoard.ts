import { DIMENSION } from "@/_constants";
import { Stones } from "@/_types";
import { EGamer } from "@/_enums";

export default function createBoard(): Stones {
    const initialCells: Record<string, EGamer> = {
        "33": EGamer.WHITE,
        "34": EGamer.BLACK,
        "43": EGamer.BLACK,
        "44": EGamer.WHITE,
    };

    const board: Stones = [];
    for (let row = 0; row < DIMENSION; row++) {
        for (let col = 0; col < DIMENSION; col++) {

            const gamer = initialCells[`${row}${col}`] as EGamer || null
            board.push({
                row,
                col,
                gamer
            })
        }
    }

    return board;
}