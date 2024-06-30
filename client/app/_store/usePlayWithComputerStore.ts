import { create } from 'zustand';
import { devtools } from 'zustand/middleware'
import { IGame, IMove } from "@/_types";

interface Store {
    game: IGame | null,
    moves: IMove[],
    updateGame: (game: IGame | null) => void;
    updateMoves: (moves: IMove[]) => void;
}

export default create(devtools<Store>((set) => ({
    game: null,
    moves: [],
    updateGame: (game) => set({ game }),
    updateMoves: (moves) => set({ moves }),
})));

