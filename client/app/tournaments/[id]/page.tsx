"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useContract } from "../../../contexts/ContractContext";
import { Tournament, Player, formatUSDC, formatTournamentStatus, getTournamentGroups, getTournamentWinners, getPlayer } from "../../../lib/contractService";

export default function TournamentDetailsPage() {
    const { id } = useParams();
    const { getTournament, isInitialized, getPlayer } = useContract();
    const [tournament, setTournament] = useState<Tournament | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [winners, setWinners] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!isInitialized) return;
            setLoading(true);
            const t = await getTournament(Number(id));
            setTournament(t);
            // Fetch registered players
            if (t) {
                // For demo, assume maxPlayers slots and try to fetch each
                const ps: Player[] = [];
                for (let i = 0; i < t.maxPlayers; i++) {
                    // In a real app, you'd get addresses from an event or mapping
                    // Here, we just skip as we don't have the addresses
                }
                setPlayers(ps);
                // Fetch winners if completed
                if (t.status === 4) {
                    // 4 = Completed
                    // You'd fetch winners from contract
                }
            }
            setLoading(false);
        };
        fetchDetails();
    }, [isInitialized, id]);

    return (
        <div className="max-w-3xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-6 gradient-text-white">Tournament Details</h1>
            {loading && <div className="text-white/60 mb-4">Loading tournament...</div>}
            {tournament && (
                <div className="card-hover p-6 rounded-2xl border border-white/10 bg-white/5 mb-8">
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-xl font-bold text-white mb-1">{tournament.name}</h2>
                        <span className="status-badge">{formatTournamentStatus(tournament.status)}</span>
                    </div>
                    <div className="text-white/70 mb-2">{tournament.description}</div>
                    <div className="flex justify-between text-white/60 text-sm mb-2">
                        <span>Prize: <span className="text-white font-bold">{formatUSDC(tournament.prizePool)} USDC</span></span>
                        <span>Players: {tournament.registeredPlayers}/{tournament.maxPlayers}</span>
                    </div>
                    <div className="flex justify-between text-white/40 text-xs mb-4">
                        <span>Start: {new Date(Number(tournament.startTime) * 1000).toLocaleString()}</span>
                        <span>End: {new Date(Number(tournament.endTime) * 1000).toLocaleString()}</span>
                    </div>
                </div>
            )}
            {/* TODO: List registered players and, if completed, winners and prizes */}
        </div>
    );
} 