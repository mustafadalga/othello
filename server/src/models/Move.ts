import { Schema, model } from "mongoose";
import mongoose from "mongoose";
import { Gamer } from "@/enums";

const schema = new mongoose.Schema({
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    gamer: { type: String, enum: Gamer, required: true },
    gameID: { type: Schema.Types.ObjectId, ref: 'Game', required: true },
});
schema.index({ row: 1, col: 1, gameID: 1 }, { unique: true });


export default model('Move', schema)