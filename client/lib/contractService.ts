import { ethers } from 'ethers'
import ChessTournamentABI from '../contracts/ChessTournament.json'
import MockUSDCABI from '../contracts/MockUSDC.json'

// Contract addresses (these will be set after deployment)
let CHESS_TOURNAMENT_ADDRESS = ''
let MOCK_USDC_ADDRESS = ''

// Contract instances
let chessTournamentContract: ethers.Contract | null = null
let mockUsdcContract: ethers.Contract | null = null

// Provider and signer
let provider: ethers.BrowserProvider | null = null
let signer: ethers.JsonRpcSigner | null = null

// Tournament status enum
export enum TournamentStatus {
    Created = 0,
    RegistrationOpen = 1,
    RegistrationClosed = 2,
    InProgress = 3,
    Completed = 4
}

// Match result enum
export enum MatchResult {
    Pending = 0,
    Player1Win = 1,
    Player2Win = 2,
    Draw = 3
}

// Tournament interface
export interface Tournament {
    id: number
    name: string
    description: string
    organizer: string
    prizeToken: string
    prizePool: bigint
    maxPlayers: number
    startTime: number
    endTime: number
    status: TournamentStatus
    registeredPlayers: number
    currentRound: number
}

// Player interface
export interface Player {
    wallet: string
    username: string
    isRegistered: boolean
    totalPoints: number
    wins: number
    draws: number
    losses: number
    isActive: boolean
}

// Group interface
export interface Group {
    id: number
    tournamentId: number
    round: number
    players: string[]
    isCompleted: boolean
}

// Match interface
export interface Match {
    id: number
    tournamentId: number
    groupId: number
    player1: string
    player2: string
    result: MatchResult
    isCompleted: boolean
}

// Initialize the contract service
export const initializeContractService = async (
    tournamentAddress: string,
    usdcAddress: string
) => {
    CHESS_TOURNAMENT_ADDRESS = tournamentAddress
    MOCK_USDC_ADDRESS = usdcAddress

    if (typeof window !== 'undefined' && window.ethereum) {
        provider = new ethers.BrowserProvider(window.ethereum)
        signer = await provider.getSigner()

        chessTournamentContract = new ethers.Contract(
            CHESS_TOURNAMENT_ADDRESS,
            ChessTournamentABI.abi,
            signer
        )

        mockUsdcContract = new ethers.Contract(
            MOCK_USDC_ADDRESS,
            MockUSDCABI.abi,
            signer
        )
    }
}

// Get contract instances
export const getContracts = () => {
    if (!chessTournamentContract || !mockUsdcContract) {
        throw new Error('Contracts not initialized. Call initializeContractService first.')
    }
    return { chessTournamentContract, mockUsdcContract }
}

// Tournament Management Functions

/**
 * Create a new tournament
 */
