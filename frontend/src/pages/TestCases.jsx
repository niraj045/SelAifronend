import { motion } from 'framer-motion';
import { Terminal, Plus, Search, Filter, Play, Edit, Trash2, ChevronRight, Zap, Target, Shield, Clock, Brain } from 'lucide-react';

const TestCases = () => {
    const cases = [
        { id: 'SCN-102', name: 'Identity Matrix Handshake', tags: ['Auth', 'Critical'], priority: 'High', coverage: '98%', complexity: 'Medium' },
        { id: 'SCN-105', name: 'Protocol Shard Sync', tags: ['Data', 'Sync'], priority: 'Medium', coverage: '94%', complexity: 'Low' },
        { id: 'SCN-211', name: 'Recursive Healing Loop', tags: ['AI', 'Heuristic'], priority: 'High', coverage: '100%', complexity: 'High' },
        { id: 'SCN-308', name: 'Ephemeral Token Breach', tags: ['Security', 'Edge'], priority: 'Low', coverage: '88%', complexity: 'High' },
    ];

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-[1700px] mx-auto space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-20">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <Target className="text-indigo-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Scenario Registry</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
                        Scenario <span className="text-indigo-500">Mapping.</span>
                    </h1>
                </motion.div>
                
                <motion.button 
                    whileHover={{ scale: 1.02, y: -2 }}
                    className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-600/20 flex items-center gap-3"
                >
                    <Plus size={18} strokeWidth={3} /> Synthesize Scenario
                </motion.button>
            </header>

            {/* Controls Bar */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-white/[0.01] border border-white/[0.04] rounded-[2.5rem] backdrop-blur-xl">
                 <div className="relative flex-1 max-w-lg w-full">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search scenario mapping..." 
                        className="w-full pl-16 pr-6 py-4 bg-[#020617] border border-white/[0.05] rounded-[1.5rem] text-[13px] text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder-slate-800 font-medium"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="flex items-center gap-3 px-6 py-4 bg-white/[0.03] border border-white/[0.05] text-slate-400 rounded-2xl hover:text-white transition-all">
                        <Filter size={18} />
                        <span className="text-[10px] font-black uppercase tracking-widest">Filter Shards</span>
                    </button>
                    <button className="p-4 bg-white/[0.03] border border-white/[0.05] rounded-2xl text-slate-400 hover:text-white transition-all">
                        <Edit size={18} />
                    </button>
                </div>
            </div>

            {/* Scenarios Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {cases.map((scenario, idx) => (
                    <motion.div
                        key={scenario.id}
                        initial={{ opacity: 0, scale: 0.98 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-[#0f172a]/20 backdrop-blur-3xl border border-white/[0.03] rounded-[3rem] p-12 hover:border-indigo-500/20 transition-all duration-500 relative overflow-hidden"
                    >
                         <div className="absolute top-0 right-0 p-10 opacity-[0.03] text-indigo-500 group-hover:opacity-[0.06] transition-opacity duration-700 pointer-events-none">
                            <Brain size={160} />
                        </div>

                        <div className="flex flex-col h-full relative z-10">
                            <div className="flex items-start justify-between mb-10">
                                <div>
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {scenario.tags.map(tag => (
                                            <span key={tag} className="text-[9px] font-black px-2.5 py-1 bg-white/5 text-slate-500 rounded-md border border-white/10 uppercase tracking-widest">{tag}</span>
                                        ))}
                                    </div>
                                    <h3 className="text-3xl font-black text-white tracking-tighter uppercase leading-tight group-hover:text-indigo-400 transition-colors">{scenario.name}</h3>
                                    <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mt-1 italic">Shard Registry ID: {scenario.id}</p>
                                </div>
                                <div className={`px-4 py-1.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${
                                    scenario.priority === 'High' ? 'text-rose-400 border-rose-500/20 bg-rose-500/10' : 'text-slate-500 border-white/10'
                                }`}>
                                    {scenario.priority} Priority
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-8 py-8 border-y border-white/5 mb-10">
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Map Coverage</div>
                                    <div className="text-xl font-black text-white tracking-tighter">{scenario.coverage}</div>
                                </div>
                                <div className="space-y-1 border-x border-white/[0.05] px-8">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Complexity</div>
                                    <div className="text-xl font-black text-white tracking-tighter">{scenario.complexity}</div>
                                </div>
                                <div className="space-y-1 pl-4">
                                    <div className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Heuristic Sync</div>
                                    <div className="text-xl font-black text-emerald-400 tracking-tighter">Optimal</div>
                                </div>
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <button className="flex-1 py-4 bg-white text-[#020617] rounded-2xl font-black text-[10px] uppercase tracking-widest hover:shadow-2xl transition-all flex items-center justify-center gap-3 group/btn">
                                    <Play size={14} fill="currentColor" className="group-hover/btn:translate-x-1 transition-transform" /> Execute Shard
                                </button>
                                <button className="p-4 bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-white rounded-2xl transition-all">
                                    <Edit size={18} />
                                </button>
                                <button className="p-4 bg-white/[0.03] border border-white/[0.05] text-slate-400 hover:text-rose-400 rounded-2xl transition-all">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default TestCases;
