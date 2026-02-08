import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import { ArrowLeft, CheckCircle, BrainCircuit, Terminal, Globe, Sparkles, Zap } from 'lucide-react';
import { motion, useScroll, useTransform } from 'framer-motion';

export default function TestRunStatus() {
    const { id } = useParams();
    const [status, setStatus] = useState('PENDING');
    const [logs, setLogs] = useState([]);
    const containerRef = useRef(null);
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    
    const backgroundY = useTransform(scrollYProgress, [0, 1], [0, 100]);

    useEffect(() => {
        const interval = setInterval(async () => {
            try {
                const res = await api.getTestRunStatus(id);
                const currentStatus = res.data.status;
                setStatus(currentStatus);
                
                if (currentStatus === 'RUNNING' && logs.length < 3) {
                    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] Executing test steps...`]);
                }
                
                if (['PASSED', 'FAILED'].includes(currentStatus)) {
                    clearInterval(interval);
                }
            } catch (e) {
                console.error("Failed to fetch test status", e);
            }
        }, 2000);
        
        return () => clearInterval(interval);
    }, [id, logs.length]);

    const getStatusGradient = () => {
        if (status === 'PASSED') return 'from-green-500 to-emerald-600';
        if (status === 'FAILED') return 'from-red-500 to-rose-600';
        return 'from-blue-500 to-purple-600';
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Animated Background */}
            <motion.div 
                style={{ y: backgroundY }}
                className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"
            >
                <motion.div 
                    className="absolute inset-0"
                    animate={{
                        background: [
                            'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15), transparent 60%)',
                            'radial-gradient(circle at 70% 50%, rgba(139, 92, 246, 0.15), transparent 60%)',
                            'radial-gradient(circle at 30% 50%, rgba(59, 130, 246, 0.15), transparent 60%)'
                        ]
                    }}
                    transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                />
            </motion.div>

            {/* Content */}
            <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
                {/* Back Button */}
                <Link 
                    to="/" 
                    className="absolute top-8 left-8 text-gray-400 hover:text-white transition-colors flex items-center gap-2 group"
                >
                    <motion.div
                        whileHover={{ x: -5 }}
                        className="flex items-center gap-2"
                    >
                        <ArrowLeft size={20} /> 
                        <span>Back to Dashboard</span>
                    </motion.div>
                </Link>

                {/* Main Status Card */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-full max-w-5xl"
                >
                    <div className="relative group">
                        {/* Glow Effect */}
                        <div className={`absolute -inset-1 bg-gradient-to-r ${getStatusGradient()} rounded-3xl blur-xl opacity-50 group-hover:opacity-75 transition duration-500`} />
                        
                        {/* Card Content */}
                        <div className="relative bg-black/90 backdrop-blur-xl border border-white/10 rounded-3xl p-12 overflow-hidden">
                            {/* Top Gradient Bar */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusGradient()}`} />

                            {/* Header */}
                            <motion.div 
                                className="text-center mb-12"
                                initial={{ y: -20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <motion.h2 
                                    className="text-4xl md:text-5xl font-black mb-4 bg-clip-text text-transparent"
                                    animate={status === 'RUNNING' ? {
                                        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
                                    } : {}}
                                    transition={{ duration: 3, repeat: Infinity }}
                                    style={{
                                        backgroundSize: '200% 200%',
                                        backgroundImage: 'linear-gradient(90deg, #fff, #60a5fa, #a78bfa, #fff)'
                                    }}
                                >
                                    {status === 'RUNNING' ? 'AI Agent Active' : `Test ${status}`}
                                </motion.h2>
                                <StatusBadge status={status} />
                            </motion.div>

                            {/* Pipeline Visualization */}
                            <div className="flex items-center justify-center gap-8 md:gap-16 mb-12 relative">
                                <PipelineNode 
                                    icon={BrainCircuit} 
                                    label="AI Analysis" 
                                    isActive={['PENDING', 'RUNNING', 'PASSED', 'FAILED'].includes(status)}
                                    gradient="from-purple-500 to-pink-500"
                                />

                                <ConnectingPulse active={status === 'RUNNING'} />

                                <PipelineNode 
                                    icon={Terminal} 
                                    label="Orchestration" 
                                    isActive={['RUNNING', 'PASSED', 'FAILED'].includes(status)}
                                    gradient="from-blue-500 to-cyan-500"
                                />

                                <ConnectingPulse active={status === 'RUNNING'} />

                                <PipelineNode 
                                    icon={Globe} 
                                    label="Execution" 
                                    isActive={['RUNNING', 'PASSED'].includes(status)}
                                    gradient="from-green-500 to-emerald-500"
                                />
                            </div>

                            {/* Live Terminal */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 }}
                                className="relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-blue-500/20 rounded-2xl blur" />
                                <div className="relative bg-gray-900 rounded-2xl p-6 font-mono text-sm border border-white/5">
                                    <div className="flex items-center gap-2 mb-4 pb-3 border-b border-white/10">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                        <span className="ml-4 text-gray-500 text-xs">Terminal</span>
                                    </div>
                                    <div className="space-y-2 max-h-48 overflow-y-auto text-green-400">
                                        <TerminalLine text={`> Test Run #${id} initialized...`} delay={0} />
                                        {status !== 'PENDING' && <TerminalLine text="> Connecting to AI Engine..." delay={0.5} />}
                                        {status === 'RUNNING' && <TerminalLine text="> GPT-4 analyzing target..." delay={1} />}
                                        {status === 'RUNNING' && logs.map((log, idx) => (
                                            <TerminalLine key={idx} text={log} delay={1.5 + idx * 0.3} />
                                        ))}
                                        {status === 'PASSED' && <TerminalLine text="✓ Test execution completed successfully" delay={2} />}
                                        {status === 'FAILED' && <TerminalLine text="✗ Test execution failed" delay={2} className="text-red-400" />}
                                        {['PASSED', 'FAILED'].includes(status) && <TerminalLine text="> Generating report..." delay={2.5} />}
                                    </div>
                                </div>
                            </motion.div>

                            {/* Status Messages */}
                            {status === 'PASSED' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="mt-8"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl blur opacity-50" />
                                        <div className="relative bg-green-500/10 border border-green-500/30 rounded-2xl p-6 text-center">
                                            <CheckCircle className="mx-auto mb-3 text-green-400" size={32} />
                                            <p className="text-green-100 text-lg font-semibold">Test Completed Successfully</p>
                                            <p className="text-green-400/70 text-sm mt-2">Report available via API Gateway</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                            
                            {status === 'FAILED' && (
                                <motion.div 
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    className="mt-8"
                                >
                                    <div className="relative group">
                                        <div className="absolute -inset-0.5 bg-gradient-to-r from-red-500 to-rose-600 rounded-2xl blur opacity-50" />
                                        <div className="relative bg-red-500/10 border border-red-500/30 rounded-2xl p-6 text-center">
                                            <p className="text-red-100 text-lg font-semibold">Test Failed</p>
                                            <p className="text-red-400/70 text-sm mt-2">Review logs for details</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}

// Status Badge Component
const StatusBadge = ({ status }) => {
    const getConfig = () => {
        if (status === 'PASSED') return { gradient: 'from-green-500 to-emerald-600', icon: CheckCircle };
        if (status === 'FAILED') return { gradient: 'from-red-500 to-rose-600', icon: CheckCircle };
        if (status === 'RUNNING') return { gradient: 'from-blue-500 to-purple-600', icon: Sparkles };
        return { gradient: 'from-gray-500 to-gray-600', icon: Zap };
    };
    
    const config = getConfig();
    const Icon = config.icon;
    
    return (
        <motion.div 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/5 border border-white/10"
            animate={status === 'RUNNING' ? { scale: [1, 1.05, 1] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
        >
            <Icon size={16} className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`} />
            <span className={`font-bold text-sm bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {status}
            </span>
        </motion.div>
    );
};

// Pipeline Node Component
const PipelineNode = ({ icon: Icon, label, isActive, gradient }) => (
    <motion.div 
        className="flex flex-col items-center gap-3"
        animate={isActive ? { scale: [1, 1.1, 1] } : { scale: 1 }}
        transition={{ duration: 2, repeat: isActive ? Infinity : 0 }}
    >
        <div className="relative">
            {isActive && (
                <motion.div 
                    className={`absolute -inset-4 bg-gradient-to-r ${gradient} rounded-3xl blur-xl opacity-50`}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity }}
                />
            )}
            <motion.div 
                className={`relative w-20 h-20 rounded-2xl flex items-center justify-center border-2 ${
                    isActive 
                        ? `bg-gradient-to-r ${gradient} border-transparent shadow-lg` 
                        : 'bg-white/5 border-white/10'
                }`}
                whileHover={{ scale: 1.1, rotate: 5 }}
            >
                <Icon size={32} className={isActive ? 'text-white' : 'text-gray-600'} />
            </motion.div>
        </div>
        <span className={`font-semibold text-sm ${isActive ? 'text-white' : 'text-gray-600'}`}>
            {label}
        </span>
    </motion.div>
);

// Connecting Pulse Component
const ConnectingPulse = ({ active }) => (
    <div className="w-16 md:w-32 h-1 bg-white/10 rounded-full overflow-hidden relative">
        {active && (
            <>
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div 
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
                    animate={{ x: ['-100%', '200%'] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear", delay: 0.3 }}
                />
            </>
        )}
    </div>
);

// Terminal Line Component
const TerminalLine = ({ text, delay, className = "" }) => (
    <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay, duration: 0.3 }}
        className={className || "text-green-400"}
    >
        {text}
    </motion.div>
);
