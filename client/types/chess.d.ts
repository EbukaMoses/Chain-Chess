export interface ChessMove {
    from: string;
    to: string;
    promotion?: 'q' | 'r' | 'b' | 'n';
}

export interface GameState {
    game: any; // Chess.js instance
    playerColor: 'w' | 'b';
    isPlayerTurn: boolean;
    gameStatus: string;
    moveHistory: string[];
    capturedPieces: {
        white: string[];
        black: string[];
    };
}

export interface ChessGameProps {
    gameId: string;
    initialPosition?: string;
    playerColor?: 'w' | 'b';
    onMove?: (move: ChessMove) => void;
    onGameEnd?: (result: string) => void;
} 