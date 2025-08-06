'use client'

import { useState } from 'react'
import { useContract } from '../contexts/ContractContext'

export function TestIntegration() {
    const [testResult, setTestResult] = useState<string>('')
    const [isTesting, setIsTesting] = useState(false)
    const { isInitialized, getUSDCBalance, mintUSDC } = useContract()

    const runTest = async () => {
        setIsTesting(true)
        setTestResult('Running tests...')

        try {
            // Test 1: Check if contracts are initialized
            if (!isInitialized) {
                setTestResult('❌ Contracts not initialized. Please connect your wallet first.')
                return
            }

            // Test 2: Check USDC balance
            const balance = await getUSDCBalance('0x0000000000000000000000000000000000000000')
            setTestResult(`✅ Contracts initialized. USDC Balance: ${balance}`)

            // Test 3: Try to mint USDC (this will fail if not owner, but we can test the connection)
            try {
                await mintUSDC(1000)
                setTestResult(prev => prev + '\n✅ USDC minting test passed')
            } catch (error) {
                setTestResult(prev => prev + '\n⚠️ USDC minting failed (expected if not owner)')
            }

        } catch (error) {
            setTestResult(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
        } finally {
            setIsTesting(false)
        }
    }

    return (
        <div className="fixed bottom-4 left-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors z-50">
            <button
                onClick={runTest}
                disabled={isTesting}
                className="flex items-center space-x-2"
            >
                <span>🧪</span>
                <span>{isTesting ? 'Testing...' : 'Test Integration'}</span>
            </button>

            {testResult && (
                <div className="absolute bottom-full left-0 mb-2 p-3 bg-gray-800 text-white rounded-lg text-xs max-w-xs">
                    <pre className="whitespace-pre-wrap">{testResult}</pre>
                </div>
            )}
        </div>
    )
} 