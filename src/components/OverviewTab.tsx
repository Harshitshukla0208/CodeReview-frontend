// src/components/OverviewTab.tsx

import React from 'react';
import type { FinalReport } from '../types';

type Props = {
    overview: FinalReport['overview'];
    categories: FinalReport['categories'];
    recommendations: FinalReport['recommendations'];
}

const riskColorMap = {
    low: 'text-green-600 bg-green-100',
    medium: 'text-yellow-600 bg-yellow-100',
    high: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100',
};

const ScoreCircle: React.FC<{ score: number }> = ({ score }) => {
    const color = score > 80 ? 'text-green-500' : score > 60 ? 'text-yellow-500' : 'text-red-500';
    return (
        <div className={`text-4xl font-bold ${color}`}>
            {score}<span className="text-2xl text-gray-500">/100</span>
        </div>
    );
}

const OverviewTab: React.FC<Props> = ({ overview, categories, recommendations }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
                {/* Category Scores */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Category Scores</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(categories).map(([key, value]) => (
                            <div key={key} className="border border-gray-200 p-4 rounded-lg">
                                <h4 className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}</h4>
                                <div className="flex items-baseline gap-2">
                                    <ScoreCircle score={value.score} />
                                    <div className="text-sm text-gray-600">
                                        <p>{value.issues} issues</p>
                                        <p className="font-bold">{value.criticalIssues} critical</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recommendations */}
                <div className="bg-white p-6 rounded-lg shadow">
                    <h3 className="text-xl font-bold mb-4">Recommendations</h3>
                    <div className="space-y-4">
                        <div>
                            <h4 className="font-semibold text-red-600">Immediate Actions</h4>
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                                {recommendations.immediate.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-yellow-600">Short-Term Goals</h4>
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                                {recommendations.shortTerm.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-semibold text-green-600">Long-Term Strategy</h4>
                            <ul className="list-disc list-inside text-gray-700 mt-1">
                                {recommendations.longTerm.map((rec, i) => <li key={i}>{rec}</li>)}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column (Overview) */}
            <div className="bg-white p-6 rounded-lg shadow space-y-4">
                <h3 className="text-xl font-bold mb-2">Project Overview</h3>
                <div className="text-center">
                    <p className='text-sm text-gray-500'>Overall Score</p>
                    <ScoreCircle score={overview.overallScore} />
                </div>
                <div className="space-y-2">
                    <div>
                        <span className="font-semibold">Risk Level:</span>
                        <span className={`ml-2 px-2 py-1 rounded-full text-sm font-medium capitalize ${riskColorMap[overview.riskLevel]}`}>
                            {overview.riskLevel}
                        </span>
                    </div>
                    <div><span className="font-semibold">Total Files:</span> {overview.totalFiles}</div>
                    <div><span className="font-semibold">Lines of Code:</span> {overview.linesOfCode.toLocaleString()}</div>
                </div>
            </div>

        </div>
    );
};

export default OverviewTab;