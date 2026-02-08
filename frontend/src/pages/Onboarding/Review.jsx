import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Review() {
    const navigate = useNavigate();

    // Mock Tests
    const initialTests = [
        {
            id: 1,
            name: 'Login Flow Test',
            steps: ['Navigate to /login', 'Fill email & password', 'Click submit', 'Assert: Redirects to dashboard'],
            type: 'flow',
            selected: true
        },
        {
            id: 2,
            name: 'Navigation Test',
            steps: ['Click all main menu items', 'Verify pages load'],
            type: 'nav',
            selected: true
        },
        {
            id: 3,
            name: 'Contact Form Validation',
            steps: ['Submit empty form', 'Assert: Shows error messages'],
            type: 'validation',
            selected: true
        }
    ];

    const [tests, setTests] = useState(initialTests);

    const toggleTest = (id) => {
        setTests(tests.map(t => t.id === id ? { ...t, selected: !t.selected } : t));
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
                    <span className="font-medium text-white/70">Step 3 of 3</span>
                    <button className="hover:text-white transition-colors">Skip Review</button>
                </div>

                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
                    <div className="text-center mb-8">
                        <div className="bg-violet-600/20 text-violet-300 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl font-bold">✨</div>
                        <h1 className="text-2xl font-bold text-white mb-2">12 Tests Generated!</h1>
                        <p className="text-white/40">Review and customize before running</p>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                        {tests.map((test) => (
                            <div
                                key={test.id}
                                className={`bg-[#0f121e] border ${test.selected ? 'border-violet-500/50' : 'border-white/10'} rounded-lg p-4 transition-all hover:bg-white/5`}
                            >
                                <div className="flex items-start justify-between mb-2">
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="checkbox"
                                            checked={test.selected}
                                            onChange={() => toggleTest(test.id)}
                                            className="w-5 h-5 bg-transparent border-white/20 rounded text-violet-500 focus:ring-violet-500/50"
                                        />
                                        <h3 className="font-medium text-white">{test.name}</h3>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="text-xs text-white/30 hover:text-white px-2 py-1 rounded bg-white/5">Edit</button>
                                        <button className="text-xs text-white/30 hover:text-red-400 px-2 py-1 rounded bg-white/5">Remove</button>
                                    </div>
                                </div>
                                <ul className="pl-8 space-y-1">
                                    {test.steps.map((step, i) => (
                                        <li key={i} className="text-sm text-white/50 flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-white/20"></span>
                                            {step}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                        <div className="text-center text-sm text-white/30 py-4">
                            ... and 9 more tests
                        </div>
                    </div>

                    <div className="flex gap-4 mt-8 pt-6 border-t border-white/5">
                        <button
                            onClick={() => navigate('/onboarding/project')}
                            className="px-6 py-3 text-white/60 hover:text-white font-medium transition-colors"
                        >
                            Back
                        </button>
                        <button
                            onClick={() => navigate('/app/runs/first-run')}
                            className="flex-1 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold py-3 rounded-lg shadow-lg shadow-violet-500/20 transition-all flex items-center justify-center gap-2"
                        >
                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            Run All Tests Now →
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}
