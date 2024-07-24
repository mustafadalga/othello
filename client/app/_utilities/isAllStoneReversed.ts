import { IMove } from "@/_types";
import { BOARD_DIMENSION } from "@/_constants";

export default function isAllStoneReversed(board: IMove[]): boolean {
    return (board.length == BOARD_DIMENSION*BOARD_DIMENSION) && board.every(cell => cell.gamer)
}