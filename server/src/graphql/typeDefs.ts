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
    gameByID(_id:ID!): Game
    movesByGameID(gameID:ID!): [Move]
    gamersStoneCountByGameID(gameID:ID!):GamersStoneCount
}

type Mutation {
    createGame:Game
    addPlayer(data:AddPlayer!):Game
    updateGame(data:UpdateGameInput!):Game
    createMoves(moves:[UserMove]!):[Move]
    restartGame(_id:ID!):Game
}

type Subscription {
    gameStarted(gameID:ID!):Game!
    gameUpdated(gameID:ID!):Game!
    gameMoved(gameID: ID!): GameMoved!
    gamersStoneCountUpdated(gameID:ID!):GamersStoneCount
    gamerConnection(gameID:ID!):GamerConnection!
}

type Game {
    _id:ID!
    gamers:[IGamers],
    isGameFinished:Boolean!
    isGameStarted:Boolean!
    moveOrder:String
    winnerGamer:String
    exitGamer:String,
}


type IGamers {
    id:ID!
    color:Gamer!
    status:GamerStatus!,
    canMove:Boolean!
}

type Move {
    row:Int!
    col:Int!
    gamer:Gamer!
    gameID:ID!
}

type GameMoved {
    isGameRestarted:Boolean,
    moves:[Move]!
}

type GamerConnection {
    gameID:String!
    userID:String!
    status:String!
}

type StoneCount {
    BLACK: Int!
    WHITE: Int!
}

type GamersStoneCount {
    game:Game!,
    count: StoneCount!
}

input UserMove {
    row:Int!
    col:Int!
    gamer:Gamer!
    gameID:ID!
}

input AddPlayer {
    gameID:ID!
    gamerID:ID!
}

input GamerInput {
    id: ID
    color: Gamer
    status: GamerStatus
    canMove: Boolean
}

input UpdateGameInput {
    _id: ID!
    isGameStarted: Boolean
    isGameFinished: Boolean
    moveOrder: String
    winnerGamer: String
    exitGamer: String
    gamers: [GamerInput]
}
`