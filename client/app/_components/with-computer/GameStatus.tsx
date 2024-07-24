import { capitalize } from "lodash";
import useAnimatedNumber from "use-animated-number";
import getActiveGamerData, { IActiveGamerData } from "@/_utilities/getActiveGamerData";
import usePlayWithComputerStore from "@/_store/usePlayWithComputerStore";
import { EGamer } from "@/_enums";
import { IGame } from "@/_types";
import Stone from "@/_components/Stone";

export default function GameStatus() {
    const { game, board } = usePlayWithComputerStore();
    const animatedBlackGamerCount: string = useAnimatedNumber(board.filter(cell => cell.gamer == EGamer.BLACK).length, 300);
    const animatedWhiteGamerCount: string = useAnimatedNumber(board.filter(cell => cell.gamer == EGamer.WHITE).length, 300);
    const activeMoveOrder: IActiveGamerData = getActiveGamerData(game as IGame);

    return (
        <section
            className="w-full max-w-xl grid place-items-center py-2.5 px-5 bg-gradient-to-b from-[#038947] via-[#03A454] to-[#04D46C] text-white">

            <div className="w-full flex items-center justify-around">
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                        <Stone gamer={EGamer.BLACK}
                               isActive={activeMoveOrder.gamer.color == EGamer.BLACK}/>
                    </div>
                    <span className="text-xs lg:text-sm"> {animatedBlackGamerCount} </span>
                </div>
                {activeMoveOrder?.gamer.color && (
                    <h6 className="font-semibold text-sm lg:text-base">
                        {activeMoveOrder.isYourTurn ? "Your" : capitalize(activeMoveOrder.gamer.color)} turn
                    </h6>
                )}
                <div className="flex items-center gap-3">
                    <div
                        className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12">
                        <Stone gamer={EGamer.WHITE}
                               isActive={activeMoveOrder.gamer.color == EGamer.WHITE}/>
                    </div>
                    <span className="text-xs lg:text-sm"> {animatedWhiteGamerCount} </span>
                </div>
            </div>


        </section>
    )
}