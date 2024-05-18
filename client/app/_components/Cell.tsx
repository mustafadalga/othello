import Stone from "./Stone";
import Hint from "./Hint";
import { Stone as IStone } from "@/_types";

interface Props {
    stone: IStone,
    hasHint: boolean,
    onClick: (stone: IStone) => void
}

export default function Cell({ stone, hasHint, onClick }: Props) {
    return (
        <div onClick={hasHint ? () => onClick(stone) : undefined}
             className="grid place-items-center border border-gray-900 p-2.5 sm:p-4 group">
            {stone.value && <Stone gamer={stone.value}/>}
            {hasHint && <Hint/>}
        </div>
    )
}