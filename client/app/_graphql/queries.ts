import { gql } from "@apollo/client";


export const GET_GAME_BY_ID = gql`
    query GameByID($id: ID!) {
        game:gameByID(_id: $id) {
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
`


export const GET_MOVES_BY_GAME_ID = gql`
    query MovesByGameID($gameID: ID!) {
        moves:movesByGameID(gameID: $gameID) {
            col,
            row,
            gameID,
            gamer
        }
    }
`

export const GET_GAMERS_STONE_COUNT = gql`
    query gamersStoneCountByGameID($gameID: ID!) {
        game:gamersStoneCountByGameID(gameID: $gameID) {
            game {
                _id,
                gamers {
                    id,
                    color
                }
            },
            count {
                BLACK,
                WHITE
            },
        }
    }
`