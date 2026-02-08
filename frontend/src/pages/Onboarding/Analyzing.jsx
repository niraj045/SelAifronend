import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Analyzing() {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('Initializing AI...');
    const [findings, setFindings] = useState([]);
    const [completedSteps, setCompletedSteps] = useState([]);

    const steps = [
        'Scanning DOM structure',
        'Identifying interactive elements',
        'Mapping user flows',
        'Generating test scenarios'
    ];

    useEffect(() => {
        // Simulate progress
        const interval = setInterval(() => {
            setProgress(p => {
                if (p >= 100) {
                    clearInterval(interval);
                    setTimeout(() => navigate('/onboarding/review'), 500);
                    return 100;
                }
                return p + Math.random() * 2;
            });
        }, 100);

        // Simulate status updates
        setTimeout(() => {
            setCompletedSteps(prev => [...prev, steps[0]]);
            setStatus(steps[1] + '...');
        }, 1000);

        setTimeout(() => {
            setCompletedSteps(prev => [...prev, steps[1]]);
            setStatus(steps[2] + '...');
            setFindings(prev => [...prev, '12 clickable elements', '4 form inputs']);
        }, 3000);

        setTimeout(() => {
            setCompletedSteps(prev => [...prev, steps[2]]);
            setStatus(steps[3] + '...');
            setFindings(prev => [...prev, '3 navigation menus', '1 login flow']);
        }, 5000);

        setTimeout(() => {
            setCompletedSteps(prev => [...prev, steps[3]]);
            setStatus('Finalizing report...');
        }, 7000);

        return () => clearInterval(interval);
    }, [navigate]);

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-full max-w-lg"
            >
                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    {/* Pulse Effect */}
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-violet-500 to-transparent opacity-50 animate-scan"></div>

                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-violet-600/20 rounded-full flex items-center justify-center mx-auto mb-4 relative">
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                                className="absolute inset-0 border-2 border-violet-500/50 border-t-transparent rounded-full"
                            />
                            <span className="text-2xl">🧠</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white mb-2">AI is Analyzing Your Site...</h1>
                        <p className="text-violet-300 animate-pulse text-sm">{status}</p>
                    </div>

                    <div className="space-y-6">
                        {/* Steps Checklist */}
                        <div className="space-y-3 pl-4 border-l-2 border-white/5">
                            {steps.map((step, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs transition-colors ${completedSteps.includes(step) ? 'bg-green-500 text-white' : 'bg-white/10 text-white/30'}`}>
                                        {completedSteps.includes(step) ? '✓' : i + 1}
                                    </div>
                                    <span className={`text-sm transition-colors ${completedSteps.includes(step) ? 'text-white/80' : 'text-white/30'}`}>
                                        {step}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Progress Bar */}
                        <div>
                            <div className="flex justify-between text-xs text-white/40 mb-2">
                                <span>Progress</span>
                                <span>{Math.round(progress)}%</span>
                            </div>
                            <div className="w-full bg-[#0f121e] rounded-full h-2 overflow-hidden">
                                <motion.div
                                    className="bg-gradient-to-r from-violet-600 to-indigo-500 h-full"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progress}%` }}
                                />
                            </div>
                        </div>

                        {/* Findings */}
                        {findings.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-[#0f121e] rounded-lg p-4 border border-white/5"
                            >
                                <h3 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">Found so far:</h3>
                                <ul className="space-y-2">
                                    {findings.map((item, i) => (
                                        <motion.li
                                            key={i}
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className="text-sm text-white/70 flex items-center gap-2"
                                        >
                                            <span className="w-1.5 h-1.5 rounded-full bg-violet-500"></span>
                                            {item}
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        )}
                    </div>

                    <p className="text-center text-white/20 text-xs mt-6">
                        This usually takes 30-60 seconds
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
