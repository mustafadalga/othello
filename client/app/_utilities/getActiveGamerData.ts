import { IGame, IGamer } from "@/_types";
import { EGamer, GamerStatus, LocalStorage } from "@/_enums";

export interface IActiveGamerData {
    isYourTurn: boolean;
    gamer: IGamer
}


export default function getActiveGamerData(game: IGame | undefined): IActiveGamerData {
    if (!game?.moveOrder || !localStorage.getItem(LocalStorage.USERID)) {
        return {
            isYourTurn: false,
            gamer: {
                id: "",
                color: "" as EGamer,
                canMove: false,
                status: GamerStatus.DISCONNECTED
            }
        };
    }

    const gamer = game.gamers.find(gamer => game.moveOrder == gamer.id)!;

    return {
        isYourTurn: game.moveOrder === localStorage.getItem(LocalStorage.USERID),
        gamer
    }
}
