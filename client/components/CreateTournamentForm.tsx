'use client'

import { useState } from 'react'

interface CreateTournamentFormProps {
    onSubmit: (tournamentData: TournamentFormData) => void;
    onCancel: () => void;
}

interface TournamentFormData {
    name: string;
    description: string;
    prizePool: string;
    maxPlayers: number;
    startDate: string;
    endDate: string;
}

export function CreateTournamentForm({ onSubmit, onCancel }: CreateTournamentFormProps) {
    const [formData, setFormData] = useState<TournamentFormData>({
        name: '',
        description: '',
        prizePool: '',
        maxPlayers: 8,
        startDate: '',
        endDate: ''
    });

    const [errors, setErrors] = useState<Partial<TournamentFormData>>({});

    const validateForm = () => {
        const newErrors: Partial<TournamentFormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tournament name is required';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (!formData.prizePool || parseFloat(formData.prizePool) <= 0) {
            newErrors.prizePool = 'Prize pool must be greater than 0';
        }

        if (formData.maxPlayers % 4 !== 0) {
            newErrors.maxPlayers = 'Maximum players must be divisible by 4';
        }

        if (!formData.startDate) {
            newErrors.startDate = 'Start date is required';
        }

        if (!formData.endDate) {
            newErrors.endDate = 'End date is required';
        }

        if (formData.startDate && formData.endDate) {
            const start = new Date(formData.startDate);
            const end = new Date(formData.endDate);
            if (start >= end) {
                newErrors.endDate = 'End date must be after start date';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    const handleInputChange = (field: keyof TournamentFormData, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value as any }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: undefined }));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fade-in-up">
            <div className="glass-strong rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                <div className="p-8">
                    {/* Header */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-[#6D9A4C] to-[#5A7F3F] rounded-2xl flex items-center justify-center text-2xl text-white shadow-lg">
                                🏆
                            </div>
                            <h2 className="text-3xl font-bold gradient-text-white">Create Tournament</h2>
                        </div>
                        <button
                            onClick={onCancel}
                            className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                        >
                            ✕
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Tournament Name */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                Tournament Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className={`input-field ${errors.name ? 'border-red-400 ring-red-400' : ''}`}
                                placeholder="Enter tournament name"
                            />
                            {errors.name && (
                                <p className="error-message">{errors.name}</p>
                            )}
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => handleInputChange('description', e.target.value)}
                                className={`input-field min-h-[120px] resize-none ${errors.description ? 'border-red-400 ring-red-400' : ''}`}
                                placeholder="Describe your tournament"
                            />
                            {errors.description && (
                                <p className="error-message">{errors.description}</p>
                            )}
                        </div>

                        {/* Prize Pool and Max Players */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                    Prize Pool (USDC) *
                                </label>
                                <input
                                    type="number"
                                    step="0.01"
                                    min="0"
                                    value={formData.prizePool}
                                    onChange={(e) => handleInputChange('prizePool', e.target.value)}
                                    className={`input-field ${errors.prizePool ? 'border-red-400 ring-red-400' : ''}`}
                                    placeholder="1000"
                                />
                                {errors.prizePool && (
                                    <p className="error-message">{errors.prizePool}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                    Max Players *
                                </label>
                                <select
                                    value={formData.maxPlayers}
                                    onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                                    className={`input-field ${errors.maxPlayers ? 'border-red-400 ring-red-400' : ''}`}
                                >
                                    <option value={4}>4 Players</option>
                                    <option value={8}>8 Players</option>
                                    <option value={12}>12 Players</option>
                                    <option value={16}>16 Players</option>
                                    <option value={20}>20 Players</option>
                                    <option value={24}>24 Players</option>
                                    <option value={32}>32 Players</option>
                                </select>
                                {errors.maxPlayers && (
                                    <p className="error-message">{errors.maxPlayers}</p>
                                )}
                            </div>
                        </div>

                        {/* Start and End Dates */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                    Start Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.startDate}
                                    onChange={(e) => handleInputChange('startDate', e.target.value)}
                                    className={`input-field ${errors.startDate ? 'border-red-400 ring-red-400' : ''}`}
                                />
                                {errors.startDate && (
                                    <p className="error-message">{errors.startDate}</p>
                                )}
                            </div>

                            <div className="space-y-2">
                                <label className="block text-sm font-semibold text-white/90 uppercase tracking-wide">
                                    End Date *
                                </label>
                                <input
                                    type="datetime-local"
                                    value={formData.endDate}
                                    onChange={(e) => handleInputChange('endDate', e.target.value)}
                                    className={`input-field ${errors.endDate ? 'border-red-400 ring-red-400' : ''}`}
                                />
                                {errors.endDate && (
                                    <p className="error-message">{errors.endDate}</p>
                                )}
                            </div>
                        </div>

                        {/* Prize Distribution Info */}
                        <div className="bg-gradient-to-r from-[#6D9A4C]/10 to-[#8BB563]/10 backdrop-blur-sm border border-[#6D9A4C]/20 rounded-2xl p-6">
                            <h4 className="font-bold text-[#8BB563] mb-4 flex items-center">
                                <span className="mr-2">💰</span>
                                Prize Distribution
                            </h4>
                            <div className="grid grid-cols-3 gap-4">
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#6D9A4C] to-[#5A7F3F] rounded-xl flex items-center justify-center mx-auto mb-2 text-white font-bold">
                                        1st
                                    </div>
                                    <div className="text-sm text-[#8BB563] font-semibold">1st Place</div>
                                    <div className="text-xs text-white/60">50% of prize pool</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#8BB563] to-[#6D9A4C] rounded-xl flex items-center justify-center mx-auto mb-2 text-white font-bold">
                                        2nd
                                    </div>
                                    <div className="text-sm text-[#8BB563] font-semibold">2nd Place</div>
                                    <div className="text-xs text-white/60">30% of prize pool</div>
                                </div>
                                <div className="text-center">
                                    <div className="w-12 h-12 bg-gradient-to-br from-[#9BC573] to-[#8BB563] rounded-xl flex items-center justify-center mx-auto mb-2 text-white font-bold">
                                        3rd
                                    </div>
                                    <div className="text-sm text-[#8BB563] font-semibold">3rd Place</div>
                                    <div className="text-xs text-white/60">20% of prize pool</div>
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 pt-6">
                            <button
                                type="button"
                                onClick={onCancel}
                                className="btn-secondary px-8 py-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn-primary px-8 py-3"
                            >
                                <span className="mr-2">🚀</span>
                                Create Tournament
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
} 