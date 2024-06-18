import { useParams, useRouter } from "next/navigation";
import { useMutation } from "@apollo/client";
import { RESTART_GAME, UPDATE_GAME } from "@/_graphql/mutations";
import graphQLError from "@/_utilities/graphQLError";
import useGameResultModal from "@/_store/useGameResultModal";
import useLoader from "@/_store/useLoader";
import { ELocalStorage } from "@/_enums";


export default function BoardOptions() {
    const router = useRouter();
    const { id } = useParams();
    const { onClose } = useGameResultModal();
    const { onOpen: onLoaderOpen, onClose: onLoaderClose } = useLoader();

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
        onError: graphQLError,

    });

    const [ restartGame ] = useMutation(RESTART_GAME, {
        variables: {
            _id: id,
        },
        onError: graphQLError
    })

    const handleRestart = async () => {
        onClose();
        onLoaderOpen();
        await restartGame();
        onLoaderClose();
    }

    const handleExit = async () => {
        onLoaderOpen();
        await exitGame();
        onLoaderClose();
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