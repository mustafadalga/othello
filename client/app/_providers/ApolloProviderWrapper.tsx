import { ReactNode } from "react";
import { ApolloClient, ApolloProvider, createHttpLink, from, InMemoryCache, split } from "@apollo/client";
import { removeTypenameFromVariables } from "@apollo/client/link/remove-typename";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from "graphql-ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { useGame } from "@/_providers/GameProvider";
import { SubscriptionGameMovedData } from "@/_types";
import { ELocalStorage } from "@/_enums";

function createWsLink(gameID: string) {
    return new GraphQLWsLink(createClient({
        url: process.env.NEXT_PUBLIC_WS_URL as string,

        connectionParams: {
            userID: localStorage.getItem(ELocalStorage.USERID),
            gameID
        }
    }))
}

function getClient(gameID: string) {
    const removeTypenameLink = removeTypenameFromVariables();
    const httpLink = createHttpLink({
        uri: process.env.NEXT_PUBLIC_API_URL
    });
    const wsLink = createWsLink(gameID)

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
    const link = from([ removeTypenameLink, splitLink ]);

    const cache = new InMemoryCache({
        typePolicies: {
            Subscription: {
                fields: {
                    gameMoved: {
                        keyArgs: [ "gameID" ],
                        merge(existing: SubscriptionGameMovedData, incoming: SubscriptionGameMovedData) {
                            const existingMoves = existing?.moves || [];
                            const incomingMoves = incoming?.moves || [];
                            const merged = [ ...existingMoves ];

                            // Create a map to keep track of unique row+col combinations
                            const map = new Map();
                            for (const move of merged) {
                                map.set(`${move.row}:${move.col}`, move);
                            }

                            for (const move of incomingMoves) {
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

export function ApolloProviderWrapper({ children }: { children: ReactNode }) {
    const { gameID } = useGame();
    const client = getClient(gameID as string)

    return (
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    );
};