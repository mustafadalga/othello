import { Gamer } from "@/_enums";

export type Stone = {
    row: number,
    col: number,
    value: Gamer | null
}


export type Stones = Stone[]