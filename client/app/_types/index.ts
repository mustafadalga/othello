import { EGamer, EGamerStatus } from "@/_enums";

export interface IGamer {
    id: string
    color: EGamer
    status: EGamerStatus,
    canMove: boolean
}

export interface IGame {
    _id: string,
    gamers: IGamer[]
    isGameFinished: boolean
    isGameStarted: boolean
    moveOrder: string | null
    winnerGamer: string | null
    exitGamer: string | null
}

export interface IMove {
    row: number
    col: number
    gamer: EGamer | null,
    gameID: string | null
}


export type IGamersStoneCount = {
    game: {
        _id: string,
        gamers: IGamer[],
    },
    count: {
        [key in EGamer]: number
    }
}

export interface SubscriptionGameMovedData {
    game: {
        moves: IMove[],
        isGameRestarted?: boolean
    } | undefined
}

export interface SubscriptionGameUpdatedData {
    game: IGame | undefined
}

export interface SubscriptionGamersStoneCountUpdatedData {
    game: IGamersStoneCount | undefined
}

export interface IGamerConnection {
    gameID: string
    userID: string
    status: EGamerStatus
}

export interface SubscriptionGamerConnection {
    gamer: IGamerConnection | undefined
}


export interface IMutationUpdateGameVariables {
    data: {
        _id: string,
        isGameStarted?: boolean
        isGameFinished?: boolean
        moveOrder?: string | null
        winnerGamer?: string
        exitGamer?: string
        gamers?: IGamer[]
    }
}

export interface IMutationUpdateGame {
    game: {
        _id: string
    }
}