interface Window {
    ethereum?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (eventName: string, handler: (...args: any[]) => void) => void;
        removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
        off: (eventName: string, callback: (...args: any[]) => void) => void;
        removeAllListeners: (eventName?: string) => void;
        isMetaMask?: boolean;
        isConnected: () => boolean;
        selectedAddress: string | null;
    };
}

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (eventName: string, handler: (...args: any[]) => void) => void;
            removeListener: (eventName: string, callback: (...args: any[]) => void) => void;
            off: (eventName: string, callback: (...args: any[]) => void) => void;
            removeAllListeners: (eventName?: string) => void;
            isMetaMask?: boolean;
            isConnected: () => boolean;
            selectedAddress: string | null;
        };
    }
}

export { }; 