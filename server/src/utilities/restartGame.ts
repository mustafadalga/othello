import { EGamer } from "@/enums";
import { IGameDocument } from "@/types";

export default function restartGame(game: IGameDocument) {
    game.moveOrder = game.gamers.find(gamer => gamer.color == EGamer.BLACK)?.id || null;
    game.gamers.forEach(gamer => gamer.canMove = true)
    game.isGameStarted = true;
    game.isGameFinished = false;
    game.winnerGamer = null;
    game.exitGamer = null;
    game.save();
};