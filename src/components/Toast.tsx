import React, { useState, useEffect } from 'react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
    message: string;
    type: ToastType;
    onClose: () => void;
    duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const getToastStyles = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500 text-white';
            case 'error':
                return 'bg-red-500 text-white';
            case 'warning':
                return 'bg-yellow-500 text-black';
            case 'info':
                return 'bg-blue-500 text-white';
            default:
                return 'bg-gray-500 text-white';
        }
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✅';
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '💬';
        }
    };

    return (
        <div className={`fixed top-4 right-4 z-50 max-w-sm w-full ${getToastStyles()} rounded-lg shadow-lg p-4 transform transition-all duration-300 ease-in-out`}>
            <div className="flex items-center justify-between">
                <div className="flex items-center">
                    <span className="mr-2">{getIcon()}</span>
                    <span className="text-sm font-medium">{message}</span>
                </div>
                <button
                    onClick={onClose}
                    className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                >
                    ✕
                </button>
            </div>
        </div>
    );
};

interface ToastContextType {
    showToast: (message: string, type: ToastType) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([]);

    const showToast = (message: string, type: ToastType) => {
        const id = Date.now();
        setToasts(prev => [...prev, { id, message, type }]);
    };

    const removeToast = (id: number) => {
        setToasts(prev => prev.filter(toast => toast.id !== id));
    };

    // Add toast to window object for global access
    useEffect(() => {
        if (typeof window !== 'undefined') {
            (window as any).toast = {
                success: (message: string) => showToast(message, 'success'),
                error: (message: string) => showToast(message, 'error'),
                warning: (message: string) => showToast(message, 'warning'),
                info: (message: string) => showToast(message, 'info'),
            };
        }
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            <div className="fixed top-4 right-4 z-50 space-y-2">
                {toasts.map(toast => (
                    <Toast
                        key={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>
        </ToastContext.Provider>
    );
};

export const useToast = () => {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error('useToast must be used within a ToastProvider');
    }
    return context;
};

export default Toast; 