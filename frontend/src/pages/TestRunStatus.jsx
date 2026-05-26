import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { 
    ArrowLeft, 
    CheckCircle, 
    BrainCircuit, 
    Terminal as TerminalIcon, 
    Globe, 
    Sparkles, 
    Zap, 
    Activity, 
    Cpu, 
    Radar, 
    ChevronRight,
    Search,
    Dna
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TestRunStatus() {
    const { id } = useParams();
    const [status, setStatus] = useState('RUNNING');
    const [logs, setLogs] = useState([
        'Initializing neural shard link...',
        'Allocating memory sectors in Node-12...',
        'Establishing DOM traversal baseline...',
        'Injecting heuristic probes into #auth-matrix...',
        'Processing 422 concurrent user simulations...',
        'Neural healing active: resolving unstable selector...',
        'Analyzing temporal race conditions in API shunt...',
    ]);

    const theme = useMemo(() => ({
        color: status === 'RUNNING' ? '#a3a6ff' : status === 'PASSED' ? '#10b981' : '#f43f5e',
        glow: status === 'RUNNING' ? 'rgba(163,166,255,0.4)' : status === 'PASSED' ? 'rgba(16,185,129,0.4)' : 'rgba(244,63,94,0.4)'
    }), [status]);

    return (
        <div className="relative min-h-screen bg-[#020617] overflow-hidden">
            {/* Header / Top Bar */}
            <header className="fixed top-16 left-0 right-0 h-20 bg-[#020617]/50 backdrop-blur-xl border-b border-white/[0.04] px-12 flex items-center justify-between z-40">
                <div className="flex items-center gap-8">
                    <Link to="/app/runs" className="p-3 bg-white/[0.03] hover:bg-white/[0.08] rounded-xl text-slate-400 hover:text-white transition-all border border-white/[0.05]">
                        <ArrowLeft size={18} />
                    </Link>
                    <div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Diagnostic Interface</span>
                            <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
                        </div>
                        <h2 className="text-xl font-black text-white tracking-widest uppercase">Run Shard: {id || '042-ALPHA'}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-6">
                    <div className="flex flex-col items-end">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Status Protocol</span>
                        <div className="flex items-center gap-3 px-4 py-1.5 bg-white/[0.03] border border-white/[0.05] rounded-full">
                            <div className="w-2 h-2 rounded-full animate-ping" style={{ backgroundColor: theme.color }} />
                            <span className="text-xs font-black uppercase tracking-widest" style={{ color: theme.color }}>{status}</span>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Diagnostics Container */}
            <main className="pt-40 px-12 pb-24 grid grid-cols-1 xl:grid-cols-3 gap-12 max-w-[1900px] mx-auto h-screen">
                
                {/* Visual Pipeline (Lef/Center Column) */}
                <div className="xl:col-span-2 space-y-12 overflow-y-auto custom-scrollbar pr-4">
                    <div className="relative bg-[#0f172a]/20 backdrop-blur-3xl border border-white/[0.03] rounded-[3rem] p-16 overflow-hidden">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.05),transparent_70%)]" />
                        
                        {/* Process Flow */}
                        <div className="relative flex flex-col md:flex-row items-center justify-between gap-12 z-10">
                            <PipelineNode 
                                icon={Globe} 
                                label="Initialization" 
                                isActive={true} 
                                color="#8ce7ff" 
                                status="Complete"
                            />
                            <ConnectingPulse active={true} />
                            <PipelineNode 
                                icon={Dna} 
                                label="Neural Mapping" 
                                isActive={true} 
                                color="#ac8aff" 
                                status="Processing"
                            />
                            <ConnectingPulse active={true} />
                            <PipelineNode 
                                icon={Activity} 
                                label="Flow Execution" 
                                isActive={false} 
                                color="#a3a6ff" 
                                status="Queued"
                            />
                            <ConnectingPulse active={false} />
                            <PipelineNode 
                                icon={CheckCircle} 
                                label="Synthesis" 
                                isActive={false} 
                                color="#10b981" 
                                status="Hold"
                            />
                        </div>

                        {/* Telemetry Stats */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-24 pt-16 border-t border-white/[0.03]">
                            {[
                                { label: 'CPU Cluster Load', value: '42.8%', icon: Cpu },
                                { label: 'Active Simulations', value: '512 / 1k', icon: Sparkles },
                                { label: 'Memory Reserved', value: '1,248 MB', icon: Zap },
                                { label: 'Neural Accuracy', value: '99.99%', icon: BrainCircuit },
                            ].map((stat, i) => (
                                <div key={i}>
                                    <div className="flex items-center gap-2 mb-3">
                                        <stat.icon size={14} className="text-slate-600" />
                                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</span>
                                    </div>
                                    <div className="text-2xl font-black text-white tracking-tighter">{stat.value}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] p-10 group hover:border-indigo-500/30 transition-all">
                             <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Heuristic Correction</h3>
                                <Zap className="text-indigo-500" size={18} fill="currentColor" />
                             </div>
                             <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                                AI has autonomously detected 4 breaking changes in DOM structure. Synthesis of healing selectors initiated.
                             </p>
                        </div>
                        <div className="bg-emerald-600/5 border border-emerald-500/10 rounded-[2.5rem] p-10 group hover:border-emerald-500/30 transition-all">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Security Integrity</h3>
                                <ShieldIcon className="text-emerald-500" size={18} fill="currentColor" />
                             </div>
                             <p className="text-sm text-slate-400 font-medium italic leading-relaxed">
                                All simulation nodes are verified within the secure cloud perimeter. Zero breach vectors detected.
                             </p>
                        </div>
                    </div>
                </div>

                {/* Terminal Console (Right Column) */}
                <div className="flex flex-col h-full overflow-hidden pb-12">
                    <div className="flex-1 bg-[#020617] border border-white/[0.04] rounded-[2.5rem] flex flex-col overflow-hidden shadow-3xl">
                        {/* Terminal Header */}
                        <div className="px-8 py-6 bg-white/[0.02] border-b border-white/[0.04] flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <TerminalIcon size={16} className="text-indigo-500" />
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">Neural Stream</span>
                            </div>
                            <div className="flex gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                                <div className="w-2.5 h-2.5 rounded-full bg-white/5" />
                            </div>
                        </div>
                        
                        {/* Console Logs */}
                        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar font-mono text-xs space-y-3">
                            <AnimatePresence>
                                {logs.map((log, i) => (
                                    <motion.div 
                                        key={i}
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="flex items-start gap-4 text-slate-500"
                                    >
                                        <span className="opacity-20 select-none">[{i.toString().padStart(3, '0')}]</span>
                                        <span className={i === logs.length - 1 ? 'text-indigo-400 font-bold' : ''}>
                                            <span className="text-indigo-800">{'>>>'}</span> {log}
                                        </span>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                            <motion.div 
                                animate={{ opacity: [1, 0] }}
                                transition={{ repeat: Infinity, duration: 0.8 }}
                                className="w-2 h-4 bg-indigo-500 inline-block align-middle ml-2"
                            />
                        </div>

                        {/* Console Controls */}
                        <div className="p-6 bg-white/[0.01] border-t border-white/[0.03] space-y-4">
                            <div className="flex items-center gap-4">
                                <Search size={14} className="text-slate-600" />
                                <input 
                                    type="text" 
                                    placeholder="Filter neural feed..." 
                                    className="bg-transparent border-none text-[10px] text-slate-400 placeholder-slate-700 focus:outline-none w-full font-mono"
                                />
                            </div>
                            <button className="w-full py-4 bg-white text-[#020617] rounded-xl font-black text-[10px] uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02]">
                                Intervene Process
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

const PipelineNode = ({ icon: Icon, label, isActive, color, status }) => (
    <div className="flex flex-col items-center gap-6 group">
        <div className="relative">
            {isActive && (
                <motion.div 
                    className="absolute -inset-10 rounded-full blur-3xl opacity-20"
                    style={{ backgroundColor: color }}
                    animate={{ opacity: [0.1, 0.4, 0.1], scale: [0.8, 1.4, 0.8] }}
                    transition={{ duration: 4, repeat: Infinity }}
                />
            )}
            <motion.div 
                className={`relative w-32 h-32 rounded-[2.5rem] flex items-center justify-center border transition-all duration-700 ${
                    isActive 
                        ? 'bg-[#0f172a]/40 border-white/[0.1] shadow-2xl' 
                        : 'bg-transparent border-white/[0.03]'
                }`}
                whileHover={{ y: -8, transition: { duration: 0.3 } }}
            >
                <Icon size={44} className={isActive ? '' : 'opacity-10'} style={{ color: isActive ? color : 'white' }} />
                <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-[#020617] border border-white/5 flex items-center justify-center">
                     <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-indigo-500 shadow-[0_0_8px_rgba(99,102,241,0.6)]' : 'bg-slate-800'}`} />
                </div>
            </motion.div>
        </div>
        <div className="text-center">
            <div className={`text-[11px] font-black uppercase tracking-widest transition-all duration-500 mb-1 ${isActive ? 'text-white' : 'text-slate-700'}`}>
                {label}
            </div>
            <div className="text-[9px] font-bold text-slate-500 opacity-40 uppercase tracking-widest">{status}</div>
        </div>
    </div>
);

const ConnectingPulse = ({ active }) => (
    <div className="hidden md:block flex-1 h-[2px] bg-white/[0.04] relative mx-4 rounded-full">
        {active && (
            <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500 to-transparent shadow-[0_0_15px_rgba(99,102,241,0.6)]"
                animate={{ x: ['-100%', '100%'] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
        )}
    </div>
);

const ShieldIcon = ({ size, className }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    </svg>
);
