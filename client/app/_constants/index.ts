import { EGamer, EGamerStatus } from "@/_enums";
import { IGame } from "@/_types";

export const BOARD_DIMENSION: number = 8;
export const MAX_GAMER_COUNT: number = 2;

export const INITIAL_GAME_WITH_COMPUTER: IGame = {
    _id: "1",
    gamers: [
        {
            id: 'computer',
            color: EGamer.WHITE,
            status: EGamerStatus.CONNECTED,
            canMove: true
        },
        {
            id: "gamer",
            color: EGamer.BLACK,
            status: EGamerStatus.CONNECTED,
            canMove: true
        }
    ],
    isGameFinished: false,
    isGameStarted: true,
    moveOrder: "gamer",
    winnerGamer: null,
    exitGamer: null
}
