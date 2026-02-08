import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Summary() {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-4xl"
            >
                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Confetti Effect (Simple Circles) */}
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full w-2 h-2 bg-yellow-400 opacity-50"
                            initial={{ x: Math.random() * 800, y: -20 }}
                            animate={{ y: 800 }}
                            transition={{ duration: Math.random() * 2 + 2, repeat: Infinity, delay: Math.random() * 2 }}
                        />
                    ))}

                    <div className="text-center mb-10 relative z-10">
                        <div className="inline-block bg-green-500/20 text-green-400 rounded-full px-4 py-1.5 text-sm font-semibold mb-4 border border-green-500/30">
                            Success
                        </div>
                        <h1 className="text-4xl font-bold text-white mb-2">🎉 First Test Run Complete!</h1>
                        <p className="text-white/40">Here's how your site performed</p>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 relative z-10">
                        <div className="bg-[#0f121e] border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-green-400 mb-1">10</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Passed</div>
                        </div>
                        <div className="bg-[#0f121e] border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-red-400 mb-1">2</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Failed</div>
                        </div>
                        <div className="bg-[#0f121e] border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-blue-400 mb-1">1.2s</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Avg Time</div>
                        </div>
                        <div className="bg-[#0f121e] border border-white/10 rounded-xl p-4 text-center">
                            <div className="text-3xl font-bold text-violet-400 mb-1">92%</div>
                            <div className="text-xs text-white/40 uppercase tracking-wider">Coverage</div>
                        </div>
                    </div>

                    {/* Results List */}
                    <div className="space-y-3 mb-10 relative z-10">
                        <h3 className="text-sm font-semibold text-white/40 uppercase tracking-wider mb-2">Key Findings</h3>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f121e] border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                                <span className="text-white font-medium">Login Flow Test</span>
                            </div>
                            <span className="text-green-400 text-sm font-medium">Passed</span>
                        </div>

                        <div className="flex items-center justify-between p-4 rounded-lg bg-[#0f121e] border border-green-500/20">
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center text-green-500 text-xs">✓</div>
                                <span className="text-white font-medium">Navigation Test</span>
                            </div>
                            <span className="text-green-400 text-sm font-medium">Passed</span>
                        </div>

                        <div className="p-4 rounded-lg bg-[#0f121e] border border-red-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs">✕</div>
                                    <span className="text-white font-medium">Contact Form Test</span>
                                </div>
                                <span className="text-red-400 text-sm font-medium">Failed</span>
                            </div>
                            <div className="pl-9">
                                <p className="text-red-300/80 text-sm mb-3">→ Email validation missing</p>
                                <div className="flex gap-3">
                                    <button className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 py-1.5 rounded transition-colors border border-red-500/20">View Details</button>
                                    <button className="text-xs bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded transition-colors border border-violet-500/30 flex items-center gap-1">
                                        ✨ Auto-Fix
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="p-4 rounded-lg bg-[#0f121e] border border-red-500/20">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center gap-3">
                                    <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 text-xs">✕</div>
                                    <span className="text-white font-medium">Checkout Flow</span>
                                </div>
                                <span className="text-red-400 text-sm font-medium">Failed</span>
                            </div>
                            <div className="pl-9">
                                <p className="text-red-300/80 text-sm mb-3">→ Payment button not found</p>
                                <div className="flex gap-3">
                                    <button className="text-xs bg-red-500/10 hover:bg-red-500/20 text-red-300 px-3 py-1.5 rounded transition-colors border border-red-500/20">View Details</button>
                                    <button className="text-xs bg-violet-600/20 hover:bg-violet-600/30 text-violet-300 px-3 py-1.5 rounded transition-colors border border-violet-500/30 flex items-center gap-1">
                                        ✨ Auto-Fix
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-4 relative z-10">
                        <button className="px-6 py-3 text-white/40 hover:text-white font-medium transition-colors">
                            View Full Report
                        </button>
                        <button
                            onClick={() => navigate('/app')}
                            className="flex-1 bg-violet-600 hover:bg-violet-700 text-white font-bold py-3 rounded-lg shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            Go to Dashboard →
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
