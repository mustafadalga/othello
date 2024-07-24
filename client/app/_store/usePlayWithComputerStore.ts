import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { IGame, IMove } from "@/_types";

interface Store {
    game: IGame | null,
    board: IMove[],
    updateGame: (game: IGame | null) => void;
    updateBoard: (moves: IMove[]) => void;
}

export default create(devtools<Store>((set) => ({
    game: null,
    board: [],
    updateGame: (game) => set({ game }),
    updateBoard: (board) => set({ board }),
})));

