'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NewGamePage() {
    const router = useRouter();

    useEffect(() => {
        // Generate a random game ID
        const gameId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        // Redirect to the game page
        router.push(`/game/${gameId}`);
    }, [router]);

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Creating new game...</p>
            </div>
        </div>
    );
} 