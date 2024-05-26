import { gql } from "@apollo/client";

export const CREATE_GAME = gql`
    mutation createGame($playAgainstComputer: Boolean) {
        game:createGame(playAgainstComputer:$playAgainstComputer) {
            _id,
            playAgainstComputer
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

export const CREATE_MOVE = gql`
    mutation createMove($move: UserMove!) {
        game:createMove(move: $move) {
            row,
            col,
            gameID,
            gamer
        }
    }
`;

export const FINISH_GAME = gql`
    mutation finishGame($data: FinishGame!) {
        game:finishGame(data: $data) {
            _id
        }
    }
`;

export const EXIT_GAME = gql`
    mutation exitGame($data: ExitGame!) {
        game:exitGame(data: $data) {
            _id
        }
    }
`;

export const RESTART_GAME = gql`
    mutation restartGame($id: ID!) {
        game:restartGame(_id: $id) {
            _id
        }
    }
`