const { ethers } = require("hardhat");

async function main() {
  console.log("Testing Chess Tournament Platform deployment...");

  try {
    // Get the contract factories
    const MockUSDC = await ethers.getContractFactory("MockUSDC");
    const ChessTournament = await ethers.getContractFactory("ChessTournament");

    console.log("Deploying Mock USDC...");
    const mockUSDC = await MockUSDC.deploy();
    await mockUSDC.waitForDeployment();
    const mockUSDCAddress = await mockUSDC.getAddress();
    console.log("Mock USDC deployed to:", mockUSDCAddress);

    console.log("Deploying Chess Tournament...");
    const chessTournament = await ChessTournament.deploy();
    await chessTournament.waitForDeployment();
    const chessTournamentAddress = await chessTournament.getAddress();
    console.log("Chess Tournament deployed to:", chessTournamentAddress);

    console.log("\n✅ Deployment successful!");
    console.log("===================");
    console.log("Mock USDC:", mockUSDCAddress);
    console.log("Chess Tournament:", chessTournamentAddress);

    // Test basic functionality
    console.log("\n🧪 Testing basic functionality...");
    
    const [owner, organizer, player1] = await ethers.getSigners();
    
    // Transfer some USDC to organizer
    await mockUSDC.transfer(organizer.address, ethers.parseUnits("1000", 6));
    console.log("✅ Transferred 1000 USDC to organizer");

    // Create a tournament
    const startTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    const endTime = startTime + 86400; // 24 hours later
    
    await chessTournament.connect(organizer).createTournament(
      "Test Tournament",
      "A test tournament",
      mockUSDCAddress,
      ethers.parseUnits("100", 6), // 100 USDC prize pool
      8, // 8 players
      startTime,
      endTime
    );
    console.log("✅ Tournament created");

    // Start registration
    await chessTournament.connect(organizer).startRegistration(1);
    console.log("✅ Registration started");

    // Register a player
    await chessTournament.connect(player1).registerForTournament(1, "Player1");
    console.log("✅ Player registered");

    console.log("\n🎉 All tests passed! The platform is working correctly.");

  } catch (error) {
    console.error("❌ Deployment failed:", error.message);
    process.exit(1);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 