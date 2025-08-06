'use client'

import { useState } from 'react'
import { saveDeploymentConfig, loadDeploymentConfig, DeploymentConfig } from '../lib/config'

export function DeploymentHelper() {
    const [isOpen, setIsOpen] = useState(false)
    const [config, setConfig] = useState<DeploymentConfig>(loadDeploymentConfig())
    const [message, setMessage] = useState('')

    const handleSave = () => {
        try {
            saveDeploymentConfig(config)
            setMessage('Configuration saved successfully! Please refresh the page.')
            setTimeout(() => setMessage(''), 3000)
        } catch (error) {
            setMessage('Error saving configuration')
            setTimeout(() => setMessage(''), 3000)
        }
    }

    const handleInputChange = (field: keyof DeploymentConfig['contracts'], value: string) => {
        setConfig(prev => ({
            ...prev,
            contracts: {
                ...prev.contracts,
                [field]: value
            }
        }))
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-4 right-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors z-50"
            >
                ⚙️ Config
            </button>
        )
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="glass-strong max-w-md w-full p-6 rounded-2xl shadow-2xl relative">
                <button
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-white/60 hover:text-white text-xl"
                >
                    ✕
                </button>

                <h2 className="text-xl font-bold mb-4 gradient-text-white">Sepolia Testnet Configuration</h2>

                {message && (
                    <div className={`mb-4 p-3 rounded-lg text-sm ${message.includes('Error') ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Network</label>
                        <input
                            type="text"
                            value={config.network}
                            disabled
                            className="input-field bg-gray-700/50 cursor-not-allowed"
                        />
                        <p className="text-xs text-white/60 mt-1">Sepolia testnet is required</p>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Chess Tournament Address</label>
                        <input
                            type="text"
                            value={config.contracts.ChessTournament}
                            onChange={(e) => handleInputChange('ChessTournament', e.target.value)}
                            className="input-field"
                            placeholder="0x..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-white/90 mb-2">Mock USDC Address</label>
                        <input
                            type="text"
                            value={config.contracts.MockUSDC}
                            onChange={(e) => handleInputChange('MockUSDC', e.target.value)}
                            className="input-field"
                            placeholder="0x..."
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            onClick={() => setIsOpen(false)}
                            className="btn-secondary px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="btn-primary px-4 py-2"
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
} 