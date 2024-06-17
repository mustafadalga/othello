import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { RESTART_GAME, UPDATE_GAME } from "@/_graphql/mutations";
import { ELocalStorage } from "@/_enums";
import graphQLError from "@/_utilities/graphQLError";
import useGameResultModal from "@/_store/useGameResultModal";

export default function BoardOptions() {
    const router = useRouter();
    const { id } = useParams();
    const { onClose } = useGameResultModal();

    const [ exitGame ] = useMutation(UPDATE_GAME, {
        variables: {
            data: {
                _id: id,
                exitGamer: localStorage.getItem(ELocalStorage.USERID),
                isGameStarted: false,
                isGameFinished: true,
                moveOrder: null
            }
        },
        onCompleted: () => {
            router.push("/")
        },
        onError: graphQLError
    });

    const [ restartGame ] = useMutation(RESTART_GAME, {
        variables: {
            _id: id,
        },
        onError: graphQLError
    })

    const handleRestart = () => {
        onClose();
        restartGame();
    }

    return (
        <div className="grid grid-cols-2 gap-3">
            <button
                onClick={handleRestart}
                className="px-4 py-2 text-xs lg:text-sm text-white whitespace-nowrap bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                New Game
            </button>
            <button
                onClick={() => exitGame()}
                className="px-4 py-2 text-xs lg:text-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium rounded-lg transition-colors">
                Exit
            </button>
        </div>
    )
}