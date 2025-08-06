'use client'

import { useState } from 'react'
import { useContract } from '../contexts/ContractContext'
import { loadDeploymentConfig } from '../lib/config'

export function TournamentDebugger() {
    const [isOpen, setIsOpen] = useState(false)
    const [debugInfo, setDebugInfo] = useState<any>({})
    const [isLoading, setIsLoading] = useState(false)
    const [testResult, setTestResult] = useState<string>('')

    const {
        isInitialized,
        getUSDCBalance,
        mintUSDC,
        createNewTournament
    } = useContract()

    const runDebugTests = async () => {
        setIsLoading(true)
        setTestResult('')

        try {
            const results: any = {}

            // Test 1: Check wallet connection
            if (typeof window !== 'undefined' && window.ethereum) {
                const accounts = await window.ethereum.request({ method: 'eth_accounts' })
                results.walletConnected = accounts.length > 0
                results.walletAddress = accounts[0] || 'Not connected'

                if (accounts.length > 0) {
                    // Test 2: Check network
                    const chainId = await window.ethereum.request({ method: 'eth_chainId' })
                    results.network = chainId === '0xaa36a7' ? 'Sepolia' : `Other (${chainId})`
                }
            } else {
                results.walletConnected = false
                results.walletAddress = 'No wallet detected'
            }

            // Test 3: Check contract configuration
            const config = loadDeploymentConfig()
            results.contractConfig = config
            results.contractsInitialized = isInitialized

            // Test 4: Check USDC balance
            if (results.walletConnected && results.walletAddress !== 'Not connected') {
                try {
                    const balance = await getUSDCBalance(results.walletAddress)
                    results.usdcBalance = balance
                } catch (error) {
                    results.usdcBalance = `Error: ${error}`
                }
            }

            // Test 5: Try to mint USDC
            if (results.walletConnected && results.walletAddress !== 'Not connected') {
                try {
                    const mintResult = await mintUSDC(1000)
                    results.mintResult = mintResult ? 'Success' : 'Failed'
                } catch (error) {
                    results.mintResult = `Error: ${error}`
                }
            }

            setDebugInfo(results)
            setTestResult('Debug tests completed! Check the information below.')

        } catch (error) {
            setTestResult(`Error running debug tests: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    const testCreateTournament = async () => {
        setIsLoading(true)
        setTestResult('')

        try {
            const testData = {
                name: 'Debug Test Tournament',
                description: 'This is a test tournament for debugging',
                prizePool: 100,
                maxPlayers: 4,
                startTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
                endTime: new Date(Date.now() + 48 * 60 * 60 * 1000)   // Day after tomorrow
            }

            const result = await createNewTournament(
                testData.name,
                testData.description,
                testData.prizePool,
                testData.maxPlayers,
                testData.startTime,
                testData.endTime
            )

            if (result.success) {
                setTestResult(`✅ Tournament created successfully! Tournament ID: ${result.tournamentId}, TX: ${result.transactionHash}`)
            } else {
                setTestResult(`❌ Failed to create tournament: ${result.error}`)
            }
        } catch (error) {
            setTestResult(`❌ Error creating tournament: ${error}`)
        } finally {
            setIsLoading(false)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 left-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors z-50"
            >
                🐛 Debug
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 max-w-4xl w-full p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 gradient-text-white">Tournament Creation Debugger</h2>

                <div className="space-y-6">
                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            onClick={runDebugTests}
                            disabled={isLoading}
                            className="btn-primary px-6 py-3"
                        >
                            {isLoading ? 'Running...' : '🔍 Run Debug Tests'}
                        </button>
                        <button
                            onClick={testCreateTournament}
                            disabled={isLoading}
                            className="btn-secondary px-6 py-3"
                        >
                            {isLoading ? 'Creating...' : '🧪 Test Create Tournament'}
                        </button>
                    </div>

                    {/* Test Result */}
                    {testResult && (
                        <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                            <h3 className="text-blue-300 font-semibold mb-2">Test Result:</h3>
                            <p className="text-blue-200 text-sm whitespace-pre-wrap">{testResult}</p>
                        </div>
                    )}

                    {/* Debug Information */}
                    {Object.keys(debugInfo).length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-white">Debug Information:</h3>

                            {/* Wallet Status */}
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold text-white mb-2">Wallet Status:</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Connected:</span>
                                        <span className={`ml-2 ${debugInfo.walletConnected ? 'text-green-400' : 'text-red-400'}`}>
                                            {debugInfo.walletConnected ? '✅ Yes' : '❌ No'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Address:</span>
                                        <span className="ml-2 text-white font-mono text-xs">
                                            {debugInfo.walletAddress}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Network:</span>
                                        <span className={`ml-2 ${debugInfo.network === 'Sepolia' ? 'text-green-400' : 'text-red-400'}`}>
                                            {debugInfo.network || 'Unknown'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">USDC Balance:</span>
                                        <span className="ml-2 text-white">
                                            {typeof debugInfo.usdcBalance === 'number' ? `${debugInfo.usdcBalance} USDC` : debugInfo.usdcBalance}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Contract Status */}
                            <div className="bg-gray-800 rounded-lg p-4">
                                <h4 className="font-semibold text-white mb-2">Contract Status:</h4>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="text-gray-400">Initialized:</span>
                                        <span className={`ml-2 ${debugInfo.contractsInitialized ? 'text-green-400' : 'text-red-400'}`}>
                                            {debugInfo.contractsInitialized ? '✅ Yes' : '❌ No'}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-gray-400">Network:</span>
                                        <span className="ml-2 text-white">{debugInfo.contractConfig?.network}</span>
                                    </div>
                                </div>

                                <div className="mt-4">
                                    <h5 className="font-semibold text-white mb-2">Contract Addresses:</h5>
                                    <div className="space-y-2 text-xs">
                                        <div>
                                            <span className="text-gray-400">Mock USDC:</span>
                                            <span className="ml-2 text-white font-mono">
                                                {debugInfo.contractConfig?.contracts?.MockUSDC}
                                            </span>
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Chess Tournament:</span>
                                            <span className="ml-2 text-white font-mono">
                                                {debugInfo.contractConfig?.contracts?.ChessTournament}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Test Results */}
                            {debugInfo.mintResult && (
                                <div className="bg-gray-800 rounded-lg p-4">
                                    <h4 className="font-semibold text-white mb-2">Test Results:</h4>
                                    <div className="text-sm">
                                        <div>
                                            <span className="text-gray-400">USDC Mint Test:</span>
                                            <span className={`ml-2 ${debugInfo.mintResult === 'Success' ? 'text-green-400' : 'text-red-400'}`}>
                                                {debugInfo.mintResult}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Troubleshooting Tips */}
                    <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
                        <h3 className="text-yellow-300 font-semibold mb-2">🔧 Troubleshooting Tips:</h3>
                        <ul className="text-yellow-200 text-sm space-y-1">
                            <li>• Make sure your wallet is connected to Sepolia testnet</li>
                            <li>• Ensure you have some Sepolia ETH for gas fees</li>
                            <li>• Check that contract addresses are correct</li>
                            <li>• Try minting USDC first if balance is 0</li>
                            <li>• Check browser console for detailed error messages</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
} 