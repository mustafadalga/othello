import { Schema, model } from "mongoose";
import { Gamer, GamerStatus } from "@/enums";

const schema = new Schema({
    id: { type: Schema.Types.ObjectId, auto: true },
    blackGamer: { type: String, required: true },
    whiteGamer: { type: String, required: true },
    isGameFinished: { type: Boolean, default: false },
    isGameStarted: { type: Boolean, default: false },
    moveOrder: { type: String, enum: Gamer, default: Gamer.BLACK },
    winnerGamer: { type: String, default: null },
    blackGamerStatus: { type: String, enum: GamerStatus, default: GamerStatus.CONNECTED },
    whiteGamerStatus: { type: String, enum: GamerStatus, default: GamerStatus.CONNECTED },
    moves: [{ type: Schema.Types.ObjectId, ref: 'Move' }],
});

export default model('Game', schema)