import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    LayoutDashboard, 
    FolderKanban, 
    Play, 
    FileText, 
    List, 
    Brain, 
    Settings, 
    HelpCircle,
    ChevronDown,
    Search,
    Bell,
    User,
    Menu,
    X,
    Sparkles,
    LogOut,
    CreditCard,
    Users,
    BookOpen,
    ChevronRight
} from 'lucide-react';

const navigation = [
    { name: 'Dashboard', href: '/app', icon: LayoutDashboard, badge: null },
    { name: 'Projects', href: '/app/projects', icon: FolderKanban, badge: null },
    { name: 'Test Runs', href: '/app/runs', icon: Play, badge: '3' },
    { name: 'Reports', href: '/app/reports', icon: FileText, badge: null },
    { name: 'Test Cases', href: '/app/cases', icon: List, badge: null },
    { name: 'AI Insights', href: '/app/insights', icon: Brain, badge: 'New' },
    { name: 'Settings', href: '/app/settings', icon: Settings, badge: null },
    { name: 'Help & Support', href: '/app/help', icon: HelpCircle, badge: null },
];

const workspaces = [
    { id: 1, name: 'Personal Workspace' },
    { id: 2, name: 'Team Workspace' },
    { id: 3, name: 'Create New Workspace', isCreate: true },
];

const notifications = [
    { id: 1, text: 'Test execution completed – Project Alpha', time: '2m ago', unread: true },
    { id: 2, text: '3 tests failed in last run', time: '1h ago', unread: true },
    { id: 3, text: 'Weekly report is ready', time: '3h ago', unread: false },
];

