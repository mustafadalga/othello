import { BOARD_DIMENSION } from "@/_constants";
import { IMove } from "@/_types";
import { EGamer } from "@/_enums";

export default function createBoard(): IMove[] {
    const initialCells: Record<string, EGamer> = {
        "33": EGamer.WHITE,
        "34": EGamer.BLACK,
        "43": EGamer.BLACK,
        "44": EGamer.WHITE,
    };

    const board: IMove[] = [];
    for (let row = 0; row < BOARD_DIMENSION; row++) {
        for (let col = 0; col < BOARD_DIMENSION; col++) {

            const gamer = initialCells[`${row}${col}`] as EGamer || null
            board.push({
                row,
                col,
                gamer,
                gameID: null
            })
        }
    }

    return board;
}