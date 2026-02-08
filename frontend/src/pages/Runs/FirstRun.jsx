import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FirstRun() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [currentTest, setCurrentTest] = useState('Login Flow Test');
    const [testStatuses, setTestStatuses] = useState({
        'Login Flow Test': 'running',
        'Navigation Test': 'queued',
        'Contact Form Validation': 'queued',
        'Product Search': 'queued',
        'Checkout Flow': 'queued'
    });

    useEffect(() => {
        // Simulate test execution
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => navigate('/app/runs/summary'), 1000);
                    return 100;
                }
                return p + 0.5;
            });
        }, 50);

        setTimeout(() => {
            setTestStatuses(prev => ({ ...prev, 'Login Flow Test': 'passed', 'Navigation Test': 'running' }));
            setCurrentTest('Navigation Test');
        }, 2000);

        setTimeout(() => {
            setTestStatuses(prev => ({ ...prev, 'Navigation Test': 'passed', 'Contact Form Validation': 'running' }));
            setCurrentTest('Contact Form Validation');
        }, 4000);

        setTimeout(() => {
            setTestStatuses(prev => ({ ...prev, 'Contact Form Validation': 'failed', 'Product Search': 'running' }));
            setCurrentTest('Product Search');
        }, 6000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0a0e1a] text-white p-6">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex justify-between items-center bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-xl p-4 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-violet-600/20 flex items-center justify-center animate-pulse">
                            running
                        </div>
                        <div>
                            <h1 className="text-xl font-bold">🚀 Running Tests...</h1>
                            <p className="text-white/40 text-sm">Executing 12 generated tests on Production Site</p>
                        </div>
                    </div>
                    <button className="bg-white/5 hover:bg-red-500/10 hover:text-red-400 border border-white/10 text-white/60 px-4 py-2 rounded-lg transition-colors text-sm">
                        Stop All
                    </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Test List */}
                    <div className="lg:col-span-1 bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-xl p-4 shadow-lg flex flex-col h-[600px]">
                        <h2 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-4">Test Queue</h2>
                        <div className="space-y-2 flex-1 overflow-y-auto custom-scrollbar pr-2">
                            {Object.entries(testStatuses).map(([name, status]) => (
                                <div key={name} className="flex items-center justify-between p-3 rounded-lg bg-[#0f121e] border border-white/5">
                                    <span className="text-sm text-white/80 truncate">{name}</span>
                                    {status === 'running' && <span className="text-xs text-yellow-400 animate-pulse">Running...</span>}
                                    {status === 'passed' && <span className="text-xs text-green-400">2.3s</span>}
                                    {status === 'failed' && <span className="text-xs text-red-400">Failed</span>}
                                    {status === 'queued' && <span className="text-xs text-white/20">Queued</span>}
                                </div>
                            ))}
                            {/* Mock more items */}
                            {Array.from({ length: 7 }).map((_, i) => (
                                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-[#0f121e] border border-white/5 opacity-50">
                                    <span className="text-sm text-white/80">Test Case #{i + 6}</span>
                                    <span className="text-xs text-white/20">Queued</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Live Preview */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-xl p-1 shadow-lg h-[450px] relative overflow-hidden flex flex-col">
                            <div className="bg-[#0f121e] border-b border-white/5 p-2 flex items-center gap-2">
                                <div className="flex gap-1.5">
                                    <div className="w-3 h-3 rounded-full bg-red-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/20"></div>
                                    <div className="w-3 h-3 rounded-full bg-green-500/20"></div>
                                </div>
                                <div className="flex-1 bg-white/5 rounded px-3 py-1 text-xs text-center text-white/30 font-mono">
                                    https://example.com/login
                                </div>
                            </div>
                            <div className="flex-1 bg-[#0a0e1a] relative flex items-center justify-center p-8">
                                {/* Mock Browser Content */}
                                <div className="w-full max-w-md space-y-4 opacity-50">
                                    <div className="h-8 bg-white/10 rounded w-1/3"></div>
                                    <div className="h-32 bg-white/5 rounded w-full"></div>
                                    <div className="space-y-2">
                                        <div className="h-4 bg-white/10 rounded w-full"></div>
                                        <div className="h-4 bg-white/10 rounded w-5/6"></div>
                                    </div>
                                </div>
                                {/* Cursor Animation */}
                                <motion.div
                                    className="absolute w-6 h-6 border-2 border-violet-500 rounded-full bg-violet-500/20 z-10 pointer-events-none"
                                    animate={{
                                        x: [0, 100, 50, -50, 0],
                                        y: [0, 50, -50, 100, 0],
                                        scale: [1, 0.8, 1]
                                    }}
                                    transition={{ duration: 4, repeat: Infinity }}
                                />
                            </div>

                            <div className="bg-[#0f121e] border-t border-white/5 p-3 text-xs font-mono text-green-400">
                                &gt; Clicking "Submit" button...
                            </div>
                        </div>

                        {/* Progress */}
                        <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-xl p-6 shadow-lg">
                            <div className="flex justify-between items-end mb-2">
                                <div>
                                    <h3 className="text-white font-medium">Progress: 2/12 tests complete</h3>
                                    <p className="text-white/40 text-xs mt-1">Estimated time remaining: 45s</p>
                                </div>
                                <span className="text-2xl font-bold text-violet-400">{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-[#0f121e] rounded-full h-3 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full relative"
                                    style={{ width: `${progress}%` }}
                                >
                                    <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white/20 to-transparent"></div>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
