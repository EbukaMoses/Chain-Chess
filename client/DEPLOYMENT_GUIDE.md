# Deployment Guide

This guide will help you deploy the Chess Tournament contracts and configure the frontend application.

## Prerequisites

1. Node.js (v16 or higher)
2. MetaMask or another Web3 wallet
3. Some test ETH for gas fees

## Step 1: Deploy Contracts

### Option A: Using Hardhat (Recommended)

1. Navigate to the contract directory:
   ```bash
   cd contract
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start a local Hardhat node:
   ```bash
   npx hardhat node
   ```

4. In a new terminal, deploy the contracts:
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

5. Copy the contract addresses from the deployment output.

### Option B: Using Remix IDE

1. Go to [remix.ethereum.org](https://remix.ethereum.org)
2. Create new files for `MockUSDC.sol` and `Chess.sol` (copy from the contract directory)
3. Compile the contracts
4. Deploy to your preferred network
5. Copy the contract addresses

## Step 2: Configure Frontend

1. Navigate to the client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open the application in your browser (usually http://localhost:3000)

5. Click the "⚙️ Config" button in the bottom-right corner

6. Enter your contract addresses:
   - **Chess Tournament Address**: The address of your deployed ChessTournament contract
   - **Mock USDC Address**: The address of your deployed MockUSDC contract
   - **Network**: The network name (e.g., "localhost", "sepolia", "mainnet")

7. Click "Save" and refresh the page

## Step 3: Test the Application

1. Connect your wallet using the "Connect Wallet" button
2. Click "Get 1000 USDC" to mint some test USDC
3. Create a tournament or register for existing ones
4. Test the full tournament lifecycle

## Troubleshooting

### Contract Not Found Error
- Make sure you're connected to the correct network
- Verify the contract addresses are correct
- Check that the contracts are deployed and verified

### Transaction Failed
- Ensure you have enough ETH for gas fees
- Check that you're connected to the correct network
- Verify the contract addresses are correct

### Wallet Connection Issues
- Make sure MetaMask is installed and unlocked
- Check that you're connected to the correct network
- Try refreshing the page and reconnecting

## Network Configuration

### Local Development
- Network: `localhost`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `31337`

### Sepolia Testnet
- Network: `sepolia`
- RPC URL: `https://sepolia.infura.io/v3/YOUR_PROJECT_ID`
- Chain ID: `11155111`

### Mainnet
- Network: `mainnet`
- RPC URL: `https://mainnet.infura.io/v3/YOUR_PROJECT_ID`
- Chain ID: `1`

## Security Notes

- Never share your private keys or seed phrases
- Use test networks for development and testing
- Verify contracts on block explorers before using them
- Keep your MetaMask and other wallets updated

## Support

If you encounter any issues:
1. Check the browser console for error messages
2. Verify your contract addresses and network configuration
3. Ensure your wallet is connected to the correct network
4. Try refreshing the page and reconnecting your wallet 