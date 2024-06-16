import { gql } from '@apollo/client';

export const GAME_MOVED = gql`
    subscription gameMoved($gameID: ID!) {
        moves:gameMoved(gameID: $gameID) {
            col
            gameID
            gamer
            row
        }
    }
`;


export const GAME_UPDATED = gql`
    subscription gameUpdated($gameID: ID!) {
        game:gameUpdated(gameID: $gameID) {
            _id,
            gamers {
                id,
                color,
                canMove,
                status
            }
            isGameStarted,
            isGameFinished,
            moveOrder,
            winnerGamer,
            exitGamer
        }
    }
`;

export const GAME_RESTARTED = gql`
    subscription gameRestarted($gameID: ID!) {
        game:gameRestarted(gameID: $gameID) {
            _id
        }
    }
`;

export const GAMERS_STONE_COUNT_UPDATED = gql`
    subscription gamersStoneCountUpdated($gameID: ID!) {
        game:gamersStoneCountUpdated(gameID: $gameID) {
            game {
                _id,
                gamers {
                    id,
                    color
                }
            }
            count {
                BLACK
                WHITE
            }
        }
    }
`

export const GAMER_CONNECTION = gql`
    subscription GamerConnection($gameID: ID!) {
        gamer:gamerConnection(gameID: $gameID) {
            gameID,
            userID,
            status
        }
    }
`;