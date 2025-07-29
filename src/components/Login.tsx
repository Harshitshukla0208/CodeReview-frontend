import React from 'react'
import { useAuth } from '../contexts/AuthContext'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

const Login: React.FC = () => {
  const { signInWithGoogle, signInWithGitHub } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error('Google sign in error:', error)
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub()
    } catch (error) {
      console.error('GitHub sign in error:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to Code Review
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Choose your preferred authentication method
          </p>
        </div>
        <div className="mt-8 space-y-4">
          <button
            onClick={handleGoogleSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
          >
            <FcGoogle className="h-5 w-5 mr-2" />
            Continue with Google
          </button>
          
          <button
            onClick={handleGitHubSignIn}
            className="group relative w-full flex justify-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors"
          >
            <FaGithub className="h-5 w-5 mr-2" />
            Continue with GitHub
          </button>
        </div>
        
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-100 text-gray-500">
                Why authenticate?
              </span>
            </div>
          </div>
          <div className="mt-4 text-center text-sm text-gray-600 space-y-2">
            <p>• Save your analysis history</p>
            <p>• Access your GitHub repositories</p>
            <p>• Secure token storage</p>
            <p>• Personalized recommendations</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login 