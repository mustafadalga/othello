import { CREATE_GAME } from "@/_graphql/mutations";
import { useMutation } from "@apollo/client";
import Link from "next/link";
import useLoader from "@/_store/useLoader";
import ClipBoardURL from "@/_components/ClipBoardURL";

interface AddTodoResponse {
    game: {
        _id: string;
        playAgainstComputer: boolean
    };
}

interface AddTodoVariables {
    playAgainstComputer: boolean
}

export default function CreateGame() {
    const [ createGame, { data, loading, error } ] = useMutation<AddTodoResponse, AddTodoVariables>(CREATE_GAME);
    const roomURL: string = `${process.env.NEXT_PUBLIC_SITE_URL}/room/${data?.game?._id}`;
    const playAgainstComputer: boolean = data?.game?.playAgainstComputer || false;
    const { onOpen, onClose } = useLoader()

    const handleCreateGame = (playAgainstComputer: boolean) => {
        onOpen();
        createGame({
            variables: {
                playAgainstComputer
            },
            onCompleted: () => {
                onClose();
            }
        })
    }

    return (
        <section
            className="w-full max-w-3xl grid place-items-center gap-5 mx-auto p-5 lg:p-8 rounded-xl bg-white shadow-xl">
            <h1 className="text-gray-600 text-xl lg:text-2xl text-center">
                Start Your Game: Play with Friends or Against the Computer
            </h1>

            <p className="text-gray-600 text-sm lg:text-base">
                Create a room to play in real-time with a friend by sharing the room link, or start a
                game to challenge the computer. Both options are designed for dynamic gameplay tailored to your
                preference.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 mb-4">
                <button type="button"
                        onClick={() => handleCreateGame(false)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-2 font-normal text-xs lg:text-sm">
                    Play with Friends
                </button>

                <button type="button"
                        onClick={() => handleCreateGame(true)}
                        className="bg-indigo-600 text-white hover:bg-indigo-700 rounded-lg px-4 py-2 font-normal text-xs lg:text-sm">
                    Play Against the Computer
                </button>
            </div>


            {
                data?.game &&

                <div className="grid max-w-xl text-sm lg:text-base">
                    {
                        playAgainstComputer ? (
                            <p className="text-gray-600">
                                Your game against the computer is ready! Click
                                <Link href={roomURL} className="text-blue-500 underline mx-1">here</Link>
                                to start playing.
                            </p>

                        ) : (
                            <>
                                <p className="text-gray-600">
                                    Game room created! Share this link with your friend to start playing together
                                </p>
                                <div className="flex items-center truncate">
                                    <Link href={roomURL} className="text-blue-500 truncate">{roomURL}</Link>
                                    <ClipBoardURL roomURL={roomURL}/>
                                </div>
                            </>
                        )
                    }
                </div>

            }

            {
                error &&
                <p className="text-red-500 text-sm lg:text-base">
                    Unable to create the game. Please check your connection and try again.
                </p>
            }

            {
                loading &&
                <p className="text-blue-500 text-sm lg:text-base">
                    Creating your game, please wait...
                </p>
            }

        </section>
    )
}