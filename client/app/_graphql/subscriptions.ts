import { gql } from '@apollo/client';

export const GAME_MOVE = gql`
    subscription Subscription($gameID: ID!) {
        move:gameMove(gameID: $gameID) {
            col
            gameID
            gamer
            row
        }
    }
`;
