import { Gamer } from "@/_enums";

export type Stone = {
    row: number,
    col: number,
    gamer: Gamer | null
}


export type Stones = Stone[]