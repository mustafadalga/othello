"use client";
import { useEffect } from "react";
import usePlayWithComputerStore from "@/_store/usePlayWithComputerStore";
import createBoard from "@/_utilities/createBoard";
import getInitialGameWithComputer from "@/_utilities/getInitialGameWithComputer";
import GameScreen from "@/_components/with-computer/GameScreen";


export default function Page(){
    const { updateGame, updateBoard, game } = usePlayWithComputerStore()

    useEffect(() => {
        if (!game) {
            updateGame(getInitialGameWithComputer());
            updateBoard(createBoard())
        }
    }, [])

    return <GameScreen/>
}
