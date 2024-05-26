import { Gamer, GamerStatus } from "@/enums";
import { Schema } from "mongoose";

export interface Game {
    _id: Schema.Types.ObjectId
    gamers: {
        id: string,
        color: Gamer,
        status: GamerStatus
    }[]
    isGameFinished: boolean
    isGameStarted: boolean
    moveOrder: string
    winnerGamer: string
    playAgainstComputer: boolean,
    exitGamer: string
}

export interface Move {
    row: number
    col: number
    gamer: Gamer,
    gameID: Schema.Types.ObjectId
}