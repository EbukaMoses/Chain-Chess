'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Type for the Ethereum provider
type EthereumProvider = {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (eventName: string, callback: (...args: any[]) => void) => void;
    removeListener?: (eventName: string, callback: (...args: any[]) => void) => void;
    off?: (eventName: string, callback: (...args: any[]) => void) => void;
    isConnected: () => boolean;
    selectedAddress: string | null;
};

declare global {
    interface Window {
        ethereum?: EthereumProvider;
    }
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
    const [isWalletConnected, setIsWalletConnected] = useState(false);
    const [walletAddress, setWalletAddress] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const pathname = usePathname();

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

                // Cleanup function
                return () => {
                    try {
                        // Try to remove the event listener
                        if (ethereum.removeListener) {
                            ethereum.removeListener('accountsChanged', handleAccountsChanged);
                        } else if (ethereum.off) {
                            ethereum.off('accountsChanged', handleAccountsChanged);
                        } else {
                            // As a last resort, remove all listeners
                            ethereum.removeAllListeners?.('accountsChanged');
                        }
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
    }, [pathname]);

    const connectWallet = async () => {
        if (typeof window !== 'undefined' && window.ethereum) {
            try {
                const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
                if (accounts.length > 0) {
                    setIsWalletConnected(true);
                    setWalletAddress(accounts[0]);
                }
            } catch (error) {
                console.error('Error connecting wallet:', error);
            }
        } else {
            alert('Please install MetaMask or another Web3 provider');
        }
    };

    const disconnectWallet = () => {
        setIsWalletConnected(false);
        setWalletAddress('');
        // No need to reload the page, state will update automatically
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
                    {isWalletConnected && (
                        <Link
                            href="/dashboard"
                            className={`${pathname.startsWith('/dashboard') ? 'text-white' : 'text-white/80 hover:text-white'} transition-colors`}
                        >
                            Dashboard
                        </Link>
                    )}
                </div>
                <div>
                    {isWalletConnected ? (
                        <div className="flex items-center space-x-4">
                            {/* <span className="text-sm text-white/70 hidden md:inline">
                                {`${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`}
                            </span> */}
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
                            Connect Wallet
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
