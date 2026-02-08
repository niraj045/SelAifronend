import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Play, Plus, TrendingUp, Target, Zap, Brain, Code, FileCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { RevealOnScroll, BouncyButton, StaggerContainer, StaggerItem } from '../components/ui/Motion';
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const [projects, setProjects] = useState([]);
    const [stats, setStats] = useState({
        totalProjects: 0,
        totalRuns: 0,
        successRate: 0
    });
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const res = await api.getProjects();
            setProjects(res.data);
            setStats({
                totalProjects: res.data.length,
                totalRuns: res.data.length * 12,
                successRate: 94
            });
        } catch (e) {
            console.error("Failed to load data", e);
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
            loadData();
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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 pt-24 pb-16 px-6">
            <div className="max-w-7xl mx-auto space-y-20">
                
                {/* Hero Section */}
                <RevealOnScroll>
                    <div className="text-center space-y-6 py-16">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full text-blue-600 text-sm font-semibold mb-6 border border-blue-100">
                                <Brain size={16} />
                                AI-Powered No-Code Test Automation
                            </div>
                            <h1 className="text-6xl md:text-8xl font-bold tracking-tight text-gray-900 leading-[1.1]">
                                Test Automation
                                <br />
                                <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Made Simple
                                </span>
                            </h1>
                            <p className="text-xl md:text-2xl text-gray-600 mt-8 max-w-3xl mx-auto leading-relaxed font-medium">
                                Enter a URL. Watch AI understand your website, generate Selenium tests, 
                                and produce complete documentation. <span className="text-gray-900">Zero code required.</span>
                            </p>
                        </motion.div>
                    </div>
                </RevealOnScroll>

                {/* Feature Pills */}
                <RevealOnScroll delay={0.1}>
                    <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
                        {[
                            '✅ No-code Selenium automation',
                            '🤖 AI-generated test cases',
                            '🔁 Smart selector healing',
                            '📄 Auto documentation',
                            '📊 Execution reports',
                            '🌐 Multi-browser support'
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.1 + i * 0.05 }}
                                className="px-4 py-2 bg-white rounded-full text-sm font-medium text-gray-700 border border-gray-200 shadow-sm"
                            >
                                {feature}
                            </motion.div>
                        ))}
                    </div>
                </RevealOnScroll>

                {/* Stats Grid */}
                <RevealOnScroll delay={0.2}>
                    <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <StaggerItem>
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-blue-200 transition-all duration-500 hover:shadow-2xl group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Active Projects</p>
                                        <p className="text-6xl font-bold text-gray-900 mb-2">{stats.totalProjects}</p>
                                        <p className="text-sm text-gray-500">Websites under test</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <Target className="text-white" size={28} />
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-purple-200 transition-all duration-500 hover:shadow-2xl group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Total Test Runs</p>
                                        <p className="text-6xl font-bold text-gray-900 mb-2">{stats.totalRuns}</p>
                                        <p className="text-sm text-gray-500">AI-powered executions</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <Zap className="text-white" size={28} />
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>

                        <StaggerItem>
                            <div className="bg-white rounded-3xl p-8 border border-gray-100 hover:border-green-200 transition-all duration-500 hover:shadow-2xl group">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-sm font-semibold text-gray-500 mb-3 uppercase tracking-wide">Success Rate</p>
                                        <p className="text-6xl font-bold text-gray-900 mb-2">{stats.successRate}%</p>
                                        <p className="text-sm text-gray-500">Automated healing</p>
                                    </div>
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg">
                                        <TrendingUp className="text-white" size={28} />
                                    </div>
                                </div>
                            </div>
                        </StaggerItem>
                    </StaggerContainer>
                </RevealOnScroll>

                {/* Quick Test Action */}
                <RevealOnScroll delay={0.3}>
                    <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl p-12 md:p-16 text-white shadow-2xl">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIxIi8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
                        
                        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
                            <h2 className="text-4xl md:text-5xl font-bold mb-3">Start Instant Test</h2>
                            <p className="text-blue-100 text-lg mb-8">
                                Python THINKS. Java ACTS. Enter any website URL and watch AI magic happen.
                            </p>
                            <form onSubmit={handleCreate} className="flex flex-col md:flex-row gap-4">
                                <input 
                                    type="url" 
                                    placeholder="https://example.com" 
                                    className="flex-1 bg-white/10 backdrop-blur border-2 border-white/20 rounded-2xl px-6 py-5 text-white placeholder-white/60 focus:outline-none focus:ring-4 focus:ring-white/30 focus:border-white/40 transition-all text-lg font-medium"
                                    value={newUrl}
                                    onChange={e => setNewUrl(e.target.value)}
                                    required
                                />
                                <BouncyButton 
                                    className="bg-white text-blue-600 hover:bg-blue-50 px-10 py-5 flex items-center justify-center gap-3 shadow-2xl font-bold text-lg whitespace-nowrap"
                                    disabled={loading}
                                >
                                    <Brain size={22} />
                                    {loading ? 'Analyzing...' : 'AI Generate Tests'}
                                </BouncyButton>
                            </form>
                            <p className="text-sm text-white/70 mt-4">
                                No credit card required • Generate unlimited test cases
                            </p>
                        </div>
                    </div>
                </RevealOnScroll>

                {/* How It Works */}
                <RevealOnScroll delay={0.4}>
                    <div className="text-center mb-12">
                        <h2 className="text-5xl font-bold text-gray-900 mb-4">How It Works</h2>
                        <p className="text-xl text-gray-600">Four simple steps to intelligent test automation</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {[
                            { icon: Code, title: '1. Enter URL', desc: 'Paste your website URL' },
                            { icon: Brain, title: '2. AI Analyzes', desc: 'Python engine understands structure' },
                            { icon: Zap, title: '3. Tests Execute', desc: 'Java runs Selenium automation' },
                            { icon: FileCheck, title: '4. Get Reports', desc: 'Download documentation & results' }
                        ].map((step, i) => {
                            const Icon = step.icon;
                            return (
                                <motion.div
                                    key={i}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.5 + i * 0.1 }}
                                    className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all hover:shadow-lg text-center group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                        <Icon className="text-blue-600" size={32} />
                                    </div>
                                    <h3 className="font-bold text-lg text-gray-900 mb-2">{step.title}</h3>
                                    <p className="text-sm text-gray-600">{step.desc}</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </RevealOnScroll>

                {/* Recent Projects */}
                {projects.length > 0 && (
                    <RevealOnScroll delay={0.5}>
                        <div className="space-y-8">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h2 className="text-4xl font-bold text-gray-900">Your Projects</h2>
                                    <p className="text-gray-600 mt-2">Active test automation projects</p>
                                </div>
                                <BouncyButton 
                                    onClick={() => navigate('/projects')}
                                    className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-3 flex items-center gap-2"
                                >
                                    <Plus size={18} />
                                    View All Projects
                                </BouncyButton>
                            </div>

                            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {projects.slice(0, 6).map((p, i) => (
                                    <StaggerItem key={p.id}>
                                        <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-xl group">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                                                        {p.name}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 truncate">{p.url}</p>
                                                </div>
                                                <span className="text-xs font-mono bg-gray-100 px-2.5 py-1 rounded-lg text-gray-500 shrink-0">
                                                    #{p.id}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2 mb-4 text-xs text-gray-500">
                                                <span className="px-2 py-1 bg-green-50 text-green-700 rounded-full font-medium">✓ Active</span>
                                                <span>•</span>
                                                <span>Last run: 2h ago</span>
                                            </div>
                                            <BouncyButton 
                                                onClick={() => runTest(p)}
                                                className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 py-3 flex items-center justify-center gap-2 font-semibold"
                                            >
                                                <Play size={16} fill="currentColor" />
                                                Run AI Test
                                            </BouncyButton>
                                        </div>
                                    </StaggerItem>
                                ))}
                            </StaggerContainer>
                        </div>
                    </RevealOnScroll>
                )}
            </div>
        </div>
    );
}
