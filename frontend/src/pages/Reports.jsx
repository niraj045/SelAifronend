import { motion } from 'framer-motion';
import { FileText, Download, Share2, Calendar } from 'lucide-react';

const Reports = () => {
    const reports = [
        { id: 1, name: 'Weekly Test Summary', date: '2024-01-15', type: 'Summary', size: '2.4 MB', tests: 127 },
        { id: 2, name: 'E-Commerce Site Report', date: '2024-01-14', type: 'Detailed', size: '5.1 MB', tests: 42 },
        { id: 3, name: 'Regression Test Results', date: '2024-01-13', type: 'Regression', size: '3.8 MB', tests: 89 },
        { id: 4, name: 'API Integration Tests', date: '2024-01-12', type: 'Integration', size: '1.9 MB', tests: 34 },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Reports</h1>
                    <p className="text-gray-400 mt-1">Access detailed test execution reports</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg font-semibold flex items-center gap-2 hover:bg-white/10"
                >
                    <Calendar size={18} /> Filter by Date
                </motion.button>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Reports', value: '47', icon: '📊' },
                    { label: 'This Month', value: '12', icon: '📅' },
                    { label: 'Total Tests', value: '1,247', icon: '✅' },
                    { label: 'Avg Pass Rate', value: '94.2%', icon: '🎯' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                    >
                        <div className="text-3xl mb-2">{stat.icon}</div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Reports Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {reports.map((report, idx) => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <div className="p-3 bg-blue-500/20 rounded-lg">
                                    <FileText size={24} className="text-blue-400" />
                                </div>
                                <div>
                                    <h3 className="font-semibold text-white">{report.name}</h3>
                                    <p className="text-sm text-gray-400">{report.date}</p>
                                </div>
                            </div>
                            <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs rounded-full">
                                {report.type}
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                            <div>
                                <span className="text-gray-400">Tests Included</span>
                                <div className="text-white font-semibold">{report.tests}</div>
                            </div>
                            <div>
                                <span className="text-gray-400">File Size</span>
                                <div className="text-white font-semibold">{report.size}</div>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-blue-600"
                            >
                                <Download size={16} /> Download
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10"
                            >
                                <Share2 size={16} />
                            </motion.button>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Reports;
