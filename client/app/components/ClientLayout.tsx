'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useContract } from '../../contexts/ContractContext';
import { loadDeploymentConfig } from '../../lib/config';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [stablecoinBalance, setStablecoinBalance] = useState<number>(0);
    const pathname = usePathname();

    const {
        isInitialized,
        initializeContracts,
        getUSDCBalance,
        mintUSDC
    } = useContract();

    // Check if wallet is connected on component mount and when path changes
    useEffect(() => {
        const checkWalletConnection = async () => {
            if (typeof window !== 'undefined' && window.ethereum) {
                try {
                    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
                    if (accounts.length > 0) {
                        setIsWalletConnected(true);
                        setWalletAddress(accounts[0]);
                    }
                } catch (error) {
                    console.error('Error checking wallet connection:', error);
                } finally {
                    setIsLoading(false);
                }
            } else {
                setIsLoading(false);
            }
        };

        checkWalletConnection();

        // Listen for account changes
        const handleAccountsChanged = (accounts: string[]) => {
            if (accounts.length === 0) {
                // User disconnected wallet
                setIsWalletConnected(false);
                setWalletAddress('');
                setStablecoinBalance(0);
            } else if (accounts[0] !== walletAddress) {
                // Account changed
                setWalletAddress(accounts[0]);
                if (!isWalletConnected) {
                    setIsWalletConnected(true);
                }
            }
        };

        // Store the ethereum provider reference
        const ethereum = window.ethereum;

        if (ethereum) {
            try {
                // Add event listener for account changes
                ethereum.on('accountsChanged', handleAccountsChanged);

                // Add event listener for network changes
                ethereum.on('chainChanged', (chainId: string) => {
                    const sepoliaChainId = '0xaa36a7';
                    if (chainId !== sepoliaChainId) {
                        alert('Please switch to Sepolia testnet to use this application');
                        // Optionally auto-switch back to Sepolia
                        ethereum.request({
                            method: 'wallet_switchEthereumChain',
                            params: [{ chainId: sepoliaChainId }],
                        }).catch(() => {
                            // User rejected the switch
                        });
                    }
                });

                // Cleanup function
                return () => {
                    try {
                        // Remove all listeners for accountsChanged and chainChanged
                        ethereum.removeAllListeners('accountsChanged');
                        ethereum.removeAllListeners('chainChanged');
                    } catch (error) {
                        console.error('Error cleaning up event listener:', error);
                    }
                };
            } catch (error) {
                console.error('Error setting up wallet connection:', error);
            }
        }

        // Return empty cleanup function if ethereum is not available
        return () => { };
    }, [pathname, walletAddress, isWalletConnected]);

    // Initialize contracts when wallet is connected
    useEffect(() => {
        if (isWalletConnected && !isInitialized) {
            // Load deployment configuration
            const config = loadDeploymentConfig();
            const { ChessTournament: tournamentAddress, MockUSDC: usdcAddress } = config.contracts;

            // Initialize contracts
            initializeContracts(tournamentAddress, usdcAddress).catch(console.error);
        }
    }, [isWalletConnected, isInitialized, initializeContracts]);

    // Fetch balance when wallet is connected and contracts are initialized
    useEffect(() => {
        const fetchBalance = async () => {
            if (isWalletConnected && walletAddress && isInitialized) {
                try {
                    const balance = await getUSDCBalance(walletAddress);
                    setStablecoinBalance(balance);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                    setStablecoinBalance(0);
                }
            }
        };

        fetchBalance();
    }, [isWalletConnected, walletAddress, isInitialized, getUSDCBalance]);

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                // First, request accounts
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });

                if (accounts.length > 0) {
                    // Check current network
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
                    const sepoliaChainId = '0xaa36a7'; // Sepolia testnet chain ID

                    if (chainId !== sepoliaChainId) {
                        // Switch to Sepolia testnet
                        try {
                            await window.ethereum.request({
                                method: 'wallet_switchEthereumChain',
                                params: [{ chainId: sepoliaChainId }],
                            });
                        } catch (switchError: any) {
                            // If Sepolia is not added to MetaMask, add it
                            if (switchError.code === 4902) {
                                try {
                                    await window.ethereum.request({
                                        method: 'wallet_addEthereumChain',
                                        params: [{
                                            chainId: sepoliaChainId,
                                            chainName: 'Sepolia Testnet',
                                            nativeCurrency: {
                                                name: 'Sepolia Ether',
                                                symbol: 'SEP',
                                                decimals: 18
                                            },
                                            rpcUrls: ['https://sepolia.infura.io/v3/'],
                                            blockExplorerUrls: ['https://sepolia.etherscan.io/']
                                        }],
                                    });
                                } catch (addError) {
                                    console.error('Error adding Sepolia network:', addError);
                                    alert('Please add Sepolia testnet to your wallet manually');
                                    return;
                                }
                            } else {
                                console.error('Error switching to Sepolia:', switchError);
                                alert('Please switch to Sepolia testnet manually');
                                return;
                            }
                        }
                    }

                    setIsWalletConnected(true);
                    setWalletAddress(accounts[0]);
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
                alert('Failed to connect wallet. Please try again.');
            }
        } else {
            alert('Please install MetaMask or another Web3 provider');
        }
    };

    const disconnectWallet = () => {
        setIsWalletConnected(false);
        setWalletAddress('');
        setStablecoinBalance(0);
    };

    const handleDiscount = async () => {
        if (!isWalletConnected || !walletAddress) {
            alert('Please connect your wallet first');
            return;
        }

        try {
            const success = await mintUSDC(1000); // Mint 1000 USDC
            if (success) {
                // Refresh balance
                const newBalance = await getUSDCBalance(walletAddress);
                setStablecoinBalance(newBalance);
                alert('Successfully minted 1000 USDC!');
            } else {
                alert('Failed to mint USDC. Please try again.');
            }
        } catch (error) {
            console.error('Error minting USDC:', error);
            alert('Error minting USDC. Please try again.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
                <div className="animate-pulse">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col">
            <nav className="w-full bg-black/90 border-b border-white/10 py-4 px-8 flex items-center justify-between z-50 sticky top-0">
                <div className="flex items-center space-x-8">
                    <Link
                        href="/"
                        className={`text-xl font-bold ${pathname === '/' ? 'text-white' : 'text-white/80 hover:text-white'} transition-colors`}
                    >
                        <div className="flex items-center space-x-3">
                            <div className="chess-piece animate-glow">♔</div>
                            <h1 className="text-3xl font-bold gradient-text-white">Chain-Chess</h1>
                        </div>
                    </Link>
                    <Link
                        href="/tournaments"
                        className={`${pathname.startsWith('/tournaments') ? 'text-white' : 'text-white/80 hover:text-white'} transition-colors`}
                    >
                        Tournaments
                    </Link>
                    <Link
                        href="/game/new"
                        className={`${pathname.startsWith('/game') ? 'text-white' : 'text-white/80 hover:text-white'} transition-colors`}
                    >
                        Play Chess
                    </Link>
                    {isWalletConnected && (
                        <Link
                            href="/dashboard"
                            className={`${pathname.startsWith('/dashboard') ? 'text-white' : 'text-white/80 hover:text-white'} transition-colors`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
                <div className="flex items-center space-x-4">
                    {isWalletConnected && (
                        <>
                            <button
                                onClick={handleDiscount}
                                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Get 1000 USDC
                            </button>
                            <div className="bg-white/10 text-white px-4 py-2 rounded-xl font-mono text-sm">
                                USDC: {stablecoinBalance.toFixed(2)}
                            </div>
                        </>
                    )}
                    {isWalletConnected ? (
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2 bg-green-600/20 text-green-300 px-3 py-1 rounded-full text-xs font-medium border border-green-500/30">
                                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                                <span>Sepolia</span>
                            </div>
                            <span className="text-sm text-white/70 hidden md:inline">
                                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                            </span>
                            <button
                                onClick={disconnectWallet}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                            >
                                Disconnect
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={connectWallet}
                            className="bg-[#6D9A4C] hover:bg-[#8BB563] text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Connect Wallet (Sepolia)
                        </button>
                    )}
                </div>
            </nav>
            <main className="flex-1 bg-gray-900 text-white">
                {children}
            </main>
        </div>
    );
}
