interface Window {
    ethereum?: {
        request: (args: { method: string; params?: any[] }) => Promise<any>;
        on: (eventName: string, handler: (...args: any[]) => void) => void;
        removeAllListeners: () => void;
        isMetaMask?: boolean;
    };
}

declare global {
    interface Window {
        ethereum?: {
            request: (args: { method: string; params?: any[] }) => Promise<any>;
            on: (eventName: string, handler: (...args: any[]) => void) => void;
            removeAllListeners: () => void;
            isMetaMask?: boolean;
        };
    }
}

export { }; 