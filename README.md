## Othello - Realtime 2 Player Mind Game

Othello is a strategic board game played between two players. The goal is to have the most pieces of your color on the board at the end of the game.


### Features
* **Play with Friends:** Invite friends to play in a real-time competitive match.
* **Play Against the Computer:** Challenge the computer


<br/>

## How to Play Othello

### Game Introduction

Othello is a strategic board game played between two players. The goal is to have the most pieces of
your color on the board at the end of the game.

<p align="center">
<img src="https://raw.githubusercontent.com/mustafadalga/othello/main/client/public/how-to-play/screenshot-1.png" width="400" height="400" alt="Game Introduction"/>
<p/>


### Starting Position

The game begins on an 8x8 board. In the center, four pieces are placed diagonally: two white and two
black.

<p align="center">
<img src="https://raw.githubusercontent.com/mustafadalga/othello/main/client/public/how-to-play/screenshot-2.png" width="400" height="400" alt="Starting Position"/>
<p/>


### Making Moves and Flipping Pieces

*   Players take turns placing their pieces on empty squares. When placing a piece, it must trap
    opponent’s pieces between two of your pieces, either horizontally, vertically, or
    diagonally.
*  Trapped opponent pieces are flipped to your color.

| Before       | After                                                                                                                                       |
|--------------|---------------------------------------------------------------------------------------------------------------------------------------------|
| ![Making Moves and Flipping Pieces](https://raw.githubusercontent.com/mustafadalga/othello/main/client/public/how-to-play/screenshot-3.png) | ![Making Moves and Flipping Pieces](https://raw.githubusercontent.com/mustafadalga/othello/main/client/public/how-to-play/screenshot-4.png) |

An example showing a piece being placed and how opponent pieces are flipped. (With black’s turn,
I placed a piece in the 6th row, 5th column, turning the opponent’s white piece in the 5th row,
5th column to black.)



### Strategic Moves

Players can gain a strategic advantage by placing pieces on edge and corner squares, as these cannot
be flipped easily.


### End of Game and Winner

The game continues until the board is full or no valid moves are possible. The player with the most pieces wins.


<p align="center">
<img src="https://raw.githubusercontent.com/mustafadalga/othello/main/client/public/how-to-play/screenshot-5.png" width="400" height="400" alt="Othello game board"/>
<p/>


### Used Technologies

## Technology Stack
- **Frontend**: Next.js, Typescript, Tailwind CSS, Apollo Client, react-toastify, Zustand, framer-motion
- **Backend**: Node.js, Express.js, Apollo Server, GraphQL
- **Database**: MongoDB
- **Real-Time Communication**: WebSockets
- **Hosting**: Render.com for the backend and vercel.com for frontend

### Demo
* https://play-othello.vercel.app/


## Project Setup

### Installation

```
git clone git@github.com:mustafadalga/othello.git
cd othello
npm run install
```

### Server
* The following variables should be defined in an .env file in the server folder.

**Environment Variables(.env)**
* MONGODB_URL
* NODE_ENV

Change package.json moduleAliases alias as "src"
```
  "_moduleAliases": {
    "@": "src"
  }
```

### Client
* The following variables should be defined in an .env file in the client folder.

**Environment Variables(.env)**
* NEXT_PUBLIC_SITE_URL
* NEXT_PUBLIC_API_URL
* NEXT_PUBLIC_WS_URL

### Running the Project
To start the development server and run the project locally, use the following command:


#### Front End
```
cd client
npm run dev
```

#### Back End
```
cd backend
npm run dev
```

Once the server is running, you can access the project in your web browser at http://localhost:3000.


<hr/>

### Screenshots


<p align="center">
<img src="https://github.com/user-attachments/assets/44cb2465-96b2-4881-a874-1c71e5738f77" width="600" height="600" alt="Othello game board"/>
<img src="https://github.com/user-attachments/assets/245bd58e-8356-4b36-bf7d-f555d94c0d65" width="600" height="600" alt="Othello game board"/>
<img src="https://github.com/user-attachments/assets/fc9912b7-02ad-42b4-9ac9-8917b0da2c12" width="600" height="600" alt="Othello game board"/>
<p/>


## License
[![License](https://img.shields.io/badge/LICENSE-GPL--3.0-orange)](https://github.com/mustafadalga/othello/blob/main/LICENSE)