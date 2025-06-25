// src/App.tsx

import { useState } from 'react';
import RepoForm from './components/RepoForm';
import AnalysisPoller from './components/AnalysisPoller';
import LandingPage from './components/LandingPage';
import { ToastProvider } from './components/Toast';

function App() {
    const [showLanding, setShowLanding] = useState(true);
    const [analysisId, setAnalysisId] = useState<string | null>(null);
    const [githubToken, setGithubToken] = useState<string>('');
    const [repoUrl, setRepoUrl] = useState<string>('');

    const handleAnalysisStart = (id: string, url: string) => {
        setAnalysisId(id);
        setRepoUrl(url);
    };

    if (showLanding) {
        return (
            <ToastProvider>
                <LandingPage onGetStarted={() => setShowLanding(false)} />
            </ToastProvider>
        );
    }

    return (
        <ToastProvider>
            <div className="min-h-screen bg-gray-100 text-gray-800 font-sans">
                <header className="bg-white shadow-md">
                    <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
                        <h1 className="text-3xl font-bold leading-tight text-gray-900">
                            AI Code Review & Analysis
                        </h1>
                    </div>
                </header>
                <main className="py-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {!analysisId ? (
                            <RepoForm
                                onAnalysisStart={handleAnalysisStart}
                                githubToken={githubToken}
                                setGithubToken={setGithubToken}
                            />
                        ) : (
                            <AnalysisPoller analysisId={analysisId} githubToken={githubToken} repositoryUrl={repoUrl} />
                        )}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}

export default App;