import { ethers } from "hardhat";

async function main() {
    console.log("Deploying Chess Tournament Platform...");

    // Deploy Mock USDC first
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();

    console.log("Mock USDC deployed to:", mockUSDCAddress);

    // Deploy Chess Tournament contract
    const ChessTournament = await ethers.getContractFactory("ChessTournament");
    const chessTournament = await ChessTournament.deploy();
    await chessTournament.waitForDeployment();
    const chessTournamentAddress = await chessTournament.getAddress();

    console.log("Chess Tournament deployed to:", chessTournamentAddress);

    console.log("\nDeployment Summary:");
    console.log("===================");
    console.log("Mock USDC:", mockUSDCAddress);
    console.log("Chess Tournament:", chessTournamentAddress);
    console.log("\nYou can now use these addresses to interact with the contracts.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    }); 