import { EGamer } from "@/enums";

export const INITIAL_GAMER_STONE_COUNT: number = 2

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