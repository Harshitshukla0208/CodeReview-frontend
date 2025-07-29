// src/types.ts

export interface CategoryScore {
    score: number;
    issues: number;
    criticalIssues: number;
    suggestions: string[];
    details: string[];
}

export interface FileIssueSuggestion {
    description: string;
    originalCode: string;
    fixedCode: string;
}

export interface FileIssue {
    line?: number;
    type: 'security' | 'performance' | 'quality' | 'style' | 'bug';
    severity: 'low' | 'medium' | 'high' | 'critical';
    message: string;
    suggestion: FileIssueSuggestion; // <-- Updated
}

export interface FileAnalysis {
    filePath: string;
    score: number;
    issues: FileIssue[];
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
    maintainability: number;
}

export interface GitHubIssueData {
    id: number;
    number: number;
    title: string;
    body: string;
    state: 'open' | 'closed';
    author: string;
    url: string;
}

export interface GitHubIssueAnalysis {
    issue: GitHubIssueData;
    category: string;
    priority: string;
    relatedFiles: string[];
    estimatedEffort: string;
    solution: { // <-- Solution for GitHub issues
        summary: string;
        filePath?: string;
        originalCode?: string;
        fixedCode?: string;
    };
}

export interface FinalReport {
    overview: {
        [x: string]: string;
        totalFiles: number;
        linesOfCode: number;
        overallScore: number;
        riskLevel: 'low' | 'medium' | 'high' | 'critical';
        repositoryName: string;
    };
    categories: {
        codeQuality: CategoryScore;
        security: CategoryScore;
        performance: CategoryScore;
        maintainability: CategoryScore;
    };
    fileAnalysis: FileAnalysis[];
    recommendations: {
        immediate: string[];
        shortTerm: string[];
        longTerm: string[];
    };
    githubIssues?: {
        totalIssues: number;
        analyses: GitHubIssueAnalysis[];
    };
}

export interface AnalysisResponse {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    results?: FinalReport;
    error?: string;
}

export interface CreatePRBody {
    analysisId: string;
    githubToken: string;
    issueIdentifier: string; // A unique string for the issue (e.g., file path or issue number)
    issueType: 'code' | 'github';
    // For 'code' type, these are needed to find the specific issue
    filePath?: string;
    originalCode?: string;
}

// Database types
export interface DatabaseAnalysis {
    id: string;
    user_id: string;
    repository_url: string;
    github_token?: string;
    status: 'processing' | 'completed' | 'failed';
    progress: number;
    results?: FinalReport;
    error?: string;
    created_at: string;
    updated_at: string;
}

export interface DatabaseGitHubRepo {
    id: number;
    user_id: string;
    name: string;
    full_name: string;
    html_url: string;
    description?: string;
    private: boolean;
    fork: boolean;
    stargazers_count: number;
    language?: string;
    created_at: string;
    updated_at: string;
}

export interface User {
    id: string;
    email: string;
    github_username?: string;
    created_at: string;
    updated_at: string;
}