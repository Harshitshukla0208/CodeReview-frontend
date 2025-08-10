// API Configuration
const API_BASE_URL = 'https://codereview-backend-pau3.onrender.com'

// API endpoints
export const API_ENDPOINTS = {
  ANALYZE: `${API_BASE_URL}/analyze`,
  HEALTH: `${API_BASE_URL}/health`,
  PR_CREATE: `${API_BASE_URL}/pr/create`,
  PR_FIX_AUTO: `${API_BASE_URL}/pr/fix/auto`,
} as const

// Helper function for API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, defaultOptions)
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
    }
    
    return response
  } catch (error) {
    console.error('API call failed:', error)
    throw error
  }
}

// Specific API functions
export const api = {
  // Analysis endpoints
  startAnalysis: async (repoUrl: string, githubToken: string) => {
    return apiCall(API_ENDPOINTS.ANALYZE, {
      method: 'POST',
      body: JSON.stringify({ repo_url: repoUrl, github_token: githubToken }),
    })
  },

  getAnalysisStatus: async (analysisId: string) => {
    return apiCall(`${API_ENDPOINTS.ANALYZE}/${analysisId}`)
  },

  refreshAnalysis: async (analysisId: string) => {
    return apiCall(`${API_ENDPOINTS.ANALYZE}/${analysisId}/refresh`, {
      method: 'POST',
    })
  },

  // PR endpoints
  createPR: async (data: any) => {
    return apiCall(API_ENDPOINTS.PR_CREATE, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  autoFixPR: async (data: any) => {
    return apiCall(API_ENDPOINTS.PR_FIX_AUTO, {
      method: 'POST',
      body: JSON.stringify(data),
    })
  },

  // Health check
  healthCheck: async () => {
    return apiCall(API_ENDPOINTS.HEALTH)
  },
}
