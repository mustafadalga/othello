import { EGamer, EGamerStatus } from "@/enums";
import { Document, Schema } from "mongoose";

export interface IGamer {
    id: string
    color: EGamer
    status: EGamerStatus,
    canMove: boolean
}

export interface IMove {
    row: number
    col: number
    gamer: EGamer,
    gameID: Schema.Types.ObjectId
}

export interface IGame {
    _id: Schema.Types.ObjectId
    gamers: IGamer[]
    isGameFinished: boolean
    isGameStarted: boolean
    moveOrder: string
    winnerGamer: string
    moves: IMove[]
    exitGamer: string
}

export type IGamerDocument = IGamer & Document;
export type IGameDocument = IGame & Document;
export type IMoveDocument = IMove & Document;
