import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FolderKanban, PlayCircle, FileBarChart,
  Settings, HelpCircle, Menu, X, Bell, LogOut, CreditCard,
  Users, ChevronDown, Bot, Activity, Search, Zap, Circle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL ?? 'http://localhost:5000';

const navigation = [
  { name: 'Dashboard', href: '/app', icon: LayoutDashboard },
  { name: 'Projects', href: '/app/projects', icon: FolderKanban },
  { name: 'Test Runs', href: '/app/runs', icon: PlayCircle },
  { name: 'Reports', href: '/app/reports', icon: FileBarChart },
];

const secondaryNav = [
  { name: 'Team', href: '/app/team', icon: Users },
  { name: 'Subscription', href: '/app/subscription', icon: CreditCard },
  { name: 'Settings', href: '/app/settings', icon: Settings },
  { name: 'Help', href: '/app/help', icon: HelpCircle },
];

export default function AppLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [profileOpen, setProfileOpen] = useState(false);
  const [aiStatus, setAiStatus] = useState('checking'); // 'checking' | 'ok' | 'error'
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // Ping AI engine health every 30s
  useEffect(() => {
    const checkAi = async () => {
      try {
        await axios.get(`${AI_ENGINE_URL}/api/health`, { timeout: 3000 });
        setAiStatus('ok');
      } catch {
        setAiStatus('error');
      }
    };
    checkAi();
    const interval = setInterval(checkAi, 30000);
    return () => clearInterval(interval);
  }, []);

  const isActive = (path) => {
    if (path === '/app') return location.pathname === '/app';
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavLink = ({ item }) => {
    const Icon = item.icon;
    const active = isActive(item.href);
    return (
      <Link to={item.href} className="block">
        <motion.div
          whileHover={{ x: 2 }}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 group relative ${
            active ? 'bg-indigo-500/10 text-indigo-400' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
          }`}
        >
          {active && (
            <motion.div
              layoutId="activeNav"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-500 rounded-full"
            />
          )}
          <Icon size={17} className={`ml-1 flex-shrink-0 ${active ? 'text-indigo-400' : 'text-slate-500 group-hover:text-slate-300'}`} />
          <span className={`text-[13px] font-semibold transition-colors ${active ? 'text-indigo-300' : ''}`}>{item.name}</span>
        </motion.div>
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 overflow-hidden relative">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.012)_1px,transparent_0)] bg-[size:28px_28px] pointer-events-none z-0" />

      {/* Top Nav */}
      <nav className="fixed top-0 z-50 w-full bg-[#020617]/80 backdrop-blur-xl border-b border-white/[0.05]">
        <div className="px-4 h-14 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg transition-all text-slate-400 hover:text-white">
              {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-all">
                <Bot className="text-white" size={16} />
              </div>
              <span className="text-lg font-black text-white tracking-tighter">Sel<span className="text-indigo-400">AI</span></span>
            </Link>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search projects, runs, reports..."
                className="w-full pl-10 pr-4 py-2 bg-white/[0.03] border border-white/[0.05] rounded-xl text-xs text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* AI Engine status pill */}
            <div className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-[10px] font-bold transition-all ${
              aiStatus === 'ok'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                : aiStatus === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                : 'bg-slate-500/10 border-slate-500/20 text-slate-500'
            }`}>
              <Circle size={6} fill="currentColor" />
              AI {aiStatus === 'ok' ? 'Online' : aiStatus === 'error' ? 'Offline' : '…'}
            </div>

            <button className="p-2 bg-white/[0.02] hover:bg-white/[0.06] rounded-xl text-slate-400 hover:text-white transition-all border border-white/[0.04] relative">
              <Bell size={16} />
            </button>

            {/* Profile dropdown */}
            <div className="relative">
              <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-2 py-1.5 hover:bg-white/5 rounded-xl transition-all">
                <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-[11px] font-black text-white">
                  {user?.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-xs font-semibold text-slate-300 hidden sm:block">{user?.name || 'User'}</span>
                <ChevronDown size={14} className={`text-slate-500 transition-transform ${profileOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    className="absolute right-0 top-full mt-2 w-52 bg-[#0f172a] border border-white/[0.08] rounded-2xl shadow-2xl overflow-hidden z-50"
                  >
                    <div className="p-3 border-b border-white/[0.06]">
                      <div className="text-sm font-semibold text-white truncate">{user?.name}</div>
                      <div className="text-xs text-slate-500 truncate">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <Link to="/app/settings" onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-slate-400 hover:text-white hover:bg-white/5 transition-all">
                        <Settings size={14} /> Settings
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-rose-400 hover:bg-rose-500/10 transition-all">
                        <LogOut size={14} /> Sign Out
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex pt-14 h-screen overflow-hidden">
        {/* Sidebar */}
        <AnimatePresence initial={false}>
          {sidebarOpen && (
            <motion.aside
              initial={{ x: -260, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -260, opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="w-56 bg-[#020617]/50 backdrop-blur-xl border-r border-white/[0.04] flex flex-col shrink-0 relative z-40"
            >
              <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto pt-4">
                <div className="px-3 mb-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Main</span>
                </div>
                {navigation.map(item => <NavLink key={item.name} item={item} />)}

                <div className="px-3 mt-5 mb-2">
                  <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Account</span>
                </div>
                {secondaryNav.map(item => <NavLink key={item.name} item={item} />)}
              </nav>

              {/* AI Engine status card in sidebar */}
              <div className="p-3 pb-4 space-y-3">
                <div className={`flex items-center gap-2.5 p-3 rounded-xl border ${
                  aiStatus === 'ok'
                    ? 'bg-emerald-500/5 border-emerald-500/15'
                    : aiStatus === 'error'
                    ? 'bg-rose-500/5 border-rose-500/15'
                    : 'bg-white/[0.02] border-white/[0.04]'
                }`}>
                  <Zap size={14} className={
                    aiStatus === 'ok' ? 'text-emerald-400' :
                    aiStatus === 'error' ? 'text-rose-400' : 'text-slate-500'
                  } fill={aiStatus === 'ok' ? 'currentColor' : 'none'} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-black text-white">AI Engine</div>
                    <div className={`text-[10px] font-medium ${
                      aiStatus === 'ok' ? 'text-emerald-400' :
                      aiStatus === 'error' ? 'text-rose-400' : 'text-slate-500'
                    }`}>
                      {aiStatus === 'ok' ? 'Connected' : aiStatus === 'error' ? 'Offline — start server' : 'Checking…'}
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-gradient-to-br from-indigo-500/8 to-purple-500/5 rounded-xl border border-indigo-500/10 group hover:border-indigo-500/20 transition-all">
                  <div className="text-[11px] font-black text-white mb-0.5 flex items-center gap-1.5">
                    <Activity size={11} className="text-indigo-400" /> Upgrade Plan
                  </div>
                  <p className="text-[10px] text-slate-500 mb-2">Unlock unlimited test runs</p>
                  <Link to="/app/subscription">
                    <button className="w-full py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-lg transition-all">
                      View Plans
                    </button>
                  </Link>
                </div>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-transparent relative">
          <div className="relative z-10 min-h-full">{children}</div>
        </main>
      </div>
    </div>
  );
}
