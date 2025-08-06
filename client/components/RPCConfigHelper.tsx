'use client'

import { useState } from 'react'

export function RPCConfigHelper() {
    const [isOpen, setIsOpen] = useState(false)
    const [selectedProvider, setSelectedProvider] = useState('public')

    const providers = {
        public: {
            name: 'Public RPC (Free)',
            url: 'https://rpc.sepolia.org',
            description: 'No API key required, but may have rate limits',
            setup: 'No setup required - ready to use!'
        },
        infura: {
            name: 'Infura (Free Tier)',
            url: 'https://sepolia.infura.io/v3/YOUR_PROJECT_ID',
            description: 'Free tier with 100,000 requests/day',
            setup: '1. Go to https://infura.io\n2. Create free account\n3. Create new project\n4. Copy Project ID\n5. Replace YOUR_PROJECT_ID in the URL'
        },
        alchemy: {
            name: 'Alchemy (Free Tier)',
            url: 'https://eth-sepolia.g.alchemy.com/v2/w5YTzXeRQZB4YgguIHj-D2yotqekW4yi',
            description: 'Free tier with 300M compute units/month',
            setup: '1. Go to https://alchemy.com\n2. Create free account\n3. Create new app\n4. Copy API Key\n5. Replace YOUR_API_KEY in the URL'
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors z-50"
            >
                🔧 RPC Config
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="bg-gray-900 border border-gray-700 max-w-2xl w-full p-8 rounded-2xl shadow-2xl relative max-h-[90vh] overflow-y-auto">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white text-2xl"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold mb-6 gradient-text-white">RPC Configuration</h2>

                <div className="space-y-6">
                    <div className="bg-yellow-600/20 border border-yellow-600/30 rounded-lg p-4">
                        <h3 className="text-yellow-300 font-semibold mb-2">⚠️ Rate Limit Issue</h3>
                        <p className="text-yellow-200 text-sm">
                            You're currently using Alchemy's demo endpoint which has strict rate limits.
                            Choose a provider below to fix this issue.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {Object.entries(providers).map(([key, provider]) => (
                            <div
                                key={key}
                                className={`border rounded-lg p-4 cursor-pointer transition-colors ${selectedProvider === key
                                    ? 'border-green-500 bg-green-500/10'
                                    : 'border-gray-600 hover:border-gray-500'
                                    }`}
                                onClick={() => setSelectedProvider(key)}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold text-white">{provider.name}</h3>
                                    {selectedProvider === key && (
                                        <span className="text-green-400 text-sm">✓ Selected</span>
                                    )}
                                </div>
                                <p className="text-gray-300 text-sm mb-2">{provider.description}</p>
                                <div className="bg-gray-800 rounded p-2 font-mono text-xs text-gray-300 mb-3">
                                    {provider.url}
                                </div>
                                <div className="text-gray-400 text-sm">
                                    <strong>Setup:</strong> {provider.setup}
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-4">
                        <h3 className="text-blue-300 font-semibold mb-2">💡 Recommendation</h3>
                        <p className="text-blue-200 text-sm">
                            For development and testing, we recommend using the <strong>Public RPC</strong>
                            as it requires no setup. For production, consider Infura or Alchemy for better reliability.
                        </p>
                    </div>

                    <div className="flex justify-end space-x-4 pt-6">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn-secondary px-6 py-3"
                        >
                            Close
                        </button>
                        <button
                            onClick={() => {
                                // Here you would implement the actual RPC URL update
                                alert(`Selected: ${providers[selectedProvider as keyof typeof providers].name}\n\nTo implement this, update the RPC URL in your configuration.`)
                                setIsOpen(false)
                            }}
                            className="btn-primary px-6 py-3"
                        >
                            Use Selected Provider
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 