export default function AppLayout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [workspaceOpen, setWorkspaceOpen] = useState(false);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const location = useLocation();

    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <div className="min-h-screen bg-black text-white">
            {/* Top Navbar */}
            <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-black/90 backdrop-blur-xl border-b border-white/10">
                <div className="flex items-center justify-between h-full px-6">
                    {/* Left Section */}
                    <div className="flex items-center gap-6">
                        <motion.button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
                        </motion.button>

                        <Link to="/" className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles size={16} className="text-white" />
                            </div>
                            <div>
                                <div className="text-sm font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                    AI Test Automation
                                </div>
                            </div>
                        </Link>

                        {/* Workspace Selector */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setWorkspaceOpen(!workspaceOpen)}
                                className="flex items-center gap-2 px-3 py-1.5 bg-white/5 hover:bg-white/10 rounded-lg transition-colors text-sm"
                                whileHover={{ scale: 1.02 }}
                            >
                                <span className="text-gray-300">Personal Workspace</span>
                                <ChevronDown size={14} className={`transition-transform ${workspaceOpen ? 'rotate-180' : ''}`} />
                            </motion.button>

                            <AnimatePresence>
                                {workspaceOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full left-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        {workspaces.map((ws) => (
                                            <button
                                                key={ws.id}
                                                className={`w-full px-4 py-3 text-left hover:bg-white/5 transition-colors ${ws.isCreate ? 'border-t border-white/10 text-blue-400' : ''}`}
                                            >
                                                {ws.name}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* Center - Search */}
                    <div className="flex-1 max-w-md mx-8">
                        <div className="relative">
                            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search projects, test runs, reports..."
                                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 placeholder-gray-500"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Right Section */}
                    <div className="flex items-center gap-2">
                        {/* Docs */}
                        <motion.button
                            className="p-2 hover:bg-white/5 rounded-lg transition-colors relative group"
                            whileHover={{ scale: 1.05 }}
                        >
                            <BookOpen size={20} className="text-gray-400" />
                            <div className="absolute top-full right-0 mt-2 w-40 bg-gray-900 border border-white/10 rounded-lg shadow-xl p-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                                <div className="text-xs space-y-1">
                                    <div className="px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer">Documentation</div>
                                    <div className="px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer">Getting Started</div>
                                    <div className="px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer">API Reference</div>
                                    <div className="px-2 py-1.5 hover:bg-white/5 rounded cursor-pointer">FAQs</div>
                                </div>
                            </div>
                        </motion.button>

                        {/* Notifications */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setNotificationsOpen(!notificationsOpen)}
                                className="p-2 hover:bg-white/5 rounded-lg transition-colors relative"
                                whileHover={{ scale: 1.05 }}
                            >
                                <Bell size={20} className="text-gray-400" />
                                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                            </motion.button>

                            <AnimatePresence>
                                {notificationsOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/10">
                                            <h3 className="font-semibold">Notifications</h3>
                                        </div>
                                        <div className="max-h-96 overflow-y-auto">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    className={`p-4 hover:bg-white/5 transition-colors ${notif.unread ? 'bg-blue-500/5' : ''}`}
                                                >
                                                    <p className="text-sm mb-1">{notif.text}</p>
                                                    <p className="text-xs text-gray-500">{notif.time}</p>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="p-3 border-t border-white/10 text-center">
                                            <button className="text-xs text-blue-400 hover:text-blue-300">View all notifications</button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Profile */}
                        <div className="relative">
                            <motion.button
                                onClick={() => setProfileOpen(!profileOpen)}
                                className="flex items-center gap-2 p-2 hover:bg-white/5 rounded-lg transition-colors"
                                whileHover={{ scale: 1.05 }}
                            >
                                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-sm font-bold">
                                    A
                                </div>
                            </motion.button>

                            <AnimatePresence>
                                {profileOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="absolute top-full right-0 mt-2 w-56 bg-gray-900 border border-white/10 rounded-xl shadow-xl overflow-hidden"
                                    >
                                        <div className="p-4 border-b border-white/10">
                                            <div className="font-semibold">Admin User</div>
                                            <div className="text-xs text-gray-500">admin@example.com</div>
                                        </div>
                                        <div className="p-2">
                                            <ProfileMenuItem icon={User} label="My Profile" />
                                            <ProfileMenuItem icon={Settings} label="Account Settings" />
                                            <ProfileMenuItem icon={CreditCard} label="Billing & Plans" />
                                            <ProfileMenuItem icon={Users} label="Team Management" />
                                            <ProfileMenuItem icon={HelpCircle} label="Support" />
                                            <div className="border-t border-white/10 my-2" />
                                            <ProfileMenuItem icon={LogOut} label="Logout" destructive />
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </nav>

            <div className="flex pt-16">
                {/* Sidebar */}
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.aside
                            initial={{ x: -280, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: -280, opacity: 0 }}
                            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                            className="fixed left-0 top-16 bottom-0 w-64 bg-black/50 backdrop-blur-xl border-r border-white/10 overflow-y-auto"
                        >
                            <nav className="p-4 space-y-1">
                                {navigation.map((item) => {
                                    const Icon = item.icon;
                                    const active = isActive(item.href);
                                    
                                    return (
                                        <Link
                                            key={item.name}
                                            to={item.href}
                                            className="group relative"
                                        >
                                            <motion.div
                                                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                                                    active 
                                                        ? 'bg-blue-500/10 text-blue-400' 
                                                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                                whileHover={{ x: 4 }}
                                            >
                                                {active && (
                                                    <motion.div
                                                        layoutId="activeNav"
                                                        className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r"
                                                    />
                                                )}
                                                <Icon size={18} />
                                                <span className="text-sm font-medium flex-1">{item.name}</span>
                                                {item.badge && (
                                                    <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                                                        item.badge === 'New' 
                                                            ? 'bg-blue-500/20 text-blue-400' 
                                                            : 'bg-red-500/20 text-red-400'
                                                    }`}>
                                                        {item.badge}
                                                    </span>
                                                )}
                                            </motion.div>
                                        </Link>
                                    );
                                })}
                            </nav>
                        </motion.aside>
                    )}
                </AnimatePresence>

                {/* Main Content */}
                <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
                    {children}
                </main>
            </div>
        </div>
    );
}

const ProfileMenuItem = ({ icon: Icon, label, destructive }) => (
    <motion.button
        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors ${
            destructive ? 'text-red-400' : ''
        }`}
        whileHover={{ x: 4 }}
    >
        <Icon size={16} />
        <span>{label}</span>
    </motion.button>
);
