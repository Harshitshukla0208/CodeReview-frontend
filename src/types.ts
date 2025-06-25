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