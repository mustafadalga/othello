"use client";
import { ReactNode, useEffect, useState } from "react";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";
import { GameProvider } from "./GameProvider";
import { ApolloProviderWrapper } from "./ApolloProviderWrapper";
import { ELocalStorage } from "@/_enums";
import generateID from "@/_utilities/generateID";

/**
 * Disable React DevTools in production
 */
if (process.env.NODE_ENV === "production") {
    disableReactDevTools();
}


function saveUserID() {
    if (localStorage.getItem(ELocalStorage.USERID)) {
        return;
    }

    const id: string = generateID();
    localStorage.setItem(ELocalStorage.USERID, id);
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