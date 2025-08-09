'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

export default function TestRPCPage() {
    const [status, setStatus] = useState('Testing RPC connection...');
    const [blockNumber, setBlockNumber] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        testRPCConnection();
    }, []);

    const testRPCConnection = async () => {
        try {
            setStatus('Connecting to Sepolia...');

            if (typeof window !== 'undefined' && window.ethereum) {
                const provider = new ethers.BrowserProvider(window.ethereum);

                setStatus('Getting block number...');
                const blockNum = await provider.getBlockNumber();
                setBlockNumber(blockNum);
                setStatus('✅ RPC connection successful!');
                setError(null);
            } else {
                setError('MetaMask not found');
                setStatus('❌ MetaMask not available');
            }
        } catch (err: any) {
            console.error('RPC Test Error:', err);
            setError(err.message || 'Unknown error');
            setStatus('❌ RPC connection failed');
        }
    };

    const switchToPublicRPC = async () => {
        try {
            setStatus('Switching to public RPC...');

            if (typeof window !== 'undefined' && window.ethereum) {
                await window.ethereum.request({
                    method: 'wallet_switchEthereumChain',
                    params: [{ chainId: '0xaa36a7' }],
                });

                setStatus('✅ Switched to Sepolia! Testing connection...');
                setTimeout(testRPCConnection, 1000);
            }
        } catch (err: any) {
            console.error('Switch Error:', err);
            setError(err.message);
            setStatus('❌ Failed to switch network');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-8">
            <div className="max-w-2xl mx-auto px-4">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h1 className="text-3xl font-bold text-gray-800 mb-6">
                        RPC Connection Test
                    </h1>

                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h2 className="font-semibold text-gray-700 mb-2">Status</h2>
                            <p className="text-lg">{status}</p>
                        </div>

                        {blockNumber !== null && (
                            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                                <h2 className="font-semibold text-green-700 mb-2">✅ Success</h2>
                                <p className="text-green-600">
                                    Current block number: <span className="font-mono">{blockNumber}</span>
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                                <h2 className="font-semibold text-red-700 mb-2">❌ Error</h2>
                                <p className="text-red-600 text-sm">{error}</p>
                            </div>
                        )}

                        <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                            <h2 className="font-semibold text-blue-700 mb-2">Quick Fix</h2>
                            <p className="text-blue-600 mb-3">
                                If you're still getting rate limit errors, click the button below to switch to the public RPC.
                            </p>
                            <button
                                onClick={switchToPublicRPC}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                            >
                                Switch to Public RPC
                            </button>
                        </div>

                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                            <h2 className="font-semibold text-yellow-700 mb-2">Manual Fix</h2>
                            <p className="text-yellow-600 text-sm">
                                If the automatic fix doesn't work, manually update MetaMask:
                            </p>
                            <ol className="text-yellow-600 text-sm mt-2 list-decimal list-inside space-y-1">
                                <li>Open MetaMask</li>
                                <li>Click the network dropdown</li>
                                <li>Click "Settings" → "Networks"</li>
                                <li>Find "Sepolia" and click "Edit"</li>
                                <li>Change RPC URL to: <code className="bg-yellow-100 px-1 rounded">https://rpc.sepolia.org</code></li>
                                <li>Save and refresh this page</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
} 