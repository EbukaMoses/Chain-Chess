# Chess Tournament Platform - Smart Contract Integration Guide

## 🎯 Overview

This guide will help you set up and use the complete Chess Tournament Platform with smart contract integration for creating tournaments, registering players, and managing games.

## 🚀 Quick Start

### 1. Deploy Smart Contracts

First, deploy the smart contracts to get the contract addresses:

```bash
# Navigate to contract directory
cd contract

# Install dependencies
npm install

# Compile contracts
npx hardhat compile

# Start local blockchain
npx hardhat node

# In a new terminal, deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 2. Update Contract Addresses

After deployment, copy the contract addresses and update them in `client/lib/contractService.ts`:

```typescript
// Replace these placeholder addresses with your deployed contract addresses
let CHESS_TOURNAMENT_ADDRESS = '0x...' // Your deployed ChessTournament address
let MOCK_USDC_ADDRESS = '0x...' // Your deployed MockUSDC address
```

### 3. Start the Frontend

```bash
# Navigate to client directory
cd client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Connect Wallet and Test

1. Open your browser to `http://localhost:3000`
2. Connect your MetaMask wallet
3. Switch to the local network (usually `localhost:8545`)
4. Start creating and managing tournaments!

## 🔧 Smart Contract Features

### Tournament Management

#### Create Tournament
- **Function**: `createTournament(name, description, prizeToken, prizePool, maxPlayers, startTime, endTime)`
- **Requirements**: 
  - Max players must be divisible by 4
  - Prize pool > 0
  - Start time must be in the future
  - End time must be after start time

#### Start Registration
- **Function**: `startRegistration(tournamentId)`
- **Requirements**: Only tournament organizer can call this

#### Register for Tournament
- **Function**: `registerForTournament(tournamentId, username)`
- **Requirements**: 
  - Registration must be open
  - User not already registered
  - Tournament not full
  - Username cannot be empty

#### Close Registration and Start
- **Function**: `closeRegistrationAndStart(tournamentId)`
- **Requirements**: 
  - Only organizer can call
  - Player count must be divisible by 4
  - Automatically creates groups and starts tournament

### Game Management

#### Submit Match Result
- **Function**: `submitMatchResult(tournamentId, groupId, player1, player2, result)`
- **Requirements**: Only tournament organizer can submit results
- **Results**: Player1Win, Player2Win, Draw

#### Complete Tournament
- **Function**: `completeTournament(tournamentId, firstPlace, secondPlace, thirdPlace)`
- **Requirements**: Only organizer can complete tournament
- **Prize Distribution**: 50% (1st), 30% (2nd), 20% (3rd)

### View Functions

- `getTournament(tournamentId)` - Get tournament details
- `getPlayer(tournamentId, playerAddress)` - Get player stats
- `getTournamentGroups(tournamentId)` - Get tournament groups
- `getTournamentMatches(tournamentId)` - Get tournament matches
- `getTournamentWinners(tournamentId)` - Get tournament winners
- `getTotalTournaments()` - Get total number of tournaments

## 🎮 Frontend Integration

### Contract Service

The `client/lib/contractService.ts` file provides a complete interface for interacting with the smart contracts:

```typescript
// Initialize contracts
await initializeContractService(tournamentAddress, usdcAddress)

// Create tournament
const result = await createTournament(name, description, prizePool, maxPlayers, startTime, endTime)

// Register for tournament
const result = await registerForTournament(tournamentId, username)

// Submit match result
const result = await submitMatchResult(tournamentId, groupId, player1, player2, MatchResult.Player1Win)
```

### React Context

The `client/contexts/ContractContext.tsx` provides React hooks for easy contract interaction:

```typescript
const {
  tournaments,
  createNewTournament,
  registerForTournament,
  isLoading,
  isInitialized
} = useContract()
```

### UI Components

The main page (`client/app/page.tsx`) includes:

