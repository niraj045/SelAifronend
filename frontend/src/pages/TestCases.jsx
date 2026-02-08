import { motion } from 'framer-motion';
import { Play, Edit, Trash2, Eye, ToggleLeft, ToggleRight } from 'lucide-react';

const TestCases = () => {
    const testCases = [
        { id: 1, name: 'Login Flow - Valid Credentials', project: 'E-Commerce', enabled: true, lastRun: '2h ago', status: 'passed' },
        { id: 2, name: 'Checkout Process', project: 'E-Commerce', enabled: true, lastRun: '2h ago', status: 'passed' },
        { id: 3, name: 'Product Search Functionality', project: 'E-Commerce', enabled: true, lastRun: '5h ago', status: 'passed' },
        { id: 4, name: 'User Registration', project: 'E-Commerce', enabled: false, lastRun: '1d ago', status: 'failed' },
        { id: 5, name: 'Password Reset Flow', project: 'Marketing Site', enabled: true, lastRun: '3h ago', status: 'passed' },
        { id: 6, name: 'Contact Form Submission', project: 'Marketing Site', enabled: true, lastRun: '5h ago', status: 'passed' },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Test Cases</h1>
                    <p className="text-gray-400 mt-1">Manage individual test scenarios</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold flex items-center gap-2"
                >
                    <Play size={18} /> Run Selected
                </motion.button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                    { label: 'Total Cases', value: '247', color: 'from-blue-500 to-cyan-500' },
                    { label: 'Enabled', value: '231', color: 'from-green-500 to-emerald-500' },
                    { label: 'Passing', value: '218', color: 'from-purple-500 to-pink-500' },
                    { label: 'Failing', value: '13', color: 'from-orange-500 to-red-500' },
                ].map((stat, idx) => (
                    <motion.div
                        key={idx}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="relative group"
                    >
                        <div className={`absolute -inset-0.5 bg-gradient-to-r ${stat.color} rounded-xl blur opacity-20 group-hover:opacity-40 transition`} />
                        <div className="relative bg-black/80 backdrop-blur-xl border border-white/10 rounded-xl p-6">
                            <div className="text-2xl font-bold text-white">{stat.value}</div>
                            <div className="text-sm text-gray-400">{stat.label}</div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Test Cases Table */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-white/5 border-b border-white/10">
                            <tr>
                                <th className="px-6 py-4 text-left">
                                    <input type="checkbox" className="rounded" />
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Test Case</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Project</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Last Run</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {testCases.map((test, idx) => (
                                <motion.tr
                                    key={test.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="hover:bg-white/5 transition"
                                >
                                    <td className="px-6 py-4">
                                        <input type="checkbox" className="rounded" />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            {test.enabled ? (
                                                <ToggleRight className="text-green-400" size={20} />
                                            ) : (
                                                <ToggleLeft className="text-gray-500" size={20} />
                                            )}
                                            <span className="text-white font-medium">{test.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{test.project}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${
                                            test.status === 'passed' 
                                                ? 'bg-green-500/20 text-green-400' 
                                                : 'bg-red-500/20 text-red-400'
                                        }`}>
                                            {test.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-400">{test.lastRun}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition" title="View Details">
                                                <Eye size={16} className="text-gray-400" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition" title="Edit">
                                                <Edit size={16} className="text-gray-400" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition" title="Run">
                                                <Play size={16} className="text-green-400" />
                                            </button>
                                            <button className="p-2 hover:bg-white/10 rounded-lg transition" title="Delete">
                                                <Trash2 size={16} className="text-red-400" />
                                            </button>
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

export default TestCases;
