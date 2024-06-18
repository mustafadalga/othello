import { IMoveDocument } from "@/types";
import { EGamer } from "@/enums";

export default function getGamersStoneCount(moves: IMoveDocument[]): Record<EGamer, number> {
    return {
        [EGamer.BLACK]: moves.filter(move => move.gamer == EGamer.BLACK).length,
        [EGamer.WHITE]: moves.filter(move => move.gamer == EGamer.WHITE).length,
    }
}