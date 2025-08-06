// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title MockUSDC
 * @dev Mock USDC token for testing the chess tournament platform
 */
contract MockUSDC is ERC20, Ownable {
    uint8 private _decimals = 6; // USDC has 6 decimals

    constructor() ERC20("Mock USDC", "mUSDC") Ownable() {
        // Mint initial supply to deployer
        _mint(msg.sender, 1000000 * 10**6); // 1 million USDC
    }

    function decimals() public view virtual override returns (uint8) {
        return _decimals;
    }

    function mint(address to, uint256 amount) external onlyOwner {
        _mint(to, amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
} 