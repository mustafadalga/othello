export enum EGamer {
    BLACK = "BLACK",
    WHITE = "WHITE"
}

export enum ELocalStorage {
    USERID = "userID",
    GAME_STARTED_MESSAGE_SHOWN = "gameStartedMessageShown",
}

export enum EGamerStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
}


export enum ErrorCode {
    GAME_NOT_FOUND = 'GAME_NOT_FOUND',
    GAME_FULL = 'GAME_FULL',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    BAD_USER_INPUT = "BAD_USER_INPUT",
    DUPLICATE_MOVE = "DUPLICATE_MOVE"
}
