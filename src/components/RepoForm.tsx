// src/components/RepoForm.tsx

import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';
import { useGitHubToken } from '../hooks/useGitHubToken';
import { supabase } from '../lib/supabase';
import GitHubRepoSelector from './GitHubRepoSelector';

interface RepoFormProps {
    onAnalysisStart: (id: string, repoUrl: string) => void;
}

const RepoForm: React.FC<RepoFormProps> = ({ onAnalysisStart }) => {
    const { user, session } = useAuth();
    const { token: githubToken, setToken: setGithubToken, loading: tokenLoading } = useGitHubToken();
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showRepoSelector, setShowRepoSelector] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Store analysis in Supabase
            const { data: analysisData, error: dbError } = await supabase
                .from('analyses')
                .insert({
                    user_id: user?.id,
                    repository_url: repoUrl,
                    github_token: githubToken || null,
                    status: 'processing',
                    progress: 0,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (dbError) {
                throw new Error(`Database error: ${dbError.message}`);
            }

            console.log(`Created analysis record in database: ${analysisData.id}`);

            // Call the analysis API
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repositoryUrl: repoUrl,
                    includeGitHubIssues: true,
                    githubToken: githubToken || undefined,
                    analysisId: analysisData.id, // Pass the database ID
                }),
            });

            const data = await res.json();
            if (res.ok && data.analysisId) {
                console.log(`Analysis started successfully: ${data.analysisId}`);
                onAnalysisStart(data.analysisId, repoUrl);
            } else {
                // Update analysis status to failed
                await supabase
                    .from('analyses')
                    .update({ 
                        status: 'failed', 
                        error: data.error || 'Failed to start analysis',
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', analysisData.id);

                setError(data.error || 'Failed to start analysis.');
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : 'A network error occurred. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    const handleRepoSelect = (selectedRepoUrl: string) => {
        setRepoUrl(selectedRepoUrl);
        setShowRepoSelector(false);
    };

    if (tokenLoading) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading...</p>
            </div>
        );
    }

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Analyze a Repository</h2>
            
            {user && session?.provider_refresh_token && (
                <div className="mb-6">
                    <button
                        type="button"
                        onClick={() => setShowRepoSelector(!showRepoSelector)}
                        className="w-full bg-gray-100 text-gray-700 px-4 py-3 rounded-md hover:bg-gray-200 transition-colors mb-4"
                    >
                        {showRepoSelector ? 'Hide' : 'Select from your GitHub repositories'}
                    </button>
                    
                    {showRepoSelector && (
                        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <GitHubRepoSelector onRepoSelect={handleRepoSelect} />
                        </div>
                    )}
                </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                <div>
                    <label htmlFor="repoUrl" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Repository URL
                    </label>
                    <input
                        id="repoUrl"
                        type="url"
                        className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="https://github.com/owner/repo"
                        value={repoUrl}
                        onChange={(e) => setRepoUrl(e.target.value)}
                        required
                    />
                </div>
                
                <div>
                    <label htmlFor="githubToken" className="block text-sm font-medium text-gray-700 mb-1">
                        GitHub Token {user && session?.provider_refresh_token && '(Optional if using GitHub auth)'}
                    </label>
                    <input
                        id="githubToken"
                        type="password"
                        className="block w-full border-gray-300 rounded-md shadow-sm p-2"
                        placeholder="ghp_..."
                        value={githubToken}
                        onChange={(e) => setGithubToken(e.target.value)}
                    />
                    <div className="mt-2 text-sm bg-blue-50 text-blue-700 p-3 rounded-md flex gap-2">
                        <InformationCircleIcon className="h-5 w-5 flex-shrink-0 mt-0.5" />
                        <div>
                            To use the <strong>Auto-PR</strong> feature, a Personal Access Token with the
                            <code className="bg-blue-200 text-blue-900 rounded px-1 py-0.5 mx-1 font-mono text-xs">repo</code>
                            scope is required.
                            <a href="https://github.com/settings/tokens/new?scopes=repo&description=AI%20Code%20Review" target="_blank" rel="noopener noreferrer" className="font-bold hover:underline ml-1">
                                Create one here.
                            </a>
                        </div>
                    </div>
                </div>
                
                <button
                    type="submit"
                    className="w-full bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300 transition-colors"
                    disabled={loading}
                >
                    {loading ? 'Submitting...' : 'Analyze Now'}
                </button>
                
                {error && <div className="text-red-600 bg-red-50 p-3 rounded-md text-center">{error}</div>}
            </form>
        </div>
    );
};

export default RepoForm;