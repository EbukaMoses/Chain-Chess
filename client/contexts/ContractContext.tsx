'use client'

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
    initializeContractService,
    createTournament,
    startRegistration,
    registerForTournament,
    closeRegistrationAndStart,
    submitMatchResult,
    completeTournament,
    getTournament,
    getPlayer,
    getTournamentGroups,
    getTournamentMatches,
    getTournamentWinners,
    getTotalTournaments,
    getAllTournaments,
    getUSDCBalance,
    mintUSDC,
    isUserRegistered,
    getUserTournamentStats,
    formatTournamentStatus,
    formatMatchResult,
    formatUSDC,
    parseUSDC,
    Tournament,
    Player,
    Group,
    Match,
    TournamentStatus,
    MatchResult
} from '../lib/contractService'

interface ContractContextType {
    // State
    isInitialized: boolean
    isLoading: boolean
    tournaments: Tournament[]
    userTournaments: Tournament[]
    userStats: Player | null

    // Contract functions
    initializeContracts: (tournamentAddress: string, usdcAddress: string) => Promise<void>
    createNewTournament: (name: string, description: string, prizePool: number, maxPlayers: number, startTime: Date, endTime: Date) => Promise<any>
    startTournamentRegistration: (tournamentId: number) => Promise<any>
    registerForTournament: (tournamentId: number, username: string) => Promise<any>
    closeRegistrationAndStartTournament: (tournamentId: number) => Promise<any>
    submitMatchResult: (tournamentId: number, groupId: number, player1: string, player2: string, result: MatchResult) => Promise<any>
    completeTournament: (tournamentId: number, firstPlace: string, secondPlace: string, thirdPlace: string) => Promise<any>

    // View functions
    getTournament: (tournamentId: number) => Promise<Tournament | null>
    getPlayer: (tournamentId: number, playerAddress: string) => Promise<Player | null>
    getTournamentGroups: (tournamentId: number) => Promise<Group[]>
    getTournamentMatches: (tournamentId: number) => Promise<Match[]>
    getTournamentWinners: (tournamentId: number) => Promise<string[]>
    getTotalTournaments: () => Promise<number>
    getAllTournaments: () => Promise<Tournament[]>
    getUSDCBalance: (address: string) => Promise<number>
    mintUSDC: (amount: number) => Promise<boolean>
    isUserRegistered: (tournamentId: number, userAddress: string) => Promise<boolean>
    getUserTournamentStats: (tournamentId: number, userAddress: string) => Promise<Player | null>

    // Utility functions
    formatTournamentStatus: (status: TournamentStatus) => string
    formatMatchResult: (result: MatchResult) => string
    formatUSDC: (amount: bigint) => string
    parseUSDC: (amount: string) => bigint

    // Refresh functions
    refreshTournaments: () => Promise<void>
    refreshUserStats: (tournamentId: number, userAddress: string) => Promise<void>
}

const ContractContext = createContext<ContractContextType | undefined>(undefined)

export const useContract = () => {
    const context = useContext(ContractContext)
    if (context === undefined) {
        throw new Error('useContract must be used within a ContractProvider')
    }
    return context
}

interface ContractProviderProps {
    children: ReactNode
}

export const ContractProvider: React.FC<ContractProviderProps> = ({ children }) => {
    const [isInitialized, setIsInitialized] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [tournaments, setTournaments] = useState<Tournament[]>([])
    const [userTournaments, setUserTournaments] = useState<Tournament[]>([])
    const [userStats, setUserStats] = useState<Player | null>(null)

    // Initialize contracts
    const initializeContracts = async (tournamentAddress: string, usdcAddress: string) => {
        try {
            setIsLoading(true)
            await initializeContractService(tournamentAddress, usdcAddress)
            setIsInitialized(true)

            // Load initial tournaments
            await refreshTournaments()
        } catch (error) {
            console.error('Error initializing contracts:', error)
            setIsInitialized(false)
        } finally {
            setIsLoading(false)
        }
    }

    // Refresh tournaments
    const refreshTournaments = async () => {
        try {
            setIsLoading(true)
            const allTournaments = await getAllTournaments()
            setTournaments(allTournaments)
        } catch (error) {
            console.error('Error refreshing tournaments:', error)
        } finally {
            setIsLoading(false)
        }
    }

    // Refresh user stats
    const refreshUserStats = async (tournamentId: number, userAddress: string) => {
        try {
            const stats = await getUserTournamentStats(tournamentId, userAddress)
            setUserStats(stats)
        } catch (error) {
            console.error('Error refreshing user stats:', error)
        }
    }

    // Contract functions
    const createNewTournament = async (
        name: string,
        description: string,
        prizePool: number,
        maxPlayers: number,
        startTime: Date,
        endTime: Date
    ) => {
        try {
            setIsLoading(true)
            const result = await createTournament(name, description, prizePool, maxPlayers, startTime, endTime)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error creating tournament:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    const startTournamentRegistration = async (tournamentId: number) => {
        try {
            setIsLoading(true)
            const result = await startRegistration(tournamentId)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error starting registration:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    const registerForTournament = async (tournamentId: number, username: string) => {
        try {
            setIsLoading(true)
            const result = await registerForTournament(tournamentId, username)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error registering for tournament:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    const closeRegistrationAndStartTournament = async (tournamentId: number) => {
        try {
            setIsLoading(true)
            const result = await closeRegistrationAndStart(tournamentId)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error closing registration and starting tournament:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    const submitMatchResult = async (
        tournamentId: number,
        groupId: number,
        player1: string,
        player2: string,
        result: MatchResult
    ) => {
        try {
            setIsLoading(true)
            const result = await submitMatchResult(tournamentId, groupId, player1, player2, result)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error submitting match result:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    const completeTournament = async (
        tournamentId: number,
        firstPlace: string,
        secondPlace: string,
        thirdPlace: string
    ) => {
        try {
            setIsLoading(true)
            const result = await completeTournament(tournamentId, firstPlace, secondPlace, thirdPlace)

            if (result.success) {
                await refreshTournaments()
            }

            return result
        } catch (error) {
            console.error('Error completing tournament:', error)
            return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
        } finally {
            setIsLoading(false)
        }
    }

    // Filter tournaments by user
    useEffect(() => {
        if (typeof window !== 'undefined' && window.ethereum) {
            const filterUserTournaments = async () => {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                    if (accounts.length > 0) {
                        const userAddress = accounts[0]
                        const userTours = tournaments.filter(t => t.organizer.toLowerCase() === userAddress.toLowerCase())
                        setUserTournaments(userTours)
                    }
                } catch (error) {
                    console.error('Error filtering user tournaments:', error)
                }
            }

            filterUserTournaments()
        }
    }, [tournaments])

    const value: ContractContextType = {
        // State
        isInitialized,
        isLoading,
        tournaments,
        userTournaments,
        userStats,

        // Contract functions
        initializeContracts,
        createNewTournament,
        startTournamentRegistration,
        registerForTournament,
        closeRegistrationAndStartTournament,
        submitMatchResult,
        completeTournament,

        // View functions
        getTournament,
        getPlayer,
        getTournamentGroups,
        getTournamentMatches,
        getTournamentWinners,
        getTotalTournaments,
        getAllTournaments,
        getUSDCBalance,
        mintUSDC,
        isUserRegistered,
        getUserTournamentStats,

        // Utility functions
        formatTournamentStatus,
        formatMatchResult,
        formatUSDC,
        parseUSDC,

        // Refresh functions
        refreshTournaments,
        refreshUserStats
    }

    return (
        <ContractContext.Provider value={value}>
            {children}
        </ContractContext.Provider>
    )
} 