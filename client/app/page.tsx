'use client'

import { useState, useEffect } from 'react'
import { useContract } from '../contexts/ContractContext'
import { TournamentStatus, MatchResult } from '../lib/contractService'
import Link from 'next/link'

export default function Home() {
    const [isWalletConnected, setIsWalletConnected] = useState(false)
    const [walletAddress, setWalletAddress] = useState('')
    const [isConnecting, setIsConnecting] = useState(false)
    const [error, setError] = useState('')
    const [showCreateForm, setShowCreateForm] = useState(false)
    const [showRegisterForm, setShowRegisterForm] = useState(false)
    const [selectedTournament, setSelectedTournament] = useState<any>(null)
    const [username, setUsername] = useState('')
    const [showBrowseModal, setShowBrowseModal] = useState(false)
    const [showDetailsModal, setShowDetailsModal] = useState(false)
    const [detailsTournament, setDetailsTournament] = useState<any>(null)
    const [showDashboard, setShowDashboard] = useState(false)
    const [stablecoinBalance, setStablecoinBalance] = useState<number>(0)

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
        refreshTournaments,
        getUSDCBalance
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

    // Check if MetaMask is installed
    const checkIfWalletIsConnected = async () => {
        try {
            if (typeof window !== 'undefined' && window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                if (accounts.length > 0) {
                    setIsWalletConnected(true)
                    setWalletAddress(accounts[0])
                }
            }
        } catch (error) {
            console.error('Error checking wallet connection:', error)
        }
    }

    // Connect wallet function
    const connectWallet = async () => {
        if (typeof window === 'undefined' || !window.ethereum) {
            setError('MetaMask is not installed. Please install MetaMask to connect your wallet.')
            return
        }

        setIsConnecting(true)
        setError('')

        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts'
            })

            if (accounts.length > 0) {
                setIsWalletConnected(true)
                setWalletAddress(accounts[0])
            }
        } catch (error: any) {
            if (error.code === 4001) {
                setError('User rejected the connection request.')
            } else {
                setError('Failed to connect wallet. Please try again.')
            }
            console.error('Error connecting wallet:', error)
        } finally {
            setIsConnecting(false)
        }
    }

    // Disconnect wallet
    const disconnectWallet = () => {
        setIsWalletConnected(false)
        setWalletAddress('')
        setError('')
    }

    // Listen for account changes
    useEffect(() => {
        checkIfWalletIsConnected()

        if (typeof window !== 'undefined' && window.ethereum) {
            window.ethereum.on('accountsChanged', (accounts: string[]) => {
                if (accounts.length > 0) {
                    setIsWalletConnected(true)
                    setWalletAddress(accounts[0])
                } else {
                    setIsWalletConnected(false)
                    setWalletAddress('')
                }
            })

            window.ethereum.on('chainChanged', () => {
                window.location.reload()
            })
        }

        return () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                window.ethereum.removeAllListeners()
            }
        }
    }, [])

    // Initialize contracts when wallet is connected
    useEffect(() => {
        if (isWalletConnected && !isInitialized) {
            // For demo purposes, we'll use placeholder addresses
            // In production, these would be the actual deployed contract addresses
            const tournamentAddress = '0x1234567890123456789012345678901234567890'
            const usdcAddress = '0x0987654321098765432109876543210987654321'

            // Only initialize if we have real contract addresses
            // For now, we'll skip initialization and use mock data
            console.log('Contracts would be initialized here with real addresses')
        }
    }, [isWalletConnected, isInitialized])

    // Handle tournament creation
    const handleCreateTournament = async (tournamentData: any) => {
        if (!isWalletConnected) {
            setError('Please connect your wallet first')
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
            setError('Failed to create tournament')
        }
    }

    // Handle tournament registration
    const handleRegisterForTournament = async () => {
        if (!selectedTournament || !username.trim()) {
            setError('Please enter a username')
            return
        }

        try {
            const result = await registerForTournament(selectedTournament.id, username)

            if (result.success) {
                setShowRegisterForm(false)
                setUsername('')
                setSelectedTournament(null)
                setError('')
                // Refresh tournaments
                await refreshTournaments()
            } else {
                setError(result.error || 'Failed to register for tournament')
            }
        } catch (error) {
            setError('Failed to register for tournament')
        }
    }

    // Format wallet address for display
    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`
    }

    // Fetch stablecoin balance when wallet is connected
    useEffect(() => {
        const fetchBalance = async () => {
            if (isWalletConnected && walletAddress) {
                const balance = await getUSDCBalance(walletAddress)
                setStablecoinBalance(balance)
            }
        }
        fetchBalance()
    }, [isWalletConnected, walletAddress])

    return (
        <div className="min-h-screen relative overflow-hidden">
            {/* Animated background elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#6D9A4C]/10 rounded-full blur-3xl animate-float"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#8BB563]/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-[#6D9A4C]/5 to-[#8BB563]/5 rounded-full blur-3xl animate-pulse-slow"></div>
            </div>

            {/* Header */}
            {/* <header className="relative z-10 glass-strong border-b border-white/10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">

                        <div className="flex items-center space-x-3">
                            <div className="chess-piece animate-glow">♔</div>
                            <h1 className="text-3xl font-bold gradient-text-white">Chess Tournament Platform</h1>
                        </div>
                        <div className="flex items-center space-x-4">
                            {error && (
                                <div className="error-message max-w-xs">
                                    {error}
                                </div>
                            )}
                            <button
                                onClick={isWalletConnected ? disconnectWallet : connectWallet}
                                disabled={isConnecting}
                                className={`px-6 py-2 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 ${isWalletConnected
                                    ? 'wallet-connected'
                                    : 'wallet-disconnected'
                                    } ${isConnecting ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {isConnecting ? (
                                    <span className="flex items-center">
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                        Connecting...
                                    </span>
                                ) : isWalletConnected ? (
                                    <span className="flex items-center">
                                        <span className="mr-2">✓</span>
                                        {formatAddress(walletAddress)}
                                    </span>
                                ) : (
                                    'Connect Wallet'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </header> */}

            {/* Main Content */}
            <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                                if (isWalletConnected) {
                                    setShowCreateForm(true)
                                } else {
                                    setError('Please connect your wallet first')
                                }
                            }}
                            className="btn-primary text-lg px-8 py-4"
                        >
                            <span className="mr-2">🎯</span>
                            Create Tournament
                        </button>
                        {/* <button className="btn-secondary text-lg px-8 py-4">
                            <span className="mr-2">🔍</span>
                            Browse Tournaments
                        </button> */}
                        <Link href="/tournaments" className="btn-secondary text-lg px-8 py-4">
                            <span className="mr-2">🔍</span>
                            Browse Tournaments
                        </Link>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="features-grid animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
                    <div className="feature-card">
                        <div className="feature-icon">
                            <span>🏆</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Transparent Prizes</h3>
                        <p className="text-white/70 leading-relaxed">
                            Stablecoin prize pools with automatic distribution.
                            No hidden fees, no delays - just instant, transparent payouts.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <span>⚡</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">On-Chain Results</h3>
                        <p className="text-white/70 leading-relaxed">
                            Every match result stored immutably on the blockchain.
                            Verifiable, tamper-proof, and completely transparent.
                        </p>
                    </div>

                    <div className="feature-card">
                        <div className="feature-icon">
                            <span>🎯</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4">Fair Competition</h3>
                        <p className="text-white/70 leading-relaxed">
                            Group-based tournaments with round-robin matches.
                            Advanced scoring system ensures fair play for all participants.
                        </p>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="mb-16 animate-fade-in-up" style={{ animationDelay: '0.9s' }}>
                    <div className="grid md:grid-cols-4 gap-6">
                        {stats.map((stat, index) => (
                            <div key={index} className="stat-card">
                                <div className="text-4xl mb-3">{stat.icon}</div>
                                <div className="stat-number">{stat.number}</div>
                                <div className="stat-label">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Tournament List */}
                <section className="animate-fade-in-up" style={{ animationDelay: '1.2s' }}>
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-3xl font-bold gradient-text-white">Active Tournaments</h3>
                        <button
                            onClick={() => {
                                if (isWalletConnected) {
                                    setShowCreateForm(true)
                                } else {
                                    setError('Please connect your wallet first')
                                }
                            }}
                            className="btn-primary"
                        >
                            <span className="mr-2">➕</span>
                            Create New
                        </button>
                    </div>

                    <div className="tournament-grid">
                        {(isInitialized ? tournaments : mockTournaments).map((tournament, index) => {
                            // Handle both real and mock tournament data
                            const isRealTournament = 'prizePool' in tournament && typeof tournament.prizePool === 'bigint'
                            const status = isRealTournament ? formatTournamentStatus(tournament.status as TournamentStatus) : tournament.status
                            const prizePool = isRealTournament ? formatUSDC(tournament.prizePool as bigint) : tournament.prizePool
                            const startDate = isRealTournament ? new Date(Number((tournament as any).startTime) * 1000).toLocaleDateString() : (tournament as any).startDate
                            const endDate = isRealTournament ? new Date(Number((tournament as any).endTime) * 1000).toLocaleDateString() : (tournament as any).endDate

                            return (
                                <div key={tournament.id} className="card-hover animate-fade-in-up" style={{ animationDelay: `${1.5 + index * 0.1}s` }}>
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex-1">
                                            <h4 className="text-xl font-bold text-white mb-2">{tournament.name}</h4>
                                            <p className="text-white/60 text-sm mb-3">{tournament.description}</p>
                                        </div>
                                        <span className={`status-badge ${status === 'Registration Open' ? 'status-registration' :
                                            status === 'In Progress' ? 'status-progress' :
                                                'status-completed'
                                            }`}>
                                            {status}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <p className="text-white/50 text-sm">Prize Pool</p>
                                            <p className="text-xl font-bold text-white">{prizePool} USDC</p>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-sm">Players</p>
                                            <p className="text-xl font-bold text-white">
                                                {tournament.registeredPlayers}/{tournament.maxPlayers}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-sm">Start Date</p>
                                            <p className="font-semibold text-white">{startDate}</p>
                                        </div>
                                        <div>
                                            <p className="text-white/50 text-sm">End Date</p>
                                            <p className="font-semibold text-white">{endDate}</p>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <div className="flex space-x-3">
                                            {status === 'Registration Open' && (
                                                <button
                                                    onClick={() => {
                                                        if (isWalletConnected) {
                                                            setSelectedTournament(tournament)
                                                            setShowRegisterForm(true)
                                                        } else {
                                                            setError('Please connect your wallet first')
                                                        }
                                                    }}
                                                    className="btn-success text-sm px-4 py-2"
                                                >
                                                    {tournament.registeredPlayers >= tournament.maxPlayers ? 'Full' : 'Register'}
                                                </button>
                                            )}
                                            <button className="btn-secondary text-sm px-4 py-2">
                                                View Details
                                            </button>
                                        </div>

                                        <div className="text-right">
                                            <div className="text-sm text-white/40">Tournament #{tournament.id}</div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </section>

                {/* Call to Action */}
                <section className="text-center py-16">
                    {/* <section className="text-center py-16 animate-fade-in-up" style={{ animationDelay: '1.8s' }}> */}
                    <div className=" max-w-2xl mx-auto p-8">
                        <h3 className="text-3xl font-bold gradient-text-white mb-4">
                            Ready to Compete?
                        </h3>
                        <p className="text-white/70 text-lg mb-8">
                            Join thousands of players in the most advanced chess tournament platform.
                            Create your first tournament or register for an existing one.
                        </p>
                        <div className="flex justify-center space-x-4">
                            <button className="btn-primary text-lg px-8 py-4">
                                <span className="mr-2">🚀</span>
                                Get Started
                            </button>
                            <button className="btn-secondary text-lg px-8 py-4">
                                <span className="mr-2">📖</span>
                                Learn More
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="footer relative z-10 mt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="text-center">
                        <div className="flex justify-center items-center mb-4">
                            <div className="chess-piece mr-3">♔</div>
                            <span className="text-xl font-bold gradient-text-white">Chess Tournament Platform</span>
                        </div>
                        <p className="text-white/50">
                            Built on blockchain technology for transparent, fair, and secure chess competitions.
                        </p>
                        <div className="mt-6 text-white/30 text-sm">
                            © 2024 Chess Tournament Platform. All rights reserved.
                        </div>
                    </div>
                </div>
            </footer>

            {/* Create Tournament Form */}
            {showCreateForm && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-strong rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/10">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-3xl font-bold gradient-text-white">Create Tournament</h2>
                                <button
                                    onClick={() => setShowCreateForm(false)}
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={(e) => {
                                e.preventDefault()
                                const formData = new FormData(e.currentTarget)
                                handleCreateTournament({
                                    name: formData.get('name'),
                                    description: formData.get('description'),
                                    prizePool: formData.get('prizePool'),
                                    maxPlayers: parseInt(formData.get('maxPlayers') as string),
                                    startDate: formData.get('startDate'),
                                    endDate: formData.get('endDate')
                                })
                            }} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-white/90 mb-2">Tournament Name</label>
                                    <input
                                        name="name"
                                        type="text"
                                        required
                                        className="input-field"
                                        placeholder="Enter tournament name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-white/90 mb-2">Description</label>
                                    <textarea
                                        name="description"
                                        required
                                        className="input-field min-h-[100px]"
                                        placeholder="Describe your tournament"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-white/90 mb-2">Prize Pool (USDC)</label>
                                        <input
                                            name="prizePool"
                                            type="number"
                                            required
                                            min="1"
                                            step="0.01"
                                            className="input-field"
                                            placeholder="1000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white/90 mb-2">Max Players</label>
                                        <select name="maxPlayers" required className="input-field">
                                            <option value={4}>4 Players</option>
                                            <option value={8}>8 Players</option>
                                            <option value={12}>12 Players</option>
                                            <option value={16}>16 Players</option>
                                            <option value={20}>20 Players</option>
                                            <option value={24}>24 Players</option>
                                            <option value={32}>32 Players</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-white/90 mb-2">Start Date</label>
                                        <input
                                            name="startDate"
                                            type="datetime-local"
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-white/90 mb-2">End Date</label>
                                        <input
                                            name="endDate"
                                            type="datetime-local"
                                            required
                                            className="input-field"
                                        />
                                    </div>
                                </div>

                                <div className="flex justify-end space-x-4 pt-6">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateForm(false)}
                                        className="btn-secondary px-8 py-3"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="btn-primary px-8 py-3"
                                    >
                                        {isLoading ? 'Creating...' : 'Create Tournament'}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Register for Tournament Form */}
            {showRegisterForm && selectedTournament && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="glass-strong rounded-3xl shadow-2xl max-w-md w-full border border-white/10">
                        <div className="p-8">
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-2xl font-bold gradient-text-white">Register for Tournament</h2>
                                <button
                                    onClick={() => {
                                        setShowRegisterForm(false)
                                        setSelectedTournament(null)
                                        setUsername('')
                                    }}
                                    className="w-10 h-10 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center text-white/60 hover:text-white hover:bg-white/20 transition-all duration-300"
                                >
                                    ✕
                                </button>
                            </div>

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
                </div>
            )}

            {/* Discount button and balance */}
            {/* {isWalletConnected && (
                <div className="fixed top-6 right-6 z-50 flex items-center space-x-4">
                    <button className="btn-success px-6 py-2">Discount</button>
                    <div className="bg-white/10 text-white px-4 py-2 rounded-xl font-mono">
                        USDC Balance: {stablecoinBalance}
                    </div>
                </div>
            )} */}

            {/* Browse Tournaments Modal */}
            {showBrowseModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="glass-strong max-w-3xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button onClick={() => setShowBrowseModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">Browse Tournaments</h2>
                        {/* TODO: List tournaments with View Details button */}
                    </div>
                </div>
            )}

            {/* Tournament Details Modal */}
            {showDetailsModal && detailsTournament && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="glass-strong max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button onClick={() => setShowDetailsModal(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">Tournament Details</h2>
                        {/* TODO: Show tournament info, players, winners */}
                    </div>
                </div>
            )}

            {/* User Dashboard Modal */}
            {showDashboard && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
                    <div className="glass-strong max-w-4xl w-full p-8 rounded-2xl shadow-2xl relative">
                        <button onClick={() => setShowDashboard(false)} className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl">✕</button>
                        <h2 className="text-2xl font-bold mb-6 gradient-text-white">My Dashboard</h2>
                        {/* TODO: Show tournaments created, participated, won, and badges */}
                    </div>
                </div>
            )}
        </div>
    )
} 