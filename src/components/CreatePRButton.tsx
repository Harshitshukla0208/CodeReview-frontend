// src/components/CreatePRButton.tsx

import React, { useState } from 'react';

interface Props {
    githubToken: string;
    prBody: {
        analysisId: string;
        issueType: 'code' | 'github';
        issueIdentifier: string;
        filePath?: string;
        originalCode?: string;
    };
}

const CreatePRButton: React.FC<Props> = ({ githubToken, prBody }) => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [result, setResult] = useState<string | null>(null);

    const handleClick = async () => {
        if (!githubToken) {
            if (typeof window !== 'undefined' && (window as any).toast) {
                (window as any).toast.error('A GitHub token is required to create a Pull Request. Please provide one on the main analysis page.');
            } else {
                alert('A GitHub token is required to create a Pull Request. Please provide one on the main analysis page.');
            }
            return;
        }

        setState('loading');
        setResult(null);

        try {
            const res = await fetch('/api/pr/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...prBody, githubToken }),
            });
            const data = await res.json();
            
            if (res.ok && data.prUrl) {
                setState('success');
                setResult(data.prUrl);
                if (typeof window !== 'undefined' && (window as any).toast) {
                    (window as any).toast.success('✅ Pull Request created successfully!');
                }
            } else {
                setState('error');
                const errorMessage = data.message || 'An unknown error occurred.';
                setResult(errorMessage);
                if (typeof window !== 'undefined' && (window as any).toast) {
                    (window as any).toast.error(errorMessage);
                }
            }
        } catch (err: any) {
            setState('error');
            const errorMessage = err.message || 'Network error during PR creation';
            setResult(errorMessage);
            if (typeof window !== 'undefined' && (window as any).toast) {
                (window as any).toast.error('Network error during PR creation');
            }
        }
    };

    if (state === 'success') {
        return (
            <a 
                href={result!} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-green-700 bg-green-100 rounded-full hover:bg-green-200"
            >
                ✅ PR Created! View &rarr;
            </a>
        );
    }

    if (state === 'error') {
        return (
            <div className="space-y-2">
                <button
                    onClick={handleClick}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                >
                    ❌
                    <span>Create PR Failed - Retry</span>
                </button>
                {result && (
                    <div className="text-xs text-red-600 max-w-xs">
                        {result}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleClick}
            disabled={state === 'loading'}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
            {state === 'loading' ? '🔄' : '📝'}
            <span>{state === 'loading' ? 'Creating...' : 'Create PR'}</span>
        </button>
    );
};

export default CreatePRButton;
