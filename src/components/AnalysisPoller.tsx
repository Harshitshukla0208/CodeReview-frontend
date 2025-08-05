"use client"

import type React from "react"
import { useEffect, useState, useCallback } from "react"
import { motion } from "framer-motion"
import { FaSpinner, FaExclamationTriangle, FaRocket, FaArrowLeft } from "react-icons/fa"
import type { AnalysisResponse } from "../types"
import Dashboard from "./Dashboard"
import { useGitHubToken } from "../hooks/useGitHubToken"

interface Props {
  analysisId: string
  repositoryUrl: string
  onBack: () => void
}

const POLL_INTERVAL = 2000
const MAX_POLL_ATTEMPTS = 150 // 5 minutes max

const AnalysisPoller: React.FC<Props> = ({ analysisId, repositoryUrl, onBack }) => {
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null)
  const [pollAttempts, setPollAttempts] = useState(0)
  const [isPolling, setIsPolling] = useState(true)
  const { token: githubToken } = useGitHubToken()

  const pollAnalysis = useCallback(async () => {
    if (!isPolling || pollAttempts >= MAX_POLL_ATTEMPTS) {
      setIsPolling(false)
      return
    }

    try {
      const apiResponse = await fetch(`/api/analyze/${analysisId}`)

      if (apiResponse.ok) {
        const apiData = await apiResponse.json()
        setAnalysis(apiData)

        // Stop polling if completed or failed
        if (apiData.status === "completed" || apiData.status === "failed") {
          setIsPolling(false)
        }
      } else {
        console.warn(`API returned ${apiResponse.status}: ${apiResponse.statusText}`)
        setPollAttempts((prev) => prev + 1)
      }
    } catch (error) {
      console.error("Polling error:", error)
      setPollAttempts((prev) => prev + 1)
    }
  }, [analysisId, isPolling, pollAttempts])

  useEffect(() => {
    let intervalId: NodeJS.Timeout

    if (isPolling) {
      // Initial poll
      pollAnalysis()

      // Set up interval
      intervalId = setInterval(pollAnalysis, POLL_INTERVAL)
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    }
  }, [pollAnalysis, isPolling])

  // Handle max attempts reached
  useEffect(() => {
    if (pollAttempts >= MAX_POLL_ATTEMPTS && isPolling) {
      setAnalysis({
        id: analysisId,
        status: "failed",
        progress: 100,
        error: "Analysis timed out after 5 minutes",
      })
      setIsPolling(false)
    }
  }, [pollAttempts, isPolling, analysisId])

  const getRepositoryName = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.substring(1)
    } catch {
      return url
    }
  }

  // Back button for all states
  const BackButton = () => (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onClick={onBack}
      className="mb-3 flex items-center space-x-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors duration-100 text-sm"
    >
      <FaArrowLeft className="w-3 h-3" />
      <span>Back to Analysis</span>
    </motion.button>
  )

  if (!analysis) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
            <FaSpinner className="w-5 h-5 sm:w-6 sm:h-6 text-white animate-spin" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Loading Analysis</h2>
          <p className="text-sm sm:text-base text-gray-600">Fetching analysis status...</p>
        </motion.div>
      </div>
    )
  }

  if (analysis.status === "processing") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sm:p-8 text-center"
        >
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
            <FaRocket className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
            Analyzing {getRepositoryName(repositoryUrl)}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 max-w-2xl mx-auto">
            Our AI is examining your code for bugs, security issues, and optimization opportunities.
          </p>

          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-4 sm:mb-5">
            <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-2">
              <span>Progress</span>
              <span>{analysis.progress || 0}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${analysis.progress || 0}%` }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                className="bg-indigo-600 h-2 rounded-full"
              />
            </div>
          </div>

          {/* <p className="text-xs sm:text-sm text-gray-500">
            Attempt {pollAttempts} of {MAX_POLL_ATTEMPTS} •{" "}
            {Math.ceil(((MAX_POLL_ATTEMPTS - pollAttempts) * POLL_INTERVAL) / 1000)}s remaining
          </p> */}
        </motion.div>
      </div>
    )
  }

  if (analysis.status === "failed") {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className="bg-white rounded-xl shadow-lg border border-red-200 p-6 sm:p-8 text-center"
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-red-100 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
            <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-red-600" />
          </div>
          <h2 className="text-lg sm:text-xl font-bold text-red-900 mb-2 sm:mb-3">Analysis Failed</h2>
          <p className="text-sm sm:text-base text-red-700 mb-4 sm:mb-5">
            {analysis.error || "An unknown error occurred during analysis."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors duration-100 text-sm"
            >
              Retry Analysis
            </button>
            <button
              onClick={onBack}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors duration-100 text-sm"
            >
              Start New Analysis
            </button>
          </div>
        </motion.div>
      </div>
    )
  }

  if (analysis.status === "completed" && analysis.results) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <BackButton />
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
        >
          <Dashboard
            report={analysis.results}
            analysisId={analysisId}
            githubToken={githubToken}
            repositoryUrl={repositoryUrl}
          />
        </motion.div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6">
      <BackButton />
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="bg-white rounded-xl shadow-lg border border-yellow-200 p-6 sm:p-8 text-center"
      >
        <div className="w-12 h-12 sm:w-14 sm:h-14 bg-yellow-100 rounded-xl flex items-center justify-center mx-auto mb-4 sm:mb-5">
          <FaExclamationTriangle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
        </div>
        <h2 className="text-lg sm:text-xl font-bold text-yellow-900 mb-2 sm:mb-3">Unexpected Status</h2>
        <p className="text-sm sm:text-base text-yellow-700 mb-4 sm:mb-5">Status: {analysis.status}</p>
        <button
          onClick={onBack}
          className="px-4 py-2 bg-yellow-600 text-white rounded-lg font-semibold hover:bg-yellow-700 transition-colors duration-100 text-sm"
        >
          Go Back
        </button>
      </motion.div>
    </div>
  )
}

export default AnalysisPoller
