"use client";
import { useParams, useRouter } from 'next/navigation'
import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useMutation, useQuery, useSubscription } from "@apollo/client";
import GameScreen from "@/_components/GameScreen";
import { ADD_PLAYER } from "@/_graphql/mutations";
import { GET_GAME_BY_ID } from "@/_graphql/queries";
import graphQLError from "@/_utilities/graphQLError";
import { GAME_UPDATED, GAMER_CONNECTION } from "@/_graphql/subscriptions";
import { useGame } from "@/_providers/GameProvider";
import { MAX_GAMER_COUNT } from "@/_constants";
import { EGamerStatus, ELocalStorage } from "@/_enums";
import { IGame, IGamerConnection, SubscriptionGamerConnection, SubscriptionGameUpdatedData } from "@/_types";


function toggleLocalStorageGameStartedMessage(status: boolean) {
    if (status) {
        localStorage.setItem(ELocalStorage.GAME_STARTED_MESSAGE_SHOWN, "true");
    } else {
        localStorage.removeItem(ELocalStorage.GAME_STARTED_MESSAGE_SHOWN);
    }
}


export default function Page() {
    const { id } = useParams();
    const router = useRouter()
    const { setGameID } = useGame();
    const [ game, setGame ] = useState<IGame>();
    const userID: string = localStorage.getItem(ELocalStorage.USERID)!

    const [ addPlayer ] = useMutation(ADD_PLAYER, {
        onError: graphQLError
    });
    useQuery<{ game: IGame }>(GET_GAME_BY_ID, {
        variables: {
            id,
        },
        onCompleted: ({ game }) => {
            if (!game) return;

            setGame(game);
            const isAuthenticatedGamer: boolean = game.gamers.some(gamer => gamer.id == userID);

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
                        gamerID: userID
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

            if (data.game.isGameStarted && !localStorage.getItem(ELocalStorage.GAME_STARTED_MESSAGE_SHOWN)) {
                toggleLocalStorageGameStartedMessage(true);
                const message: string = "Game has started. You can start playing now."
                toast.info(message, {
                    toastId: message
                })
            }

            if (data.game.isGameFinished) {
                toggleLocalStorageGameStartedMessage(false);
                if (data.game.exitGamer && data.game.exitGamer != userID) {
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

    useSubscription<SubscriptionGamerConnection>(GAMER_CONNECTION, {
        variables: { gameID: id },
        onData: ({ data: { data } }) => {

            if (!data?.gamer || !game) return;
            const gamer = data?.gamer as IGamerConnection;

            if (gamer.userID == userID) return;

            const color = (game as IGame).gamers.find(gamerItem => gamerItem.id == gamer.userID)?.color;
            if (!color) return;
            
            const message: string = `${color} gamer ${gamer.status.toLowerCase()}!`

            if (gamer.status == EGamerStatus.CONNECTED) {
                toast.success(message, {
                    toastId: message
                })
            } else {
                toast.error(message, {
                    toastId: message
                })
            }
        },
        onError: graphQLError
    });

    useEffect(() => {
        setGameID(id as string);
    }, [])

    return <GameScreen/>;
}