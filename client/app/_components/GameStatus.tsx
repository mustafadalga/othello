import { useParams } from "next/navigation";
import { useState } from "react";
import { useQuery, useSubscription } from "@apollo/client";
import { capitalize } from "lodash";
import { EGamer } from "@/_enums";
import { GET_GAME_BY_ID, GET_GAMERS_STONE_COUNT } from "@/_graphql/queries";
import { GAME_UPDATED, GAMERS_STONE_COUNT_UPDATED } from "@/_graphql/subscriptions";
import getActiveGamerData from "@/_utilities/getActiveGamerData";
import graphQLError from "@/_utilities/graphQLError";
import {
    IGame,
    IGamersStoneCount,
    SubscriptionGamersStoneCountUpdatedData,
    SubscriptionGameUpdatedData
} from "@/_types";
import Stone from "@/_components/Stone";


export default function GameStatus() {
    const { id } = useParams();
    const [ game, setGame ] = useState<IGame>();
    const activeMoveOrder = getActiveGamerData(game);
    const [ gamerCount, setGamerCount ] = useState<Record<EGamer, number>>({
        [EGamer.WHITE]: 0,
        [EGamer.BLACK]: 0
    });
    useQuery<{ game: IGame }>(GET_GAME_BY_ID, {
        variables: {
            id,
        },
        onCompleted: ({ game }) => {
            setGame(game)
        }
    });

    useQuery<{ game: IGamersStoneCount }>(GET_GAMERS_STONE_COUNT, {
        variables: {
            gameID: id,
        },
        onCompleted: ({ game }) => {
            if (game) {
                setGamerCount(game.count)
            }
        }
    });

    useSubscription<SubscriptionGamersStoneCountUpdatedData>(GAMERS_STONE_COUNT_UPDATED, {
        variables: {
            gameID: id
        },
        onData: ({ data: { data } }) => {
            if (data?.game) {
                setGamerCount(data.game.count)
            }
        },
        onError: graphQLError
    });

    useSubscription<SubscriptionGameUpdatedData>(GAME_UPDATED, {
        variables: {
            gameID: id as string
        },
        onData: ({ data: { data } }) => {
            if (data?.game) {
                setGame(data.game);
            }
        },
        onError: graphQLError
    });

    return (
        <div className="w-full max-w-xl grid place-items-center h-20 py-2.5 px-5 bg-green-600 text-white">

            <div className="w-full flex items-center justify-around">
                <div className="flex items-center gap-3">
                    <Stone gamer={EGamer.BLACK}
                           isActive={activeMoveOrder.gamer.color == EGamer.BLACK}/>
                    <span className="text-xs lg:text-sm"> {gamerCount.BLACK} </span>
                </div>
                <div className="flex items-center gap-3">
                    <Stone gamer={EGamer.WHITE}
                           isActive={activeMoveOrder.gamer.color == EGamer.WHITE}/>
                    <span className="text-xs lg:text-sm"> {gamerCount.WHITE} </span>
                </div>
            </div>

            {activeMoveOrder?.gamer.color && (
                <h6 className="font-semibold text-sm lg:text-base">
                    {activeMoveOrder.isYourTurn ? "Your" : capitalize(activeMoveOrder.gamer.color)} turn
                </h6>
            )}

        </div>
    )
}