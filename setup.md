# Chess Tournament Platform - Setup Guide

This guide will help you set up and run the Chess Tournament Platform on your local machine.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Git** - [Download here](https://git-scm.com/)

## Quick Start

### 1. Clone and Navigate to Project

```bash
# If you haven't already cloned the repository
git clone <repository-url>
cd Chess
```

### 2. Smart Contract Setup

```bash
# Navigate to contract directory
cd contract

# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests to verify everything works
npm test
```

### 3. Frontend Setup

```bash
# Navigate to client directory (from project root)
cd ../client

# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## Detailed Setup Instructions

### Smart Contracts

The smart contracts are built using Hardhat and include:

- **ChessTournament.sol**: Main contract for tournament management
- **MockUSDC.sol**: Mock USDC token for testing

#### Key Features:
- Tournament creation with stablecoin prize pools
- Player registration with wallet verification
- Group-based competition (4 players per group)
- Automated scoring system
- Transparent prize distribution

#### Testing the Contracts:

```bash
cd contract
npm test
```

This will run comprehensive tests covering:
- Tournament creation and validation
- Player registration
- Match result submission
- Prize distribution

#### Deploying Locally:

```bash
# Start local blockchain
npm run node

# In a new terminal, deploy contracts
npm run deploy:local
```

### Frontend Application

The frontend is built with Next.js and includes:

- Modern, responsive UI with Tailwind CSS
- Tournament browsing and creation
- Player registration interface
- Real-time tournament status updates

#### Key Components:
- **TournamentCard**: Displays tournament information
- **CreateTournamentForm**: Form for creating new tournaments
- **Responsive Design**: Works on desktop and mobile

#### Development:

```bash
cd client
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
Chess/
├── contract/                 # Smart contracts
│   ├── contracts/
│   │   ├── ChessTournament.sol    # Main tournament contract
│   │   └── MockUSDC.sol           # Mock USDC for testing
│   ├── scripts/
│   │   ├── deploy.ts              # Deployment script
│   │   └── test-deploy.js         # Test deployment script
│   ├── test/
│   │   └── ChessTournament.test.ts # Comprehensive tests
│   └── hardhat.config.ts          # Hardhat configuration
├── client/                   # Frontend application
│   ├── app/
│   │   ├── page.tsx              # Main page
│   │   ├── layout.tsx            # Root layout
│   │   ├── providers.tsx         # App providers
│   │   └── globals.css           # Global styles
│   ├── components/
│   │   ├── TournamentCard.tsx    # Tournament display component
│   │   └── CreateTournamentForm.tsx # Tournament creation form
│   ├── package.json              # Frontend dependencies
│   └── tailwind.config.js        # Tailwind configuration
└── README.md                    # Project documentation
```

## Usage Examples

### Creating a Tournament

1. Open the application in your browser
2. Click "Create Tournament"
3. Fill in the tournament details:
   - Name: "Spring Chess Championship"
   - Description: "A competitive tournament for chess enthusiasts"
   - Prize Pool: 1000 USDC
   - Max Players: 8
   - Start Date: Tomorrow at 2 PM
   - End Date: Day after tomorrow at 6 PM
4. Click "Create Tournament"

### Registering for a Tournament

1. Browse available tournaments
2. Click "Register" on a tournament
3. Enter your username
4. Confirm the transaction

### Tournament Progression

1. **Registration Phase**: Players register until the cap is reached
2. **Group Allocation**: Players are randomly assigned to groups of 4
3. **Round-Robin Matches**: Each player faces every other player in their group
4. **Scoring**: Points are awarded (Win: 3, Draw: 1, Loss: 0)
5. **Advancement**: Top players advance to subsequent rounds
6. **Final**: Winners are determined and prizes distributed

## Troubleshooting

### Common Issues

1. **Node.js Version**: Make sure you're using Node.js v16 or higher
   ```bash
   node --version
   ```

2. **Dependencies**: If you encounter dependency issues, try:
   ```bash
   # In contract directory
   rm -rf node_modules package-lock.json
   npm install

   # In client directory
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Port Conflicts**: If port 3000 is in use:
   ```bash
   # The Next.js dev server will automatically try the next available port
   # Or you can specify a different port
   npm run dev -- -p 3001
   ```

4. **Hardhat Network**: If you have issues with the local blockchain:
   ```bash
   cd contract
   npx hardhat clean
   npx hardhat compile
   npx hardhat node
   ```

### Getting Help

If you encounter any issues:

1. Check the console output for error messages
2. Verify all prerequisites are installed
3. Make sure you're in the correct directory when running commands
4. Check that all dependencies are properly installed

## Next Steps

Once you have the basic platform running, you can:

1. **Connect Real Wallets**: Integrate with MetaMask or other wallet providers
2. **Deploy to Testnet**: Deploy contracts to a test network like Sepolia
3. **Add More Features**: Implement additional tournament formats
4. **Enhance UI**: Add more interactive elements and animations
5. **Add Analytics**: Track tournament statistics and player performance

## Security Notes

- The smart contracts include comprehensive security measures
- All user inputs are validated
- Reentrancy protection is implemented
- Access control ensures only authorized users can perform actions
- All important actions are logged as events for transparency

## License

This project is licensed under the MIT License. 