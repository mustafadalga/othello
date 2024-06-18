import { ObjectId } from "mongoose";
import { INITIAL__STONES } from "@/constansts";
import Move from "@/models/Move";
import { IMoveDocument } from "@/types";

export default async function restartMoves(gameID: ObjectId):Promise<IMoveDocument[]> {
    const bulkOps = [
        // Add the delete operation to remove all moves for the specific gameID
        {
            deleteMany: {
                filter: { gameID }
            }
        },
        // Add insert operations for each initial stone
        ...INITIAL__STONES.map(stone => ({
            insertOne: {
                document: {
                    gameID,
                    row: stone.row,
                    col: stone.col,
                    gamer: stone.gamer
                }
            }
        }))
    ];

    await Move.bulkWrite(bulkOps);
    return Move.find({ gameID });
}
