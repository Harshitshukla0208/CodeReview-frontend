"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import {
  FaGithub,
  FaLink,
  FaRocket,
  FaInfoCircle,
  FaStar,
  FaLock,
  FaCodeBranch,
  FaSearch,
} from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import { useGitHubToken } from "../hooks/useGitHubToken"

interface GitHubRepo {
  id: number
  name: string
  full_name: string
  html_url: string
  description?: string
  private: boolean
  fork: boolean
  stargazers_count: number
  language?: string
  updated_at: string
}

interface RepoFormProps {
  onAnalysisStart: (id: string, repoUrl: string) => void
}

const RepoForm: React.FC<RepoFormProps> = ({ onAnalysisStart }) => {
  const { user, session } = useAuth()
  const { token: githubToken, setToken: setGithubToken } = useGitHubToken()
  const [repoUrl, setRepoUrl] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [reposLoading, setReposLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRepos, setShowRepos] = useState(false)

  // Check if user authenticated with GitHub
  const isGitHubAuth = session?.user?.app_metadata?.provider === "github" && session?.provider_token

  const fetchGitHubRepos = async () => {
    if (!session?.provider_token) return

    setReposLoading(true)
    setError(null)

    try {
      const response = await fetch("https://api.github.com/user/repos?sort=updated&per_page=100", {
        headers: {
          Authorization: `Bearer ${session.provider_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      })

      if (!response.ok) {
        throw new Error(`GitHub API error: ${response.status}`)
      }

      const githubRepos = await response.json()
      setRepos(githubRepos)
      setShowRepos(true)
    } catch (error) {
      console.error("Error fetching repos:", error)
      setError(error instanceof Error ? error.message : "Failed to fetch repositories")
    } finally {
      setReposLoading(false)
    }
  }

  const handleRepoSelect = (repo: GitHubRepo) => {
    setRepoUrl(repo.html_url)
    setShowRepos(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      setError("Please sign in to start analysis")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Generate a unique analysis ID
      const analysisId = `analysis_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

      // Start analysis via API
      const apiResponse = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          repositoryUrl: repoUrl,
          includeGitHubIssues: !!githubToken,
          githubToken: githubToken || undefined,
          analysisId: analysisId,
        }),
      })

      const apiData = await apiResponse.json()

      if (!apiResponse.ok) {
        throw new Error(apiData.error || "Failed to start analysis")
      }

      // Success - navigate to analysis
      onAnalysisStart(apiData.analysisId || analysisId, repoUrl)
    } catch (err) {
      console.error("Analysis start error:", err)
      setError(err instanceof Error ? err.message : "A network error occurred.")
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = repos.filter(
    (repo) =>
      repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      repo.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getLanguageColor = (language: string) => {
    const colors: { [key: string]: string } = {
      JavaScript: "bg-yellow-400",
      TypeScript: "bg-blue-500",
      Python: "bg-green-500",
      Java: "bg-red-500",
      "C++": "bg-purple-500",
      Go: "bg-cyan-500",
      Rust: "bg-orange-500",
      PHP: "bg-indigo-500",
    }
    return colors[language] || "bg-gray-400"
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
      <motion.div
        initial={{ opacity: 0, y: 3 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.1, ease: "easeOut" }}
        className="text-center mb-6 sm:mb-8"
      >
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-3 text-gray-900">Analyze Your Repository</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
          Get instant AI-powered insights, security analysis, and automated fixes for your codebase
        </p>
      </motion.div>

      <div className={`grid gap-4 sm:gap-6 ${isGitHubAuth ? "lg:grid-cols-3" : "max-w-2xl mx-auto"}`}>
        {/* GitHub Repositories - Only show for GitHub authenticated users */}
        {isGitHubAuth && (
          <motion.div
            initial={{ opacity: 0, x: -5 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.1, ease: "easeOut" }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gray-900 px-4 sm:px-5 py-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <FaGithub className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    <h2 className="text-base sm:text-lg font-semibold text-white">Your Repositories</h2>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    onClick={fetchGitHubRepos}
                    disabled={reposLoading}
                    className="px-2 py-1 sm:px-3 sm:py-1 bg-white/20 text-white rounded-md hover:bg-white/30 transition-colors duration-100 disabled:opacity-50 text-xs sm:text-sm flex items-center space-x-1"
                  >
                    <FaCodeBranch className={`w-2 h-2 sm:w-3 sm:h-3 ${reposLoading ? "animate-spin" : ""}`} />
                    <span>{reposLoading ? "Loading..." : "Load Repos"}</span>
                  </motion.button>
                </div>
              </div>

              {showRepos && (
                <div className="p-4 sm:p-5">
                  {/* Search */}
                  <div className="relative mb-3 sm:mb-4">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-2 h-2 sm:w-3 sm:h-3" />
                    <input
                      type="text"
                      placeholder="Search repositories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 sm:pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-100 text-xs sm:text-sm"
                    />
                  </div>

                  {/* Repository List */}
                  <div className="space-y-2 max-h-60 sm:max-h-80 overflow-y-auto">
                    {filteredRepos.length === 0 ? (
                      <div className="text-center py-6 sm:py-8 text-gray-500">
                        {searchTerm ? (
                          <div>
                            <div className="text-2xl sm:text-4xl mb-2">🔍</div>
                            <p className="text-xs sm:text-sm">No repositories found matching "{searchTerm}"</p>
                          </div>
                        ) : (
                          <div>
                            <div className="text-2xl sm:text-4xl mb-2">📁</div>
                            <p className="text-xs sm:text-sm">Click "Load Repos" to see your repositories</p>
                          </div>
                        )}
                      </div>
                    ) : (
                      filteredRepos.map((repo, index) => (
                        <motion.div
                          key={repo.id}
                          initial={{ opacity: 0, y: 3 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.1, delay: index * 0.01 }}
                          whileHover={{ scale: 1.005, y: -1 }}
                          className="group p-3 sm:p-4 border border-gray-200 rounded-xl hover:border-indigo-300 hover:shadow-md transition-all duration-100 cursor-pointer bg-white"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center space-x-2 mb-1 sm:mb-2">
                                <h3 className="font-semibold text-gray-900 truncate text-sm sm:text-base">
                                  {repo.name}
                                </h3>
                                {repo.private && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-yellow-100 text-yellow-800">
                                    <FaLock className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-1" />
                                    Private
                                  </span>
                                )}
                                {repo.fork && (
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-xs bg-blue-100 text-blue-800">
                                    <FaCodeBranch className="w-1.5 h-1.5 sm:w-2 sm:h-2 mr-1" />
                                    Fork
                                  </span>
                                )}
                              </div>

                              {repo.description && (
                                <p className="text-xs sm:text-sm text-gray-600 mb-1 sm:mb-2 line-clamp-2">
                                  {repo.description}
                                </p>
                              )}

                              <div className="flex items-center space-x-3 sm:space-x-4 text-xs text-gray-500">
                                {repo.language && (
                                  <div className="flex items-center space-x-1">
                                    <div
                                      className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full ${getLanguageColor(repo.language)}`}
                                    />
                                    <span className="font-medium text-xs">{repo.language}</span>
                                  </div>
                                )}
                                <div className="flex items-center space-x-1">
                                  <FaStar className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-500" />
                                  <span className="text-xs">{repo.stargazers_count}</span>
                                </div>
                              </div>
                            </div>

                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              transition={{ duration: 0.1 }}
                              onClick={() => handleRepoSelect(repo)}
                              className="ml-3 sm:ml-4 px-3 py-1.5 sm:px-4 sm:py-2 bg-indigo-600 text-white rounded-lg font-medium opacity-0 group-hover:opacity-100 hover:bg-indigo-700 transition-all duration-100 shadow-lg hover:shadow-xl text-xs sm:text-sm"
                            >
                              Select
                            </motion.button>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Analysis Form */}
        <motion.div
          initial={{ opacity: 0, x: isGitHubAuth ? 5 : 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.1, ease: "easeOut" }}
          className={isGitHubAuth ? "lg:col-span-1" : ""}
        >
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-4 sm:p-6">
            <div className="flex items-center space-x-2 mb-4 sm:mb-5">
              <div className="w-6 h-6 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <FaRocket className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
              </div>
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Start Analysis</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">Repository URL</label>
                <div className="relative">
                  <FaLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-2 h-2 sm:w-3 sm:h-3" />
                  <input
                    type="url"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/owner/repo"
                    className="w-full pl-8 sm:pl-9 pr-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-100 text-xs sm:text-sm"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1">
                  GitHub Token (Optional)
                </label>
                <input
                  type="password"
                  value={githubToken}
                  onChange={(e) => setGithubToken(e.target.value)}
                  placeholder="ghp_..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-100 text-xs sm:text-sm"
                />
                <div className="mt-2 p-2 sm:p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <FaInfoCircle className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-indigo-800">
                      <p className="font-medium mb-1">Enhanced Features with Token:</p>
                      <ul className="space-y-0.5 text-indigo-700 text-xs">
                        <li>• Auto-fix and PR creation</li>
                        <li>• Private repository access</li>
                        <li>• GitHub issues analysis</li>
                      </ul>
                      <a
                        href="https://github.com/settings/tokens/new?scopes=repo&description=CodeReview%20AI"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center mt-1 text-indigo-600 hover:text-indigo-800 font-medium text-xs"
                      >
                        Create Token →
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.01, y: -1 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
                type="submit"
                disabled={loading || !user}
                className="w-full py-3 sm:py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all duration-100 disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden text-sm sm:text-base"
              >
                {loading && (
                  <motion.div
                    initial={{ x: "-100%" }}
                    animate={{ x: "100%" }}
                    transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                  />
                )}

                {loading ? (
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 0.8, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-4 h-4 sm:w-5 sm:h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                    <span>Starting Analysis...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-2">
                    <FaRocket className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Analyze Repository</span>
                  </div>
                )}
              </motion.button>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: 3 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.1 }}
                  className="p-2 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-800 text-xs sm:text-sm"
                >
                  {error}
                </motion.div>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default RepoForm
