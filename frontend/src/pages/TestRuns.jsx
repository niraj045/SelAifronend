import { motion } from 'framer-motion';
import { Play, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const TestRuns = () => {
    const runs = [
        { id: 1, project: 'E-Commerce Website', status: 'running', progress: 65, duration: '2m 15s', passed: 13, failed: 2, total: 42 },
        { id: 2, project: 'Marketing Site', status: 'passed', progress: 100, duration: '1m 32s', passed: 18, failed: 0, total: 18 },
        { id: 3, project: 'Admin Dashboard', status: 'failed', progress: 100, duration: '4m 08s', passed: 62, failed: 5, total: 67 },
        { id: 4, project: 'E-Commerce Website', status: 'passed', progress: 100, duration: '2m 45s', passed: 42, failed: 0, total: 42 },
    ];

    const getStatusIcon = (status) => {
        switch(status) {
            case 'running': return <Clock className="text-blue-400" size={18} />;
            case 'passed': return <CheckCircle className="text-green-400" size={18} />;
            case 'failed': return <XCircle className="text-red-400" size={18} />;
            default: return <AlertCircle className="text-gray-400" size={18} />;
        }
    };

    const getStatusColor = (status) => {
        switch(status) {
            case 'running': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
            case 'passed': return 'bg-green-500/20 text-green-400 border-green-500/30';
            case 'failed': return 'bg-red-500/20 text-red-400 border-red-500/30';
            default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
        }
    };

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Test Runs</h1>
                    <p className="text-gray-400 mt-1">Monitor your test execution history</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg font-semibold flex items-center gap-2"
                >
                    <Play size={18} /> Run Tests
                </motion.button>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
                {['All', 'Running', 'Passed', 'Failed'].map((filter) => (
                    <button
                        key={filter}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'All' 
                                ? 'bg-blue-500 text-white' 
                                : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                    >
                        {filter}
                    </button>
                ))}
            </div>

            {/* Test Runs Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Progress</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Duration</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Results</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {runs.map((run, idx) => (
                                <motion.tr
                                    key={run.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/5 cursor-pointer transition"
                                >
                                    <td className="px-6 py-4">
                                        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border ${getStatusColor(run.status)}`}>
                                            {getStatusIcon(run.status)}
                                            <span className="text-sm font-medium capitalize">{run.status}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-white font-medium">{run.project}</td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{run.progress}%</span>
                                            </div>
                                            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${run.progress}%` }}
                                                    transition={{ duration: 0.5, delay: idx * 0.1 }}
                                                    className={`h-full ${
                                                        run.status === 'running' ? 'bg-blue-500' :
                                                        run.status === 'passed' ? 'bg-green-500' :
                                                        'bg-red-500'
                                                    }`}
                                                />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{run.duration}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4 text-sm">
                                            <span className="text-green-400">{run.passed} passed</span>
                                            {run.failed > 0 && <span className="text-red-400">{run.failed} failed</span>}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default TestRuns;
