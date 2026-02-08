import { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, AlertTriangle, Zap, CheckCircle, XCircle, Clock, ChevronRight, Activity, Shield } from 'lucide-react';

export default function Dashboard() {
    const [activeRun, setActiveRun] = useState(null);

    const stats = [
        { label: 'Total Tests', value: '247', icon: Activity, color: 'text-blue-400', bg: 'bg-blue-400/10' },
        { label: 'Pass Rate', value: '94.2%', icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-400/10' },
        { label: 'Avg Duration', value: '2.3s', icon: Clock, color: 'text-violet-400', bg: 'bg-violet-400/10' },
        { label: 'Self Healed', value: '12', icon: Shield, color: 'text-orange-400', bg: 'bg-orange-400/10' },
    ];

    const testRuns = [
        { id: 1247, project: 'E-commerce Site', status: 'running', duration: '2:34', time: 'Now' },
        { id: 1246, project: 'SaaS Dashboard', status: 'passed', duration: '1:12', time: '10m ago' },
        { id: 1245, project: 'Auth Flow', status: 'failed', duration: '0:45', time: '2h ago' },
        { id: 1244, project: 'Landing Page', status: 'passed', duration: '0:55', time: '5h ago' },
    ];

    const recommendations = [
        { type: 'heal', text: 'Login flow has 3 flaky tests', action: 'Auto-heal' },
        { type: 'coverage', text: 'Coverage gap in checkout process', action: 'Generate 5 tests' },
    ];

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-white mb-1">Dashboard</h1>
                    <p className="text-white/40 text-sm">Overview of your automated testing suite</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-[#1e2337] hover:bg-[#2a3044] text-white/80 px-4 py-2 rounded-lg border border-white/10 text-sm transition-colors">
                        Customize
                    </button>
                    <button className="bg-violet-600 hover:bg-violet-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                        <Play size={16} /> Run New Test
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#1e2337]/80 backdrop-blur-sm border border-[#8a74f9]/15 rounded-xl p-5"
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className={`${stat.bg} ${stat.color} p-2 rounded-lg`}>
                                <stat.icon size={20} />
                            </div>
                            <span className="text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">+2.4%</span>
                        </div>
                        <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                        <div className="text-white/40 text-sm">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Test Runs */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1e2337]/80 backdrop-blur-sm border border-[#8a74f9]/15 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-lg font-bold text-white">Recent Test Runs</h2>
                            <button className="text-sm text-violet-400 hover:text-violet-300">View All</button>
                        </div>
                        <div className="space-y-3">
                            {testRuns.map((run, i) => (
                                <div key={run.id} className="flex items-center justify-between p-4 bg-[#0f121e] border border-white/5 rounded-lg group hover:border-violet-500/20 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${run.status === 'running' ? 'bg-yellow-400 animate-pulse' :
                                                run.status === 'passed' ? 'bg-green-400' : 'bg-red-400'
                                            }`} />
                                        <div>
                                            <h3 className="text-white font-medium text-sm">{run.project}</h3>
                                            <p className="text-white/30 text-xs">Run #{run.id} • {run.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <div className={`text-sm font-medium ${run.status === 'running' ? 'text-yellow-400' :
                                                    run.status === 'passed' ? 'text-green-400' : 'text-red-400'
                                                }`}>
                                                {run.status === 'running' ? 'Running...' :
                                                    run.status === 'passed' ? 'Passed' : 'Failed'}
                                            </div>
                                            <div className="text-white/30 text-xs">{run.duration}</div>
                                        </div>
                                        <button className="p-2 hover:bg-white/5 rounded text-white/40 hover:text-white transition-colors">
                                            <ChevronRight size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* AI Insights & Quick Actions */}
                <div className="space-y-6">
                    <div className="bg-[#1e2337]/80 backdrop-blur-sm border border-[#8a74f9]/15 rounded-xl p-6">
                        <div className="flex items-center gap-2 mb-6">
                            <Zap size={20} className="text-yellow-400" />
                            <h2 className="text-lg font-bold text-white">AI Recommendations</h2>
                        </div>
                        <div className="space-y-4">
                            {recommendations.map((rec, i) => (
                                <div key={i} className="p-4 bg-gradient-to-br from-violet-600/10 to-indigo-600/10 border border-violet-500/20 rounded-xl">
                                    <p className="text-violet-200 text-sm mb-3">{rec.text}</p>
                                    <button className="w-full py-2 bg-violet-600/20 hover:bg-violet-600/30 border border-violet-500/30 rounded text-violet-300 text-xs font-medium transition-colors flex items-center justify-center gap-2">
                                        <SparklesIcon className="w-3 h-3" /> {rec.action}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-[#1e2337]/80 backdrop-blur-sm border border-[#8a74f9]/15 rounded-xl p-6">
                        <h2 className="text-lg font-bold text-white mb-4">Quick Stats</h2>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between text-sm text-white/60 mb-1">
                                    <span>Test Coverage</span>
                                    <span>84%</span>
                                </div>
                                <div className="w-full bg-[#0f121e] rounded-full h-2">
                                    <div className="bg-violet-500 h-2 rounded-full w-[84%]"></div>
                                </div>
                            </div>
                            <div>
                                <div className="flex justify-between text-sm text-white/60 mb-1">
                                    <span>Server Load</span>
                                    <span>42%</span>
                                </div>
                                <div className="w-full bg-[#0f121e] rounded-full h-2">
                                    <div className="bg-blue-500 h-2 rounded-full w-[42%]"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function SparklesIcon({ className }) {
    return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    )
}
