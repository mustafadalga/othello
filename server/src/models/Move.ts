import { Schema, model } from "mongoose";
import { Gamer } from "@/enums";

const schema = new Schema({
    id: { type: Schema.Types.ObjectId, auto: true },
    row: { type: Number, required: true },
    col: { type: Number, required: true },
    value: { type: Gamer, required: true },
    gameId: { type: Schema.Types.ObjectId, ref: 'Room', required: true },
});

export default model('Move', schema)