import {
    createContext,
    Dispatch,
    ReactNode,
    SetStateAction,
    useContext,
    useState
} from 'react';

interface RoomContextType {
    gameID: string | null;
    setGameID: Dispatch<SetStateAction<string | null>>;
}


const RoomContext = createContext<RoomContextType>({
    gameID: null,
    setGameID: () => {
    }
});

export const useGame = () => useContext(RoomContext);

export function GameProvider({ children }: { children: ReactNode }) {
    const [ gameID, setGameID ] = useState<string | null>(null);

    return (
        <RoomContext.Provider value={{ gameID, setGameID }}>
            {children}
        </RoomContext.Provider>
    );
};
