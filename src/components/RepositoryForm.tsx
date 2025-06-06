'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Loader2, Github, GitBranch, Eye, EyeOff } from 'lucide-react';

interface RepositoryFormProps {
    onAnalysisStart: (analysisId: string) => void;
}

export function RepositoryForm({ onAnalysisStart }: RepositoryFormProps) {
    const [repositoryUrl, setRepositoryUrl] = useState('');
    const [includeGitHubIssues, setIncludeGitHubIssues] = useState(true);
    const [githubToken, setGithubToken] = useState('');
    const [showToken, setShowToken] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const validateUrl = (url: string): boolean => {
        const githubPattern = /^https:\/\/github\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
        const gitlabPattern = /^https:\/\/gitlab\.com\/[\w\-\.]+\/[\w\-\.]+\/?$/;
        return githubPattern.test(url.trim()) || gitlabPattern.test(url.trim());
    };

    const isGitHubUrl = (url: string): boolean => {
        return url.includes('github.com');
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!repositoryUrl.trim()) {
            setError('Please enter a repository URL');
            return;
        }

        if (!validateUrl(repositoryUrl)) {
            setError('Please enter a valid GitHub or GitLab repository URL');
            return;
        }

        if (includeGitHubIssues && !isGitHubUrl(repositoryUrl)) {
            setError('GitHub issues analysis is only available for GitHub repositories');
            return;
        }

        setIsLoading(true);

        try {
            const requestBody: any = {
                repositoryUrl: repositoryUrl.trim(),
                includeGitHubIssues: includeGitHubIssues && isGitHubUrl(repositoryUrl)
            };

            // Only include GitHub token if provided and issues analysis is enabled
            if (includeGitHubIssues && isGitHubUrl(repositoryUrl) && githubToken.trim()) {
                requestBody.githubToken = githubToken.trim();
            }

            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/analyze`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestBody),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to start analysis');
            }

            onAnalysisStart(data.analysisId);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const url = e.target.value;
        setRepositoryUrl(url);
        
        // Auto-disable GitHub issues if not a GitHub URL
        if (!isGitHubUrl(url) && includeGitHubIssues) {
            setIncludeGitHubIssues(false);
        }
        
        if (error) setError(''); // Clear error when user starts typing
    };

    const handleIssuesToggle = (checked: boolean) => {
        if (checked && !isGitHubUrl(repositoryUrl)) {
            setError('GitHub issues analysis is only available for GitHub repositories');
            return;
        }
        setIncludeGitHubIssues(checked);
        if (error) setError('');
    };

    const exampleUrls = [
        'https://github.com/facebook/react',
        'https://github.com/microsoft/vscode',
        'https://github.com/nodejs/node'
    ];

    const estimatedTime = includeGitHubIssues && isGitHubUrl(repositoryUrl) ? '3-7 minutes' : '2-5 minutes';

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center justify-center gap-2 text-2xl">
                    <GitBranch className="h-6 w-6 text-blue-600" />
                    Analyze Repository
                </CardTitle>
                <CardDescription className="text-base">
                    Enter a public GitHub or GitLab repository URL to get started
                </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="repo-url" className="text-sm font-medium text-gray-700">
                            Repository URL
                        </label>
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Github className="h-5 w-5 text-gray-400" />
                            </div>
                            <Input
                                id="repo-url"
                                type="url"
                                placeholder="https://github.com/username/repository"
                                value={repositoryUrl}
                                onChange={handleUrlChange}
                                className="pl-10 h-12 text-base"
                                disabled={isLoading}
                            />
                        </div>
                    </div>

                    {/* GitHub Issues Analysis Toggle */}
                    <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="include-issues"
                                checked={includeGitHubIssues}
                                onCheckedChange={handleIssuesToggle}
                                disabled={isLoading || !isGitHubUrl(repositoryUrl)}
                            />
                            <Label 
                                htmlFor="include-issues" 
                                className={`text-sm font-medium ${!isGitHubUrl(repositoryUrl) ? 'text-gray-400' : 'text-gray-700'}`}
                            >
                                Analyze GitHub Issues & Pull Requests
                            </Label>
                        </div>
                        
                        {includeGitHubIssues && isGitHubUrl(repositoryUrl) && (
                            <div className="space-y-2 pl-6 border-l-2 border-blue-200">
                                <label htmlFor="github-token" className="text-sm font-medium text-gray-700">
                                    GitHub Token (Optional)
                                </label>
                                <p className="text-xs text-gray-500 mb-2">
                                    Provide a GitHub personal access token to avoid rate limits and access private repositories
                                </p>
                                <div className="relative">
                                    <Input
                                        id="github-token"
                                        type={showToken ? "text" : "password"}
                                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                                        value={githubToken}
                                        onChange={(e) => setGithubToken(e.target.value)}
                                        className="pr-10"
                                        disabled={isLoading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowToken(!showToken)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        disabled={isLoading}
                                    >
                                        {showToken ? (
                                            <EyeOff className="h-4 w-4 text-gray-400" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400" />
                                        )}
                                    </button>
                                </div>
                                <p className="text-xs text-gray-500">
                                    <a 
                                        href="https://github.com/settings/tokens" 
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Create a GitHub token
                                    </a> with 'repo' scope for private repositories
                                </p>
                            </div>
                        )}
                        
                        {!isGitHubUrl(repositoryUrl) && repositoryUrl && (
                            <p className="text-xs text-gray-500 pl-6">
                                GitHub issues analysis is only available for GitHub repositories
                            </p>
                        )}
                    </div>

                    {error && (
                        <Alert variant="destructive">
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        disabled={isLoading || !repositoryUrl.trim()}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                Starting Analysis...
                            </>
                        ) : (
                            `Analyze Repository (${estimatedTime})`
                        )}
                    </Button>
                </form>

                {/* Example URLs */}
                <div className="space-y-3">
                    <p className="text-sm font-medium text-gray-700">Try these examples:</p>
                    <div className="space-y-2">
                        {exampleUrls.map((url, index) => (
                            <button
                                key={index}
                                onClick={() => setRepositoryUrl(url)}
                                className="block w-full text-left px-3 py-2 text-sm text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                disabled={isLoading}
                            >
                                {url}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Info section */}
                <div className="bg-blue-50 rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-blue-900">What we analyze:</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Security vulnerabilities and potential risks</li>
                        <li>• Code quality and best practices</li>
                        <li>• Performance optimization opportunities</li>
                        <li>• Maintainability and technical debt</li>
                        <li>• Detailed file-by-file recommendations</li>
                        {includeGitHubIssues && isGitHubUrl(repositoryUrl) && (
                            <>
                                <li>• GitHub issues categorization and prioritization</li>
                                <li>• Issue effort estimation and insights</li>
                                <li>• Codebase correlation with reported issues</li>
                            </>
                        )}
                    </ul>
                </div>

                <div className="text-center text-xs text-gray-500">
                    <p>Only public repositories are supported (unless GitHub token provided). Analysis typically takes {estimatedTime}.</p>
                    <p className="mt-1">Repository size limit: 100MB</p>
                </div>
            </CardContent>
        </Card>
    );
}