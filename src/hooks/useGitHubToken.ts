"use client"

import { useState } from "react"

export const useGitHubToken = () => {
  const [token, setToken] = useState<string>("")

  const saveToken = (newToken: string) => {
    setToken(newToken)
    // Store in localStorage for session persistence
    if (typeof window !== "undefined") {
      localStorage.setItem("github_token", newToken)
    }
  }

  const loadToken = () => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("github_token")
      if (stored) {
        setToken(stored)
      }
    }
  }

  const clearToken = () => {
    setToken("")
    if (typeof window !== "undefined") {
      localStorage.removeItem("github_token")
    }
  }

  // Load token on first use
  if (!token && typeof window !== "undefined") {
    loadToken()
  }

  return {
    token,
    setToken: saveToken,
    clearToken,
    loading: false,
  }
}
