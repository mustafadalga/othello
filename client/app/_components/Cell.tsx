import { useState, useCallback, useEffect } from "react";
import { IStone } from "@/_types";
import { EGamer } from "@/_enums";
import Stone from "./Stone";
import Hint from "./Hint";

interface Props {
    stone: IStone,
    hasHint: boolean,
    activeGamer: EGamer,
    onClick: (stone: IStone) => void
}

export default function Cell({ stone, hasHint, activeGamer, onClick }: Props) {
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
             className="grid place-items-center border border-gray-900 p-1.5 [@media(min-width:400px)]:p-2 [@media(min-width:480px)]:p-2.5 [@media(min-width:540px)]:p-4 group">

            {stone.gamer && <Stone gamer={stone.gamer}/>}

            {hasHint && <Hint isHintClicked={isHintClicked} activeGamer={activeGamer}/>}
        </div>
    )
}