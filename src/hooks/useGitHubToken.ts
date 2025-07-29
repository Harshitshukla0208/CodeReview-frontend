import { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

export const useGitHubToken = () => {
  const { user } = useAuth()
  const [token, setToken] = useState<string>('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user) {
      loadStoredToken()
    } else {
      setToken('')
      setLoading(false)
    }
  }, [user])

  const loadStoredToken = async () => {
    try {
      // Get the most recent analysis with a token for this user
      const { data, error } = await supabase
        .from('analyses')
        .select('github_token')
        .eq('user_id', user?.id)
        .not('github_token', 'is', null)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error loading token:', error)
      }

      // Check if we got any results
      if (data && data.length > 0 && data[0]?.github_token) {
        setToken(data[0].github_token)
      } else {
        setToken('') // No token found
      }
    } catch (error) {
      console.error('Error loading token:', error)
      setToken('') // Set empty token on error
    } finally {
      setLoading(false)
    }
  }

  const saveToken = async (newToken: string) => {
    setToken(newToken)
    
    // Store token in the most recent analysis or create a placeholder
    try {
      const { data: recentAnalyses } = await supabase
        .from('analyses')
        .select('id')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false })
        .limit(1)

      if (recentAnalyses && recentAnalyses.length > 0) {
        await supabase
          .from('analyses')
          .update({ github_token: newToken })
          .eq('id', recentAnalyses[0].id)
      }
    } catch (error) {
      console.error('Error saving token:', error)
    }
  }

  const clearToken = () => {
    setToken('')
  }

  return {
    token,
    setToken: saveToken,
    clearToken,
    loading
  }
} 