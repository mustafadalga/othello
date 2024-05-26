import { Schema, model } from "mongoose";
import { Gamer, GamerStatus } from "@/enums";

const schema = new Schema({
    gamers: [ {
        id: { type: String, required: true },
        color: { type: String, enum: Gamer, required: true },
        status: { type: String, enum: GamerStatus, required: true, default: GamerStatus.CONNECTED }
    } ],
    isGameFinished: { type: Boolean, default: false },
    isGameStarted: { type: Boolean, default: false },
    moveOrder: { type: String, default: null },
    winnerGamer: { type: String, default: null },
    playAgainstComputer: { type: Boolean, default: false },
    moves: [ { type: Schema.Types.ObjectId, ref: 'Move' } ],
    exitGamer: { type: String, default: null },
});

export default model('Game', schema)