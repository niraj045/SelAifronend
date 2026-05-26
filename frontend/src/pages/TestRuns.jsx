import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Play, Clock, CheckCircle, XCircle, StopCircle, Search, Filter,
  ChevronRight, Activity, Calendar, Loader2, Square
} from 'lucide-react';
import { testRunsApi } from '../api/testRunsApi';

const STATUS_CONFIG = {
  PASSED: { color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-500', icon: CheckCircle },
  FAILED: { color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20', dot: 'bg-rose-500', icon: XCircle },
  RUNNING: { color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-500 animate-pulse', icon: Activity },
  PENDING: { color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20', dot: 'bg-amber-500 animate-pulse', icon: Clock },
  STOPPED: { color: 'text-slate-400', bg: 'bg-slate-500/10 border-slate-500/20', dot: 'bg-slate-500', icon: StopCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.STOPPED;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${cfg.bg} ${cfg.color}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {status}
    </span>
  );
}

export default function TestRuns() {
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [stoppingId, setStoppingId] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const data = await testRunsApi.getAll();
      setRuns(Array.isArray(data) ? data.reverse() : []);
    } catch {
      setRuns([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleStop = async (id, e) => {
    e.preventDefault();
    e.stopPropagation();
    setStoppingId(id);
    try {
      await testRunsApi.stop(id);
      load();
    } catch {}
    setStoppingId(null);
  };

  const filtered = runs.filter(r => {
    const matchStatus = filterStatus === 'all' || r.status === filterStatus;
    const matchSearch = !searchQuery || 
      String(r.id).includes(searchQuery) || 
      (r.url || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.testType || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = {
    RUNNING: runs.filter(r => r.status === 'RUNNING').length,
    PASSED: runs.filter(r => r.status === 'PASSED').length,
    FAILED: runs.filter(r => r.status === 'FAILED').length,
    PENDING: runs.filter(r => r.status === 'PENDING').length,
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Activity size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Test Runs</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Run <span className="text-indigo-400">History</span>
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={load} className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/[0.06] transition-all flex items-center gap-2">
            Refresh
          </button>
          <Link to="/app/projects">
            <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all flex items-center gap-2">
              <Play size={14} fill="currentColor" /> New Run
            </button>
          </Link>
        </div>
      </motion.header>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: 'Running', count: statusCounts.RUNNING, color: 'text-indigo-400', bg: 'bg-indigo-500/10 border-indigo-500/20' },
          { label: 'Passed', count: statusCounts.PASSED, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
          { label: 'Failed', count: statusCounts.FAILED, color: 'text-rose-400', bg: 'bg-rose-500/10 border-rose-500/20' },
          { label: 'Pending', count: statusCounts.PENDING, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
        ].map(s => (
          <div key={s.label} className={`flex items-center gap-3 p-3.5 rounded-xl border ${s.bg}`}>
            <span className={`text-2xl font-black ${s.color}`}>{s.count}</span>
            <span className="text-xs text-slate-400 font-semibold">{s.label}</span>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by ID, URL, or type..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', 'RUNNING', 'PENDING', 'PASSED', 'FAILED', 'STOPPED'].map(s => (
            <button
              key={s}
              onClick={() => setFilterStatus(s)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterStatus === s
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <Activity size={52} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">No test runs found</h3>
          <p className="text-slate-500 text-sm mb-6">Go to Projects and click "Run Tests" to start your first test run</p>
          <Link to="/app/projects">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all">
              Go to Projects
            </button>
          </Link>
        </div>
      ) : (
        <div className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-white/[0.05] bg-white/[0.01]">
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Run ID</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">URL / Project</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Type</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">Results</th>
                <th className="px-5 py-4 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">Started</th>
                <th className="px-5 py-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.03]">
              {filtered.map((run, idx) => (
                <motion.tr
                  key={run.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.03 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="font-black text-white text-sm">#{run.id}</div>
                    <div className="text-[10px] text-slate-600 font-bold">{run.browser || 'chrome'}</div>
                  </td>
                  <td className="px-5 py-4 max-w-[200px]">
                    <div className="text-sm text-slate-300 truncate">{run.url || `Project #${run.projectId}`}</div>
                    <div className="text-[10px] text-slate-600">Project #{run.projectId}</div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/[0.08] text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {run.testType || 'smoke'}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={run.status} />
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    {run.totalTests > 0 ? (
                      <div className="space-y-0.5">
                        <div className="text-xs text-slate-300 font-semibold">{run.totalTests} total</div>
                        <div className="text-[10px] text-slate-600">
                          <span className="text-emerald-400">{run.passedTests} pass</span>
                          {' · '}
                          <span className="text-rose-400">{run.failedTests} fail</span>
                        </div>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-600">—</span>
                    )}
                  </td>
                  <td className="px-5 py-4 hidden lg:table-cell">
                    <div className="text-xs text-slate-400">{formatDate(run.startedAt)}</div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {(run.status === 'RUNNING' || run.status === 'PENDING') && (
                        <button
                          onClick={(e) => handleStop(run.id, e)}
                          disabled={stoppingId === run.id}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                          title="Stop run"
                        >
                          {stoppingId === run.id ? <Loader2 size={14} className="animate-spin" /> : <Square size={14} />}
                        </button>
                      )}
                      <Link
                        to={`/app/runs/${run.id}`}
                        className="p-2 bg-white/[0.03] border border-white/[0.05] rounded-xl text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all"
                      >
                        <ChevronRight size={14} />
                      </Link>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
