import { IGame, IMove } from "@/_types";
import { EGamer } from "@/_enums";

export default function getWinnerGamer(game: IGame, board: IMove[]): string | null {
    const blackMovesCount = board.filter(cell => cell.gamer == EGamer.BLACK).length;
    const whiteMovesCount = board.filter(cell => cell.gamer == EGamer.WHITE).length;
    const whiteGamerID: string = game.gamers.find(gamer => gamer.color == EGamer.WHITE)?.id!;
    const blackGamerID: string = game.gamers.find(gamer => gamer.color == EGamer.BLACK)?.id!;
    let winnerID: string | null = null;

    if (blackMovesCount > whiteMovesCount) {
        winnerID = blackGamerID;
    } else if (whiteMovesCount > blackMovesCount) {
        winnerID = whiteGamerID;
    }

    return winnerID;
}