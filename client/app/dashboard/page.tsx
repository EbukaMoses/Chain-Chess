"use client";
import { useEffect, useState } from "react";
import { useContract } from "../../contexts/ContractContext";
import { Tournament, formatUSDC } from "../../lib/contractService";
import Link from "next/link";

// Helper component for statistics cards
const StatCard = ({ title, value, icon }: { title: string; value: string | number; icon: React.ReactNode }) => (
    <div className="bg-gray-900 rounded-xl p-6 border border-gray-700">
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-400">{title}</p>
                <p className="text-2xl font-bold text-white mt-1">{value}</p>
            </div>
            <div className="p-3 rounded-lg bg-[#6D9A4C]/20 text-green-400">
                {icon}
            </div>
        </div>
    </div>
);

// Tournament card component
const TournamentCard = ({ tournament, isCreator = false }: { tournament: Tournament; isCreator?: boolean }) => (
    <div className="bg-gray-900 rounded-xl p-5 border border-gray-700 hover:border-green-500/50 transition-colors">
        <div className="flex justify-between items-start mb-3">
            <h3 className="font-bold text-lg text-white">{tournament.name}</h3>
            {isCreator && (
                <span className="text-xs bg-green-900/50 text-green-300 px-2 py-1 rounded-full">
                    Your Tournament
                </span>
            )}
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
                <p className="text-gray-400">Prize Pool</p>
                <p className="text-white">{formatUSDC(tournament.prizePool)} USDC</p>
            </div>
            <div>
                <p className="text-gray-400">Status</p>
                <p className="capitalize text-white">{tournament.status.toLowerCase()}</p>
            </div>
            <div>
                <p className="text-gray-400">Players</p>
                <p className="text-white">{tournament.players?.length || 0} / {tournament.maxPlayers}</p>
            </div>
            <div>
                <p className="text-gray-400">Entry Fee</p>
                <p className="text-white">{formatUSDC(tournament.entryFee)} USDC</p>
            </div>
        </div>
        <div className="mt-4 pt-4 border-t border-gray-700">
            <Link
                href={`/tournaments/${tournament.id}`}
                className="text-green-400 hover:text-green-300 text-sm font-medium flex items-center"
            >
                View Tournament
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
            </Link>
        </div>
    </div>
);

type TournamentView = 'participated' | 'created';

