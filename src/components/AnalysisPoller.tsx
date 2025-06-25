// src/components/AnalysisPoller.tsx

import React, { useEffect, useState } from 'react';
import type { AnalysisResponse } from '../types';
import Dashboard from './Dashboard';

interface Props {
    analysisId: string;
    githubToken: string;
    repositoryUrl: string;
}

const POLL_INTERVAL = 3000;

const AnalysisPoller: React.FC<Props> = ({ analysisId, githubToken, repositoryUrl }) => {
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const poll = async () => {
            try {
                const res = await fetch(`/api/analyze/${analysisId}`);
                const data: AnalysisResponse = await res.json();
                setAnalysis(data);

                if (data.status === 'completed' || data.status === 'failed') {
                    clearInterval(intervalId);
                }
            } catch (error) {
                console.error('Polling failed:', error);
                setAnalysis({ id: analysisId, status: 'failed', progress: 100, error: 'Failed to fetch analysis status.' });
                clearInterval(intervalId);
            }
        };

        poll(); // Initial fetch
        intervalId = setInterval(poll, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [analysisId]);

    if (!analysis) {
        return <div>Loading analysis status...</div>;
    }

    if (analysis.status === 'processing') {
        return (
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Analysis in Progress</h2>
                <p className="text-gray-600 mb-6">Your repository is being analyzed. This may take a few minutes.</p>
                <div className="w-full bg-gray-200 rounded-full h-4">
                    <div
                        className="bg-indigo-600 h-4 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.progress}%` }}
                    ></div>
                </div>
                <p className="mt-4 text-sm font-medium">{analysis.progress}% Complete</p>
            </div>
        );
    }

    if (analysis.status === 'failed') {
        return (
            <div className="bg-red-50 border-l-4 border-red-400 text-red-700 p-4 rounded-md" role="alert">
                <p className="font-bold">Analysis Failed</p>
                <p>{analysis.error || 'An unknown error occurred.'}</p>
            </div>
        );
    }

    if (analysis.status === 'completed' && analysis.results) {
        return <Dashboard report={analysis.results} analysisId={analysisId} githubToken={githubToken} repositoryUrl={repositoryUrl} />;
    }
    return <div>Something went wrong.</div>;
};

export default AnalysisPoller;