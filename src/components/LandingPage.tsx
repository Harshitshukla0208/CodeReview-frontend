"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { FaCode, FaShieldAlt, FaRocket, FaGithub, FaArrowRight, FaPlay, FaHeart, FaLinkedin } from "react-icons/fa"
import Human1 from '../assets/human-1.svg'
import Human2 from '../assets/human-2.svg'
import { api } from "../lib/api"

interface LandingPageProps {
  onGetStarted: () => void
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const { scrollYProgress } = useScroll()
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "15%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    setIsVisible(true)

    const checkBackendHealth = async () => {
      try {
        const response = await api.healthCheck()
        if (response.ok) {
          console.log('Backend is healthy')
        } else {
          console.warn(`Backend health check failed: HTTP ${response.status}`)
        }
      } catch (error) {
        console.error('Backend health check error:', error)
      }
    }

    checkBackendHealth()
  }, [])

  const openVideo = () => setIsVideoOpen(true)
  const closeVideo = () => setIsVideoOpen(false)

  const features = [
    {
      icon: <FaCode className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Code Analysis",
      description: "Analyze your code for potential issues, bugs, and improvements using AI-powered insights.",
    },
    {
      icon: <FaShieldAlt className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Security Scanning",
      description: "Identify potential security vulnerabilities and get suggestions for fixes.",
    },
    {
      icon: <FaRocket className="w-5 h-5 sm:w-6 sm:h-6" />,
      title: "Quick Insights",
      description: "Get instant feedback on your code quality and maintainability.",
    },
  ]

  return (
    <div className="min-h-screen bg-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          style={{ y, opacity }}
          className="absolute -top-40 -right-40 w-60 h-60 sm:w-80 sm:h-80 bg-indigo-100 rounded-full blur-3xl"
        />
        {/* <motion.div
          style={{ y: useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]) }}
          className="absolute -bottom-40 -left-40 w-60 h-60 sm:w-80 sm:h-80 bg-indigo-50 rounded-full blur-3xl"
        /> */}
      </div>

      {/* Navigation */}
      <motion.nav
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className="relative z-50 px-4 sm:px-6 py-4 sm:py-5 lg:absolute lg:top-0 lg:left-0 lg:right-0"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <motion.div
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.1 }}
            className="flex items-center space-x-2"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <FaCode className="w-3 h-3 sm:w-4 sm:h-4 text-white" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-gray-900">CodeLens</span>
          </motion.div>

          <div className="flex items-center space-x-3">
            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
              onClick={onGetStarted}
              className="px-4 py-2 sm:px-5 sm:py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-lg hover:bg-indigo-700 hover:shadow-xl transition-all duration-100 text-sm sm:text-base"
            >
              Try It Out
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section - Full Screen Height on Desktop Only */}
      <section className="relative z-10 pt-12 sm:pt-16 pb-16 sm:pb-24 lg:h-screen lg:pt-0 lg:pb-0 lg:flex lg:flex-col lg:justify-center px-4 sm:px-6">
        <div className="max-w-7xl mx-auto text-center lg:flex-1 lg:flex lg:flex-col lg:justify-center">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={isVisible ? { y: 0, opacity: 1 } : {}}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="mb-8 sm:mb-16"
          >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={isVisible ? { scale: 1, opacity: 1 } : {}}
              transition={{ duration: 0.15, delay: 0.05 }}
              className="inline-flex items-center px-3 py-1 bg-indigo-50 border border-indigo-200 rounded-full text-indigo-700 text-xs sm:text-sm font-medium mb-4 sm:mb-6"
            >
              <FaHeart className="w-2 h-2 sm:w-3 sm:h-3 mr-2" />A personal project built with passion
            </motion.div>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
              <span className="text-gray-900">Analyze & Fix Your Code</span>
              <br />
              <span className="text-indigo-600">Get Insights</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-4xl mx-auto leading-relaxed px-4">
              A simple tool to help you understand your code better. Get AI-powered insights, spot potential issues & auto-fix them, create auto-PRs, and
              learn how to improve your projects.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 sm:mb-12 px-4">
              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
                onClick={onGetStarted}
                className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-indigo-600 text-white rounded-lg font-semibold shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all duration-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <span>Start Analyzing</span>
                <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                transition={{ duration: 0.1 }}
                onClick={openVideo}
                className="w-full sm:w-auto px-5 py-3 sm:px-6 sm:py-3 bg-white border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:border-indigo-300 hover:text-indigo-600 transition-all duration-100 flex items-center justify-center space-x-2 text-sm sm:text-base"
              >
                <FaPlay className="w-2 h-2 sm:w-3 sm:h-3" />
                <span>See How It Works</span>
              </motion.button>
            </div>

            <motion.div
              initial={{ y: 10, opacity: 0 }}
              animate={isVisible ? { y: 0, opacity: 1 } : {}}
              transition={{ duration: 0.2, delay: 0.1 }}
              className="text-center px-4"
            >
              <p className="text-xs sm:text-sm text-gray-500">
                Built as a learning project • Open source • Free to use
              </p>
            </motion.div>
          </motion.div>
        </div>

        {/* Human SVGs positioned at bottom corners - Hidden on mobile and tablet */}
        <div className="absolute bottom-0 left-0 right-0 pointer-events-none hidden lg:block">
          {/* Human 1 - Bottom Left */}
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 left-0 w-56"
          >
            <img
              src={Human1}
              alt="Human illustration"
              className="w-full h-full object-contain"
            />
          </motion.div>

          {/* Human 2 - Bottom Right */}
          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={isVisible ? { x: 0, opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
            className="absolute bottom-0 right-0 w-48"
          >
            <img
              src={Human2}
              alt="Human illustration"
              className="w-full h-full object-contain"
            />
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            viewport={{ once: true }}
            className="text-center mb-12 sm:mb-16"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-gray-900">
              What This Tool Does
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
              A simple way to get insights about your code. Perfect for learning and improving your projects.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ y: 10, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.15, delay: index * 0.03 }}
                viewport={{ once: true }}
                whileHover={{ y: -2, scale: 1.005 }}
                className="group relative"
              >
                <div className="absolute inset-0 bg-indigo-100 opacity-0 group-hover:opacity-100 transition-opacity duration-100 rounded-xl blur-xl -z-10" />

                <div className="relative bg-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-2xl transition-all duration-100 border border-gray-100">
                  <div className="inline-flex p-2 sm:p-3 rounded-lg bg-indigo-600 text-white mb-3 sm:mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed text-sm sm:text-base">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 py-16 sm:py-24 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.15 }}
            viewport={{ once: true }}
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 text-gray-900">
              Ready to Try It Out?
            </h2>
            <p className="text-base sm:text-lg text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto">
              Just paste your GitHub repository URL and get instant insights about your code. It's free and takes just a
              few seconds!
            </p>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              transition={{ duration: 0.1 }}
              onClick={onGetStarted}
              className="w-full sm:w-auto px-8 py-3 sm:px-10 sm:py-4 bg-indigo-600 text-white rounded-lg text-base sm:text-lg font-semibold shadow-xl hover:bg-indigo-700 hover:shadow-2xl transition-all duration-100 flex items-center justify-center space-x-2 sm:space-x-3 mx-auto"
            >
              <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>Analyze Any Repository</span>
              <FaArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
            </motion.button>

            <p className="text-xs sm:text-sm text-gray-500 mt-3 sm:mt-4">
              Just signup required • Works with public repos • Completely free
            </p>
          </motion.div>
        </div>
      </section>

      {/* Video Popup Overlay */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.4)' }}
            onClick={closeVideo}
          >
            <motion.div
              initial={{
                y: "100vh",
                scale: 0.8,
                opacity: 0
              }}
              animate={{
                y: 0,
                scale: 1,
                opacity: 1
              }}
              exit={{
                y: "100vh",
                scale: 0.8,
                opacity: 0
              }}
              transition={{
                type: "spring",
                damping: 25,
                stiffness: 400,
                duration: 0.4
              }}
              className="relative max-w-4xl w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-3xl p-2 shadow-2xl border border-white">
                <div className="bg-gray-100 rounded-2xl overflow-hidden p-0">
                  <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-inner">
                    <iframe
                      src="https://www.youtube.com/embed/feGksT9Uujc"
                      title="Demo Video"
                      className="w-full h-full"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                </div>
              </div>

              <div className="absolute inset-0 bg-indigo-500/5 rounded-t-3xl blur-xl -z-10 scale-110"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-gray-600 text-sm bg-white/90 px-4 py-2 rounded-full backdrop-blur-sm shadow-lg border border-gray-200"
            >
              Press ESC or click outside to close
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global key handler */}
      {isVideoOpen && (
        <div
          tabIndex={-1}
          className="fixed inset-0 outline-none"
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              closeVideo();
            }
          }}
          autoFocus
        />
      )}

      <footer className="relative z-10 bg-gray-50 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0">
            {/* Left side - Copyright */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2 }}
              viewport={{ once: true }}
              className="flex items-center space-x-1 text-sm text-gray-600"
            >
              <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white border border-indigo-300 rounded-lg flex items-center justify-center">
                <FaCode className="w-3 h-3 sm:w-4 sm:h-4 text-indigo-600" />
              </div>
              <span>CodeLens © 2025 Built with</span>
              <FaHeart className="w-3 h-3 text-indigo-600" />
              <span>by</span>
              <a href="https://harshit02.vercel.app/" className="text-indigo-600 underline" target="_blank">Harshit Shukla</a>
            </motion.div>

            {/* Right side - Social Links */}
            <motion.div
              initial={{ y: 10, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              viewport={{ once: true }}
              className="flex items-center space-x-4"
            >
              <motion.a
                href="https://github.com/Harshitshukla0208"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                <FaGithub className="w-5 h-5" />
              </motion.a>
              <motion.a
                href="https://www.linkedin.com/in/harshit-shukla-9a5950239/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="text-gray-700 hover:text-indigo-600 transition-colors duration-200"
              >
                <FaLinkedin className="w-5 h-5" />
              </motion.a>
            </motion.div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage