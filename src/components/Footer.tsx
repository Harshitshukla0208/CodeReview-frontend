// components/Footer.tsx
'use client';

import { Github, Twitter, Mail, Heart } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-bold text-gray-900">CodeReview AI</h3>
                        <p className="text-sm text-gray-600">
                            AI-powered code analysis platform that helps developers improve code quality,
                            security, and maintainability.
                        </p>
                        <div className="flex space-x-4">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                            </a>
                            <a
                                href="mailto:contact@codereview-ai.com"
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <Mail className="h-5 w-5" />
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Product</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Features</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Pricing</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">API</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Help Center</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact Us</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Status</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Community</a></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Privacy Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Terms of Service</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Cookie Policy</a></li>
                            <li><a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Security</a></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                        <span>Made with</span>
                        <Heart className="h-4 w-4 text-red-500 fill-current" />
                        <span>by developers, for developers</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-4 md:mt-0">
                        © 2024 CodeReview AI. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}