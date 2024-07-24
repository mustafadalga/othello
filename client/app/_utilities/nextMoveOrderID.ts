import { IGame } from "@/_types";

export default function nextMoveOrderID(game: IGame): string {
    if (game) {
        if (game.moveOrder === game.gamers[0].id) {
            return game.gamers[1].id
        } else {
            return game.gamers[0].id
        }
    }
    return "";
}