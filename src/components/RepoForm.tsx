// src/components/RepoForm.tsx

import React, { useState } from 'react';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

interface RepoFormProps {
    onAnalysisStart: (id: string, repoUrl: string) => void;
    githubToken: string;
    setGithubToken: (token: string) => void;
}

const RepoForm: React.FC<RepoFormProps> = ({ onAnalysisStart, githubToken, setGithubToken }) => {
    const [repoUrl, setRepoUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    repositoryUrl: repoUrl,
                    includeGitHubIssues: true,
                    githubToken: githubToken || undefined,
                }),
            });

            const data = await res.json();
            if (res.ok && data.analysisId) {
                onAnalysisStart(data.analysisId, repoUrl);
            } else {
                setError(data.error || 'Failed to start analysis.');
            }
        } catch (err) {
            setError('A network error occurred. Is the server running?');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Analyze a Repository</h2>
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
                        GitHub Token
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