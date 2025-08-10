import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useNavigate } from 'react-router-dom'

const AuthCallback: React.FC = () => {
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('Processing authentication...')
  const navigate = useNavigate()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setStatus('Checking current session...')
        console.log('Auth callback started, URL:', window.location.href)
        
        // Handle the OAuth callback by processing the URL
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setError(error.message)
          return
        }

        if (data.session) {
          // Successfully authenticated, redirect to main app
          console.log('Authentication successful, redirecting...')
          setStatus('Authentication successful! Redirecting...')
          navigate('/', { replace: true })
        } else {
          setStatus('No active session, checking URL parameters...')
          
          // Try to get the session from the URL hash or query params
          const hashParams = new URLSearchParams(window.location.hash.substring(1))
          const queryParams = new URLSearchParams(window.location.search)
          
          const accessToken = hashParams.get('access_token') || queryParams.get('access_token')
          const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token')
          const code = queryParams.get('code')
          
          console.log('URL params found:', { accessToken: !!accessToken, refreshToken: !!refreshToken, code: !!code })
          
          if (accessToken && refreshToken) {
            setStatus('Setting session with tokens...')
            // Set the session manually
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            })
            
            if (setSessionError) {
              console.error('Error setting session:', setSessionError)
              setError(setSessionError.message)
            } else {
              console.log('Session set successfully, redirecting...')
              setStatus('Session set successfully! Redirecting...')
              navigate('/', { replace: true })
            }
          } else if (code) {
            setStatus('Processing authorization code...')
            // Handle authorization code flow
            const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
            
            if (exchangeError) {
              console.error('Error exchanging code for session:', exchangeError)
              setError(exchangeError.message)
            } else {
              console.log('Code exchanged successfully, redirecting...')
              setStatus('Code exchanged successfully! Redirecting...')
              navigate('/', { replace: true })
            }
          } else {
            setError('No session found and no authentication tokens in URL')
          }
        }
      } catch (err) {
        console.error('Auth callback error:', err)
        setError('Authentication failed')
      }
    }

    handleAuthCallback()
  }, [navigate])

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Completing Authentication</h2>
        <p className="text-gray-600">{status}</p>
      </div>
    </div>
  )
}

export default AuthCallback
