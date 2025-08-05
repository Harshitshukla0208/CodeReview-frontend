"use client"

import type React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaGithub, FaTimes, FaShieldAlt, FaRocket, FaUsers } from "react-icons/fa"
import { useAuth } from "../contexts/AuthContext"
import GoogleIcon from '../assets/search.png'
interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithGitHub } = useAuth()

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
    } catch (error) {
      console.error("Google sign in error:", error)
    }
  }

  const handleGitHubSignIn = async () => {
    try {
      await signInWithGitHub()
    } catch (error) {
      console.error("GitHub sign in error:", error)
    }
  }

  const benefits = [
    {
      icon: <FaShieldAlt className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Secure GitHub integration",
    },
    {
      icon: <FaRocket className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Access your repositories easily",
    },
    {
      icon: <FaUsers className="w-4 h-4 sm:w-5 sm:h-5" />,
      text: "Simple and straightforward",
    },
  ]

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl max-w-sm sm:max-w-md w-full mx-4 overflow-hidden"
            >
              {/* Header */}
              <div className="relative bg-indigo-600 px-6 sm:px-8 py-5 sm:py-6 text-white">
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 sm:top-4 sm:right-4 p-2 hover:bg-white/20 rounded-full transition-colors duration-100"
                >
                  <FaTimes className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>

                <div className="text-center">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.05, duration: 0.15 }}
                    className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4"
                  >
                    <FaShieldAlt className="w-6 h-6 sm:w-8 sm:h-8" />
                  </motion.div>
                  <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome!</h2>
                  <p className="text-indigo-100 text-sm sm:text-base">Sign in to start analyzing your code</p>
                </div>
              </div>

              {/* Content */}
              <div className="px-6 sm:px-8 py-6 sm:py-8">
                {/* Benefits */}
                <div className="mb-6 sm:mb-8">
                  <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">Why sign in?</h3>
                  <div className="space-y-2 sm:space-y-3">
                    {benefits.map((benefit, index) => (
                      <motion.div
                        key={index}
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 0.05 + index * 0.03, duration: 0.15 }}
                        className="flex items-center space-x-2 sm:space-x-3 text-gray-600"
                      >
                        <div className="text-indigo-600">{benefit.icon}</div>
                        <span className="text-sm sm:text-base">{benefit.text}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Auth Buttons */}
                <div className="space-y-3 sm:space-y-4">
                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    onClick={handleGitHubSignIn}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-gray-900 text-white rounded-xl font-semibold hover:bg-gray-800 transition-colors duration-100 shadow-lg text-sm sm:text-base"
                  >
                    <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>Continue with GitHub</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={{ duration: 0.1 }}
                    onClick={handleGoogleSignIn}
                    className="w-full flex items-center justify-center space-x-2 sm:space-x-3 px-4 sm:px-6 py-3 sm:py-4 bg-white border-2 border-gray-200 text-gray-700 rounded-xl font-semibold hover:border-indigo-300 hover:bg-gray-50 transition-colors duration-100 shadow-lg text-sm sm:text-base"
                  >
                    <img src={GoogleIcon} alt="google icon" className="h-5 w-5 mr-2" />
                    <span>Continue with Google</span>
                  </motion.button>
                </div>

                {/* Footer */}
                <div className="mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-100 text-center">
                  <p className="text-xs sm:text-sm text-gray-500">
                    This helps us connect to your GitHub repositories securely
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default AuthModal
