'use client';

import { useState, useEffect } from 'react';
import { Chess } from 'chess.js';
import { Chessboard } from 'react-chessboard';
import { useParams } from 'next/navigation';

interface GameState {
    game: Chess;
    playerColor: 'w' | 'b';
    isPlayerTurn: boolean;
    gameStatus: string;
}

export default function ChessGamePage() {
    const params = useParams();
    const gameId = params.id as string;

    const [gameState, setGameState] = useState<GameState>({
        game: new Chess(),
        playerColor: 'w',
        isPlayerTurn: true,
        gameStatus: 'Game in progress'
    });

    // Function to make a move
    function makeAMove(move: any) {
        const gameCopy = new Chess(gameState.game.fen());

        try {
            const result = gameCopy.move(move);

            if (result === null) return false; // Invalid move

            setGameState(prev => ({
                ...prev,
                game: gameCopy,
                isPlayerTurn: !prev.isPlayerTurn
            }));

            return true;
        } catch (error) {
            return false;
        }
    }

    // Function to handle piece drop
    function onDrop(sourceSquare: string, targetSquare: string) {
        // Check if it's the player's turn
        if (!gameState.isPlayerTurn) {
            return false;
        }

        // Check if the piece belongs to the player
        const piece = gameState.game.get(sourceSquare);
        if (!piece || piece.color !== gameState.playerColor) {
            return false;
        }

        const move = makeAMove({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q' // Always promote to queen for simplicity
        });

        return move;
    }

    // Function to handle piece drag begin
    function onPieceDragBegin(piece: string, sourceSquare: string) {
        // Only allow dragging if it's the player's turn and it's their piece
        const isPlayerPiece = piece[0] === gameState.playerColor;
        if (!gameState.isPlayerTurn || !isPlayerPiece) {
            return false;
        }
        return true;
    }

    // Check game status
    useEffect(() => {
        const game = gameState.game;
        let status = 'Game in progress';

        if (game.isGameOver()) {
            if (game.isCheckmate()) {
                status = 'Checkmate!';
            } else if (game.isDraw()) {
                status = 'Draw!';
            } else if (game.isStalemate()) {
                status = 'Stalemate!';
            } else if (game.isThreefoldRepetition()) {
                status = 'Draw by repetition!';
            } else if (game.isInsufficientMaterial()) {
                status = 'Draw by insufficient material!';
            }
        } else if (game.isCheck()) {
            status = 'Check!';
        }

        setGameState(prev => ({
            ...prev,
            gameStatus: status
        }));
    }, [gameState.game]);

    // Reset game function
    const resetGame = () => {
        setGameState({
            game: new Chess(),
            playerColor: 'w',
            isPlayerTurn: true,
            gameStatus: 'Game in progress'
        });
    };

    // Switch player color
    const switchColor = () => {
        setGameState(prev => ({
            ...prev,
            playerColor: prev.playerColor === 'w' ? 'b' : 'w'
        }));
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-4xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-3xl font-bold text-gray-800 mb-2">
                            Chess Game #{gameId}
                        </h1>
                        <div className="flex items-center justify-between">
                            <div className="text-lg text-gray-600">
                                Status: <span className="font-semibold">{gameState.gameStatus}</span>
                            </div>
                            <div className="text-lg text-gray-600">
                                Turn: <span className="font-semibold">
                                    {gameState.isPlayerTurn ? 'Your turn' : 'Opponent\'s turn'}
                                </span>
                            </div>
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            You are playing as: <span className="font-semibold">
                                {gameState.playerColor === 'w' ? 'White' : 'Black'}
                            </span>
                        </div>
                    </div>

                    {/* Game Controls */}
                    <div className="mb-6 flex gap-4">
                        <button
                            onClick={resetGame}
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                        >
                            New Game
                        </button>
                        <button
                            onClick={switchColor}
                            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
                        >
                            Switch Color
                        </button>
                    </div>

                    {/* Chess Board */}
                    <div className="flex justify-center mb-6">
                        <div className="w-full max-w-2xl">
                            <Chessboard
                                position={gameState.game.fen()}
                                onPieceDrop={onDrop}
                                onPieceDragBegin={onPieceDragBegin}
                                boardOrientation={gameState.playerColor === 'w' ? 'white' : 'black'}
                            />
                        </div>
                    </div>

                    {/* Game Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Game History</h3>
                            <div className="text-sm text-gray-600 max-h-40 overflow-y-auto">
                                {gameState.game.history().map((move, index) => (
                                    <div key={index} className="py-1">
                                        {Math.floor(index / 2) + 1}. {index % 2 === 0 ? `${move} ` : move}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-semibold mb-2">Game Info</h3>
                            <div className="text-sm text-gray-600 space-y-1">
                                <div>FEN: <code className="text-xs bg-gray-200 px-1 rounded">{gameState.game.fen()}</code></div>
                                <div>Moves: {gameState.game.history().length}</div>
                                <div>In Check: {gameState.game.isCheck() ? 'Yes' : 'No'}</div>
                                <div>Game Over: {gameState.game.isGameOver() ? 'Yes' : 'No'}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 