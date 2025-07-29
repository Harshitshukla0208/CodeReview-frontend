// src/components/AnalysisPoller.tsx

import React, { useEffect, useState } from 'react';
import type { AnalysisResponse } from '../types';
import Dashboard from './Dashboard';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { useGitHubToken } from '../hooks/useGitHubToken';

interface Props {
    analysisId: string;
    repositoryUrl: string;
}

const POLL_INTERVAL = 3000;
const MAX_RETRIES = 3;

const AnalysisPoller: React.FC<Props> = ({ analysisId, repositoryUrl }) => {
    const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
    const [apiRetries, setApiRetries] = useState(0);
    const { user } = useAuth();
    const { token: githubToken } = useGitHubToken();

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        const poll = async () => {
            try {
                // First check our database for the latest status
                const { data: dbAnalysis, error: dbError } = await supabase
                    .from('analyses')
                    .select('*')
                    .eq('id', analysisId)
                    .limit(1);

                if (dbError) {
                    console.error('Database error:', dbError);
                }

                // Get the first (and should be only) result
                const analysisRecord = dbAnalysis && dbAnalysis.length > 0 ? dbAnalysis[0] : null;

                // Try to get real-time status from API
                let apiData: AnalysisResponse | null = null;
                try {
                    const res = await fetch(`/api/analyze/${analysisId}`);
                    if (res.ok) {
                        apiData = await res.json();
                        setApiRetries(0); // Reset retry counter on successful API call
                    } else {
                        console.warn(`API returned ${res.status}: ${res.statusText}`);
                    }
                } catch (apiError) {
                    console.warn('API call failed:', apiError);
                    setApiRetries(prev => prev + 1);
                }
                
                // Combine database and API data, prioritizing API data when available
                const combinedData: AnalysisResponse = {
                    id: analysisId,
                    status: apiData?.status || analysisRecord?.status || 'processing',
                    progress: apiData?.progress || analysisRecord?.progress || 0,
                    results: apiData?.results || analysisRecord?.results,
                    error: apiData?.error || analysisRecord?.error
                };

                setAnalysis(combinedData);

                // Always update database with the latest status
                // This ensures persistence even if API is temporarily unavailable
                const shouldUpdateDb = 
                    apiData && (
                        apiData.status !== analysisRecord?.status || 
                        apiData.progress !== analysisRecord?.progress ||
                        apiData.results !== analysisRecord?.results ||
                        apiData.error !== analysisRecord?.error
                    );

                if (shouldUpdateDb && apiData) {
                    try {
                        if (analysisRecord) {
                            // Update existing record
                            await supabase
                                .from('analyses')
                                .update({
                                    status: apiData.status,
                                    progress: apiData.progress,
                                    results: apiData.results,
                                    error: apiData.error,
                                    updated_at: new Date().toISOString()
                                })
                                .eq('id', analysisId);
                        } else {
                            // Create new record if it doesn't exist
                            await supabase
                                .from('analyses')
                                .upsert({
                                    id: analysisId,
                                    user_id: user?.id,
                                    repository_url: repositoryUrl,
                                    status: apiData.status,
                                    progress: apiData.progress,
                                    results: apiData.results,
                                    error: apiData.error,
                                    created_at: new Date().toISOString(),
                                    updated_at: new Date().toISOString()
                                }, {
                                    onConflict: 'id'
                                });
                        }
                        console.log(`Updated analysis ${analysisId} in database: ${apiData.status} (${apiData.progress}%)`);
                    } catch (dbUpdateError) {
                        console.error('Failed to update database:', dbUpdateError);
                    }
                }

                // Stop polling if analysis is complete or failed
                if (combinedData.status === 'completed' || combinedData.status === 'failed') {
                    console.log(`Analysis ${analysisId} finished with status: ${combinedData.status}`);
                    clearInterval(intervalId);
                }

                // Stop polling if API has been failing for too long
                if (apiRetries >= MAX_RETRIES && !analysisRecord) {
                    console.error(`API failed ${MAX_RETRIES} times and no database record exists. Stopping poll.`);
                    setAnalysis({ 
                        id: analysisId, 
                        status: 'failed', 
                        progress: 100, 
                        error: 'Unable to fetch analysis status after multiple attempts.' 
                    });
                    clearInterval(intervalId);
                }

            } catch (error) {
                console.error('Polling failed:', error);
                // Don't immediately fail, try to get status from database
                try {
                    const { data: dbAnalysis } = await supabase
                        .from('analyses')
                        .select('*')
                        .eq('id', analysisId)
                        .limit(1);

                    if (dbAnalysis && dbAnalysis.length > 0) {
                        const record = dbAnalysis[0];
                        setAnalysis({
                            id: analysisId,
                            status: record.status,
                            progress: record.progress,
                            results: record.results,
                            error: record.error
                        });
                    } else {
                        setAnalysis({ 
                            id: analysisId, 
                            status: 'failed', 
                            progress: 100, 
                            error: 'Failed to fetch analysis status.' 
                        });
                        clearInterval(intervalId);
                    }
                } catch (dbError) {
                    console.error('Database fallback also failed:', dbError);
                    setAnalysis({ 
                        id: analysisId, 
                        status: 'failed', 
                        progress: 100, 
                        error: 'Failed to fetch analysis status.' 
                    });
                    clearInterval(intervalId);
                }
            }
        };

        poll(); // Initial fetch
        intervalId = setInterval(poll, POLL_INTERVAL);

        return () => clearInterval(intervalId);
    }, [analysisId, apiRetries]);

    if (!analysis) {
        return (
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-2xl mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading analysis status...</p>
            </div>
        );
    }

    if (analysis.status === 'processing') {
        return (
            <div className="bg-white shadow-lg rounded-lg p-8 text-center max-w-2xl mx-auto">
                <h2 className="text-2xl font-bold mb-4">Analysis in Progress</h2>
                <p className="text-gray-600 mb-6">
                    Your repository is being analyzed. This may take a few minutes.
                    {apiRetries > 0 && (
                        <span className="block text-sm text-yellow-600 mt-2">
                            ⚠️ API temporarily unavailable, using cached data
                        </span>
                    )}
                </p>
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
        return (
            <Dashboard 
                report={analysis.results} 
                analysisId={analysisId} 
                githubToken={githubToken} 
                repositoryUrl={repositoryUrl} 
            />
        );
    }
    
    return (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-700 p-4 rounded-md">
            <p className="font-bold">Something went wrong</p>
            <p>Unable to load analysis results.</p>
        </div>
    );
};

export default AnalysisPoller;