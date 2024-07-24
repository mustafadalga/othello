import { useState, useCallback, useEffect, forwardRef } from "react";
import { IMove } from "@/_types";
import { EGamer } from "@/_enums";
import Stone from "./Stone";
import Hint from "./Hint";

interface Props {
    stone: IMove,
    hasHint: boolean,
    activeGamer: EGamer,
    onClick: (stone: IMove) => void
}

export default forwardRef<HTMLDivElement, Props>(function Cell({ stone, hasHint, activeGamer, onClick }, ref) {
    const [ isHintClicked, setIsHintClicked ] = useState(false);

    const handleClick = useCallback(() => {
        if (!hasHint) return;

        setIsHintClicked(true)
        onClick(stone);
    }, [ hasHint, stone, onClick ]);

    useEffect(() => {
        if (!hasHint) {
            setIsHintClicked(false);
        }
    }, [ hasHint ])

    return (
        <div onClick={handleClick}
             ref={ref}
             className="relative bg-gradient-to-r from-[#038947] via-[#03A454] to-[#04D46C] grid place-items-center rounded w-6 h-6 min-[320px]:w-8 min-[320px]:h-8 min-[400px]:w-10 min-[400px]:h-10 min-[480px]:w-12 min-[480px]:h-12 min-[600px]:w-16 min-[600px]:h-16 min-[720px]:w-[72px] min-[720px]:h-[72px] group">

            {stone.gamer && <Stone gamer={stone.gamer}/>}

            {hasHint && <Hint isHintClicked={isHintClicked} activeGamer={activeGamer}/>}
        </div>
    )
})