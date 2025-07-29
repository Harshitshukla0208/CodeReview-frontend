import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { FaGithub, FaGoogle, FaSignOutAlt, FaHistory, FaUser } from 'react-icons/fa'

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
  const { user, session, signOut } = useAuth()
  const [analyses, setAnalyses] = useState<Analysis[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadUserAnalyses()
    }
  }, [user])

  const loadUserAnalyses = async () => {
    try {
      const { data, error } = await supabase
        .from('analyses')
        .select('id, repository_url, status, progress, created_at, updated_at, error')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Error loading analyses:', error)
      } else {
        setAnalyses(data || [])
      }
    } catch (error) {
      console.error('Error loading analyses:', error)
    } finally {
      setLoading(false)
    }
  }

  const getProviderIcon = () => {
    if (session?.user?.app_metadata?.provider === 'github') {
      return <FaGithub className="h-5 w-5" />
    } else if (session?.user?.app_metadata?.provider === 'google') {
      return <FaGoogle className="h-5 w-5" />
    }
    return <FaUser className="h-5 w-5" />
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100'
      case 'processing':
        return 'text-blue-600 bg-blue-100'
      case 'failed':
        return 'text-red-600 bg-red-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getRepositoryName = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname.substring(1) // Remove leading slash
    } catch {
      return url
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">User Profile</h2>
          <p className="text-gray-600">Welcome, {user.email}</p>
        </div>
        <button
          onClick={signOut}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
        >
          Sign Out
        </button>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">Recent Analyses</h3>
        {loading ? (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading analyses...</p>
          </div>
        ) : analyses.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No analyses found. Start by analyzing a repository!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {analyses.map((analysis) => (
              <div key={analysis.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {getRepositoryName(analysis.repository_url)}
                    </h4>
                    <p className="text-sm text-gray-500">
                      Created: {formatDate(analysis.created_at)}
                    </p>
                    {analysis.updated_at !== analysis.created_at && (
                      <p className="text-sm text-gray-500">
                        Updated: {formatDate(analysis.updated_at)}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(analysis.status)}`}>
                      {analysis.status}
                    </span>
                    {analysis.status === 'processing' && (
                      <span className="text-sm text-gray-600">
                        {analysis.progress}%
                      </span>
                    )}
                  </div>
                </div>
                
                {analysis.status === 'processing' && (
                  <div className="mt-2">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${analysis.progress}%` }}
                      ></div>
                    </div>
                  </div>
                )}
                
                {analysis.error && (
                  <div className="mt-2 text-sm text-red-600 bg-red-50 p-2 rounded">
                    Error: {analysis.error}
                  </div>
                )}
                
                <div className="mt-2 text-xs text-gray-400">
                  ID: {analysis.id}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="border-t pt-4">
        <h3 className="text-lg font-semibold mb-2">Account Information</h3>
        <div className="space-y-2 text-sm">
          <p><span className="font-medium">Email:</span> {user.email}</p>
          <p><span className="font-medium">User ID:</span> {user.id}</p>
          <p><span className="font-medium">Provider:</span> {user.app_metadata?.provider || 'Unknown'}</p>
        </div>
      </div>
    </div>
  )
}

export default UserProfile 