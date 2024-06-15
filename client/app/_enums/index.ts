export enum EGamer {
    BLACK = "BLACK",
    WHITE = "WHITE"
}

export enum LocalStorage {
    USERID = "userID",
    GAME_STARTED_MESSAGE_SHOWN = "gameStartedMessageShown",
}

export enum GamerStatus {
    CONNECTED = "CONNECTED",
    DISCONNECTED = "DISCONNECTED",
    EXITED = "EXITED"
}


export enum ErrorCode {
    GAME_NOT_FOUND = 'GAME_NOT_FOUND',
    GAME_FULL = 'GAME_FULL',
    INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
    BAD_USER_INPUT = "BAD_USER_INPUT",
    DUPLICATE_MOVE = "DUPLICATE_MOVE"
}
