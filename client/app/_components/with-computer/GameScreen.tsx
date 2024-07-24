import GameStatus from "./GameStatus";
import Board from "./Board";
import BoardOptions from "./BoardOptions";

export default function GameScreen() {
    return <section className="grid gap-5 place-items-center">
        <GameStatus/>
        <Board/>
        <BoardOptions/>
    </section>
}