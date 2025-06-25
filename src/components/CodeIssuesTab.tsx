// src/components/CodeIssuesTab.tsx

import React, { useState } from 'react';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import type { FileAnalysis, FileIssue } from '../types';
import { ChevronDownIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import ReactMarkdown from 'react-markdown';
import AutoFixButton from './AutoFixButton';

interface Props {
    fileAnalyses: FileAnalysis[];
    analysisId: string;
    githubToken: string;
    repositoryUrl: string;
}

const severityConfig = {
    critical: { color: 'bg-red-500', text: 'Critical' },
    high: { color: 'bg-orange-500', text: 'High' },
    medium: { color: 'bg-yellow-500', text: 'Medium' },
    low: { color: 'bg-blue-500', text: 'Low' },
};

// Enhanced Error Display Component

// Enhanced Issue Row Component
const IssueRow: React.FC<{ 
    issue: FileIssue; 
    analysisId: string; 
    githubToken: string; 
    filePath: string; 
    owner: string; 
    repo: string; 
}> = ({ issue, analysisId, githubToken, filePath, owner, repo }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [showRefreshSuggestion, setShowRefreshSuggestion] = useState(false);
    const severity = severityConfig[issue.severity] || severityConfig.low;

    const handleRefreshSuggestion = () => {
        setShowRefreshSuggestion(true);
    };

    return (
        <>
            <tr onClick={() => setIsOpen(!isOpen)} className="cursor-pointer hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-mono">{issue.line || 'N/A'}</td>
                <td className="px-4 py-3">
                    <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full text-white ${severity.color}`}>
                        {severity.text}
                    </span>
                </td>
                <td className="px-4 py-3 text-sm">{issue.message}</td>
                <td className="px-4 py-3 text-sm capitalize">{issue.type}</td>
                <td className="px-4 py-3 text-sm">
                    {isOpen ? <ChevronDownIcon className="h-4 w-4 text-gray-600" /> : <ChevronRightIcon className="h-4 w-4 text-gray-400" />}
                </td>
            </tr>
            {isOpen && (
                <tr className="bg-gray-50 border-l-4 border-indigo-500">
                    <td colSpan={5} className="p-4 space-y-4">
                        <div className="prose prose-sm max-w-none">
                            <ReactMarkdown>{issue.suggestion.description}</ReactMarkdown>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                            <AutoFixButton
                                githubToken={githubToken}
                                owner={owner}
                                repo={repo}
                                filePath={filePath}
                                originalCode={issue.suggestion.originalCode}
                                fixedCode={issue.suggestion.fixedCode}
                                analysisId={analysisId}
                                onRefreshSuggestion={handleRefreshSuggestion}
                            />
                        </div>

                        {/* Show refresh suggestion if auto-fix failed */}
                        {showRefreshSuggestion && (
                            <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded">
                                <p className="text-yellow-800 mb-2">
                                    💡 The file may have changed since analysis. Try refreshing for updated suggestions.
                                </p>
                            </div>
                        )}
                        
                        <ReactDiffViewer
                            oldValue={issue.suggestion.originalCode}
                            newValue={issue.suggestion.fixedCode}
                            splitView={true}
                            compareMethod={DiffMethod.WORDS}
                            useDarkTheme={true}
                            leftTitle="Original Code"
                            rightTitle="Suggested Fix"
                        />
                    </td>
                </tr>
            )}
        </>
    );
};

const CodeIssuesTab: React.FC<Props> = ({ fileAnalyses, analysisId, githubToken, repositoryUrl }) => {
    // Extract owner and repo from repositoryUrl inside the component
    const match = repositoryUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    const owner = match ? match[1] : '';
    const repo = match ? match[2].replace('.git', '') : '';

    const sortedFiles = fileAnalyses
        .filter(file => file.issues.length > 0)
        .sort((a, b) => b.issues.length - a.issues.length);

    return (
        <div className="space-y-6">
            {sortedFiles.map(file => (
                <details key={file.filePath} className="bg-white p-4 rounded-lg shadow-sm" open>
                    <summary className="font-bold cursor-pointer text-lg flex justify-between items-center">
                        <div>
                            <span className="text-indigo-600 font-mono">{file.filePath}</span>
                            <span className="ml-2 text-sm font-normal text-gray-500">({file.issues.length} issues)</span>
                        </div>
                        <span className="text-base font-semibold">Score: {file.score}/100</span>
                    </summary>
                    <div className="mt-4 overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Severity</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Message</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                                    <th className="px-4 py-2 w-10"></th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {file.issues.map((issue, index) =>
                                    <IssueRow
                                        key={index}
                                        issue={issue}
                                        analysisId={analysisId}
                                        githubToken={githubToken}
                                        filePath={file.filePath}
                                        owner={owner}
                                        repo={repo}
                                    />
                                )}
                            </tbody>
                        </table>
                    </div>
                </details>
            ))}
        </div>
    );
};

export default CodeIssuesTab;