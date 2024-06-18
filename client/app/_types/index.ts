import { EGamer, EGamerStatus } from "@/_enums";

export type IStone = {
    row: number,
    col: number,
    gamer: EGamer | null
}

export type IStones = IStone[]

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
    moveOrder: string
    winnerGamer: string
    playAgainstComputer: boolean,
    exitGamer: string
}

export interface IMove {
    row: number
    col: number
    gamer: EGamer,
    gameID: string
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
    moves: IMove[] | undefined
}

export interface SubscriptionGameUpdatedData {
    game: IGame | undefined
}

export interface SubscriptionGameRestartedData {
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