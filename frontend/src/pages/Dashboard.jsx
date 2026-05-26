import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play, Activity, CheckCircle, Clock, AlertCircle, FolderKanban,
  ChevronRight, Plus, ArrowUpRight, Bot, Zap, Globe, Circle,
  TrendingUp, XCircle
} from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { testRunsApi } from '../api/testRunsApi';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AI_ENGINE_URL = import.meta.env.VITE_AI_ENGINE_URL ?? 'http://localhost:5000';

const STATUS_COLOR = {
  PASSED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  FAILED: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  RUNNING: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  STOPPED: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

const STATUS_DOT = {
  PASSED: 'bg-emerald-500',
  FAILED: 'bg-rose-500',
  RUNNING: 'bg-indigo-500 animate-pulse',
  PENDING: 'bg-amber-500 animate-pulse',
  STOPPED: 'bg-slate-500',
};

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return 'morning';
  if (h < 18) return 'afternoon';
  return 'evening';
}

export default function Dashboard() {
  const { user } = useAuth();
  const [projects, setProjects] = useState([]);
  const [testRuns, setTestRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiStatus, setAiStatus] = useState({ status: 'checking', providers: {} });

  useEffect(() => {
    const load = async () => {
      try {
        const [p, r] = await Promise.all([
          projectsApi.getAll().catch(() => []),
          testRunsApi.getAll().catch(() => []),
        ]);
        setProjects(Array.isArray(p) ? p : []);
        setTestRuns(Array.isArray(r) ? r : []);
      } catch (_) {}
      setLoading(false);
    };
    load();

    const checkAi = async () => {
      try {
        const res = await axios.get(`${AI_ENGINE_URL}/api/health`, { timeout: 3000 });
        setAiStatus({ status: 'ok', providers: res.data.providers || {} });
      } catch {
        setAiStatus({ status: 'error', providers: {} });
      }
    };
    checkAi();
  }, []);

  const totalRuns = testRuns.length;
  const passedRuns = testRuns.filter(r => r.status === 'PASSED').length;
  const failedRuns = testRuns.filter(r => r.status === 'FAILED').length;
  const activeRuns = testRuns.filter(r => r.status === 'RUNNING' || r.status === 'PENDING').length;
  const passRate = totalRuns > 0 ? ((passedRuns / totalRuns) * 100).toFixed(1) : null;

  const recentRuns = [...testRuns].reverse().slice(0, 6);
  const recentProjects = [...projects].reverse().slice(0, 4);

  const stats = [
    { label: 'Total Projects', value: loading ? '—' : projects.length, icon: FolderKanban, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
    { label: 'Total Runs', value: loading ? '—' : totalRuns, icon: Play, color: 'text-sky-400', bg: 'bg-sky-500/10 border-sky-500/20' },
    { label: 'Pass Rate', value: loading ? '—' : (passRate ? `${passRate}%` : '—'), icon: TrendingUp, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
    { label: 'Active Runs', value: loading ? '—' : (activeRuns || '—'), icon: Activity, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto space-y-8">
      {/* Ambient blobs */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
        <div>
          <p className="text-sm text-slate-500 mb-1">
            Good {greeting()}, <span className="text-slate-300 font-medium">{user?.name || 'there'}</span>
          </p>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            QA <span className="text-indigo-400">Dashboard</span>
          </h1>
        </div>
        <Link to="/app/projects">
          <motion.button whileHover={{ scale: 1.02, y: -1 }} className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
            <Plus size={16} /> New Project
          </motion.button>
        </Link>
      </motion.header>

      {/* Stats */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={i} whileHover={{ y: -4 }} className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 hover:border-white/10 transition-all">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-2.5 rounded-xl border ${stat.bg} ${stat.color}`}>
                  <Icon size={18} />
                </div>
                {loading && <div className="w-4 h-4 border-2 border-white/10 border-t-indigo-500/50 rounded-full animate-spin" />}
              </div>
              <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
            </motion.div>
          );
        })}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        {/* Recent Test Runs */}
        <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="lg:col-span-2 bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between p-5 pb-0">
            <div>
              <h2 className="text-base font-black text-white">Recent Test Runs</h2>
              <p className="text-xs text-slate-500 mt-0.5">Latest automated test executions</p>
            </div>
            <Link to="/app/runs" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors">
              View all <ArrowUpRight size={12} />
            </Link>
          </div>

          <div className="p-4 space-y-1 mt-2">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="w-8 h-8 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : recentRuns.length === 0 ? (
              <div className="text-center py-12">
                <Bot size={36} className="text-slate-700 mx-auto mb-3" />
                <p className="text-sm text-slate-500">No test runs yet</p>
                <p className="text-xs text-slate-600">Go to Projects and click "Run Tests"</p>
              </div>
            ) : (
              recentRuns.map((run, i) => (
                <Link to={`/app/runs/${run.id}`} key={run.id}>
                  <motion.div
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-4 p-3.5 rounded-xl hover:bg-white/[0.03] transition-all group"
                  >
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[run.status] || 'bg-slate-500'}`} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">
                        Run #{run.id} — {run.url || `Project #${run.projectId}`}
                      </div>
                      <div className="text-xs text-slate-500">{run.testType || 'smoke'} · {run.browser || 'chrome'}</div>
                    </div>
                    {run.totalTests > 0 && (
                      <div className="hidden sm:flex items-center gap-2 text-xs flex-shrink-0">
                        <span className="text-emerald-400 font-bold">{run.passedTests}p</span>
                        <span className="text-slate-600">/</span>
                        <span className="text-rose-400 font-bold">{run.failedTests}f</span>
                      </div>
                    )}
                    <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${STATUS_COLOR[run.status] || STATUS_COLOR.STOPPED}`}>
                      {run.status}
                    </span>
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </motion.div>

        {/* Right column */}
        <motion.div initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="space-y-5">
          {/* AI Engine Status */}
          <div className={`rounded-2xl p-5 relative overflow-hidden border ${
            aiStatus.status === 'ok'
              ? 'bg-gradient-to-br from-indigo-600 to-purple-700 border-indigo-500/30'
              : aiStatus.status === 'error'
              ? 'bg-gradient-to-br from-rose-900/50 to-slate-900 border-rose-500/20'
              : 'bg-[#0f172a]/40 border-white/[0.05]'
          }`}>
            <div className="absolute -top-6 -right-6 opacity-10">
              <Bot size={100} />
            </div>
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <Circle size={8} fill="currentColor" className={
                  aiStatus.status === 'ok' ? 'text-emerald-400' :
                  aiStatus.status === 'error' ? 'text-rose-400' : 'text-amber-400'
                } />
                <span className={`text-xs font-bold uppercase tracking-widest ${
                  aiStatus.status === 'ok' ? 'text-indigo-200' :
                  aiStatus.status === 'error' ? 'text-rose-300' : 'text-slate-400'
                }`}>
                  AI Engine {aiStatus.status === 'ok' ? '· Online' : aiStatus.status === 'error' ? '· Offline' : '· Checking'}
                </span>
              </div>
              <h3 className="text-xl font-black text-white mb-1">
                {aiStatus.status === 'ok' ? 'Ready to Test' : aiStatus.status === 'error' ? 'Engine Offline' : 'Connecting…'}
              </h3>
              <p className={`text-xs mb-4 leading-relaxed ${aiStatus.status === 'ok' ? 'text-indigo-200/70' : 'text-slate-400'}`}>
                {aiStatus.status === 'ok'
                  ? 'AI generates Selenium tests automatically. Just add a project URL.'
                  : aiStatus.status === 'error'
                  ? 'Start the Python server: cd SelAiPython/ai-engine && ./start.sh'
                  : 'Pinging http://localhost:5000…'}
              </p>
              {aiStatus.status === 'ok' && Object.entries(aiStatus.providers).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {Object.entries(aiStatus.providers).map(([provider, status]) => (
                    <span key={provider} className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                      status === 'available'
                        ? 'bg-emerald-500/15 border-emerald-500/25 text-emerald-300'
                        : 'bg-white/5 border-white/10 text-slate-500'
                    }`}>
                      {provider}
                    </span>
                  ))}
                </div>
              )}
              <Link to="/app/projects">
                <button className={`w-full py-2.5 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${
                  aiStatus.status === 'ok'
                    ? 'bg-white text-indigo-700 hover:shadow-xl'
                    : 'bg-white/10 text-slate-300 hover:bg-white/15'
                }`}>
                  {aiStatus.status === 'ok' ? 'Start Testing' : 'View Projects'}
                </button>
              </Link>
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-black text-white">Recent Projects</h3>
              <Link to="/app/projects" className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold transition-colors">View all</Link>
            </div>
            {loading ? (
              <div className="flex justify-center py-6">
                <div className="w-6 h-6 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
              </div>
            ) : recentProjects.length === 0 ? (
              <div className="text-center py-6">
                <FolderKanban size={28} className="text-slate-700 mx-auto mb-2" />
                <p className="text-xs text-slate-500">No projects yet</p>
                <Link to="/app/projects">
                  <button className="mt-3 px-4 py-2 bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 text-xs font-semibold rounded-lg hover:bg-indigo-600/30 transition-all">
                    Create Project
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-2">
                {recentProjects.map((project) => {
                  const projectRuns = testRuns.filter(r => r.projectId === project.id);
                  const lastRun = projectRuns[projectRuns.length - 1];
                  return (
                    <Link to={`/app/projects/${project.id}`} key={project.id}>
                      <div className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-white/[0.03] transition-all group">
                        <div className="w-8 h-8 bg-indigo-500/10 border border-indigo-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Globe size={14} className="text-indigo-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-xs font-semibold text-white truncate group-hover:text-indigo-300 transition-colors">{project.name}</div>
                          <div className="text-[10px] text-slate-600 truncate">{project.url}</div>
                        </div>
                        {lastRun && (
                          <span className={`w-2 h-2 rounded-full flex-shrink-0 ${STATUS_DOT[lastRun.status] || 'bg-slate-500'}`} />
                        )}
                        <ChevronRight size={12} className="text-slate-600 group-hover:text-slate-400 flex-shrink-0" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {/* Pass/Fail summary */}
          {totalRuns > 0 && !loading && (
            <div className="bg-[#0f172a]/40 border border-white/[0.05] rounded-2xl p-5">
              <h3 className="text-sm font-black text-white mb-3">Run Summary</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <CheckCircle size={14} className="text-emerald-400 flex-shrink-0" />
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: `${(passedRuns / totalRuns) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-emerald-400 w-8 text-right">{passedRuns}</span>
                </div>
                <div className="flex items-center gap-3">
                  <XCircle size={14} className="text-rose-400 flex-shrink-0" />
                  <div className="flex-1 bg-white/5 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-rose-500 h-full rounded-full transition-all" style={{ width: `${(failedRuns / totalRuns) * 100}%` }} />
                  </div>
                  <span className="text-xs font-bold text-rose-400 w-8 text-right">{failedRuns}</span>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
