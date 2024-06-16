import { Schema, model } from "mongoose";
import { EGamer } from "@/enums";
import { IMoveDocument } from "@/types";

const schema = new Schema<IMoveDocument>({
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    gamer: { type: String, enum: EGamer, required: true },
    gameID: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
});
schema.index({ row: 1, col: 1, gameID: 1 }, { unique: true });


export default model<IMoveDocument>('Move', schema)