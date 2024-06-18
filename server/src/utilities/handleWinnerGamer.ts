import Move from "@/models/Move";
import { EGamer } from "@/enums";
import { ObjectId } from "mongoose";
import { IGameDocument } from "@/types";

export default async function handleWinnerGamer(game: IGameDocument, gameID: ObjectId): Promise<IGameDocument> {
    const blackMovesCount = await Move.countDocuments({ gameID, gamer: EGamer.BLACK });
    const whiteMovesCount = await Move.countDocuments({ gameID, gamer: EGamer.WHITE });
    const whiteGamerID: string = game.gamers.find(gamer => gamer.color == EGamer.WHITE)?.id!;
    const blackGamerID: string = game.gamers.find(gamer => gamer.color == EGamer.BLACK)?.id!;
    let winnerID: string | null = null;

    if (blackMovesCount > whiteMovesCount) {
        winnerID = blackGamerID;
    } else if (whiteMovesCount > blackMovesCount) {
        winnerID = whiteGamerID;
    }

    if (winnerID) {
        game.winnerGamer = winnerID;
    }

    return game.save();
}