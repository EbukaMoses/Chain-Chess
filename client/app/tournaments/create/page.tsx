"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useContract } from '../../../contexts/ContractContext';

export default function CreateTournamentPage() {
    const router = useRouter();
    const { createNewTournament } = useContract();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        playerLimit: '4',
        startDate: '',
        endDate: '',
        prizePoolAmount: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await createNewTournament(
                formData.name,
                formData.description,
                parseFloat(formData.prizePoolAmount),
                parseInt(formData.playerLimit),
                new Date(formData.startDate),
                new Date(formData.endDate)
            );
            router.push('/tournaments');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-900 text-white py-12">
            <div className="container mx-auto p-4 max-w-2xl">
                <div className="glass-strong rounded-2xl p-8">
                    <h1 className="text-3xl font-bold mb-6 gradient-text-white">Create New Tournament</h1>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                                Tournament Name
                            </label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="input-field"
                                placeholder="Enter tournament name"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                                Description
                            </label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="input-field"
                                rows={3}
                                placeholder="Enter tournament description"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                                Player Limit
                            </label>
                            <select
                                required
                                value={formData.playerLimit}
                                onChange={(e) => setFormData({ ...formData, playerLimit: e.target.value })}
                                className="input-field"
                            >
                                <option value="4">4 Players</option>
                                <option value="8">8 Players</option>
                                <option value="12">12 Players</option>
                                <option value="16">16 Players</option>
                            </select>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-white/90 mb-2">
                                    Start Date
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.startDate}
                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-white/90 mb-2">
                                    End Date
                                </label>
                                <input
                                    type="datetime-local"
                                    required
                                    value={formData.endDate}
                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white/90 mb-2">
                                Prize Pool Amount (USDC)
                            </label>
                            <input
                                type="number"
                                required
                                value={formData.prizePoolAmount}
                                onChange={(e) => setFormData({ ...formData, prizePoolAmount: e.target.value })}
                                className="input-field"
                                placeholder="Enter prize pool amount"
                                min="0"
                                step="0.000001"
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={() => router.push('/tournaments')}
                                className="btn-secondary px-6 py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-primary px-6 py-3"
                            >
                                {loading ? 'Creating Tournament...' : 'Create Tournament'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
