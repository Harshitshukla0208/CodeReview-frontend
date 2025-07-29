import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FaGithub, FaStar, FaLock, FaCodeBranch } from 'react-icons/fa'

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
  user_id?: string
  created_at?: string
  updated_at?: string
}

interface GitHubRepoSelectorProps {
  onRepoSelect: (repoUrl: string) => void
}

const GitHubRepoSelector: React.FC<GitHubRepoSelectorProps> = ({ onRepoSelect }) => {
  const { session } = useAuth()
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (session?.provider_token) {
      fetchRepositories()
    }
  }, [session])

  const fetchRepositories = async () => {
    setLoading(true)
    setError(null)

    try {
      // First, try to get repos from our database cache
      const { data: cachedRepos, error: cacheError } = await supabase
        .from('github_repos')
        .select('*')
        .eq('user_id', session?.user?.id)
        .order('updated_at', { ascending: false })

      if (cachedRepos && cachedRepos.length > 0) {
        setRepos(cachedRepos)
        setLoading(false)
      }

      // Fetch fresh data from GitHub API
      const response = await fetch('https://api.github.com/user/repos?sort=updated&per_page=100', {
        headers: {
          'Authorization': `Bearer ${session?.provider_token}`,
          'Accept': 'application/vnd.github.v3+json'
        }
      })

      if (!response.ok) {
        throw new Error('Failed to fetch repositories')
      }

      const githubRepos = await response.json()
      
      // Transform and store in database
      const reposToStore = githubRepos.map((repo: any) => ({
        id: repo.id,
        name: repo.name,
        full_name: repo.full_name,
        html_url: repo.html_url,
        description: repo.description,
        private: repo.private,
        fork: repo.fork,
        stargazers_count: repo.stargazers_count,
        language: repo.language,
        user_id: session?.user?.id
      }))

      // Upsert repos to database
      const { error: upsertError } = await supabase
        .from('github_repos')
        .upsert(reposToStore, { onConflict: 'id' })

      if (upsertError) {
        console.error('Error storing repos:', upsertError)
      }

      setRepos(githubRepos)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch repositories')
    } finally {
      setLoading(false)
    }
  }

  const filteredRepos = repos.filter(repo =>
    repo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    repo.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleRepoClick = (repo: GitHubRepo) => {
    onRepoSelect(repo.html_url)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-2 text-gray-600">Loading repositories...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <div className="flex">
          <div className="text-red-600">
            <p className="font-medium">Error loading repositories</p>
            <p className="text-sm">{error}</p>
          </div>
        </div>
        <button
          onClick={fetchRepositories}
          className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
        >
          Try again
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <label htmlFor="repo-search" className="block text-sm font-medium text-gray-700 mb-2">
          Search repositories
        </label>
        <input
          id="repo-search"
          type="text"
          placeholder="Search by repository name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="grid gap-3 max-h-96 overflow-y-auto">
        {filteredRepos.map((repo) => (
          <div
            key={repo.id}
            onClick={() => handleRepoClick(repo)}
            className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md cursor-pointer transition-all"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <FaGithub className="text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {repo.full_name}
                  </h3>
                  {repo.private && <FaLock className="text-gray-400 text-xs" />}
                  {repo.fork && <FaCodeBranch className="text-gray-400 text-xs" />}
                </div>
                {repo.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">
                    {repo.description}
                  </p>
                )}
                <div className="mt-2 flex items-center space-x-4 text-xs text-gray-500">
                  {repo.language && (
                    <span className="flex items-center">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mr-1"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center">
                    <FaStar className="mr-1" />
                    {repo.stargazers_count}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredRepos.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {searchTerm ? 'No repositories found matching your search.' : 'No repositories found.'}
        </div>
      )}
    </div>
  )
}

export default GitHubRepoSelector 