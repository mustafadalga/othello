import Move from "@/models/Move";
import { BulkWriteResult, IMove } from "@/types";


export default function bulkUpdateMoves(moves: IMove[]): Promise<BulkWriteResult> {
    const bulkOps = moves.map(move => ({
        updateOne: {
            filter: { row: move.row, col: move.col, gameID: move.gameID },
            update: { $set: move },
            upsert: true
        }
    }))
    return Move.bulkWrite(bulkOps)
}