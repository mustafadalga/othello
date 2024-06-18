import { ObjectId } from "mongoose";
import Game from "@/models/Game";
import { IGameDocument } from "@/types";
import { EGamer } from "@/enums";

export default async function updateGameMoveOrder(gameID: ObjectId, gamer: EGamer): Promise<IGameDocument> {
    const game = await Game.findById({ _id: gameID });
    const index = game.gamers.findIndex(gamerItem => gamerItem.color == gamer);
    game.moveOrder = game.gamers[index == 0 ? 1 : 0].id
    return game.save();
}

