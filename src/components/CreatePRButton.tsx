// src/components/CreatePRButton.tsx

import React, { useState } from 'react';
import { api } from "../lib/api"

interface Props {
    githubToken: string;
    prBody: {
        analysisId: string;
        issueType: 'code' | 'github';
        issueIdentifier: string;
        filePath?: string;
        originalCode?: string;
        repositoryUrl?: string;
        issues?: any[];
    };
}

const CreatePRButton: React.FC<Props> = ({ githubToken, prBody }) => {
    const [state, setState] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [error, setError] = useState<string | null>(null);
    const [prUrl, setPrUrl] = useState<string | null>(null);

    // Simple toast function - you can replace this with your actual toast system
    const showToast = (type: 'success' | 'error', message: string) => {
        if (type === 'success') {
            alert(`✅ ${message}`);
        } else {
            alert(`❌ ${message}`);
        }
    };

    const handleCreatePR = async () => {
        if (!prBody.analysisId || !githubToken) {
            showToast('error', 'GitHub token required to create PR')
            return
        }

        setState('loading')
        setError(null)

        try {
            const res = await api.createPR({
                analysis_id: prBody.analysisId,
                repository_url: prBody.repositoryUrl || '',
                github_token: githubToken,
                issues: prBody.issues || []
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || `HTTP error! status: ${res.status}`)
            }

            const result = await res.json()
            setPrUrl(result.prUrl || result.url || '')
            setState('success')
            showToast('success', 'Pull Request created successfully!')
            
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
            showToast('error', errorMessage.includes('HTTP error') ? 'Failed to create PR' : 'Network error during PR creation')
            setError(errorMessage)
            setState('error')
        }
    }

    if (state === 'success') {
        return (
            <a 
                href={prUrl || '#'} 
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
                    onClick={handleCreatePR}
                    className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200"
                >
                    ❌
                    <span>Create PR Failed - Retry</span>
                </button>
                {error && (
                    <div className="text-xs text-red-600 max-w-xs">
                        {error}
                    </div>
                )}
            </div>
        );
    }

    return (
        <button
            onClick={handleCreatePR}
            disabled={state === 'loading'}
            className="inline-flex items-center gap-2 px-3 py-1 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 disabled:opacity-50"
        >
            {state === 'loading' ? '🔄' : '📝'}
            <span>{state === 'loading' ? 'Creating...' : 'Create PR'}</span>
        </button>
    );
};

export default CreatePRButton;
