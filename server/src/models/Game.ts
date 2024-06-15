import { Schema, model } from "mongoose";
import { EGamer, GamerStatus } from "@/enums";

const GamerSchema = new Schema({
    id: { type: String, required: true },
    color: { type: String, enum: EGamer, required: true },
    status: { type: String, enum: GamerStatus, required: true, default: GamerStatus.CONNECTED },
    canMove: { type: Boolean, default: true },
}, { _id: false });


const schema = new Schema({
    gamers: [ GamerSchema],
    isGameFinished: { type: Boolean, default: false },
    isGameStarted: { type: Boolean, default: false },
    moveOrder: { type: String, default: null },
    winnerGamer: { type: String, default: null },
    moves: [ { type: Schema.Types.ObjectId, ref: 'Move' } ],
    exitGamer: { type: String, default: null },
});

export default model('Game', schema)