// Configuration for the Chess Tournament Platform
export interface DeploymentConfig {
    network: string;
    deployer: string;
    contracts: {
        MockUSDC: string;
        ChessTournament: string;
    };
    timestamp: string;
}

// RPC Configuration
export const RPC_CONFIG = {
    sepolia: {
        // Using public Sepolia RPC (no rate limits, completely free)
        url: 'https://ethereum-sepolia-rpc.publicnode.com',
        chainId: '11155111' // Sepolia chain ID
    }
};

// Default configuration (will be updated after deployment)
export const defaultConfig: DeploymentConfig = {
    network: "sepolia",
    deployer: "0x0000000000000000000000000000000000000000",
    contracts: {
        MockUSDC: "0x3685B9BA92508144B8894c51632669368Bae8307",
        ChessTournament: "0x8Bfcfc940A928E474eb1e4abA412696cefF274e2"
    },
    timestamp: new Date().toISOString()
};

// Load configuration from localStorage or use default
export const loadDeploymentConfig = (): DeploymentConfig => {
    if (typeof window === 'undefined') {
        return defaultConfig;
    }

    try {
        const stored = localStorage.getItem('deploymentConfig');
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (error) {
        console.error('Error loading deployment config:', error);
    }

    return defaultConfig;
};

// Save configuration to localStorage
export const saveDeploymentConfig = (config: DeploymentConfig): void => {
    if (typeof window === 'undefined') {
        return;
    }

    try {
        localStorage.setItem('deploymentConfig', JSON.stringify(config));
    } catch (error) {
        console.error('Error saving deployment config:', error);
    }
};

// Get contract addresses
export const getContractAddresses = () => {
    const config = loadDeploymentConfig();
    return config.contracts;
}; 