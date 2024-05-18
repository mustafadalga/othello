import Stone from "@/_components/Stone";
import { Gamer } from "@/_enums";

export default function GameStatus(){
    return (
        <div className="w-full max-w-xl grid place-items-center h-20 py-2.5 px-5 bg-green-600 text-white">

            <div className="w-full flex items-center justify-around">
                <div className="flex items-center gap-3">
                    <Stone gamer={Gamer.BLACK}/>
                    <span className="text-xs lg:text-sm"> 5 </span>
                </div>
                <div className="flex items-center gap-3">
                    <Stone gamer={Gamer.WHITE}/>
                    <span className="text-xs lg:text-sm"> 5 </span>
                </div>
            </div>

            <h6 className="font-semibold text-sm lg:text-base">
                Computer turn
            </h6>

        </div>
    )
}