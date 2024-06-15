import { gql } from "@apollo/client";

export const CREATE_GAME = gql`
    mutation createGame {
        game:createGame {
            _id,
        }
    }
`

export const ADD_PLAYER = gql`
    mutation addPlayer($data: AddPlayer!) {
        game:addPlayer(data: $data) {
            _id
        }
    }
`

export const CREATE_MOVES = gql`
    mutation createMoves($moves: [UserMove]!) {
        moves:createMoves(moves: $moves) {
            row,
            col,
            gameID,
            gamer
        }
    }
`;

export const UPDATE_GAME = gql`
    mutation updateGame($data: UpdateGameInput!) {
        game:updateGame(data: $data) {
            _id
        }
    }
`


export const RESTART_GAME = gql`
    mutation restartGame($_id: ID!) {
        game:restartGame(_id: $_id) {
            _id
        }
    }
`