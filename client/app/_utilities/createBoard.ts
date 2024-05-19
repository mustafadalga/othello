import { Gamer } from "@/_enums";
import { DIMENSION } from "@/_constants";
import { Stones } from "@/_types";

export default function createBoard(): Stones {
    const initialStones = {
        "33": Gamer.WHITE,
        "34": Gamer.BLACK,
        "43": Gamer.BLACK,
        "44": Gamer.WHITE,
    };

    const board: Stones = [];
    for (let row = 0; row < DIMENSION; row++) {
        for (let col = 0; col < DIMENSION; col++) {
            const property: string = row.toString() + col.toString()

            if (Object.hasOwn(initialStones, property)) {
                board.push({
                    row,
                    col,
                    gamer: initialStones[property as keyof typeof initialStones] || null,
                })
                continue;
            }

            board.push({
                row,
                col,
                gamer: initialStones[property as keyof typeof initialStones],
            })
        }
    }

    return board;
}