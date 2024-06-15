"use client";
import { ReactNode, useEffect, useState } from "react";
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split, from } from "@apollo/client";
import { removeTypenameFromVariables } from '@apollo/client/link/remove-typename';


import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { LocalStorage } from "@/_enums";
import { IMove } from "@/_types";


function client() {
    const removeTypenameLink = removeTypenameFromVariables();
    const httpLink = createHttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL
    });

    const wsLink = new GraphQLWsLink(createClient({
        url: process.env.NEXT_PUBLIC_WS_URL as string,
        connectionParams: {
            userID: localStorage.getItem(LocalStorage.USERID)
        }
    }));

    const splitLink = split(
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' &&
                definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink,
    );
    const link = from([removeTypenameLink, splitLink]);

    const cache = new InMemoryCache({
        typePolicies: {
            Subscription: {
                fields: {
                    gameMoved: {
                        keyArgs: [ "gameID" ],
                        merge(existing: IMove[] = [], incoming: IMove[]) {
                            const merged = [ ...existing ];

                            // Create a map to keep track of unique row+col combinations
                            const map = new Map();
                            for (const move of merged) {
                                map.set(`${move.row}:${move.col}`, move);
                            }

                            for (const move of incoming) {
                                map.set(`${move.row}:${move.col}`, move);
                            }

                            return Array.from(map.values());
                        }
                    }
                }
            }
        }
    });

    return new ApolloClient({
        link,
        cache
    });
}


export default function RootProvider({ children }: { children: ReactNode }) {
    const [ isMounted, setIsMounted ] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, [])

    if (!isMounted) return null;

    if (isMounted) {
        return <ApolloProvider client={client()}>
            {children}
        </ApolloProvider>
    }
}