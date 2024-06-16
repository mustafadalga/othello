import "module-alias/register.js"
import dotenv from "dotenv";

dotenv.config();
import http from "http"
import express from "express"
import cors from 'cors';
import { ApolloServer } from '@apollo/server';
import { ApolloServerPluginDrainHttpServer } from '@apollo/server/plugin/drainHttpServer';
import { expressMiddleware } from '@apollo/server/express4';
import { makeExecutableSchema } from "@graphql-tools/schema";
import { useServer } from 'graphql-ws/lib/use/ws';
import { WebSocketServer } from 'ws';
import connectDB from "@/db";
import typeDefs from "@/graphql/typeDefs";
import resolvers from "@/graphql/resolvers";
import pubsub from "@/pubsub";
import { EGamerStatus, ESubscriptionMessages } from "@/enums";

interface IConnection {
    gameID: string,
    userID: string
}


async function setup() {
    const app = express();
    const port = process.env.PORT || 4000;
    connectDB();
    const schema = makeExecutableSchema({ typeDefs, resolvers })
    const httpServer = http.createServer(app);

// Define the GraphQL schema using Apollo Server
    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ ApolloServerPluginDrainHttpServer({ httpServer }) ],
    });


    /**
     * Starts the Apollo Server.
     * This prepares the server to handle incoming GraphQL requests by ensuring that all
     * initializations that need to happen before accepting requests are completed.
     */
    await apolloServer.start();


    /**
     * Sets up the Apollo Server middleware within the Express application.
     * This integration enables Apollo Server to handle requests on the specified '/graphql' endpoint.
     *
     * - cors(): Middleware to enable Cross-Origin Resource Sharing (CORS) options. This is important
     *   for security in a web context, allowing you to specify which domains can access your server.
     *
     * - express.json(): Middleware to parse incoming requests with JSON payloads. This is necessary
     *   because GraphQL queries typically come as JSON.
     *
     * - expressMiddleware(apolloServer, options): The core Apollo Server middleware for Express. This
     *   function integrates the Apollo server with the Express application, allowing the handling of
     *   GraphQL queries on the specified path.
     *   - The 'context' function inside options provides a way to compute context for each request,
     *     which can be used to pass important security and request-specific data through to your
     *     resolvers.
     */
    app.use(
        '/graphql',
        cors(),
        express.json(),
        expressMiddleware(apolloServer),
    );

// Listen for requests on the specified port

    await new Promise<void>((resolve) => {
        httpServer.listen(port, resolve);
    });
    console.log(`🚀 Server ready at http://localhost:${port}/graphql`);

// Setup WebSocket server for GraphQL subscriptions
    const wsServer = new WebSocketServer({
        server: httpServer,
        path: '/graphql',
    });

    useServer({
        schema,
        onConnect: (context) => handleConnection(context.connectionParams as unknown as IConnection,EGamerStatus.CONNECTED),
        onDisconnect: (context) => handleConnection(context.connectionParams as unknown as IConnection,EGamerStatus.DISCONNECTED),
    }, wsServer);

    function handleConnection({ gameID, userID }: IConnection,status:EGamerStatus) {
        if (gameID && userID) {
            const triggerName = `${ESubscriptionMessages.GAMER_CONNECTION}_${gameID}`;
            pubsub.publish(triggerName, {
                gamerConnection: {
                    gameID,
                    userID,
                    status
                },
            });

        } else {
            console.error("Missing gameID or userID in connectionParams");
        }
    }
}


setup();