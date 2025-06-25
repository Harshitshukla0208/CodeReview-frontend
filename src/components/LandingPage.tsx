import { useState, useEffect } from 'react';
import { FaStar, FaPlay, FaBolt, FaChartLine, FaBullseye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import logo from '../assets/react.svg'; // Placeholder logo

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const [isVisible, setIsVisible] = useState(false);
    const [laptopAnimated, setLaptopAnimated] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        const handleScroll = () => {
            const demoSection = document.getElementById('demo-section');
            if (demoSection) {
                const rect = demoSection.getBoundingClientRect();
                const isInView = rect.top < window.innerHeight * 0.7;
                setLaptopAnimated(isInView);
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll();
        return () => {
            clearTimeout(timer);
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    const handleScrollToDemo = () => {
        const demoSection = document.getElementById('demo-section');
        if (demoSection) {
            demoSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div className="landing-root min-h-screen bg-white overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] bg-[size:6rem_4rem]">
                <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,#d5c5ff,transparent)]"></div>
            </div>
            {/* Navigation */}
            <nav className="relative z-50 px-4 py-4 md:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <img src={logo} alt="logo" className="h-9 w-9 rounded-md" />
                        <span className="text-xl font-bold text-gray-900">CodeReview AI</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <motion.button
                            className="border-[#6F60FC] text-[#6F60FC] hover:bg-purple-50 transition px-4 py-2 text-sm rounded-md shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={onGetStarted}
                        >
                            <span>Get Started</span>
                        </motion.button>
                        <a href="#" className="no-underline">
                            <motion.button
                                className="bg-gradient-to-r from-blue-600 to-purple-600 shadow-md text-white hover:opacity-90 transition px-6 py-2 text-sm rounded-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <span className="whitespace-nowrap">Sign In</span>
                            </motion.button>
                        </a>
                    </div>
                </div>
            </nav>
            {/* Hero Section */}
            <section className="relative z-10 pt-12 md:pt-20 pb-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <div className={`transition-all duration-1000 ease-out ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                            Double Your Productivity with<br />
                            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                CodeReview AI Agents
                            </span>
                        </h1>
                        <p className="text-base md:text-lg text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
                            Effortlessly review, analyze, and improve your codebase with AI-powered insights. No setup or coding skills required.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl" onClick={onGetStarted}>
                                Try for free
                            </button>
                            <button
                                onClick={handleScrollToDemo}
                                className="flex items-center gap-2 text-blue-600 px-6 py-3 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all duration-200 shadow-md"
                            >
                                <FaPlay className="w-5 h-5" />
                                Watch demo
                            </button>
                        </div>
                    </div>
                </div>
            </section>
            {/* Laptop Demo Section */}
            <section id="demo-section" className="relative z-10 py-16">
                <div className="max-w-6xl mx-auto px-4 md:px-8">
                    <div className="laptop-container">
                        <div className={`laptop-screen ${laptopAnimated ? 'animate' : ''}`}>
                            <div className="bg-gray-900 rounded-2xl shadow-2xl overflow-hidden max-w-5xl mx-auto p-1">
                                <div className="bg-white rounded-xl shadow-inner overflow-hidden">
                                    <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 border-b border-gray-200">
                                        <div className="w-2.5 h-2.5 rounded-full bg-red-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500"></div>
                                        <div className="w-2.5 h-2.5 rounded-full bg-green-500"></div>
                                        <div className="flex-1 text-center">
                                            <div className="bg-white rounded px-3 py-0.5 text-xs text-gray-600 inline-block border">
                                                codereview.ai/demo
                                            </div>
                                        </div>
                                    </div>
                                    <div className="bg-white border-b px-6 py-3">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-md"></div>
                                                    <span className="font-semibold">AI Review</span>
                                                </div>
                                                <div className="flex gap-6 text-sm text-gray-600">
                                                    <span className="text-blue-600 border-b-2 border-blue-600 pb-1">Overview</span>
                                                    <span>Issues</span>
                                                    <span>Suggestions</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-4">
                                                <div className="flex gap-4 text-sm text-gray-600">
                                                    <span>Insights</span>
                                                    <span>Metrics</span>
                                                    <span>Commits</span>
                                                    <span>Settings</span>
                                                </div>
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                                                    Publish
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex h-96">
                                        <div className="w-80 bg-gray-50 p-6 border-r">
                                            <div className="mb-6">
                                                <h3 className="font-semibold mb-4 text-gray-800">Pages</h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                                        <span className="w-6 h-6 bg-blue-600 text-white rounded text-xs flex items-center justify-center font-medium">1</span>
                                                        <span className="text-blue-700 font-medium">Start</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                                                        <span className="w-6 h-6 border border-gray-300 text-gray-500 rounded text-xs flex items-center justify-center">2</span>
                                                        <span className="text-gray-600">Analysis</span>
                                                    </div>
                                                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                                                        <span className="w-6 h-6 border border-gray-300 text-gray-500 rounded text-xs flex items-center justify-center">3</span>
                                                        <span className="text-gray-600">Results</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div>
                                                <h3 className="font-semibold mb-4 text-gray-800">Results</h3>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-3 p-3 hover:bg-gray-100 rounded-lg cursor-pointer">
                                                        <span className="w-6 h-6 border border-gray-300 text-gray-500 rounded text-xs flex items-center justify-center">A</span>
                                                        <span className="text-gray-600">Thank you</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex-1 bg-white p-8 flex items-center justify-center">
                                            <div className="text-center max-w-md">
                                                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                                                    <span className="text-white text-2xl">👋</span>
                                                </div>
                                                <div className="mb-4">
                                                    <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>
                                                    <p className="text-sm text-gray-500">Jane Doe, Developer:</p>
                                                </div>
                                                <h2 className="text-2xl font-bold text-gray-800 mb-4 leading-tight">
                                                    Unlock better code quality with CodeReview AI!
                                                </h2>
                                                <p className="text-gray-600 mb-6 leading-relaxed">
                                                    See what you can achieve in just a few minutes of automated code review.
                                                </p>
                                                <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold w-full mb-4" onClick={onGetStarted}>
                                                    Start your free review
                                                </button>
                                                <div className="flex items-center justify-center gap-2">
                                                    <div className="flex -space-x-1">
                                                        <div className="w-6 h-6 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full border-2 border-white"></div>
                                                        <div className="w-6 h-6 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full border-2 border-white"></div>
                                                        <div className="w-6 h-6 bg-gradient-to-r from-green-400 to-green-600 rounded-full border-2 border-white"></div>
                                                        <div className="w-6 h-6 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full border-2 border-white"></div>
                                                    </div>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <FaStar key={i} className="w-4 h-4 text-yellow-400" />
                                                        ))}
                                                    </div>
                                                    <span className="text-sm font-semibold">4.9</span>
                                                    <span className="text-sm text-gray-500">from 200+ reviews</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Results Section */}
            <section className="relative z-10 py-20 bg-gradient-to-b from-white to-gray-50">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">
                        Results in All Code Quality Areas
                    </h2>
                    <p className="text-lg text-gray-600 mb-16 max-w-3xl mx-auto">
                        We analyzed thousands of codebases to create the best templates for code quality, maintainability, and performance.
                    </p>
                    <div className="grid md:grid-cols-3 gap-8">
                        {/* Get Qualified Leads */}
                        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                                <div className="bg-blue-600 text-white rounded-lg p-4 mb-4">
                                    <FaBolt className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">10x faster code reviews</h3>
                                <p className="text-gray-600 text-sm mb-4">Automate your code review process and save hours every week.</p>
                                <div className="flex gap-2">
                                    <button className="bg-blue-600 text-white px-4 py-2 rounded text-sm">Automate</button>
                                    <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded text-sm">Manual</button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Boost Productivity</h3>
                        </div>
                        {/* Sell Smarter Online */}
                        <div className="bg-gradient-to-br from-pink-50 to-pink-100 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                                <div className="bg-pink-600 text-white rounded-lg p-4 mb-4">
                                    <FaChartLine className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Actionable insights</h3>
                                <p className="text-gray-600 text-sm mb-4">Get clear, prioritized suggestions to improve your codebase.</p>
                                <div className="flex gap-2">
                                    <button className="bg-pink-600 text-white px-4 py-2 rounded text-sm">See Insights</button>
                                    <button className="bg-pink-600 text-white px-4 py-2 rounded text-sm">Learn More</button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Improve Quality</h3>
                        </div>
                        {/* Hire Top Talent */}
                        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-2xl p-6 transform hover:scale-105 transition-all duration-300">
                            <div className="bg-white rounded-xl p-6 mb-6 shadow-lg">
                                <div className="bg-yellow-600 text-white rounded-lg p-4 mb-4">
                                    <FaBullseye className="w-8 h-8" />
                                </div>
                                <h3 className="font-bold text-lg mb-2">Find code issues instantly</h3>
                                <p className="text-gray-600 text-sm mb-4">Pinpoint bugs and vulnerabilities before they reach production.</p>
                                <div className="flex gap-2">
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm">Scan Now</button>
                                    <button className="bg-yellow-600 text-white px-4 py-2 rounded text-sm">Report</button>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-gray-800">Catch Bugs Early</h3>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage; 