- **Wallet Connection**: MetaMask integration with ethers.js
- **Tournament Creation**: Modal form for creating new tournaments
- **Tournament Registration**: Modal form for registering players
- **Tournament Display**: Real-time tournament data from blockchain
- **Error Handling**: User-friendly error messages

## 🎨 Features

### Tournament Lifecycle

1. **Created** - Tournament is created but registration not open
2. **Registration Open** - Players can register for the tournament
3. **Registration Closed** - Registration period ended
4. **In Progress** - Tournament is active with groups and matches
5. **Completed** - Tournament finished with prizes distributed

### Group System

- Players are automatically grouped into groups of 4
- Round-robin matches within each group
- Points system: 3 points for win, 1 point for draw, 0 for loss

### Prize Distribution

- **1st Place**: 50% of prize pool
- **2nd Place**: 30% of prize pool  
- **3rd Place**: 20% of prize pool
- Automatic distribution via smart contract

## 🔒 Security Features

- **Access Control**: Only tournament organizers can manage their tournaments
- **Reentrancy Protection**: Uses OpenZeppelin's ReentrancyGuard
- **Ownership**: Uses OpenZeppelin's Ownable for admin functions
- **Input Validation**: Comprehensive validation for all inputs
- **Safe Math**: Built-in overflow protection with Solidity 0.8+

## 🧪 Testing

### Smart Contract Tests

```bash
cd contract
npx hardhat test
```

Tests cover:
- Tournament creation and management
- Player registration
- Match result submission
- Prize distribution
- Access control
- Error conditions

### Frontend Testing

The frontend includes comprehensive error handling and loading states for all contract interactions.

## 🚀 Deployment

### Local Development

1. Use Hardhat's local network for development
2. Deploy contracts using the provided script
3. Update contract addresses in the frontend
4. Test all functionality locally

### Production Deployment

1. Deploy contracts to your target network (Ethereum, Polygon, etc.)
2. Update contract addresses in `client/lib/contractService.ts`
3. Build and deploy the frontend
4. Ensure MetaMask is configured for your target network

## 📝 Usage Examples

### Creating a Tournament

```typescript
const result = await createNewTournament(
  "Spring Championship 2024",
  "The ultimate chess competition for spring",
  5000, // 5000 USDC prize pool
  8, // 8 players
  new Date("2024-03-15T10:00:00Z"),
  new Date("2024-03-20T18:00:00Z")
)
```

### Registering for a Tournament

```typescript
const result = await registerForTournament(1, "ChessMaster2024")
```

### Submitting Match Results

```typescript
const result = await submitMatchResult(
  1, // tournament ID
  0, // group ID
  "0x1234...", // player1 address
  "0x5678...", // player2 address
  MatchResult.Player1Win
)
```

## 🐛 Troubleshooting

### Common Issues

1. **"Contracts not initialized"**
   - Ensure contract addresses are correctly set in `contractService.ts`
   - Check that wallet is connected

2. **"User rejected transaction"**
   - User cancelled the MetaMask transaction
   - Check gas settings in MetaMask

3. **"Insufficient funds"**
   - Ensure wallet has enough ETH for gas fees
   - For prize pools, ensure sufficient USDC balance

4. **"Only organizer can call this"**
   - Only the tournament creator can perform certain actions
   - Check that you're using the correct wallet

### Debug Mode

Enable debug logging by checking the browser console for detailed error messages and transaction information.

## 📚 Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts/)
- [MetaMask Documentation](https://docs.metamask.io/)

## 🎉 Congratulations!

You now have a fully functional on-chain chess tournament platform! Players can create tournaments, register, play matches, and receive prizes automatically through smart contracts.

The platform provides:
- ✅ Transparent prize distribution
- ✅ Immutable tournament records
- ✅ Fair competition system
- ✅ Modern, responsive UI
- ✅ Complete smart contract integration

Happy chess playing! ♔ 