import { ObjectId } from "mongoose";
import Move from "@/models/Move";
import { BOARD_DIMENSION } from "@/constansts";

export default async function isAllStoneReversed(gameID: ObjectId): Promise<boolean> {
    const moveCount = await Move.countDocuments({ gameID });
    return moveCount == BOARD_DIMENSION * BOARD_DIMENSION;
}
