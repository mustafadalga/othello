import { gql } from '@apollo/client';

export const GAME_MOVED = gql`
    subscription gameMoved($gameID: ID!) {
        game:gameMoved(gameID: $gameID) {
            isGameRestarted
            moves {
                row
                gamer
                gameID
                col
            }
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