'use client';

import { useState } from 'react';
import { RepositoryForm } from '@/components/RepositoryForm';
import { AnalysisResults } from '@/components/AnalysisResults';

export default function HomePage() {
  const [analysisId, setAnalysisId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisStart = (id: string) => {
    setAnalysisId(id);
    setIsAnalyzing(true);
  };

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false);
  };

  const handleNewAnalysis = () => {
    setAnalysisId(null);
    setIsAnalyzing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <main className="container mx-auto px-4 py-8">
        {!analysisId ? (
          <div className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="text-center mb-12">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                AI Code Review
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  {' '}Assistant
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                Get comprehensive AI-powered code analysis for your Git repositories.
                Identify security vulnerabilities, code quality issues, and receive
                actionable improvement suggestions.
              </p>
              <div className="flex flex-wrap justify-center gap-4 mb-8">
                <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Security Analysis</span>
                </div>
                <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Code Quality</span>
                </div>
                <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">Performance Insights</span>
                </div>
                <div className="flex items-center bg-white rounded-lg px-4 py-2 shadow-sm">
                  <span className="text-green-500 mr-2">✓</span>
                  <span className="text-sm font-medium">AI Suggestions</span>
                </div>
              </div>
            </div>

            {/* Repository Form */}
            <RepositoryForm onAnalysisStart={handleAnalysisStart} />

            {/* Features Section */}
            <div className="mt-16 grid md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Comprehensive Analysis</h3>
                <p className="text-gray-600">Deep dive into your codebase with AI-powered analysis covering security, performance, and maintainability.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Fast & Accurate</h3>
                <p className="text-gray-600">Get detailed results in minutes, not hours. Our AI provides accurate insights you can act on immediately.</p>
              </div>

              <div className="text-center p-6">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold mb-2">Actionable Reports</h3>
                <p className="text-gray-600">Receive clear, prioritized recommendations with specific suggestions for improving your code quality.</p>
              </div>
            </div>
          </div>
        ) : (
          <AnalysisResults
            analysisId={analysisId}
            onNewAnalysis={handleNewAnalysis}
            onComplete={handleAnalysisComplete}
          />
        )}
      </main>
    </div>
  );
}