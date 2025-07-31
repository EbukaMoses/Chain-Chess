const { ethers } = require("hardhat");

async function main() {
  console.log("🚀 Starting deployment...");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);

  // Deploy MockUSDC first
  console.log("💰 Deploying MockUSDC...");
  const MockUSDC = await ethers.getContractFactory("MockUSDC");
  const mockUSDC = await MockUSDC.deploy(ethers.parseUnits("1000000", 6)); // 1M USDC
  await mockUSDC.waitForDeployment();
  const mockUSDCAddress = await mockUSDC.getAddress();
  console.log("✅ MockUSDC deployed to:", mockUSDCAddress);

  // Deploy ChessTournament
  console.log("♔ Deploying ChessTournament...");
  const ChessTournament = await ethers.getContractFactory("ChessTournament");
  const chessTournament = await ChessTournament.deploy();
  await chessTournament.waitForDeployment();
  const chessTournamentAddress = await chessTournament.getAddress();
  console.log("✅ ChessTournament deployed to:", chessTournamentAddress);

  // Mint some USDC to the deployer for testing
  console.log("🪙 Minting USDC to deployer for testing...");
  const mintTx = await mockUSDC.mint(ethers.parseUnits("10000", 6)); // 10K USDC
  await mintTx.wait();
  console.log("✅ Minted 10,000 USDC to deployer");

  // Save deployment info
  const deploymentInfo = {
    network: "localhost",
    deployer: deployer.address,
    contracts: {
      MockUSDC: mockUSDCAddress,
      ChessTournament: chessTournamentAddress
    },
    timestamp: new Date().toISOString()
  };

  console.log("\n🎉 Deployment completed successfully!");
  console.log("\n📋 Deployment Summary:");
  console.log("Network:", deploymentInfo.network);
  console.log("Deployer:", deploymentInfo.deployer);
  console.log("MockUSDC:", deploymentInfo.contracts.MockUSDC);
  console.log("ChessTournament:", deploymentInfo.contracts.ChessTournament);
  
  console.log("\n🔧 Next steps:");
  console.log("1. Copy the contract addresses above");
  console.log("2. Update the contract addresses in client/lib/contractService.ts");
  console.log("3. Start the frontend with: cd client && npm run dev");
  console.log("4. Connect your wallet and start creating tournaments!");

  // Save to file
  const fs = require('fs');
  fs.writeFileSync('deployment.json', JSON.stringify(deploymentInfo, null, 2));
  console.log("\n💾 Deployment info saved to deployment.json");

  return deploymentInfo;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  }); 