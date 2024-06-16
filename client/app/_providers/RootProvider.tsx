"use client";
import { ReactNode, useEffect, useState } from "react";
import { GameProvider } from "./GameProvider";
import { ApolloProviderWrapper } from "./ApolloProviderWrapper";
import { LocalStorage } from "@/_enums";
import generateID from "@/_utilities/generateID";

function saveUserID() {
    if (localStorage.getItem(LocalStorage.USERID)) {
        return;
    }

    const id: string = generateID();
    localStorage.setItem(LocalStorage.USERID, id);
}

export default function RootProvider({ children }: { children: ReactNode }) {
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        saveUserID();
    }, [])

    if (!isMounted) return null;

    return (
        <GameProvider>
            <ApolloProviderWrapper>
                {children}
            </ApolloProviderWrapper>
        </GameProvider>
    )
}