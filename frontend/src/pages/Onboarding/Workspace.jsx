import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Workspace() {
    const navigate = useNavigate();
    const [workspaceName, setWorkspaceName] = useState('');

    // Step 1: Workspace
    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 text-white/40 text-sm">
                    <span>Step 1 of 3</span>
                    <button className="hover:text-white transition-colors">Skip for now</button>
                </div>

                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2">Welcome to SelAI! 👋</h1>
                        <p className="text-white/40">Let's set up your workspace</p>
                    </div>

                    <div className="space-y-8">
                        {/* Name */}
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-2">Workspace Name</label>
                            <input
                                type="text"
                                value={workspaceName}
                                onChange={(e) => setWorkspaceName(e.target.value)}
                                className="w-full bg-[#0f121e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                placeholder="My Company"
                            />
                        </div>

                        {/* App Type */}
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-3">What will you test?</label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {['E-commerce site', 'SaaS dashboard', 'Marketing website', 'Mobile app (web view)', 'Internal tools'].map((type) => (
                                    <label key={type} className="flex items-center gap-3 p-3 rounded-lg border border-white/10 hover:bg-white/5 cursor-pointer transition-colors group">
                                        <input type="radio" name="appType" className="bg-[#0f121e] border-white/20 text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
                                        <span className="text-white/80 group-hover:text-white">{type}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Team Size */}
                        <div>
                            <label className="block text-sm font-medium text-white/60 mb-3">Team size</label>
                            <div className="flex flex-wrap gap-3">
                                {['Just me', '2-10 people', '11-50 people', '50+ people'].map((size) => (
                                    <label key={size} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 hover:bg-white/5 cursor-pointer transition-colors group">
                                        <input type="radio" name="teamSize" className="bg-[#0f121e] border-white/20 text-violet-500 focus:ring-violet-500 focus:ring-offset-0" />
                                        <span className="text-white/80 group-hover:text-white text-sm">{size}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={() => navigate('/onboarding/project')}
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2 mt-4"
                        >
                            Continue →
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
