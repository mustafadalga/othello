"use client";
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import GameScreen from "@/_components/GameScreen";
import { ADD_PLAYER } from "@/_graphql/mutations";
import generateID from "@/_utilities/generateID";
import { GET_GAME_BY_ID } from "@/_graphql/queries";
import graphQLError from "@/_utilities/graphQLError";
import { GAME_UPDATED } from "@/_graphql/subscriptions";
import { MAX_GAMER_COUNT } from "@/_constants";
import { LocalStorage } from "@/_enums";
import { IGame, SubscriptionGameUpdatedData } from "@/_types";


function saveUserID() {
    if (localStorage.getItem(LocalStorage.USERID)) {
        return;
    }

    const id: string = generateID();
    localStorage.setItem(LocalStorage.USERID, id);
}

function toggleLocalStorageGameStartedMessage(status: boolean) {
    if (status) {
        localStorage.setItem(LocalStorage.GAME_STARTED_MESSAGE_SHOWN, "true");
    } else {
        localStorage.removeItem(LocalStorage.GAME_STARTED_MESSAGE_SHOWN);
    }
}


export default function Page() {
    const { id } = useParams();
    const router = useRouter()
    const [ addPlayer ] = useMutation(ADD_PLAYER, {
        onError: graphQLError
    });
    useQuery<{ game: IGame }>(GET_GAME_BY_ID, {
        variables: {
            id,
        },
        onCompleted: ({ game }) => {
            const gamerID: string = localStorage.getItem(LocalStorage.USERID)!;
            const isAuthenticatedGamer: boolean = game.gamers.some(gamer => gamer.id == gamerID);

            if (game.gamers.length == MAX_GAMER_COUNT && !isAuthenticatedGamer) {
                return router.push("/");
            }

            if (game.isGameFinished) {
                toggleLocalStorageGameStartedMessage(false);
                return showGameFinishedMessage();
            }

            if (game.isGameStarted) return;

            addPlayer({
                variables: {
                    data: {
                        gameID: id,
                        gamerID
                    }
                }
            })
        },
        onError: graphQLError
    });

    const showGameFinishedMessage = useCallback(() => {
        const message: string = "Game has finished!"
        toast.info(message, {
            toastId: message
        })
    }, [])

    useSubscription<SubscriptionGameUpdatedData>(GAME_UPDATED, {
        variables: {
            gameID: id,
        },
        onData: ({ data: { data } }) => {
            if (!data?.game) return;

            if (data.game.isGameStarted && !localStorage.getItem(LocalStorage.GAME_STARTED_MESSAGE_SHOWN)) {
                toggleLocalStorageGameStartedMessage(true);
                const message: string = "Game has started. You can start playing now."
                toast.info(message, {
                    toastId: message
                })
            }

            if (data.game.isGameFinished) {
                toggleLocalStorageGameStartedMessage(false);
                if (data.game.exitGamer && data.game.exitGamer != localStorage.getItem(LocalStorage.USERID)) {
                    const message: string = "Your opponent has exited.Game has finished!"
                    toast.info(message, {
                        toastId: message
                    })
                } else if (!data.game.exitGamer) {
                    showGameFinishedMessage();
                }
            }
        },
        onError: graphQLError
    })


    useEffect(() => {
        saveUserID();
    }, [])

    return <GameScreen/>;
}