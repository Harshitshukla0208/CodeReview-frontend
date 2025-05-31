// components/Header.tsx
'use client';

import { Github, Code2 } from 'lucide-react';

export function Header() {
    return (
        <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center space-x-2">
                        <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                            <Code2 className="h-6 w-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900">CodeReview AI</h1>
                            <p className="text-xs text-gray-500">Powered by AI</p>
                        </div>
                    </div>

                    <nav className="hidden md:flex items-center space-x-6">
                        <a href="#features" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            Features
                        </a>
                        <a href="#how-it-works" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                            How it Works
                        </a>
                        <a
                            href="https://github.com"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center space-x-1 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <Github className="h-4 w-4" />
                            <span>GitHub</span>
                        </a>
                    </nav>

                    <div className="flex items-center space-x-4">
                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                            Sign In
                        </button>
                        <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-colors">
                            Get Started
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
}