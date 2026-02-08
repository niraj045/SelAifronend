import { motion } from 'framer-motion';
import { Brain, TrendingUp, AlertTriangle, CheckCircle, Zap } from 'lucide-react';

const AIInsights = () => {
    const insights = [
        {
            type: 'optimization',
            title: 'Detected 3 redundant test flows',
            description: 'Login and authentication steps are duplicated across multiple tests. Consider extracting to a reusable component.',
            impact: 'High',
            savings: '~30% faster execution'
        },
        {
            type: 'selector',
            title: 'Unstable selector detected',
            description: 'The selector "#btn-submit-123" contains dynamic IDs which may cause flakiness. AI suggests using data-testid instead.',
            impact: 'Critical',
            affectedTests: 12
        },
        {
            type: 'coverage',
            title: 'Missing test coverage',
            description: 'Payment flow only covers happy path. AI recommends adding edge cases for invalid card numbers and expired cards.',
            impact: 'Medium',
            confidence: '87%'
        },
        {
            type: 'performance',
            title: 'Slow page load detected',
            description: 'Dashboard page takes 4.2s to load. AI identified 3 unoptimized images and excessive JS bundles.',
            impact: 'High',
            improvement: 'Up to 2.5s faster'
        }
    ];

    const getIcon = (type) => {
        switch(type) {
            case 'optimization': return <Zap className="text-yellow-400" size={20} />;
            case 'selector': return <AlertTriangle className="text-red-400" size={20} />;
            case 'coverage': return <TrendingUp className="text-blue-400" size={20} />;
            case 'performance': return <Brain className="text-purple-400" size={20} />;
            default: return <CheckCircle className="text-green-400" size={20} />;
        }
    };

    const getImpactColor = (impact) => {
        switch(impact) {
            case 'Critical': return 'bg-red-500/20 text-red-400 border-red-500/30';
            case 'High': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
            case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
            default: return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold text-white">AI Insights</h1>
                        <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-semibold rounded-full">
                            NEW
                        </span>
                    </div>
                    <p className="text-gray-400">Smart recommendations powered by machine learning</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10"
                >
                    <Brain size={18} /> Refresh Analysis
                </motion.button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Insights Generated', value: '47', icon: '🧠', gradient: 'from-purple-500 to-pink-500' },
                    { label: 'Issues Detected', value: '12', icon: '⚠️', gradient: 'from-orange-500 to-red-500' },
                    { label: 'Optimizations', value: '8', icon: '⚡', gradient: 'from-yellow-500 to-orange-500' },
                    { label: 'AI Confidence', value: '92%', icon: '✨', gradient: 'from-blue-500 to-purple-500' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group"
                    >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.gradient} rounded-xl blur opacity-30 group-hover:opacity-50 transition`} />
                        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* AI Insights List */}
            <div className="space-y-4">
                {insights.map((insight, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-purple-500/50 transition-all"
                    >
                        <div className="flex items-start gap-4">
                            <div className="p-3 bg-white/5 rounded-lg">
                                {getIcon(insight.type)}
                            </div>
                            
                            <div className="flex-1 space-y-3">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="font-semibold text-white text-lg">{insight.title}</h3>
                                        <p className="text-gray-400 mt-1">{insight.description}</p>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs border ${getImpactColor(insight.impact)}`}>
                                        {insight.impact} Impact
                                    </span>
                                </div>

                                <div className="flex items-center gap-6 text-sm">
                                    {insight.savings && (
                                        <div className="flex items-center gap-2 text-green-400">
                                            <TrendingUp size={16} />
                                            {insight.savings}
                                        </div>
                                    )}
                                    {insight.affectedTests && (
                                        <div className="text-gray-400">
                                            Affects {insight.affectedTests} tests
                                        </div>
                                    )}
                                    {insight.confidence && (
                                        <div className="text-gray-400">
                                            Confidence: {insight.confidence}
                                        </div>
                                    )}
                                    {insight.improvement && (
                                        <div className="text-blue-400">
                                            {insight.improvement}
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-medium text-sm"
                                    >
                                        Apply Suggestion
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg font-medium text-sm hover:bg-white/10"
                                    >
                                        View Details
                                    </motion.button>
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
