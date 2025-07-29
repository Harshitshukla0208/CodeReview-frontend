// src/App.tsx

import { useState } from 'react';
import RepoForm from './components/RepoForm';
import AnalysisPoller from './components/AnalysisPoller';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import UserProfile from './components/UserProfile';
import { ToastProvider } from './components/Toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { FaUser, FaSignOutAlt } from 'react-icons/fa';

function AppContent() {
    const [showLanding, setShowLanding] = useState(true);
    const [analysisId, setAnalysisId] = useState<string | null>(null);
    const [repoUrl, setRepoUrl] = useState<string>('');
    const [showProfile, setShowProfile] = useState(false);
    const { user, loading, signOut } = useAuth();

    const handleAnalysisStart = (id: string, url: string) => {
        setAnalysisId(id);
        setRepoUrl(url);
    };

    // Show loading while auth is initializing
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    // Show login if not authenticated
    if (!user) {
        return <Login />;
    }

    // Show landing page if user hasn't started
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
                        <div className="flex items-center justify-between">
                            <h1 className="text-3xl font-bold leading-tight text-gray-900">
                                Repo Analysis
                            </h1>
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setShowProfile(!showProfile)}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <FaUser />
                                    <span>Profile</span>
                                </button>
                                <button
                                    onClick={signOut}
                                    className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md transition-colors"
                                >
                                    <FaSignOutAlt />
                                    <span>Sign Out</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </header>
                
                <main className="py-8">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                        {showProfile ? (
                            <div className="max-w-2xl mx-auto">
                                <UserProfile />
                            </div>
                        ) : !analysisId ? (
                            <RepoForm onAnalysisStart={handleAnalysisStart} />
                        ) : (
                            <AnalysisPoller 
                                analysisId={analysisId} 
                                repositoryUrl={repoUrl} 
                            />
                        )}
                    </div>
                </main>
            </div>
        </ToastProvider>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;