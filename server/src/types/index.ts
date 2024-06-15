import { EGamer, GamerStatus } from "@/enums";
import { Schema } from "mongoose";

export interface IGamer {
    id: string
    color: EGamer
    status: GamerStatus,
    canMove: boolean
}

export interface IGame {
    _id: Schema.Types.ObjectId
    gamers: IGamer[]
    isGameFinished: boolean
    isGameStarted: boolean
    moveOrder: string
    winnerGamer: string
    exitGamer: string
}

export interface IMove {
    row: number
    col: number
    gamer: EGamer,
    gameID: Schema.Types.ObjectId
}