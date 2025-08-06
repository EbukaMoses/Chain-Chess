'use client'

import { useState, useEffect } from 'react'
import { useContract } from '../contexts/ContractContext'
import { TournamentStatus, MatchResult } from '../lib/contractService'
import Link from 'next/link'
import { CreateTournamentForm } from '../components/CreateTournamentForm'
import { DeploymentHelper } from '../components/DeploymentHelper'
import { TestIntegration } from '../components/TestIntegration'
import { RPCConfigHelper } from '../components/RPCConfigHelper'
import { TournamentDebugger } from '../components/TournamentDebugger'

export default function Home() {
    const [error, setError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showRegisterForm, setShowRegisterForm] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState<any>(null)
    const [username, setUsername] = useState('')
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [detailsTournament, setDetailsTournament] = useState<any>(null)
    const [showDashboard, setShowDashboard] = useState(false)

    const {
        isInitialized,
        isLoading,
        tournaments,
        createNewTournament,
        startTournamentRegistration,
        registerForTournament,
        closeRegistrationAndStartTournament,
        formatTournamentStatus,
        formatUSDC,
        refreshTournaments
    } = useContract()

    // Mock tournaments for display when contracts are not initialized
    const mockTournaments = [
        {
            id: 1,
            name: "Spring Chess Championship",
            description: "The ultimate chess competition for spring 2024",
            prizePool: "5,000",
            registeredPlayers: 8,
            maxPlayers: 8,
            status: "registration" as const,
            startDate: "2024-03-15",
            endDate: "2024-03-20"
        },
        {
            id: 2,
            name: "Weekend Blitz Tournament",
            description: "Fast-paced blitz chess for weekend warriors",
            prizePool: "2,000",
            registeredPlayers: 4,
            maxPlayers: 8,
            status: "in-progress" as const,
            startDate: "2024-03-10",
            endDate: "2024-03-12"
        },
        {
            id: 3,
            name: "Pro League Qualifier",
            description: "Qualify for the professional chess league",
            prizePool: "10,000",
            registeredPlayers: 16,
            maxPlayers: 16,
            status: "completed" as const,
            startDate: "2024-02-20",
            endDate: "2024-02-25"
        }
    ]

    const stats = [
        { number: "24", label: "Active Tournaments", icon: "🏆" },
        { number: "1,247", label: "Total Players", icon: "👥" },
        { number: "$89,420", label: "Prizes Distributed", icon: "💰" },
        { number: "156", label: "Matches Played", icon: "♔" }
    ]

    // Handle tournament creation
    const handleCreateTournament = async (tournamentData: any) => {
        if (!isInitialized) {
            setError('Please connect your wallet and wait for contracts to initialize')
            return
        }

        try {
            const result = await createNewTournament(
                tournamentData.name,
                tournamentData.description,
                parseFloat(tournamentData.prizePool),
                tournamentData.maxPlayers,
                new Date(tournamentData.startDate),
                new Date(tournamentData.endDate)
            )

            if (result.success) {
                setShowCreateForm(false)
                setError('')
                // Refresh tournaments
                await refreshTournaments()
            } else {
                setError(result.error || 'Failed to create tournament')
            }
        } catch (error) {
            console.error('Error creating tournament:', error)
            setError('Failed to create tournament. Please try again.')
        }
    }

    // Handle tournament registration
    const handleRegisterForTournament = async () => {
        if (!isInitialized) {
            setError('Please connect your wallet and wait for contracts to initialize')
            return
        }

        if (!selectedTournament || !username.trim()) {
            setError('Please select a tournament and enter a username')
            return
        }

        try {
            const result = await registerForTournament(selectedTournament.id, username.trim())
            if (result.success) {
                setShowRegisterForm(false)
                setSelectedTournament(null)
                setUsername('')
                setError('')
                await refreshTournaments()
            } else {
                setError(result.error || 'Failed to register for tournament')
            }
        } catch (error) {
            console.error('Error registering for tournament:', error)
            setError('Failed to register for tournament. Please try again.')
        }
    }

    // Clear error when component mounts
    useEffect(() => {
        setError('')
    }, [])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6D9A4C]/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8BB563]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#6D9A4C]/5 to-[#8BB563]/5 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Error Display */}
                {error && (
                    <div className="mb-6 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-300">
                        {error}
                    </div>
                )}

                {/* Hero Section */}
                <section className="hero-section animate-fade-in-up">
                    <h2 className="hero-title">
                        On-Chain Chess
                        <br />
                        <span className="gradient-text">Tournaments</span>
                    </h2>
                    <p className="hero-subtitle">
                        Compete in blockchain-powered chess tournaments with transparent prize pools.
                        Experience fair competition with immutable results and instant payouts.
                    </p>
                    <div className="flex justify-center space-x-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
                        <button
                            onClick={() => {
                                if (isInitialized) {
                                    setShowCreateForm(true)
                                } else {
                                    setError('Please connect your wallet and wait for contracts to initialize')
                                }
                            }}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            <span className="mr-2">🎯</span>
                            Create Tournament
                        </button>
                        <Link href="/tournaments" className="btn-secondary text-lg px-8 py-4">
                            <span className="mr-2">🔍</span>
                            Browse Tournaments
                        </Link>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="stats-section animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="stat-icon">{stat.icon}</div>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Featured Tournaments */}
                <section className="featured-tournaments animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                    <div className="text-center mb-12">
                        <h3 className="section-title">Featured Tournaments</h3>
                        <p className="text-white/60 text-lg mt-4">Join exciting chess competitions and compete for prizes</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mockTournaments.map((tournament, index) => (
                            <div
                                key={tournament.id}
                                className="tournament-card group animate-fade-in-up"
                                style={{ animationDelay: `${1.2 + index * 0.1}s` }}
                            >
                                <div className="tournament-header">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-12 h-12 bg-gradient-to-br from-[#6D9A4C] to-[#8BB563] rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                                            {tournament.id}
                                        </div>
                                        <div>
                                            <h4 className="tournament-name">{tournament.name}</h4>
                                            <div className="flex items-center space-x-2 text-sm text-white/50">
                                                <span>🏆</span>
                                                <span>Tournament #{tournament.id}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <span className={`tournament-status ${tournament.status}`}>
                                        {tournament.status === 'registration' && '🟢 Registration Open'}
                                        {tournament.status === 'in-progress' && '🟡 In Progress'}
                                        {tournament.status === 'completed' && '🔴 Completed'}
                                    </span>
                                </div>

                                <p className="tournament-description">{tournament.description}</p>

                                <div className="tournament-prize">
                                    <div className="flex items-center space-x-2">
                                        <span>💰</span>
                                        <span>${tournament.prizePool} Prize Pool</span>
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <div className="flex justify-between text-sm text-white/60 mb-2">
                                        <span>Registration Progress</span>
                                        <span>{tournament.registeredPlayers}/{tournament.maxPlayers}</span>
                                    </div>
                                    <div className="tournament-progress">
                                        <div
                                            className="tournament-progress-fill"
                                            style={{ width: `${(tournament.registeredPlayers / tournament.maxPlayers) * 100}%` }}
                                        ></div>
                                    </div>
                                </div>

                                <div className="tournament-meta">
                                    <div className="tournament-players">
                                        <span>👥</span>
                                        <span>{tournament.registeredPlayers}/{tournament.maxPlayers} Players</span>
                                    </div>
                                    <div className="tournament-date">
                                        <span>📅</span>
                                        <span>{tournament.startDate}</span>
                                    </div>
                                </div>

                                <div className="tournament-details">
                                    <div className="tournament-detail">
                                        <span className="detail-label">Entry Fee:</span>
                                        <span className="detail-value">Free</span>
                                    </div>
                                    <div className="tournament-detail">
                                        <span className="detail-label">Format:</span>
                                        <span className="detail-value">Swiss System</span>
                                    </div>
                                    <div className="tournament-detail">
                                        <span className="detail-label">Time Control:</span>
                                        <span className="detail-value">10+0</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => {
                                        setSelectedTournament(tournament)
                                        setShowRegisterForm(true)
                                    }}
                                    className="btn-primary w-full mt-4 group-hover:shadow-lg group-hover:shadow-[#6D9A4C]/20 transition-all duration-300"
                                    disabled={tournament.status === 'completed'}
                                >
                                    {tournament.status === 'registration' && '🎯 Register Now'}
                                    {tournament.status === 'in-progress' && '👁️ View Details'}
                                    {tournament.status === 'completed' && '🏁 View Results'}
                                </button>
                            </div>
                        ))}
                    </div>

                    <div className="text-center mt-12">
                        <Link
                            href="/tournaments"
                            className="btn-secondary px-8 py-3 text-lg font-semibold hover:scale-105 transition-transform duration-200 inline-block"
                        >
                            <span className="mr-2">🏆</span>
                            View All Tournaments
                        </Link>
                    </div>
                </section>
            </main>

            {/* Create Tournament Modal */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => setShowCreateForm(false)}
                            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">Create New Tournament</h2>
                        <CreateTournamentForm onSubmit={handleCreateTournament} onCancel={() => setShowCreateForm(false)} />
                    </div>
                </div>
            )}

            {/* Register for Tournament Modal */}
            {showRegisterForm && selectedTournament && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 max-w-md w-full p-8 rounded-2xl shadow-2xl relative">
                        <button
                            onClick={() => {
                                setShowRegisterForm(false)
                                setSelectedTournament(null)
                                setUsername('')
                            }}
                            className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                        >
                            ✕
                        </button>

                        <div className="mb-6">
                            <h3 className="text-lg font-semibold text-white mb-2">{selectedTournament.name}</h3>
                            <p className="text-white/60 text-sm">{selectedTournament.description}</p>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-white/90 mb-2">Username</label>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                    className="input-field"
                                    placeholder="Enter your username"
                                />
                            </div>

                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowRegisterForm(false)
                                        setSelectedTournament(null)
                                        setUsername('')
                                    }}
                                    className="btn-secondary px-6 py-2"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleRegisterForTournament}
                                    disabled={isLoading || !username.trim()}
                                    className="btn-primary px-6 py-2"
                                >
                                    {isLoading ? 'Registering...' : 'Register'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Tournament Details Modal */}
            {showDetailsModal && detailsTournament && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button onClick={() => setShowDetailsModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">Tournament Details</h2>
                        {/* TODO: Show tournament info, players, winners */}
                    </div>
                </div>
            )}

            {/* User Dashboard Modal */}
            {showDashboard && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
                    <div className="bg-gray-900 border border-gray-700 max-w-4xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button onClick={() => setShowDashboard(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">My Dashboard</h2>
                        {/* TODO: Show tournaments created, participated, won, and badges */}
                    </div>
                </div>
            )}

            {/* Deployment Helper */}
            <DeploymentHelper />
            <TestIntegration />
            <RPCConfigHelper />
            <TournamentDebugger />
        </div>
    )
} 