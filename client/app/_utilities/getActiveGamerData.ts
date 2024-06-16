import { IGame, IGamer } from "@/_types";
import { EGamer, EGamerStatus, ELocalStorage } from "@/_enums";

export interface IActiveGamerData {
    isYourTurn: boolean;
    gamer: IGamer
}


export default function getActiveGamerData(game: IGame | undefined): IActiveGamerData {
    if (!game?.moveOrder || !localStorage.getItem(ELocalStorage.USERID)) {
        return {
            isYourTurn: false,
            gamer: {
                id: "",
                color: "" as EGamer,
                canMove: false,
                status: EGamerStatus.DISCONNECTED
            }
        };
    }

    const gamer = game.gamers.find(gamer => game.moveOrder == gamer.id)!;

    return {
        isYourTurn: game.moveOrder === localStorage.getItem(ELocalStorage.USERID),
        gamer
    }
}
