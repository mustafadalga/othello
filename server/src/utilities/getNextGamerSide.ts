import { EGamer } from "@/enums";
import type { IGamer } from "@/types";

export default function getNextGamerSide(gamers: IGamer[]): EGamer {
    if (gamers.length == 0) {
        const values = Object.values(EGamer);
        const randomIndex = Math.floor(Math.random() * values.length);
        return values[randomIndex] as EGamer;
    }

    const prevGamer = gamers[0];

    return prevGamer.color == EGamer.BLACK ? EGamer.WHITE : EGamer.BLACK
}