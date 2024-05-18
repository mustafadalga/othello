import BoardOptions from "./BoardOptions";
import GameStatus from "@/_components/GameStatus";
import Board from "@/_components/Board";

export default function GameScreen() {
    return <div className="grid gap-5 place-items-center">
        <GameStatus/>
        <Board/>
        <BoardOptions/>
    </div>
}