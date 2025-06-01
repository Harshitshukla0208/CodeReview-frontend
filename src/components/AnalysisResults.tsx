// components/AnalysisResults.tsx (Updated to match backend structure)
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
    Loader2,
    ArrowLeft,
    Shield,
    Code,
    Zap,
    Settings,
    AlertTriangle,
    CheckCircle,
    XCircle,
    Clock,
    FileText,
    BarChart3,
    Download,
    ExternalLink,
    TrendingUp,
    TrendingDown,
    Minus
} from 'lucide-react';

interface AnalysisResultsProps {
    analysisId: string;
    onNewAnalysis: () => void;
    onComplete: () => void;
}

// Updated interfaces to match backend structure
interface CategoryScore {
    score: number;
    issues: number;
    criticalIssues: number;
    suggestions: string[];
    details: string[];
}

interface FileAnalysis {
    filePath: string;
    score: number;
    issues: Array<{
        line?: number;
        type: 'security' | 'performance' | 'quality' | 'style' | 'bug';
        severity: 'low' | 'medium' | 'high' | 'critical';
        message: string;
        suggestion: string;
    }>;
    suggestions: string[];
    complexity: 'low' | 'medium' | 'high';
    maintainability: number;
}

interface FinalReport {
    overview: {
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
    summary: string;
}

interface AnalysisData {
    id: string;
    status: 'processing' | 'completed' | 'failed';
    progress?: number;
    currentStep?: string;
    repositoryUrl: string;
    repositoryName?: string;
    error?: string;
    results?: FinalReport;
    createdAt: string;
    completedAt?: string;
}

export function AnalysisResults({ analysisId, onNewAnalysis, onComplete }: AnalysisResultsProps) {
    const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchAnalysisData();

        // Poll for updates if analysis is still processing
        const interval = setInterval(() => {
            if (analysisData?.status === 'processing') {
                fetchAnalysisData();
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [analysisId, analysisData?.status]);

    const fetchAnalysisData = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze/${analysisId}`);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to fetch analysis data');
            }

            setAnalysisData(data);

            if (data.status === 'completed' || data.status === 'failed') {
                onComplete();
            }
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
                    <p className="text-gray-600">Loading analysis data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                    <Button onClick={onNewAnalysis} className="mt-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Start New Analysis
                    </Button>
                </CardContent>
            </Card>
        );
    }

    if (!analysisData) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                    <p className="text-center text-gray-600">Analysis not found</p>
                    <Button onClick={onNewAnalysis} className="mt-4 mx-auto block">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Start New Analysis
                    </Button>
                </CardContent>
            </Card>
        );
    }

    // Processing state
    if (analysisData.status === 'processing') {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader className="text-center">
                    <CardTitle className="flex items-center justify-center gap-2">
                        <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
                        Analyzing Repository
                    </CardTitle>
                    <CardDescription>
                        {analysisData.repositoryUrl}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>{analysisData.progress || 0}%</span>
                        </div>
                        <Progress value={analysisData.progress || 0} className="h-2" />
                    </div>

                    {analysisData.currentStep && (
                        <div className="text-center">
                            <p className="text-sm text-gray-600">{analysisData.currentStep}</p>
                        </div>
                    )}

                    <div className="bg-blue-50 rounded-lg p-4">
                        <h4 className="font-medium text-blue-900 mb-2">What's happening:</h4>
                        <ul className="text-sm text-blue-800 space-y-1">
                            <li>• Cloning your repository</li>
                            <li>• Discovering code files</li>
                            <li>• Running AI analysis on each file</li>
                            <li>• Generating comprehensive report</li>
                        </ul>
                    </div>

                    <div className="text-center">
                        <Button variant="outline" onClick={onNewAnalysis}>
                            Cancel & Start New
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Failed state
    if (analysisData.status === 'failed') {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-red-600">
                        <XCircle className="h-6 w-6" />
                        Analysis Failed
                    </CardTitle>
                    <CardDescription>
                        {analysisData.repositoryUrl}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                            {analysisData.error || 'The analysis failed to complete. Please try again.'}
                        </AlertDescription>
                    </Alert>

                    <div className="flex gap-2">
                        <Button onClick={() => fetchAnalysisData()} variant="outline">
                            Retry Analysis
                        </Button>
                        <Button onClick={onNewAnalysis}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Start New Analysis
                        </Button>
                    </div>
                </CardContent>
            </Card>
        );
    }

    // Completed state - show results  
    const { results } = analysisData;
    if (!results) {
        return (
            <Card className="max-w-2xl mx-auto">
                <CardContent className="pt-6">
                    <p className="text-center text-gray-600">No results available</p>
                    <Button onClick={onNewAnalysis} className="mt-4 mx-auto block">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Start New Analysis
                    </Button>
                </CardContent>
            </Card>
        );
    }

    const getRiskColor = (severity: string) => {
        switch (severity) {
            case 'low': return 'text-green-600 bg-green-100';
            case 'medium': return 'text-yellow-600 bg-yellow-100';
            case 'high': return 'text-orange-600 bg-orange-100';
            case 'critical': return 'text-red-600 bg-red-100';
            default: return 'text-gray-600 bg-gray-100';
        }
    };

    const getScoreColor = (score: number) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        if (score >= 40) return 'text-orange-600';
        return 'text-red-600';
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'security': return <Shield className="h-4 w-4" />;
            case 'quality': 
            case 'bug':
                return <Code className="h-4 w-4" />;
            case 'performance': return <Zap className="h-4 w-4" />;
            case 'maintainability':
            case 'style': 
                return <Settings className="h-4 w-4" />;
            default: return <FileText className="h-4 w-4" />;
        }
    };

    // Calculate analysis time (fallback if not provided)
    const analysisTime = analysisData.completedAt && analysisData.createdAt 
        ? Math.floor((new Date(analysisData.completedAt).getTime() - new Date(analysisData.createdAt).getTime()) / 1000)
        : 0;

    const formatDuration = (seconds: number) => {
        if (seconds < 60) return `${seconds}s`;
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}m ${remainingSeconds}s`;
    };

    // Collect all issues from file analysis
    const allIssues = results.fileAnalysis.flatMap((file, fileIndex) => 
        file.issues.map((issue, issueIndex) => ({
            id: `${fileIndex}-${issueIndex}`,
            ...issue,
            file: file.filePath
        }))
    );

    // Get unique languages from file extensions
    const languages = [...new Set(results.fileAnalysis.map(file => {
        const ext = file.filePath.split('.').pop()?.toLowerCase();
        const langMap: Record<string, string> = {
            'js': 'JavaScript',
            'jsx': 'React',
            'ts': 'TypeScript', 
            'tsx': 'React TypeScript',
            'py': 'Python',
            'java': 'Java',
            'cpp': 'C++',
            'c': 'C',
            'go': 'Go',
            'rs': 'Rust',
            'php': 'PHP',
            'rb': 'Ruby',
            'swift': 'Swift',
            'kt': 'Kotlin',
            'cs': 'C#',
            'html': 'HTML',
            'css': 'CSS',
            'scss': 'SCSS'
        };
        return langMap[ext || ''] || ext?.toUpperCase() || 'Unknown';
    }))];

    return (
        <div className="max-w-6xl mx-auto space-y-6">
            {/* Header */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="flex items-center gap-2">
                                <CheckCircle className="h-6 w-6 text-green-600" />
                                Analysis Complete
                            </CardTitle>
                            <CardDescription className="flex items-center gap-4 mt-2">
                                <span>{analysisData.repositoryUrl}</span>
                                <span className="text-xs text-gray-500">•</span>
                                <span className="text-xs text-gray-500">
                                    <Clock className="h-3 w-3 inline mr-1" />
                                    {formatDuration(analysisTime)}
                                </span>
                            </CardDescription>
                        </div>
                        <div className="flex gap-2">
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Export
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => window.open(analysisData.repositoryUrl, '_blank')}>
                                <ExternalLink className="h-4 w-4 mr-2" />
                                View Repo
                            </Button>
                            <Button onClick={onNewAnalysis}>
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                New Analysis
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Summary Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className={`text-3xl font-bold ${getScoreColor(results.overview.overallScore)}`}>
                                {results.overview.overallScore}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Overall Score</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{results.overview.totalFiles}</div>
                            <p className="text-sm text-gray-600 mt-1">Files Analyzed</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">
                                {results.overview.linesOfCode.toLocaleString()}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">Lines of Code</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <div className="text-center">
                            <div className="text-2xl font-bold text-gray-900">{allIssues.length}</div>
                            <p className="text-sm text-gray-600 mt-1">Issues Found</p>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Detailed Results */}
            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="issues">Issues</TabsTrigger>
                    <TabsTrigger value="files">Files</TabsTrigger>
                    <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                    {/* Score Breakdown */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Score Breakdown
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Shield className="h-4 w-4 text-blue-600" />
                                            <span className="text-sm font-medium">Security</span>
                                        </div>
                                        <span className={`font-bold ${getScoreColor(results.categories.security.score)}`}>
                                            {results.categories.security.score}
                                        </span>
                                    </div>
                                    <Progress value={results.categories.security.score} className="h-2" />
                                    <p className="text-xs text-gray-600">
                                        {results.categories.security.issues} issues, {results.categories.security.criticalIssues} critical
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Code className="h-4 w-4 text-green-600" />
                                            <span className="text-sm font-medium">Code Quality</span>
                                        </div>
                                        <span className={`font-bold ${getScoreColor(results.categories.codeQuality.score)}`}>
                                            {results.categories.codeQuality.score}
                                        </span>
                                    </div>
                                    <Progress value={results.categories.codeQuality.score} className="h-2" />
                                    <p className="text-xs text-gray-600">
                                        {results.categories.codeQuality.issues} issues, {results.categories.codeQuality.criticalIssues} critical
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Zap className="h-4 w-4 text-yellow-600" />
                                            <span className="text-sm font-medium">Performance</span>
                                        </div>
                                        <span className={`font-bold ${getScoreColor(results.categories.performance.score)}`}>
                                            {results.categories.performance.score}
                                        </span>
                                    </div>
                                    <Progress value={results.categories.performance.score} className="h-2" />
                                    <p className="text-xs text-gray-600">
                                        {results.categories.performance.issues} issues, {results.categories.performance.criticalIssues} critical
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <Settings className="h-4 w-4 text-purple-600" />
                                            <span className="text-sm font-medium">Maintainability</span>
                                        </div>
                                        <span className={`font-bold ${getScoreColor(results.categories.maintainability.score)}`}>
                                            {results.categories.maintainability.score}
                                        </span>
                                    </div>
                                    <Progress value={results.categories.maintainability.score} className="h-2" />
                                    <p className="text-xs text-gray-600">
                                        {results.categories.maintainability.issues} issues
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Languages */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Languages Detected</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {languages.map((lang, index) => (
                                    <Badge key={index} variant="secondary">{lang}</Badge>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Repository Summary */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Analysis Summary</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-gray-700">{results.summary}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="issues" className="space-y-4">
                    {allIssues.length === 0 ? (
                        <Card>
                            <CardContent className="pt-6 text-center">
                                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                                <p className="text-gray-600">No issues found! Your code looks great.</p>
                            </CardContent>
                        </Card>
                    ) : (
                        allIssues.map((issue) => (
                            <Card key={issue.id}>
                                <CardContent className="pt-6">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {getTypeIcon(issue.type)}
                                                <h3 className="font-medium">{issue.message}</h3>
                                                <Badge className={getRiskColor(issue.severity)}>
                                                    {issue.severity}
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                                                <span>{issue.file}</span>
                                                {issue.line && <span>Line {issue.line}</span>}
                                            </div>
                                            <div className="bg-blue-50 rounded-lg p-3">
                                                <p className="text-sm text-blue-800">
                                                    <strong>Suggestion:</strong> {issue.suggestion}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))
                    )}
                </TabsContent>

                <TabsContent value="files" className="space-y-4">
                    {results.fileAnalysis.map((file, index) => (
                        <Card key={index}>
                            <CardContent className="pt-6">
                                <div className="flex items-center justify-between mb-3">
                                    <h3 className="font-medium">{file.filePath}</h3>
                                    <div className="flex items-center gap-2">
                                        <Badge variant={file.complexity === 'high' ? 'destructive' : file.complexity === 'medium' ? 'secondary' : 'outline'}>
                                            {file.complexity} complexity
                                        </Badge>
                                        <span className={`font-bold ${getScoreColor(file.score)}`}>
                                            {file.score}/100
                                        </span>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-600 mb-3">
                                    {file.issues.length} issues found • Maintainability: {file.maintainability}/100
                                </p>
                                <div className="space-y-2">
                                    {file.suggestions.map((suggestion, idx) => (
                                        <div key={idx} className="text-sm text-gray-700 bg-gray-50 rounded p-2">
                                            • {suggestion}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-4">
                    {results.recommendations.immediate.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-red-600">🚨 Immediate Actions</CardTitle>
                                <CardDescription>
                                    Critical issues that should be addressed right away
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    {results.recommendations.immediate.map((recommendation, index) => (
                                        <div key={index} className="flex items-start gap-3 p-4 bg-red-50 rounded-lg border border-red-200">
                                            <div className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {index + 1}
                                            </div>
                                            <p className="text-sm text-red-900">{recommendation}</p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-yellow-600">📋 Short-term Improvements</CardTitle>
                            <CardDescription>
                                Important improvements to implement in the coming weeks
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {results.recommendations.shortTerm.map((recommendation, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                                        <div className="w-6 h-6 bg-yellow-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-yellow-900">{recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-blue-600">🎯 Long-term Goals</CardTitle>
                            <CardDescription>
                                Strategic improvements for future development
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {results.recommendations.longTerm.map((recommendation, index) => (
                                    <div key={index} className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                        <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                                            {index + 1}
                                        </div>
                                        <p className="text-sm text-blue-900">{recommendation}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}