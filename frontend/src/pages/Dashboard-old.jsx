import React, { useEffect, useState, useRef } from 'react';
import { api } from '../services/api';
import { Play, Plus, Server, Globe, Sparkles, Zap } from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform, useInView } from 'framer-motion';
import { FadeInCard, BouncyButton } from '../components/ui/Motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const containerRef = useRef(null);
    const heroRef = useRef(null);
    const isHeroInView = useInView(heroRef, { once: true, amount: 0.3 });
    
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });
    
    const heroY = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        loadProjects();
    }, []);

    const loadProjects = async () => {
        try {
            const res = await api.getProjects();
            setProjects(res.data);
        } catch (e) {
            console.error("Failed to load projects", e);
        }
    };

    const handleCreate = async (e) => {
        e.preventDefault();
        if (!newUrl) return;
        
        setLoading(true);
        try {
            const name = new URL(newUrl).hostname;
            await api.createProject({ name, url: newUrl });
            setNewUrl('');
            loadProjects();
        } catch (e) {
            alert("Failed to create project: " + e.message);
        } finally {
            setLoading(false);
        }
    };

    const runTest = async (project) => {
        try {
            const res = await api.startTestRun(project.id, project.url);
            navigate(`/run/${res.data.id}`);
        } catch (e) {
            alert("Failed to start test: " + e.message);
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen bg-black text-white font-sans overflow-x-hidden">
            {/* Animated Background Gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black">
                <motion.div 
                    className="absolute inset-0 opacity-30"
                    animate={{
                        background: [
                            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15), transparent 50%)',
                            'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15), transparent 50%)',
                            'radial-gradient(circle at 50% 80%, rgba(59, 130, 246, 0.15), transparent 50%)',
                            'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15), transparent 50%)'
                        ]
                    }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navigation */}
                <motion.nav 
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="fixed top-0 left-0 right-0 z-50 px-8 py-6 backdrop-blur-xl bg-black/30 border-b border-white/5"
                >
                    <div className="max-w-7xl mx-auto flex items-center justify-between">
                        <motion.div 
                            className="text-2xl font-bold"
                            whileHover={{ scale: 1.05 }}
                        >
                            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                SelAi
                            </span>
                        </motion.div>
                        <div className="flex items-center gap-3">
                            <motion.div 
                                className="flex items-center gap-2 text-xs text-gray-400 px-3 py-1.5 rounded-full border border-white/10 bg-white/5"
                                animate={{ opacity: [0.5, 1, 0.5] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            >
                                <Sparkles size={12} className="text-green-400" />
                                AI Ready
                            </motion.div>
                        </div>
                    </div>
                </motion.nav>

                {/* Hero Section */}
                <motion.section 
                    ref={heroRef}
                    style={{ y: heroY, opacity: heroOpacity }}
                    className="min-h-screen flex items-center justify-center px-8 pt-32"
                >
                    <div className="max-w-6xl mx-auto text-center space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <motion.h1 
                                className="text-7xl md:text-8xl lg:text-9xl font-black leading-none tracking-tight mb-8"
                                initial={{ opacity: 0 }}
                                animate={isHeroInView ? { opacity: 1 } : {}}
                                transition={{ duration: 1, delay: 0.2 }}
                            >
                                <span className="block bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
                                    Testing,
                                </span>
                                <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                                    Reimagined.
                                </span>
                            </motion.h1>
                        </motion.div>

                        <motion.p 
                            className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.4 }}
                        >
                            The AI-powered testing platform behind
                            <span className="text-white font-semibold"> intelligent automation</span>.
                            Launch tests in seconds, not hours.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={isHeroInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.8, delay: 0.6 }}
                            className="flex gap-4 justify-center items-center flex-wrap"
                        >
                            <motion.div
                                whileHover={{ scale: 1.05, boxShadow: "0 0 30px rgba(59, 130, 246, 0.3)" }}
                                whileTap={{ scale: 0.95 }}
                                className="group relative"
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-60 group-hover:opacity-100 transition" />
                                <div className="relative px-8 py-4 bg-black rounded-2xl flex items-center gap-3">
                                    <Zap size={20} className="text-blue-400" />
                                    <span className="text-white font-semibold">Start Testing</span>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </motion.section>

                {/* Create Project Section */}
                <section className="px-8 py-32">
                    <div className="max-w-5xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Create New Project
                            </h2>
                            <p className="text-gray-400 text-lg mb-12">Enter any URL to begin AI-powered testing</p>
                        </ScrollReveal>

                        <ScrollReveal delay={0.2}>
                            <motion.form 
                                onSubmit={handleCreate} 
                                className="relative group"
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-20 group-hover:opacity-40 transition" />
                                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex gap-4">
                                    <input 
                                        type="url" 
                                        placeholder="https://example.com" 
                                        className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-lg focus:outline-none"
                                        value={newUrl}
                                        onChange={e => setNewUrl(e.target.value)}
                                        required
                                    />
                                    <motion.button
                                        type="submit"
                                        disabled={loading}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg hover:shadow-blue-500/50 transition-all disabled:opacity-50"
                                    >
                                        <Plus size={20} /> {loading ? 'Creating...' : 'Initialize'}
                                    </motion.button>
                                </div>
                            </motion.form>
                        </ScrollReveal>
                    </div>
                </section>

                {/* Projects Grid */}
                <section className="px-8 py-32">
                    <div className="max-w-7xl mx-auto">
                        <ScrollReveal>
                            <h2 className="text-5xl md:text-6xl font-bold mb-16 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                                Your Projects
                            </h2>
                        </ScrollReveal>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <AnimatePresence>
                                {projects.map((p, i) => (
                                    <ScrollReveal key={p.id} delay={i * 0.1}>
                                        <ProjectCard project={p} onRun={runTest} />
                                    </ScrollReveal>
                                ))}
                            </AnimatePresence>
                        </div>

                        {projects.length === 0 && (
                            <ScrollReveal>
                                <motion.div 
                                    className="text-center py-24"
                                >
                                    <motion.div
                                        animate={{ 
                                            y: [0, -10, 0],
                                            rotate: [0, 5, -5, 0]
                                        }}
                                        transition={{ duration: 4, repeat: Infinity }}
                                    >
                                        <Server size={64} className="mx-auto mb-6 text-gray-700" />
                                    </motion.div>
                                    <p className="text-gray-500 text-xl">No projects yet. Create one to begin.</p>
                                </motion.div>
                            </ScrollReveal>
                        )}
                    </div>
                </section>

                {/* Footer */}
                <footer className="px-8 py-12 border-t border-white/5">
                    <div className="max-w-7xl mx-auto text-center text-gray-500 text-sm">
                        <p>© 2026 SelAi. Powered by GPT-4 + Selenium.</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

// Scroll Reveal Component
const ScrollReveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 50 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: "easeOut" }}
        >
            {children}
        </motion.div>
    );
};

// Project Card Component
const ProjectCard = ({ project, onRun }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
        <motion.div
            className="group relative"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            whileHover={{ y: -5 }}
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-40 transition duration-500" />
            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:border-white/20 transition-all">
                <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-bold text-xl text-white">{project.name}</h3>
                            <span className="text-[10px] font-mono bg-white/10 px-2 py-1 rounded text-gray-400">
                                #{project.id}
                            </span>
                        </div>
                        <p className="text-gray-400 text-sm flex items-center gap-2">
                            <Globe size={12} /> {project.url}
                        </p>
                    </div>
                </div>
                
                <motion.button
                    onClick={() => onRun(project)}
                    className="w-full mt-4 px-4 py-3 bg-gradient-to-r from-blue-500/20 to-purple-600/20 hover:from-blue-500 hover:to-purple-600 border border-white/10 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                >
                    <Play size={16} fill={isHovered ? "white" : "none"} />
                    <span>Run AI Test</span>
                </motion.button>
            </div>
        </motion.div>
    );
};
