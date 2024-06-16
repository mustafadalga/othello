import { Schema, model } from "mongoose";
import { EGamer, EGamerStatus } from "@/enums";
import { IGameDocument, IGamerDocument } from "@/types";

const GamerSchema = new Schema<IGamerDocument>({
    id: { type: String, required: true },
    color: { type: String, enum: EGamer, required: true },
    status: { type: String, enum: EGamerStatus, required: true, default: EGamerStatus.CONNECTED },
    canMove: { type: Boolean, default: true },
}, { _id: false });


const schema = new Schema<IGameDocument>({
    gamers: [ GamerSchema],
    isGameFinished: { type: Boolean, default: false },
    isGameStarted: { type: Boolean, default: false },
    moveOrder: { type: String, default: null },
    winnerGamer: { type: String, default: null },
    moves: [ { type: Schema.Types.ObjectId, ref: 'Move' } ],
    exitGamer: { type: String, default: null },
});

export default model<IGameDocument>('Game', schema)