export const createTournament = async (
    name: string,
    description: string,
    prizePool: number,
    maxPlayers: number,
    startTime: Date,
    endTime: Date
) => {
    try {
        const { chessTournamentContract, mockUsdcContract } = getContracts()

        const startTimestamp = Math.floor(startTime.getTime() / 1000)
        const endTimestamp = Math.floor(endTime.getTime() / 1000)
        const prizePoolWei = ethers.parseUnits(prizePool.toString(), 6) // USDC has 6 decimals

        // First, approve the tournament contract to spend USDC
        const approveTx = await mockUsdcContract.approve(CHESS_TOURNAMENT_ADDRESS, prizePoolWei)
        await approveTx.wait()

        const tx = await chessTournamentContract.createTournament(
            name,
            description,
            MOCK_USDC_ADDRESS,
            prizePoolWei,
            maxPlayers,
            startTimestamp,
            endTimestamp
        )

        const receipt = await tx.wait()

        // Find the TournamentCreated event
        const event = receipt.logs.find((log: any) => {
            try {
                const parsed = chessTournamentContract.interface.parseLog(log)
                return parsed?.name === 'TournamentCreated'
            } catch {
                return false
            }
        })

        if (event) {
            const parsed = chessTournamentContract.interface.parseLog(event)
            return {
                success: true,
                tournamentId: parsed?.args[0],
                transactionHash: receipt.hash
            }
        }

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error creating tournament:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Start tournament registration
 */
export const startRegistration = async (tournamentId: number) => {
    try {
        const { chessTournamentContract } = getContracts()

        const tx = await chessTournamentContract.startRegistration(tournamentId)
        const receipt = await tx.wait()

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error starting registration:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Register for a tournament
 */
export const registerForTournament = async (tournamentId: number, username: string) => {
    try {
        const { chessTournamentContract } = getContracts()

        const tx = await chessTournamentContract.registerForTournament(tournamentId, username, "Unknown")
        const receipt = await tx.wait()

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error registering for tournament:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Close registration and start tournament
 */
export const closeRegistrationAndStart = async (tournamentId: number) => {
    try {
        const { chessTournamentContract } = getContracts()

        const tx = await chessTournamentContract.closeRegistrationAndStart(tournamentId)
        const receipt = await tx.wait()

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error closing registration and starting tournament:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Submit match result
 */
export const submitMatchResult = async (
    tournamentId: number,
    groupId: number,
    player1: string,
    player2: string,
    result: MatchResult
) => {
    try {
        const { chessTournamentContract } = getContracts()

        const tx = await chessTournamentContract.submitMatchResult(
            tournamentId,
            groupId,
            player1,
            player2,
            result
        )
        const receipt = await tx.wait()

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error submitting match result:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

/**
 * Complete tournament and distribute prizes
 */
export const completeTournament = async (
    tournamentId: number,
    firstPlace: string,
    secondPlace: string,
    thirdPlace: string
) => {
    try {
        const { chessTournamentContract } = getContracts()

        const tx = await chessTournamentContract.completeTournament(
            tournamentId,
            firstPlace,
            secondPlace,
            thirdPlace
        )
        const receipt = await tx.wait()

        return { success: true, transactionHash: receipt.hash }
    } catch (error) {
        console.error('Error completing tournament:', error)
        return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
}

// View Functions

/**
 * Get tournament details
 */
export const getTournament = async (tournamentId: number): Promise<Tournament | null> => {
    try {
        const { chessTournamentContract } = getContracts()

        const tournament = await chessTournamentContract.getTournament(tournamentId)

        return {
            id: Number(tournament.id),
            name: tournament.name,
            description: tournament.description,
            organizer: tournament.organizer,
            prizeToken: tournament.prizeToken,
            prizePool: tournament.prizePool,
            maxPlayers: Number(tournament.maxPlayers),
            startTime: Number(tournament.startTime),
            endTime: Number(tournament.endTime),
            status: Number(tournament.status),
            registeredPlayers: Number(tournament.registeredPlayers),
            currentRound: Number(tournament.currentRound)
        }
    } catch (error) {
        console.error('Error getting tournament:', error)
        return null
    }
}

/**
 * Get player details
 */
export const getPlayer = async (tournamentId: number, playerAddress: string): Promise<Player | null> => {
    try {
        const { chessTournamentContract } = getContracts()

        const player = await chessTournamentContract.getPlayer(tournamentId, playerAddress)

        return {
            wallet: player.wallet,
            username: player.username,
            isRegistered: player.isRegistered,
            totalPoints: Number(player.totalPoints),
            wins: Number(player.wins),
            draws: Number(player.draws),
            losses: Number(player.losses),
            isActive: player.isActive
        }
    } catch (error) {
        console.error('Error getting player:', error)
        return null
    }
}

/**
 * Get tournament groups
 */
export const getTournamentGroups = async (tournamentId: number): Promise<Group[]> => {
    try {
        const { chessTournamentContract } = getContracts()

        const groups = await chessTournamentContract.getTournamentGroups(tournamentId)

        return groups.map((group: any) => ({
            id: Number(group.id),
            tournamentId: Number(group.tournamentId),
            round: Number(group.round),
            players: group.players,
            isCompleted: group.isCompleted
        }))
    } catch (error) {
        console.error('Error getting tournament groups:', error)
        return []
    }
}

/**
 * Get tournament matches
 */
export const getTournamentMatches = async (tournamentId: number): Promise<Match[]> => {
    try {
        const { chessTournamentContract } = getContracts()

        const matches = await chessTournamentContract.getTournamentMatches(tournamentId)

        return matches.map((match: any) => ({
            id: Number(match.id),
            tournamentId: Number(match.tournamentId),
            groupId: Number(match.groupId),
            player1: match.player1,
            player2: match.player2,
            result: Number(match.result),
            isCompleted: match.isCompleted
        }))
    } catch (error) {
        console.error('Error getting tournament matches:', error)
        return []
    }
}

/**
 * Get tournament winners
 */
export const getTournamentWinners = async (tournamentId: number): Promise<string[]> => {
    try {
        const { chessTournamentContract } = getContracts()

        const winners = await chessTournamentContract.getTournamentWinners(tournamentId)

        return winners
    } catch (error) {
        console.error('Error getting tournament winners:', error)
        return []
    }
}

/**
 * Get total number of tournaments
 */
export const getTotalTournaments = async (): Promise<number> => {
    try {
        const { chessTournamentContract } = getContracts()

        const total = await chessTournamentContract.getTotalTournaments()

        return Number(total)
    } catch (error) {
        console.error('Error getting total tournaments:', error)
        return 0
    }
}

// USDC Token Functions

/**
 * Get USDC balance
 */
export const getUSDCBalance = async (address: string): Promise<number> => {
    try {
        const { mockUsdcContract } = getContracts()

        const balance = await mockUsdcContract.balanceOf(address)

        return Number(ethers.formatUnits(balance, 6)) // USDC has 6 decimals
    } catch (error) {
        console.error('Error getting USDC balance:', error)
        return 0
    }
}

/**
 * Mint USDC tokens (for testing)
 */
export const mintUSDC = async (amount: number): Promise<boolean> => {
    try {
        const { mockUsdcContract } = getContracts()

        const amountWei = ethers.parseUnits(amount.toString(), 6)
        const tx = await mockUsdcContract.mint(amountWei)
        await tx.wait()

        return true
    } catch (error) {
        console.error('Error minting USDC:', error)
        return false
    }
}

// Utility Functions

/**
 * Format tournament status
 */
export const formatTournamentStatus = (status: TournamentStatus): string => {
    switch (status) {
        case TournamentStatus.Created:
            return 'Created'
        case TournamentStatus.RegistrationOpen:
            return 'Registration Open'
        case TournamentStatus.RegistrationClosed:
            return 'Registration Closed'
        case TournamentStatus.InProgress:
            return 'In Progress'
        case TournamentStatus.Completed:
            return 'Completed'
        default:
            return 'Unknown'
    }
}

/**
 * Format match result
 */
export const formatMatchResult = (result: MatchResult): string => {
    switch (result) {
        case MatchResult.Pending:
            return 'Pending'
        case MatchResult.Player1Win:
            return 'Player 1 Win'
        case MatchResult.Player2Win:
            return 'Player 2 Win'
        case MatchResult.Draw:
            return 'Draw'
        default:
            return 'Unknown'
    }
}

/**
 * Format USDC amount
 */
export const formatUSDC = (amount: bigint): string => {
    return ethers.formatUnits(amount, 6)
}

/**
 * Parse USDC amount
 */
export const parseUSDC = (amount: string): bigint => {
    return ethers.parseUnits(amount, 6)
}

/**
 * Get all tournaments
 */
export const getAllTournaments = async (): Promise<Tournament[]> => {
    try {
        const total = await getTotalTournaments()
        const tournaments: Tournament[] = []

        for (let i = 1; i <= total; i++) {
            const tournament = await getTournament(i)
            if (tournament) {
                tournaments.push(tournament)
            }
        }

        return tournaments
    } catch (error) {
        console.error('Error getting all tournaments:', error)
        return []
    }
}

/**
 * Check if user is registered for tournament
 */
export const isUserRegistered = async (tournamentId: number, userAddress: string): Promise<boolean> => {
    try {
        const player = await getPlayer(tournamentId, userAddress)
        return player?.isRegistered || false
    } catch (error) {
        console.error('Error checking user registration:', error)
        return false
    }
}

/**
 * Get user's tournament stats
 */
export const getUserTournamentStats = async (tournamentId: number, userAddress: string): Promise<Player | null> => {
    try {
        return await getPlayer(tournamentId, userAddress)
    } catch (error) {
        console.error('Error getting user tournament stats:', error)
        return null
    }
} 