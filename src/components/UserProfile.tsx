"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { useAuth } from "../contexts/AuthContext"
import { supabase } from "../lib/supabase"
import { FaGithub, FaGoogle, FaUser, FaCalendar, FaEnvelope, FaIdCard } from "react-icons/fa"

interface Analysis {
  id: string
  repository_url: string
  status: string
  progress: number
  created_at: string
  updated_at: string
  error?: string
}

const UserProfile: React.FC = () => {
  const { user, session } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    processing: 0,
    failed: 0,
  })

  useEffect(() => {
    if (user) {
      loadUserAnalyses()
    }
  }, [user])

  const loadUserAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from("analyses")
        .select("id, repository_url, status, progress, created_at, updated_at, error")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(5)

      if (error) {
        console.error("Error loading analyses:", error)
      } else {
        setAnalyses(data || [])

        // Calculate stats
        const total = data?.length || 0
        const completed = data?.filter((a) => a.status === "completed").length || 0
        const processing = data?.filter((a) => a.status === "processing").length || 0
        const failed = data?.filter((a) => a.status === "failed").length || 0

        setStats({ total, completed, processing, failed })
      }
    } catch (error) {
      console.error("Error loading analyses:", error)
    } finally {
      setLoading(false)
    }
  }

  const getProviderIcon = () => {
    if (session?.user?.app_metadata?.provider === "github") {
      return <FaGithub className="h-5 w-5 text-gray-900" />
    } else if (session?.user?.app_metadata?.provider === "google") {
      return <FaGoogle className="h-5 w-5 text-red-500" />
    }
    return <FaUser className="h-5 w-5 text-gray-500" />
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getRepositoryName = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.substring(1)
    } catch {
      return url
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-indigo-100 rounded-2xl flex items-center justify-center">
            <FaUser className="w-10 h-10 text-indigo-600" />
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
            <p className="text-gray-600 mb-4">Welcome back, {user.email}</p>

            <div className="flex items-center space-x-6 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <FaEnvelope className="w-4 h-4" />
                <span>{user.email}</span>
              </div>

              <div className="flex items-center space-x-2">
                {getProviderIcon()}
                <span className="capitalize">{user.app_metadata?.provider || "Unknown"}</span>
              </div>

              <div className="flex items-center space-x-2">
                <FaCalendar className="w-4 h-4" />
                <span>Joined {formatDate(user.created_at)}</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6"
      >
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-indigo-600 mb-2">{stats.total}</div>
          <div className="text-gray-600 font-medium">Total Analyses</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">{stats.completed}</div>
          <div className="text-gray-600 font-medium">Completed</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">{stats.processing}</div>
          <div className="text-gray-600 font-medium">Processing</div>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 text-center">
          <div className="text-3xl font-bold text-red-600 mb-2">{stats.failed}</div>
          <div className="text-gray-600 font-medium">Failed</div>
        </div>
      </motion.div>

      {/* Recent Analyses */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Analyses</h2>

        {loading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading analyses...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaIdCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No analyses yet</h3>
            <p className="text-gray-600">Start by analyzing your first repository!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis, index) => (
              <motion.div
                key={analysis.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:border-indigo-300 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{getRepositoryName(analysis.repository_url)}</h3>
                  <p className="text-sm text-gray-500">{formatDate(analysis.created_at)}</p>
                </div>

                <div className="flex items-center space-x-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      analysis.status === "completed"
                        ? "bg-green-100 text-green-800"
                        : analysis.status === "processing"
                          ? "bg-indigo-100 text-indigo-800"
                          : "bg-red-100 text-red-800"
                    }`}
                  >
                    {analysis.status}
                  </span>

                  {analysis.status === "processing" && (
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${analysis.progress}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600">{analysis.progress}%</span>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Account Details */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Account Details</h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">User ID</label>
            <div className="p-3 bg-gray-50 rounded-lg font-mono text-sm text-gray-600">{user.id}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">{user.email}</div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Provider</label>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900 flex items-center space-x-2">
              {getProviderIcon()}
              <span className="capitalize">{user.app_metadata?.provider || "Unknown"}</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Member Since</label>
            <div className="p-3 bg-gray-50 rounded-lg text-sm text-gray-900">{formatDate(user.created_at)}</div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default UserProfile
