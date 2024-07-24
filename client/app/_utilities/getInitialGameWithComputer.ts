import { IGame } from "@/_types";
import { ELocalStorage } from "@/_enums";
import { INITIAL_GAME_WITH_COMPUTER } from "@/_constants";

export default function getInitialGameWithComputer(): IGame {
    return {
        ...INITIAL_GAME_WITH_COMPUTER,
        moveOrder: localStorage.getItem(ELocalStorage.USERID),
        gamers: INITIAL_GAME_WITH_COMPUTER.gamers.map(gamer => {
            if (gamer.id == "gamer") {
                return {
                    ...gamer,
                    id: localStorage.getItem(ELocalStorage.USERID)!
                }
            }
            return gamer
        })
    };
}