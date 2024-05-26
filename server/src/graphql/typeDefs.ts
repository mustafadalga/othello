export default `#graphql
enum Gamer {
    BLACK
    WHITE
}
enum GamerStatus {
    CONNECTED
    DISCONNECTED
    EXITED
}

type Query {
    gameByID(_id:ID!,gamerID:String!): Game
    movesByGameID(gameID:ID!): [MoveWithID]
}

type Mutation {
    createGame(playAgainstComputer:Boolean):Game
    addPlayer(data:AddPlayer!):Game
    createMove(move:UserMove!):MoveWithID
    finishGame(data:FinishGame!):Game
    exitGame(data:ExitGame!):Game
    restartGame(_id:ID!):Game
}

type Subscription {
    gameMove(gameID: ID!): Move
    gameStarted:GameStarted
    gameExit:GameExit
    gameFinished:GameFinished
    gamerConnected:GamerConnection
    gamerDisconnected:GamerConnection
}

type Game {
    _id:ID!
    gamers:[IGamers],
    isGameFinished:Boolean!
    isGameStarted:Boolean!
    moveOrder:String
    winnerGamer:String
    playAgainstComputer:Boolean
    exitGamer:String
}


type IGamers {
    id:ID!
    color:Gamer!
    status:GamerStatus
}

type MoveWithID {
    row:Int!
    col:Int!
    gamer:Gamer!
    gameID:ID!
}
type Move {
    row:Int!
    col:Int!
    gamer:Gamer!
    gameID:ID!
}


type GameStarted {
    gameStarted:Boolean
}

type GameExit {
    gameExit:String!
}

type GameFinished {
    gameFinished:Boolean
}

type GamerConnection {
    userID:String!
}

input UserMove {
    row:Int!
    col:Int!
    gamer:Gamer!
    gameID:ID!
}

input AddPlayer {
    roomID:ID!
    gamerID:ID!
}

input FinishGame {
    _id:ID!
    winnerGamer:String!
}

input ExitGame {
    roomID:ID!
    gamerID:ID!
}
`