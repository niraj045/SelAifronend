import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Project() {
    const navigate = useNavigate();
    const [projectName, setProjectName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');
    const [selectedTests, setSelectedTests] = useState([]);

    const handleAnalyze = () => {
        if (!websiteUrl) return;
        navigate('/onboarding/analyzing', { state: { url: websiteUrl } });
    };

    const toggleTest = (test) => {
        if (selectedTests.includes(test)) {
            setSelectedTests(selectedTests.filter(t => t !== test));
        } else {
            setSelectedTests([...selectedTests, test]);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-full max-w-2xl"
            >
                {/* Header */}
                <div className="flex justify-between items-center mb-8 text-white/40 text-sm">
                    <span className="font-medium text-white/70">Step 2 of 3</span>
                    <button onClick={() => navigate('/onboarding/workspace')} className="hover:text-white transition-colors">← Back</button>
                </div>

                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Background Detail */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-white mb-2">Create Your First Project 🚀</h1>
                            <p className="text-white/40">Define what you want to test</p>
                        </div>

                        <div className="space-y-6">
                            {/* Project Name */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Project Name</label>
                                <input
                                    type="text"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    className="w-full bg-[#0f121e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                    placeholder="Production Site"
                                />
                            </div>

                            {/* Website URL */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-2">Website URL (Required)</label>
                                <div className="flex">
                                    <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-white/10 bg-[#1e2337] text-white/40 text-sm">
                                        https://
                                    </span>
                                    <input
                                        type="text"
                                        value={websiteUrl}
                                        onChange={(e) => setWebsiteUrl(e.target.value)}
                                        className="w-full bg-[#0f121e] border border-white/10 rounded-r-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                        placeholder="example.com"
                                    />
                                </div>
                            </div>

                            {/* Test Types */}
                            <div>
                                <label className="block text-sm font-medium text-white/60 mb-3">What should SelAI test?</label>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    {[
                                        { id: 'login', label: 'Login flow', recommended: true },
                                        { id: 'nav', label: 'Navigation', recommended: true },
                                        { id: 'forms', label: 'Forms & inputs', recommended: true },
                                        { id: 'critical', label: 'Critical user paths', recommended: true },
                                        { id: 'checkout', label: 'Checkout/payment' },
                                        { id: 'admin', label: 'Admin dashboard' },
                                    ].map((test) => (
                                        <label
                                            key={test.id}
                                            className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors group ${selectedTests.includes(test.id) ? 'bg-violet-600/10 border-violet-500/50' : 'border-white/10 hover:bg-white/5'}`}
                                            onClick={() => toggleTest(test.id)}
                                        >
                                            <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedTests.includes(test.id) ? 'bg-violet-600 border-violet-600' : 'bg-[#0f121e] border-white/20'}`}>
                                                {selectedTests.includes(test.id) && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
                                            </div>
                                            <span className="text-white/80 group-hover:text-white flex-1">{test.label}</span>
                                            {test.recommended && <span className="text-[10px] font-semibold bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full uppercase tracking-wider">Rec</span>}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                onClick={handleAnalyze}
                                className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3.5 rounded-lg shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2 mt-4"
                            >
                                <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                Analyze & Generate Tests →
                            </button>

                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/5"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#1e2337] text-white/20">or</span>
                                </div>
                            </div>

                            <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                                Import from GitHub
                            </button>
                        </div>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