export default function DashboardPage() {
    const { tournaments, isInitialized, getUSDCBalance } = useContract();
    const [created, setCreated] = useState<Tournament[]>([]);
    const [participated, setParticipated] = useState<Tournament[]>([]);
    const [won, setWon] = useState<Tournament[]>([]);
    const [balance, setBalance] = useState<number>(0);
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [isLoading, setIsLoading] = useState(true);
    const [activeView, setActiveView] = useState<TournamentView>('participated');

    useEffect(() => {
        // Get wallet address from window.ethereum
        const getAccounts = async () => {
            if (typeof window !== "undefined" && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: "eth_accounts" });
                    if (accounts.length > 0) {
                        setWalletAddress(accounts[0]);
                        return accounts[0];
                    }
                } catch (error) {
                    console.error("Error fetching accounts:", error);
                }
            }
            return null;
        };

        getAccounts().then(account => {
            if (account) setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (!isInitialized || !walletAddress) return;

        // Filter tournaments
        const userTournaments = tournaments.filter(t =>
            t.players?.includes(walletAddress.toLowerCase())
        );

        setCreated(tournaments.filter(t =>
            t.organizer.toLowerCase() === walletAddress.toLowerCase()
        ));

        setParticipated(userTournaments.filter(t =>
            t.organizer.toLowerCase() !== walletAddress.toLowerCase()
        ));

        // Set won tournaments (example: where status is 'completed' and user is in winners)
        setWon(tournaments.filter(t =>
            t.status === 'COMPLETED' && t.winners?.includes(walletAddress.toLowerCase())
        ));

        // Get balance
        getUSDCBalance(walletAddress).then(bal => {
            setBalance(bal);
        }).catch(console.error);
    }, [isInitialized, tournaments, walletAddress, getUSDCBalance]);

    if (isLoading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="animate-pulse text-white/60">Loading dashboard...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto py-12 px-4">
            <div className="mb-10">
                <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
                <p className="text-gray-400">Welcome back! Here's your tournament overview</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard
                    title="USDC Balance"
                    value={formatUSDC(balance)}
                    icon={
                        <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Tournaments Won"
                    value={won.length}
                    icon={
                        <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    }
                />
                <StatCard
                    title="Active Tournaments"
                    value={[...created, ...participated].filter(t => t.status === 'ACTIVE').length}
                    icon={
                        <svg className="w-6 h-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                        </svg>
                    }
                />
            </div>

            {/* Tournament View Toggle */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex space-x-2 bg-gray-800 p-1 rounded-lg">
                    <button
                        onClick={() => setActiveView('participated')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'participated'
                                ? 'bg-gradient-to-r from-[#8BB563] to-[#6D9A4C] text-white shadow-md'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700/50'
                            }`}
                    >
                        Participated In
                    </button>
                    <button
                        onClick={() => setActiveView('created')}
                        className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeView === 'created'
                                ? 'bg-[#6D9A4C] text-white'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                    >
                        Created
                    </button>
                </div>
                <Link
                    href="/tournaments/create"
                    className="text-sm bg-[#6D9A4C] hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Create New
                </Link>
            </div>

            {/* Section Title */}
            <h2 className="text-2xl font-bold text-white mb-6">
                {activeView === 'participated' ? 'Tournaments You\'ve Joined' : 'Your Created Tournaments'}
            </h2>

            {/* Tournaments List */}
            <div className="mb-12 space-y-6">
                {(activeView === 'participated' ? participated : created).length > 0 ? (
                    <div className="space-y-4">
                        {(activeView === 'participated' ? participated : created).map(tournament => (
                            <TournamentCard
                                key={tournament.id}
                                tournament={tournament}
                                isCreator={activeView === 'created'}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="bg-gray-900 rounded-xl p-8 text-center border-2 border-dashed border-gray-700">
                        <svg
                            className="mx-auto h-12 w-12 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d={activeView === 'created'
                                    ? "M12 6v6m0 0v6m0-6h6m-6 0H6"
                                    : "M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
                                }
                            />
                        </svg>
                        <h3 className="mt-2 text-sm font-medium text-white">
                            {activeView === 'created'
                                ? 'No tournaments created yet'
                                : 'No tournaments joined'}
                        </h3>
                        <p className="mt-1 text-sm text-gray-400">
                            {activeView === 'created'
                                ? 'Get started by creating your first tournament'
                                : 'Join a tournament to see it here'}
                        </p>
                        <div className="mt-6">
                            <Link
                                href={activeView === 'created' ? "/tournaments/create" : "/tournaments"}
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-[#6D9A4C] hover:bg-green-700"
                            >
                                {activeView === 'created' ? 'Create Tournament' : 'Browse Tournaments'}
                            </Link>
                        </div>
                    </div>
                )}
            </div>

            {/* Won Tournaments */}
            {won.length > 0 && (
                <div className="mb-12">
                    <h2 className="text-xl font-bold text-white mb-6">Tournaments Won</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {won.map(tournament => (
                            <div key={tournament.id} className="bg-gradient-to-br from-yellow-900/30 to-yellow-800/20 rounded-xl p-5 border border-yellow-500/20">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-bold text-white">{tournament.name}</h3>
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-300">
                                        Winner
                                    </span>
                                </div>
                                <div className="text-yellow-400 mb-2">
                                    <span className="text-sm font-medium">Prize: </span>
                                    <span className="text-lg font-bold">{formatUSDC(tournament.prizePool)} USDC</span>
                                </div>
                                <div className="flex items-center justify-between text-sm text-yellow-300/70">
                                    <span>Completed</span>
                                    <Link
                                        href={`/tournaments/${tournament.id}`}
                                        className="text-yellow-400 hover:text-yellow-300 flex items-center"
                                    >
                                        View
                                        <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}