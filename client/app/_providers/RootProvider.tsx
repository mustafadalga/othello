"use client";

import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache, split } from "@apollo/client";
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { getMainDefinition } from "@apollo/client/utilities";
import { createClient } from "graphql-ws";
import { LocalStorage } from "@/_enums";
import { ReactNode, useEffect, useState } from "react";


function client() {
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

    return new ApolloClient({
        link: splitLink,
        cache: new InMemoryCache()
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