// src/components/GitHubIssuesTab.tsx

import React from 'react';
import ReactMarkdown from 'react-markdown';
import ReactDiffViewer, { DiffMethod } from 'react-diff-viewer';
import type { GitHubIssueAnalysis } from '../types';
import CreatePRButton from './CreatePRButton';

interface Props {
    githubIssues: { analyses: GitHubIssueAnalysis[] };
    analysisId: string;
    githubToken: string;
}

const priorityConfig = {
    critical: { border: 'border-red-500' },
    high: { border: 'border-orange-500' },
    medium: { border: 'border-yellow-500' },
    low: { border: 'border-blue-500' },
};

const GitHubIssueCard: React.FC<{ 
    analysis: GitHubIssueAnalysis, 
    analysisId: string, 
    githubToken: string 
}> = ({ analysis, analysisId, githubToken }) => {
    const { issue, solution, category, priority } = analysis;
    const config = priorityConfig[priority as keyof typeof priorityConfig] || priorityConfig.low;
    const hasCodeSolution = solution.filePath && solution.originalCode && solution.fixedCode;

    return (
        <div className={`bg-white p-6 rounded-lg shadow-md border-l-4 ${config.border}`}>
            <div className="flex justify-between items-start mb-4">
                <h4 className="font-bold text-xl">
                    <a href={issue.url} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                        #{issue.number}: {issue.title}
                    </a>
                </h4>
                <div className="flex-shrink-0 ml-4">
                    <span className="font-semibold capitalize px-2 py-1 bg-gray-200 text-gray-800 rounded-full text-xs">{category}</span>
                </div>
            </div>

            <div className="prose prose-sm max-w-none text-gray-700 mb-6 border-b pb-4">
                <ReactMarkdown>{issue.body || 'No description provided.'}</ReactMarkdown>
            </div>

            <div className="mb-6">
                <h5 className="font-bold text-lg text-gray-800 mb-3">✨ AI Suggested Solution</h5>
                <div className="prose prose-sm max-w-none text-gray-700 mb-4">
                    <ReactMarkdown>{solution.summary}</ReactMarkdown>
                </div>

                {hasCodeSolution && (
                    <div>
                        <p className="text-sm font-semibold mb-2 text-gray-600">
                            File: <span className="font-mono bg-gray-100 p-1 rounded">{solution.filePath}</span>
                        </p>
                        <ReactDiffViewer
                            oldValue={solution.originalCode}
                            newValue={solution.fixedCode}
                            splitView={true}
                            compareMethod={DiffMethod.WORDS}
                            useDarkTheme={true}
                            leftTitle="Original Code"
                            rightTitle="Suggested Fix"
                        />
                        <div className="mt-4">
                            <CreatePRButton
                                githubToken={githubToken}
                                prBody={{
                                    analysisId,
                                    issueType: 'github',
                                    issueIdentifier: analysis.issue.number.toString(),
                                    filePath: solution.filePath,
                                    originalCode: solution.originalCode,
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="mt-6 pt-4 border-t text-xs text-gray-500">
                <span>Priority: <span className="font-semibold capitalize">{priority}</span></span>
                <span className="mx-2">|</span>
                <span>Author: <span className="font-semibold">{issue.author}</span></span>
            </div>
        </div>
    );
};

const GitHubIssuesTab: React.FC<Props> = ({ githubIssues, analysisId, githubToken }) => {
  const sortedAnalyses = [...githubIssues.analyses].sort((a, b) => {
      const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder];
  });

  return (
    <div className="space-y-6">
      {sortedAnalyses.map((analysis) => (
        <GitHubIssueCard 
            key={analysis.issue.id} 
            analysis={analysis} 
            analysisId={analysisId} 
            githubToken={githubToken} 
        />
      ))}
    </div>
  );
};

export default GitHubIssuesTab;