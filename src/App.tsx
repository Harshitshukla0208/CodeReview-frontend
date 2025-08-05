"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import RepoForm from "./components/RepoForm"
import AnalysisPoller from "./components/AnalysisPoller"
import LandingPage from "./components/LandingPage"
import AuthModal from "./components/AuthModal"
import { ToastProvider } from "./components/Toast"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import { FaSignOutAlt, FaCode, FaUser } from "react-icons/fa"

type AppView = "landing" | "analyze" | "analysis"

interface AnalysisState {
  id: string
  repoUrl: string
}

function AppContent() {
  const [currentView, setCurrentView] = useState<AppView>("landing")
  const [analysisState, setAnalysisState] = useState<AnalysisState | null>(null)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, loading, signOut } = useAuth()

  const handleGetStarted = () => {
    if (!user) {
      setShowAuthModal(true)
    } else {
      setCurrentView("analyze")
    }
  }

  const handleAnalysisStart = (id: string, url: string) => {
    setAnalysisState({ id, repoUrl: url })
    setCurrentView("analysis")
  }

  const handleBackToAnalyze = () => {
    setAnalysisState(null)
    setCurrentView("analyze")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.15 }}
          className="text-center"
        >
          <div className="w-12 h-12 sm:w-16 sm:h-16 bg-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
            <FaCode className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse" />
          </div>
          <p className="text-base sm:text-lg text-gray-600">Loading CodeLens...</p>
        </motion.div>
      </div>
    )
  }

  if (currentView === "landing") {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} />
        <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <motion.nav
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="bg-white border-b border-gray-200 sticky top-0 z-40 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <motion.div
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.1 }}
              onClick={() => setCurrentView("landing")}
              className="flex items-center space-x-2 sm:space-x-3 cursor-pointer"
            >
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
                <FaCode className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
              </div>
              <span className="text-lg sm:text-2xl font-bold text-gray-900">CodeLens</span>
            </motion.div>

            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 py-1 sm:py-2 bg-gray-100 rounded-lg">
                <FaUser className="w-3 h-3 sm:w-4 sm:h-4 text-gray-600" />
                <span className="text-xs sm:text-sm text-gray-700 truncate max-w-32 sm:max-w-none">{user.email}</span>
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
                onClick={signOut}
                className="px-3 py-2 sm:px-4 sm:py-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-xl font-medium transition-all duration-100 flex items-center space-x-1 sm:space-x-2 text-xs sm:text-sm"
              >
                <FaSignOutAlt className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </motion.button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Main Content */}
      <main className="py-4 sm:py-8">
        <AnimatePresence mode="wait">
          {currentView === "analyze" && (
            <motion.div
              key="analyze"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <RepoForm onAnalysisStart={handleAnalysisStart} />
            </motion.div>
          )}

          {currentView === "analysis" && analysisState && (
            <motion.div
              key="analysis"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <AnalysisPoller
                analysisId={analysisState.id}
                repositoryUrl={analysisState.repoUrl}
                onBack={handleBackToAnalyze}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <AppContent />
      </ToastProvider>
    </AuthProvider>
  )
}

export default App
