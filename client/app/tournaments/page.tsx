"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useContract } from "../../contexts/ContractContext";
import { formatUSDC, Tournament, formatTournamentStatus, TournamentStatus } from "../../lib/contractService";

export default function TournamentsPage() {
    const { tournaments, isInitialized, refreshTournaments, registerForTournament, walletAddress } = useContract();
    const [loading, setLoading] = useState(false);
    const [registering, setRegistering] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (isInitialized) {
            setLoading(true);
            refreshTournaments().finally(() => setLoading(false));
        }
    }, [isInitialized]);

    const handleRegister = async (tournamentId: number) => {
        if (!walletAddress) {
            setError("Please connect your wallet first");
            return;
        }

        setRegistering(tournamentId);
        setError(null);

        try {
            await registerForTournament(tournamentId);
            // Refresh the tournaments list to show updated registration
            await refreshTournaments();
        } catch (err: any) {
            setError(err.message || "Failed to register for tournament");
        } finally {
            setRegistering(null);
        }
    };

    const isTournamentFull = (tournament: Tournament) => {
        return tournament.registeredPlayers >= tournament.maxPlayers;
    };

    const isRegistrationOpen = (tournament: Tournament) => {
        return tournament.status === TournamentStatus.RegistrationOpen;
    };

    const formatDate = (timestamp: number) => {
        return new Date(Number(timestamp) * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-white mb-2">Browse Tournaments</h1>
                    <p className="text-gray-400">Find and join exciting chess tournaments</p>
                </div>
                <Link
                    href="/tournaments/create"
                    className="bg-gradient-to-r from-[#8BB563] to-[#6D9A4C] hover:from-[#6D9A4C] hover:to-[#8BB563] text-white px-6 py-3 rounded-lg font-medium transition-all transform hover:scale-105 shadow-lg"
                >
                    + Create Tournament
                </Link>
            </div>

            {error && (
                <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                    {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#8BB563]"></div>
                </div>
            ) : tournaments.length === 0 ? (
                <div className="bg-gray-900 rounded-xl p-8 text-center border-2 border-dashed border-gray-700">
                    <svg
                        className="mx-auto h-12 w-12 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-white">No tournaments available</h3>
                    <p className="mt-1 text-gray-400">Check back later or create your own tournament</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tournaments.map((tournament: Tournament) => {
                        const isFull = isTournamentFull(tournament);
                        const isOpen = isRegistrationOpen(tournament);
                        const isRegistered = tournament.players?.includes(walletAddress?.toLowerCase() || '');

                        return (
                            <div
                                key={tournament.id}
                                className="bg-gray-800/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50 hover:border-emerald-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/10 flex flex-col h-full"
                            >
                                <div className="p-6 flex-1">
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-xl font-bold text-white">{tournament.name}</h2>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${tournament.status === TournamentStatus.RegistrationOpen
                                                ? 'bg-green-900/50 text-green-300'
                                                : tournament.status === TournamentStatus.InProgress
                                                    ? 'bg-blue-900/50 text-blue-300'
                                                    : 'bg-gray-700 text-gray-300'
                                            }`}>
                                            {formatTournamentStatus(tournament.status)}
                                        </span>
                                    </div>

                                    <div className="space-y-3 mt-4">
                                        <div>
                                            <p className="text-sm text-gray-400">Prize Pool</p>
                                            <p className="text-lg font-bold text-white">{formatUSDC(tournament.prizePool)} USDC</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <p className="text-sm text-gray-400">Players</p>
                                                <p className="text-white">
                                                    {tournament.registeredPlayers} / {tournament.maxPlayers}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-400">Entry Fee</p>
                                                <p className="text-white">{formatUSDC(tournament.entryFee || 0)} USDC</p>
                                            </div>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-400">Starts</p>
                                            <p className="text-white text-sm">{formatDate(tournament.startTime)}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5 bg-gradient-to-r from-gray-800/50 to-gray-900/30 border-t border-gray-700/50">
                                    <div className="flex space-x-3">
                                        <Link
                                            href={`/tournaments/${tournament.id}`}
                                            className="flex-1 text-center py-2.5 px-4 text-sm font-medium text-white bg-gray-700/80 hover:bg-gray-700 rounded-lg transition-all border border-gray-600/50 hover:border-emerald-500/50"
                                        >
                                            View Details
                                        </Link>

                                        <button
                                            onClick={() => handleRegister(tournament.id)}
                                            disabled={isFull || !isOpen || isRegistered || registering === tournament.id}
                                            className={`flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all ${isRegistered
                                                    ? 'bg-gray-700/80 text-gray-400 cursor-default border border-gray-600/50'
                                                    : isFull || !isOpen
                                                        ? 'bg-gray-800/50 text-gray-500 cursor-not-allowed border border-gray-700/50'
                                                        : 'bg-gradient-to-r from-[#6D9A4C] to-[#8BB563] hover:from-[#6D9A4C] hover:to-[#8BB563] text-white shadow-lg shadow-[#6D9A4C]/20 hover:shadow-[#6D9A4C]/30'
                                                }`}
                                        >
                                            {registering === tournament.id ? (
                                                <span className="flex items-center justify-center">
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Registering...
                                                </span>
                                            ) : isRegistered ? (
                                                'Registered'
                                            ) : isFull ? (
                                                'Tournament Full'
                                            ) : !isOpen ? (
                                                'Registration Closed'
                                            ) : (
                                                'Register Now'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}