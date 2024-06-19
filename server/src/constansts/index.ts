import { EGamer, GRAPHQL_ERROR_CODES } from "@/enums";

export const MAX_GAMER_COUNT: number = 2;

export const BOARD_DIMENSION: number = 8;

export const INITIAL__STONES = [
    {
        row: 3,
        col: 3,
        gamer: EGamer.WHITE,
    },
    {
        row: 3,
        col: 4,
        gamer: EGamer.BLACK,
    },
    {
        row: 4,
        col: 3,
        gamer: EGamer.BLACK,
    },
    {
        row: 4,
        col: 4,
        gamer: EGamer.WHITE,
    }
]

export const GRAPHQL_ERROR_MESSAGES = {
    GAME_ID_REQUIRED: "Game ID is required",
    INVALID_GAME_ID: "Invalid game ID. Please provide a valid game ID.",
    GAME_NOT_FOUND: "Game not found. Please provide a valid game ID.",
    MOVES_NOT_FOUND: "Moves not found. Please provide a valid game ID.",
    GAME_ID_AND_GAMER_ID_REQUIRED: "Game ID and gamer ID are required",
    ROOM_IS_FULL: "Room is full. Please provide a valid game ID.",
    GET_GAMES_FAILED: "Unable to retrieve the games.",
    GET_MOVES_FAILED: "Unable to retrieve the game moves.",
    GET_STONE_COUNTS_FAILED: "Unable to retrieve the players' stone counts.",
    CREATE_GAME_FAILED: "Unable to create the game. Please verify your input and try again.",
    ADD_PLAYER_FAILED: "Unable to add the player to the game. Please try again.",
    UPDATE_GAME_STATE_FAILED: "Unable to update the game state.",
    MAKE_MOVE_FAILED: "Unable to make the move.",
    FINISH_GAME_FAILED: "Unable to finish the game.",



}