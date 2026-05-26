import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap, Cpu, Scan, Activity, ArrowUpRight, BarChart3, Fingerprint, Shield } from 'lucide-react';

const AIInsights = () => {
    const insights = [
        {
            type: 'optimization',
            title: 'Neural Redundancy Detected',
            description: 'Authentication cycles in Node-8 clusters are exhibiting 32% redundant verification paths. Protocol distillation recommended to bypass overhead.',
            impact: 'Significant',
            metric: '+310ms latency gain',
            status: 'Processing'
        },
        {
            type: 'selector',
            title: 'Temporal Anchor Instability',
            description: 'The DOM sector "#workflow-matrix" relies on dynamic temporal hashes. Heuristics suggest a transition to stable property observers.',
            impact: 'Critical',
            nodes: 14,
            status: 'At Risk'
        },
        {
            type: 'coverage',
            title: 'Parity Breach Warning',
            description: 'Logic shards for "Payment Flow V2" have drifted 4% from the production baseline. Auto-synthesis of new test vectors in progress.',
            impact: 'Moderate',
            confidence: '98.2%',
            status: 'Steady'
        },
    ];

    const getImpactStyle = (impact) => {
        switch(impact) {
            case 'Critical': return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
            case 'Significant': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
            default: return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
        }
    };

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-[1700px] mx-auto space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <Fingerprint className="text-indigo-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Heuristic Reconnaissance</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
                        Synthesis <span className="text-indigo-500">Intelligence.</span>
                    </h1>
                </motion.div>
                
                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="px-10 py-5 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-2xl transition-all hover:bg-indigo-600 hover:text-white"
                >
                    Initialize Global Audit
                </motion.button>
            </header>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                {[
                    { label: 'Neural Precision', value: '99.9%', trend: '+0.1%', icon: Activity, color: 'text-emerald-400' },
                    { label: 'Protocol Drift', value: '0.04%', trend: '-0.2%', icon: Scan, color: 'text-indigo-400' },
                    { label: 'Auto-Healing', value: '1,244', trend: 'Active', icon: Cpu, color: 'text-purple-400' },
                    { label: 'Security Breaches', value: '00', trend: 'Optimal', icon: Shield, color: 'text-slate-500' },
                ].map((m, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-10 bg-white/[0.02] border border-white/[0.04] rounded-[2.5rem] relative overflow-hidden group hover:border-white/10 transition-all"
                    >
                        <div className={`p-4 rounded-2xl bg-white/[0.03] border border-white/[0.05] ${m.color} mb-8 w-fit group-hover:scale-110 transition-transform`}>
                            <m.icon size={20} />
                        </div>
                        <div className="text-4xl font-black text-white tracking-tighter mb-1">{m.value}</div>
                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">{m.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Detailed Insights Feed */}
            <div className="space-y-6">
                {insights.map((insight, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 + (idx * 0.1) }}
                        className="bg-[#0f172a]/20 backdrop-blur-3xl border border-white/[0.03] rounded-[3rem] p-12 hover:border-indigo-500/20 transition-all group relative overflow-hidden"
                    >
                        <div className="flex flex-col lg:flex-row gap-12">
                            <div className="lg:w-1/3 space-y-8">
                                <div className={`inline-flex items-center gap-3 px-5 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${getImpactStyle(insight.impact)}`}>
                                    {insight.impact} Reach
                                </div>
                                <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight">{insight.title}</h3>
                                <div className="p-6 bg-white/[0.02] border border-white/[0.05] rounded-3xl">
                                     <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Neural Confidence Map</div>
                                     <div className="h-24 w-full flex items-end gap-1 px-2">
                                         {[40, 70, 45, 90, 65, 80, 55, 95].map((h, i) => (
                                             <motion.div 
                                                 key={i} 
                                                 initial={{ height: 0 }}
                                                 animate={{ height: `${h}%` }}
                                                 transition={{ delay: 1 + i * 0.1, duration: 1 }}
                                                 className="flex-1 bg-indigo-500/20 rounded-t-sm group-hover:bg-indigo-500/40 transition-colors" 
                                             />
                                         ))}
                                     </div>
                                </div>
                            </div>

                            <div className="lg:w-2/3 space-y-10">
                                <p className="text-lg text-slate-400 font-medium italic leading-relaxed">"{insight.description}"</p>
                                
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-10 border-t border-white/5 pt-10">
                                    {insight.metric && (
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Efficiency Delta</div>
                                            <div className="text-xl font-black text-emerald-400 tracking-tight">{insight.metric}</div>
                                        </div>
                                    )}
                                    {insight.nodes && (
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Compromised Nodes</div>
                                            <div className="text-xl font-black text-rose-400 tracking-tight">{insight.nodes} SHARDS</div>
                                        </div>
                                    )}
                                    {insight.confidence && (
                                        <div className="space-y-1">
                                            <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Synthesis Rating</div>
                                            <div className="text-xl font-black text-indigo-400 tracking-tight">{insight.confidence}</div>
                                        </div>
                                    )}
                                    <div className="space-y-1">
                                        <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cycle State</div>
                                        <div className="text-xl font-black text-white tracking-tight">{insight.status}</div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button className="flex-1 px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 transition-all">
                                        Authorize Synthesis
                                    </button>
                                    <button className="px-8 py-4 bg-white/[0.02] border border-white/[0.05] text-slate-300 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-white/[0.08] transition-all">
                                        Inspect Source
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};


export default AIInsights;
