import { motion } from 'framer-motion';
import { Save, Globe, Key, Bell, Users, Code } from 'lucide-react';
import { useState } from 'react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'integrations', label: 'Integrations', icon: Code },
        { id: 'environments', label: 'Environments', icon: Key },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'team', label: 'Team', icon: Users },
    ];

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-white">Settings</h1>
                    <p className="text-gray-400 mt-1">Configure your workspace preferences</p>
                </div>
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold flex items-center gap-2"
                >
                    <Save size={18} /> Save Changes
                </motion.button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 border-b border-white/10 pb-4">
                {tabs.map((tab) => {
                    const Icon = tab.icon;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition ${
                                activeTab === tab.id
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                            }`}
                        >
                            <Icon size={18} />
                            {tab.label}
                        </button>
                    );
                })}
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Project Name</label>
                            <input
                                type="text"
                                defaultValue="My Test Project"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Default Browser</label>
                            <select className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500">
                                <option>Chrome</option>
                                <option>Firefox</option>
                                <option>Safari</option>
                                <option>Edge</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-white mb-2">Test Timeout (seconds)</label>
                            <input
                                type="number"
                                defaultValue="30"
                                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                            <div>
                                <div className="font-semibold text-white">Auto-retry failed tests</div>
                                <div className="text-sm text-gray-400">Automatically retry tests that fail</div>
                            </div>
                            <input type="checkbox" defaultChecked className="w-5 h-5 rounded" />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Integrations */}
            {activeTab === 'integrations' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                    {[
                        { name: 'Slack', description: 'Get test notifications in Slack', connected: true },
                        { name: 'Jira', description: 'Create issues from failed tests', connected: false },
                        { name: 'GitHub', description: 'Sync with your repositories', connected: true },
                        { name: 'Jenkins', description: 'Trigger tests from CI/CD', connected: false },
                    ].map((integration, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="font-semibold text-white text-lg">{integration.name}</h3>
                                    <p className="text-sm text-gray-400">{integration.description}</p>
                                </div>
                                {integration.connected ? (
                                    <span className="px-2 py-1 bg-green-500/20 text-green-400 text-xs rounded-full">
                                        Connected
                                    </span>
                                ) : (
                                    <span className="px-2 py-1 bg-gray-500/20 text-gray-400 text-xs rounded-full">
                                        Not Connected
                                    </span>
                                )}
                            </div>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full px-4 py-2 rounded-lg font-medium ${
                                    integration.connected
                                        ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                }`}
                            >
                                {integration.connected ? 'Disconnect' : 'Connect'}
                            </motion.button>
                        </motion.div>
                    ))}
                </motion.div>
            )}

            {/* Other tabs can be implemented similarly */}
            {activeTab === 'environments' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                    <p className="text-gray-400 text-center py-8">Environment configuration coming soon...</p>
                </motion.div>
            )}

            {activeTab === 'notifications' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                    <p className="text-gray-400 text-center py-8">Notification settings coming soon...</p>
                </motion.div>
            )}

            {activeTab === 'team' && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6"
                >
                    <p className="text-gray-400 text-center py-8">Team management coming soon...</p>
                </motion.div>
            )}
        </div>
    );
};

export default Settings;
