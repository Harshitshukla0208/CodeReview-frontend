"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  FaHistory,
  FaGithub,
  FaCheckCircle,
  FaSpinner,
  FaExclamationTriangle,
  FaClock,
  FaEye,
  FaTrash,
} from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import type { DatabaseAnalysis } from "../types"

interface AnalysisHistoryProps {
  onAnalysisSelect: (analysisId: string, repoUrl: string) => void
}

const AnalysisHistory: React.FC<AnalysisHistoryProps> = ({ onAnalysisSelect }) => {
  const { user } = useAuth()
  const [analyses, setAnalyses] = useState<DatabaseAnalysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadAnalyses()
    }
  }, [user])

  const loadAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("*")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error loading analyses:", error)
      } else {
        setAnalyses(data || [])
      }
    } catch (error) {
      console.error("Error loading analyses:", error)
    } finally {
      setLoading(false)
    }
  }

  const deleteAnalysis = async (analysisId: string) => {
    if (!confirm("Are you sure you want to delete this analysis?")) return

    try {
      const { error } = await supabase.from("analyses").delete().eq("id", analysisId)

      if (error) {
        console.error("Error deleting analysis:", error)
      } else {
        setAnalyses((prev) => prev.filter((a) => a.id !== analysisId))
      }
    } catch (error) {
      console.error("Error deleting analysis:", error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />
      case "processing":
        return <FaSpinner className="w-4 h-4 text-indigo-500 animate-spin" />
      case "failed":
        return <FaExclamationTriangle className="w-4 h-4 text-red-500" />
      default:
        return <FaClock className="w-4 h-4 text-gray-400" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200"
      case "processing":
        return "bg-indigo-100 text-indigo-800 border-indigo-200"
      case "failed":
        return "bg-red-100 text-red-800 border-red-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getRepositoryName = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.substring(1)
    } catch {
      return url
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-6">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
          <div className="flex items-center justify-center">
            <FaSpinner className="w-6 h-6 text-indigo-500 animate-spin mr-2" />
            <span className="text-base text-gray-600">Loading analysis history...</span>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-6">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="mb-6"
      >
        <div className="flex items-center space-x-2 mb-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <FaHistory className="w-4 h-4 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Analysis History</h1>
        </div>
        <p className="text-gray-600 text-sm">View and manage your previous repository analyses</p>
      </motion.div>

      {analyses.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15, delay: 0.05 }}
          className="bg-white rounded-xl shadow-lg border border-gray-100 p-10 text-center"
        >
          <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
            <FaHistory className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
          <p className="text-gray-600 text-sm">Start by analyzing your first repository to see results here.</p>
        </motion.div>
      ) : (
        <div className="space-y-3">
          {analyses.map((analysis, index) => (
            <motion.div
              key={analysis.id}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15, delay: index * 0.03 }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-5 hover:shadow-xl transition-all duration-150"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(analysis.status)}
                    <FaGithub className="w-4 h-4 text-gray-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900 truncate">
                      {getRepositoryName(analysis.repository_url)}
                    </h3>
                    <p className="text-xs text-gray-500">{formatDate(analysis.created_at)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(analysis.status)}`}
                  >
                    {analysis.status}
                  </span>

                  {analysis.status === "processing" && (
                    <div className="flex items-center space-x-2">
                      <div className="w-20 bg-gray-200 rounded-full h-1">
                        <div
                          className="bg-indigo-600 h-1 rounded-full transition-all duration-200"
                          style={{ width: `${analysis.progress}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">{analysis.progress}%</span>
                    </div>
                  )}

                  <div className="flex items-center space-x-1">
                    {analysis.status === "completed" && (
                      <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        transition={{ duration: 0.1 }}
                        onClick={() => onAnalysisSelect(analysis.id, analysis.repository_url)}
                        className="p-2 bg-indigo-100 text-indigo-600 rounded-md hover:bg-indigo-200 transition-colors duration-150"
                        title="View Results"
                      >
                        <FaEye className="w-3 h-3" />
                      </motion.button>
                    )}

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      transition={{ duration: 0.1 }}
                      onClick={() => deleteAnalysis(analysis.id)}
                      className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors duration-150"
                      title="Delete Analysis"
                    >
                      <FaTrash className="w-3 h-3" />
                    </motion.button>
                  </div>
                </div>
              </div>

              {analysis.error && (
                <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-xs text-red-800">
                    <strong>Error:</strong> {analysis.error}
                  </p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AnalysisHistory
