// src/components/Dashboard.tsx

import React, { useState } from 'react';
import type { FinalReport } from '../types';
import OverviewTab from './OverviewTab';
import CodeIssuesTab from './CodeIssuesTab';
import GitHubIssuesTab from './GitHubIssuesTab';
import { ChartBarIcon, CodeBracketIcon, TicketIcon } from '@heroicons/react/24/outline';

interface Props {
    report: FinalReport;
    analysisId: string;
    githubToken: string;
    repositoryUrl: string;
}

type Tab = 'overview' | 'code' | 'github';

const Dashboard: React.FC<Props> = ({ report, analysisId, githubToken, repositoryUrl }) => {
    const [activeTab, setActiveTab] = useState<Tab>('overview');

    const renderTabContent = () => {
        switch (activeTab) {
            case 'overview':
                return <OverviewTab overview={report.overview} categories={report.categories} recommendations={report.recommendations} />;
            case 'code':
                return <CodeIssuesTab fileAnalyses={report.fileAnalysis} analysisId={analysisId} githubToken={githubToken} repositoryUrl={repositoryUrl} />;
            case 'github':
                return report.githubIssues ? <GitHubIssuesTab githubIssues={report.githubIssues} analysisId={analysisId} githubToken={githubToken} /> : <p>GitHub issue analysis was not included or failed.</p>;
            default:
                return null;
        }
    };

    const TabButton: React.FC<{ tab: Tab; label: string; count?: number; children: React.ReactNode }> = ({ tab, label, count, children }) => (
        <button onClick={() => setActiveTab(tab)} className={`flex items-center gap-2 px-4 py-3 font-semibold rounded-t-lg transition-colors border-b-2 ${activeTab === tab
                ? 'text-indigo-600 border-indigo-600'
                : 'text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300'
            }`}>
            {children}
            {label}
            {count !== undefined && <span className="bg-gray-200 text-gray-700 text-xs font-bold ml-1 px-2 py-0.5 rounded-full">{count}</span>}
        </button>
    );

    return (
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
            <div className="p-6 border-b">
                <h2 className="text-2xl font-bold">Analysis for: <span className='text-indigo-600'>{report.overview.repositoryName}</span></h2>
            </div>
            <div className="border-b border-gray-200">
                <nav className="flex px-6 space-x-4" aria-label="Tabs">
                    <TabButton tab="overview" label="Overview">
                        <ChartBarIcon className="h-5 w-5" />
                    </TabButton>
                    <TabButton tab="code" label="Code Issues" count={report.fileAnalysis.reduce((sum, f) => sum + f.issues.length, 0)}>
                        <CodeBracketIcon className="h-5 w-5" />
                    </TabButton>
                    {report.githubIssues && (
                        <TabButton tab="github" label="GitHub Issues" count={report.githubIssues.totalIssues}>
                            <TicketIcon className="h-5 w-5" />
                        </TabButton>
                    )}
                </nav>
            </div>
            <div className="p-6 bg-gray-50">
                {renderTabContent()}
            </div>
        </div>
    );
};

export default Dashboard;
