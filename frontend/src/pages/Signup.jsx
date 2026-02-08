import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function Signup() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleSignup = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            navigate('/onboarding/workspace');
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-[#0a0e1a] flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-violet-400 to-indigo-400 inline-block">
                        SelAI
                    </div>
                </div>

                {/* Card */}
                <div className="bg-[#1e2337]/80 backdrop-blur-xl border border-[#8a74f9]/15 rounded-2xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold text-white mb-2">Create Your Account</h1>
                        <p className="text-white/40 text-sm">Start automating tests in 2 minutes</p>
                    </div>

                    <form onSubmit={handleSignup} className="space-y-4">
                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">Email</label>
                            <input
                                type="email"
                                className="w-full bg-[#0f121e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                placeholder="name@company.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">Password</label>
                            <input
                                type="password"
                                className="w-full bg-[#0f121e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-medium text-white/40 mb-1.5 uppercase tracking-wider">Full Name</label>
                            <input
                                type="text"
                                className="w-full bg-[#0f121e] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/20 focus:outline-none focus:border-violet-500/50 transition-colors"
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="flex items-center gap-2">
                            <input type="checkbox" id="terms" className="rounded bg-[#0f121e] border-white/10 text-violet-500 focus:ring-violet-500/50" required />
                            <label htmlFor="terms" className="text-sm text-white/40">I agree to Terms & Privacy</label>
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-violet-600 hover:bg-violet-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Start Free Trial →'}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/5"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-[#1e2337] text-white/20">OR</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.536-6.033-5.655s2.701-5.655,6.033-5.655c1.272,0,2.44,0.407,3.376,1.084l2.969-2.618C16.941,3.465,14.851,2.545,12.545,2.545c-5.18,0-9.393,3.878-9.393,8.665s4.214,8.665,9.393,8.665c5.688,0,9.393-3.921,9.393-9.588c0-0.742-0.106-1.503-0.218-2.048H12.545z" /></svg>
                            Continue with Google
                        </button>
                        <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 text-sm">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" /></svg>
                            Continue with GitHub
                        </button>
                    </div>

                    <p className="text-center text-white/30 text-sm mt-8">
                        Already have an account? <a href="#" className="text-violet-400 hover:text-violet-300">Login</a>
                    </p>
                </div>

                <div className="flex justify-center gap-6 mt-8 text-xs text-white/30">
                    <span className="flex items-center gap-1">✓ No credit card required</span>
                    <span className="flex items-center gap-1">✓ 14-day free trial</span>
                    <span className="flex items-center gap-1">✓ Cancel anytime</span>
                </div>
            </motion.div>
        </div>
    );
}
