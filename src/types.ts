// src/types.ts

export interface CategoryScore {
  score: number
  issues: number
  criticalIssues: number
  suggestions: string[]
  details: string[]
}

export interface FileIssueSuggestion {
  description: string
  originalCode: string
  fixedCode: string
}

export interface FileIssue {
  line?: number
  type: "security" | "performance" | "quality" | "style" | "bug"
  severity: "low" | "medium" | "high" | "critical"
  message: string
  suggestion: FileIssueSuggestion
}

export interface FileAnalysis {
  filePath: string
  score: number
  issues: FileIssue[]
  suggestions: string[]
  complexity: "low" | "medium" | "high"
  maintainability: number
}

export interface GitHubIssueData {
  id: number
  number: number
  title: string
  body: string
  state: "open" | "closed"
  author: string
  url: string
}

export interface GitHubIssueAnalysis {
  issue: GitHubIssueData
  category: string
  priority: string
  relatedFiles: string[]
  estimatedEffort: string
  solution: {
    summary: string
    filePath?: string
    originalCode?: string
    fixedCode?: string
  }
}

export interface FinalReport {
  overview: {
    totalFiles: number
    linesOfCode: number
    overallScore: number
    riskLevel: "low" | "medium" | "high" | "critical"
    repositoryName: string
    [x: string]: string | number | "low" | "medium" | "high" | "critical"
  }
  categories: {
    codeQuality: CategoryScore
    security: CategoryScore
    performance: CategoryScore
    maintainability: CategoryScore
  }
  fileAnalysis: FileAnalysis[]
  recommendations: {
    immediate: string[]
    shortTerm: string[]
    longTerm: string[]
  }
  githubIssues?: {
    totalIssues: number
    analyses: GitHubIssueAnalysis[]
  }
}

export interface AnalysisResponse {
  id: string
  status: "processing" | "completed" | "failed"
  progress: number
  results?: FinalReport
  error?: string
}

export interface CreatePRBody {
  analysisId: string
  githubToken: string
  issueIdentifier: string
  issueType: "code" | "github"
  filePath?: string
  originalCode?: string
}

export interface User {
  id: string
  email: string
  github_username?: string
  created_at: string
  updated_at: string
}
