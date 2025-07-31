"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContract } from '../../contexts/ContractContext';

export default function CreateTournamentPage() {
    const router = useRouter();
    const { createTournament } = useContract();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        playerLimit: '4',
        startDate: '',
        endDate: '',
        stablecoinAddress: '',
        prizePoolAmount: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createTournament(
                formData.name,
                formData.description,
                parseInt(formData.playerLimit),
                new Date(formData.startDate).getTime() / 1000,
                new Date(formData.endDate).getTime() / 1000,
                formData.stablecoinAddress,
                formData.prizePoolAmount
            );
            router.push('/tournaments');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-6">Create New Tournament</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tournament Name
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        placeholder="Enter tournament name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Description
                    </label>
                    <textarea
                        required
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        rows={3}
                        placeholder="Enter tournament description"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Player Limit
                    </label>
                    <select
                        required
                        value={formData.playerLimit}
                        onChange={(e) => setFormData({ ...formData, playerLimit: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                    >
                        <option value="4">4 Players</option>
                        <option value="8">8 Players</option>
                        <option value="12">12 Players</option>
                        <option value="16">16 Players</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Start Date
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            End Date
                        </label>
                        <input
                            type="datetime-local"
                            required
                            value={formData.endDate}
                            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                            className="w-full px-3 py-2 border rounded-md shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        USDC Token Address
                    </label>
                    <input
                        type="text"
                        required
                        value={formData.stablecoinAddress}
                        onChange={(e) => setFormData({ ...formData, stablecoinAddress: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        placeholder="Enter USDC contract address"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Prize Pool Amount (USDC)
                    </label>
                    <input
                        type="number"
                        required
                        value={formData.prizePoolAmount}
                        onChange={(e) => setFormData({ ...formData, prizePoolAmount: e.target.value })}
                        className="w-full px-3 py-2 border rounded-md shadow-sm"
                        placeholder="Enter prize pool amount"
                        min="0"
                        step="0.000001"
                    />
                </div>

                {error && (
                    <div className="text-red-600 text-sm">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating Tournament...' : 'Create Tournament'}
                </button>
            </form>
        </div>
    );
}
