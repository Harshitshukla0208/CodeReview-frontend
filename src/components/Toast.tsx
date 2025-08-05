"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimes } from "react-icons/fa"

export type ToastType = "success" | "error" | "info" | "warning"

interface ToastProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  const getToastConfig = () => {
    switch (type) {
      case "success":
        return {
          icon: <FaCheckCircle className="w-5 h-5" />,
          bgColor: "bg-green-500",
          textColor: "text-white",
          borderColor: "border-green-600",
        }
      case "error":
        return {
          icon: <FaExclamationTriangle className="w-5 h-5" />,
          bgColor: "bg-red-500",
          textColor: "text-white",
          borderColor: "border-red-600",
        }
      case "warning":
        return {
          icon: <FaExclamationTriangle className="w-5 h-5" />,
          bgColor: "bg-yellow-500",
          textColor: "text-white",
          borderColor: "border-yellow-600",
        }
      case "info":
        return {
          icon: <FaInfoCircle className="w-5 h-5" />,
          bgColor: "bg-blue-500",
          textColor: "text-white",
          borderColor: "border-blue-600",
        }
      default:
        return {
          icon: <FaInfoCircle className="w-5 h-5" />,
          bgColor: "bg-gray-500",
          textColor: "text-white",
          borderColor: "border-gray-600",
        }
    }
  }

  const config = getToastConfig()

  return (
    <motion.div
      initial={{ opacity: 0, y: -50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ type: "spring", duration: 0.5 }}
      className={`${config.bgColor} ${config.textColor} rounded-xl shadow-2xl p-4 max-w-sm w-full border-l-4 ${config.borderColor} backdrop-blur-sm`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">{config.icon}</div>
          <p className="text-sm font-medium leading-relaxed">{message}</p>
        </div>
        <button onClick={onClose} className="ml-4 flex-shrink-0 p-1 hover:bg-white/20 rounded-full transition-colors">
          <FaTimes className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  )
}

interface ToastContextType {
  showToast: (message: string, type: ToastType) => void
}

const ToastContext = React.createContext<ToastContextType | undefined>(undefined)

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Array<{ id: number; message: string; type: ToastType }>>([])

  const showToast = (message: string, type: ToastType) => {
    const id = Date.now()
    setToasts((prev) => [...prev, { id, message, type }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  // Add toast to window object for global access
  useEffect(() => {
    if (typeof window !== "undefined") {
      ;(window as any).toast = {
        success: (message: string) => showToast(message, "success"),
        error: (message: string) => showToast(message, "error"),
        warning: (message: string) => showToast(message, "warning"),
        info: (message: string) => showToast(message, "info"),
      }
    }
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-4 right-4 z-50 space-y-3">
        <AnimatePresence>
          {toasts.map((toast) => (
            <Toast key={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  )
}

export const useToast = () => {
  const context = React.useContext(ToastContext)
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}

export default Toast
