// src/components/AutoFixButton.tsx

import React, { useState } from 'react';

interface Props {
    githubToken: string;
    owner: string;
    repo: string;
    filePath: string;
    originalCode: string;
    fixedCode: string;
    analysisId: string;
    onRefreshSuggestion?: () => void;
}

// Type for toast notifications
interface Toast {
    success: (message: string) => void;
    error: (message: string) => void;
}

// Type guard for toast
const hasToast = (window: Window): window is Window & { toast: Toast } => {
    return 'toast' in window && typeof (window as any).toast === 'object';
};

const AutoFixButton: React.FC<Props> = ({ 
    githubToken, 
    owner, 
    repo, 
    filePath, 
    originalCode, 
    fixedCode, 
    analysisId,
    onRefreshSuggestion 
}) => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<string | null>(null);
    const [showRefreshSuggestion, setShowRefreshSuggestion] = useState(false);

    const showToast = (type: 'success' | 'error', message: string) => {
        if (typeof window !== 'undefined' && hasToast(window)) {
            window.toast[type](message);
        }
    };

    const handleClick = async () => {
        if (!githubToken) {
            alert('A GitHub token is required to auto-fix. Please provide one on the main analysis page.');
            return;
        }
        
        if (!window.confirm('Are you sure you want to auto-fix this issue? This will commit directly to the default branch if you have write access!')) {
            return;
        }

        setState('loading');
        setResult(null);
        setShowRefreshSuggestion(false);

        try {
            const res = await fetch('/api/pr/fix/auto', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    githubToken, 
                    owner, 
                    repo, 
                    filePath, 
                    originalCode, 
                    fixedCode 
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }

            const data = await res.json();
            
            if (data.success) {
                setState('success');
                const successMessage = `✅ Fix applied successfully! (${data.strategy || 'Direct commit'})`;
                setResult(successMessage);
                showToast('success', successMessage);
            } else {
                setState('error');
                const errorMessage = data.message || 'An unknown error occurred.';
                setResult(errorMessage);
                
                // Enhanced error handling
                if (errorMessage.includes("Couldn't apply the fix")) {
                    setShowRefreshSuggestion(true);
                    if (onRefreshSuggestion) {
                        onRefreshSuggestion();
                    }
                    showToast('error', 'File has changed since analysis. Try refreshing the analysis.');
                } else {
                    showToast('error', errorMessage);
                }
            }
        } catch (err) {
            setState('error');
            const errorMessage = err instanceof Error ? err.message : 'Network error during auto-fix';
            setResult(errorMessage);
            showToast('error', 'Network error during auto-fix');
        }
    };

    if (state === 'success') {
        return (
            <div className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full">
                <span>✅</span>
                <span>Auto-fix applied!</span>
            </div>
        );
    }

    if (state === 'error') {
        return (
            <div className="space-y-2">
                <button
                    onClick={handleClick}
                    disabled={false}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                >
                    ❌
                    <span>Auto Fix Failed</span>
                </button>
                {result && (
                    <div className="text-xs text-red-600 max-w-xs">
                        {result}
                    </div>
                )}
                {showRefreshSuggestion && (
                    <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded text-xs">
                        <p className="text-yellow-800 mb-1">
                            💡 File may have changed since analysis. Try refreshing.
                        </p>
                        <RefreshAnalysisButton 
                            analysisId={analysisId} 
                            filePath={filePath} 
                            githubToken={githubToken}
                        />
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={state === 'loading'}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-green-600 rounded-full hover:bg-green-700 disabled:opacity-50"
        >
            {state === 'loading' ? '🔄' : '🔧'}
            <span>{state === 'loading' ? 'Applying...' : 'Auto Fix'}</span>
        </button>
    );
};

// Refresh Analysis Button Component
const RefreshAnalysisButton: React.FC<{ 
    analysisId: string; 
    filePath: string; 
    githubToken: string;
}> = ({ analysisId, filePath, githubToken }) => {
    const [refreshing, setRefreshing] = useState(false);

    const showToast = (type: 'success' | 'error', message: string) => {
        if (typeof window !== 'undefined' && hasToast(window)) {
            window.toast[type](message);
        }
    };

    const handleRefresh = async () => {
        try {
            setRefreshing(true);
            
            const response = await fetch(`/api/analyze/${analysisId}/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    filePath,
                    githubToken
                })
            });

            if (response.ok) {
                showToast('success', 'Analysis refresh started. Check back in a moment.');
                // Poll for completion
                pollForRefreshCompletion(analysisId);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Network error during refresh';
            showToast('error', errorMessage.includes('HTTP error') ? 'Failed to refresh analysis' : 'Network error during refresh');
        } finally {
            setRefreshing(false);
        }
    };

    return (
        <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
            🔄 {refreshing ? 'Refreshing...' : 'Refresh Analysis'}
        </button>
    );
};

// Polling function for refresh completion
const pollForRefreshCompletion = async (analysisId: string) => {
    const maxAttempts = 30; // 5 minutes with 10-second intervals
    let attempts = 0;

    const showToast = (type: 'success' | 'error', message: string) => {
        if (typeof window !== 'undefined' && hasToast(window)) {
            window.toast[type](message);
        }
    };

    const poll = async (): Promise<void> => {
        try {
            const response = await fetch(`/api/analyze/${analysisId}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const analysis = await response.json();
            
            if (analysis.refreshError) {
                showToast('error', `Refresh failed: ${analysis.refreshError}`);
                return;
            }
            
            if (analysis.status === 'completed') {
                showToast('success', 'Analysis refreshed successfully!');
                // Refresh your UI with new data
                window.location.reload();
                return;
            }
            
            attempts++;
            if (attempts < maxAttempts) {
                setTimeout(poll, 10000); // Poll every 10 seconds
            } else {
                showToast('error', 'Analysis refresh timed out');
            }
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error';
            showToast('error', `Error checking refresh status: ${errorMessage}`);
        }
    };

    poll();
};

export default AutoFixButton;