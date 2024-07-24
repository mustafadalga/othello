import { useRouter } from "next/navigation";
import usePlayWithComputerStore from "@/_store/usePlayWithComputerStore";
import createBoard from "@/_utilities/createBoard";
import getInitialGameWithComputer from "@/_utilities/getInitialGameWithComputer";


export default function BoardOptions() {
    const router = useRouter();
    const { updateGame, updateBoard } = usePlayWithComputerStore();


    const handleRestart = () => {
        updateGame(getInitialGameWithComputer());
        updateBoard(createBoard());
    }

    const handleExit = () => {
        router.push("/")
        setTimeout(() => {
            updateGame(null);
            updateBoard([]);
        }, 10)
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={handleRestart}
                className="px-4 py-2 text-xs lg:text-sm text-white whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                New Game
            </button>
            <button
                onClick={handleExit}
                className="px-4 py-2 text-xs lg:text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                Exit
            </button>
        </div>
    )
}