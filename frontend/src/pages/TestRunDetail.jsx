import { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, CheckCircle, XCircle, Clock, Activity, Square,
  Download, RefreshCw, ChevronDown, ChevronUp, Terminal,
  AlertCircle, Loader2, Bot, Cpu, Globe, BarChart3, Circle
} from 'lucide-react';
import { testRunsApi } from '../api/testRunsApi';
import { executionsApi } from '../api/executionsApi';
import { reportsApi } from '../api/reportsApi';

const POLLING = ['PENDING', 'RUNNING'];
const DONE = ['PASSED', 'FAILED', 'STOPPED'];

const STATUS_STYLE = {
  PASSED: { border: 'border-emerald-500/20', bg: 'bg-emerald-500/5', color: 'text-emerald-400', dot: 'bg-emerald-500' },
  FAILED: { border: 'border-rose-500/20', bg: 'bg-rose-500/5', color: 'text-rose-400', dot: 'bg-rose-500' },
  RUNNING: { border: 'border-indigo-500/20', bg: 'bg-indigo-500/5', color: 'text-indigo-400', dot: 'bg-indigo-500 animate-pulse' },
  PENDING: { border: 'border-amber-500/20', bg: 'bg-amber-500/5', color: 'text-amber-400', dot: 'bg-amber-500 animate-pulse' },
  STOPPED: { border: 'border-slate-500/20', bg: 'bg-slate-500/5', color: 'text-slate-400', dot: 'bg-slate-500' },
};

// Pipeline stage derives from run status
function getPipelineStage(status) {
  if (status === 'PENDING') return 0;   // AI Analysis
  if (status === 'RUNNING') return 1;   // Execution
  if (status === 'PASSED' || status === 'FAILED') return 2; // Done
  return -1; // STOPPED
}

function PipelineViz({ run }) {
  const stage = getPipelineStage(run?.status);
  const stopped = run?.status === 'STOPPED';

  const stages = [
    { icon: Bot, label: 'AI Analysis', sub: 'GPT-4 generating tests' },
    { icon: Cpu, label: 'Execution', sub: 'Selenium running browser' },
    { icon: BarChart3, label: 'Report', sub: 'Generating results' },
  ];

  return (
    <div className="bg-[#0f172a]/40 border border-white/[0.05] rounded-2xl p-6">
      <h2 className="text-sm font-black text-white mb-5">Test Pipeline</h2>
      <div className="flex items-center gap-0">
        {stages.map((s, i) => {
          const Icon = s.icon;
          const isDone = stage > i || (stage === 2 && i <= 2);
          const isActive = stage === i && !stopped;
          const isPending = stage < i;
          return (
            <div key={i} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-500 ${
                  stopped ? 'bg-slate-500/10 border-slate-500/20 text-slate-500' :
                  isDone ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                  isActive ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-400' :
                  'bg-white/[0.02] border-white/[0.06] text-slate-600'
                }`}>
                  {isActive && !stopped
                    ? <RefreshCw size={20} className="animate-spin" />
                    : isDone && !stopped
                    ? <CheckCircle size={20} className="text-emerald-400" />
                    : <Icon size={20} />
                  }
                </div>
                <div className="text-center mt-2">
                  <div className={`text-xs font-black uppercase tracking-wide ${
                    stopped ? 'text-slate-500' :
                    isDone ? 'text-emerald-400' :
                    isActive ? 'text-indigo-300' : 'text-slate-600'
                  }`}>{s.label}</div>
                  {isActive && !stopped && (
                    <div className="text-[10px] text-slate-500 mt-0.5">{s.sub}</div>
                  )}
                </div>
              </div>
              {i < stages.length - 1 && (
                <div className={`h-0.5 w-8 mx-1 rounded-full transition-all duration-700 ${
                  stopped ? 'bg-slate-700' :
                  stage > i ? 'bg-emerald-500' :
                  stage === i ? 'bg-gradient-to-r from-indigo-500 to-white/10' :
                  'bg-white/[0.05]'
                }`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ExecutionRow({ exec }) {
  const [expanded, setExpanded] = useState(false);
  const statusStyle = {
    PASSED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    FAILED: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    ERROR: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
    RUNNING: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  }[exec.status] || 'text-slate-400 bg-slate-500/10 border-slate-500/20';

  return (
    <div className="border border-white/[0.04] rounded-xl overflow-hidden bg-white/[0.01] hover:bg-white/[0.02] transition-all">
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-4 p-4 text-left">
        <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider flex-shrink-0 ${statusStyle}`}>
          {exec.status}
        </span>
        <span className="text-sm text-white font-semibold flex-1 truncate">{exec.testName}</span>
        {exec.executionTimeMs && (
          <span className="text-xs text-slate-500 flex-shrink-0 hidden sm:block font-mono">
            {(exec.executionTimeMs / 1000).toFixed(2)}s
          </span>
        )}
        {expanded ? <ChevronUp size={14} className="text-slate-500 flex-shrink-0" /> : <ChevronDown size={14} className="text-slate-500 flex-shrink-0" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04] pt-3">
              {exec.testDescription && <p className="text-xs text-slate-400">{exec.testDescription}</p>}
              {exec.errorMessage && (
                <div className="flex items-start gap-2 p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl">
                  <AlertCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-rose-300 font-mono break-all">{exec.errorMessage}</p>
                </div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                {exec.executedAt && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-0.5 text-slate-600">Executed At</div>
                    <div className="text-slate-400">{new Date(exec.executedAt).toLocaleTimeString()}</div>
                  </div>
                )}
                {exec.executionTimeMs && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-0.5 text-slate-600">Duration</div>
                    <div className="text-slate-400">{(exec.executionTimeMs / 1000).toFixed(2)}s</div>
                  </div>
                )}
                {exec.screenshotPath && (
                  <div>
                    <div className="text-[10px] uppercase tracking-widest mb-0.5 text-slate-600">Screenshot</div>
                    <div className="text-indigo-400 font-mono text-[10px] truncate">{exec.screenshotPath.split('/').pop()}</div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function TestRunDetail() {
  const { id } = useParams();
  const [run, setRun] = useState(null);
  const [executions, setExecutions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stopping, setStopping] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const pollerRef = useRef(null);

  const fetchRun = async () => {
    try {
      const data = await testRunsApi.getById(Number(id));
      setRun(data);
      if (DONE.includes(data?.status)) {
        const execs = await executionsApi.getByRun(Number(id)).catch(() => []);
        setExecutions(Array.isArray(execs) ? execs : []);
      }
      return data;
    } catch { return null; }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const data = await fetchRun();
      setLoading(false);
      if (data && POLLING.includes(data.status)) {
        pollerRef.current = setInterval(async () => {
          const updated = await fetchRun();
          if (updated && !POLLING.includes(updated.status)) clearInterval(pollerRef.current);
        }, 3000);
      }
    };
    init();
    return () => clearInterval(pollerRef.current);
  }, [id]);

  const handleStop = async () => {
    setStopping(true);
    try {
      await testRunsApi.stop(Number(id));
      await fetchRun();
      clearInterval(pollerRef.current);
    } catch {}
    setStopping(false);
  };

  const handlePdf = async () => {
    setDownloading(true);
    try {
      await reportsApi.downloadPdf(Number(id));
    } catch {
      alert('PDF report not yet available. The backend may still be generating it.');
    }
    setDownloading(false);
  };

  const style = run ? (STATUS_STYLE[run.status] || STATUS_STYLE.STOPPED) : STATUS_STYLE.PENDING;
  const isActive = run && POLLING.includes(run.status);
  const passRate = run?.totalTests > 0 ? ((run.passedTests / run.totalTests) * 100).toFixed(0) : 0;

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Back header */}
      <div className="flex items-center gap-4 mb-8">
        <Link to="/app/runs" className="p-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-slate-400 hover:text-white transition-all">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <Activity size={14} className="text-indigo-400" />
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-widest">Test Run Detail</span>
          </div>
          <h1 className="text-xl md:text-2xl font-black text-white">Run #{id}</h1>
        </div>
        <div className="flex gap-2">
          {isActive && (
            <button onClick={handleStop} disabled={stopping}
              className="px-4 py-2.5 bg-rose-600/20 border border-rose-500/20 text-rose-400 hover:bg-rose-600/30 rounded-xl font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-60">
              {stopping ? <Loader2 size={14} className="animate-spin" /> : <Square size={14} />}
              Stop
            </button>
          )}
          <button onClick={handlePdf} disabled={downloading || isActive}
            className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:text-white hover:bg-white/[0.06] rounded-xl font-semibold text-sm transition-all flex items-center gap-2 disabled:opacity-40">
            {downloading ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
            PDF
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-32">
          <div className="w-12 h-12 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : !run ? (
        <div className="text-center py-32">
          <AlertCircle size={48} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">Run not found</h3>
          <Link to="/app/runs"><button className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold text-sm mt-4">Back to Runs</button></Link>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Status card */}
          <div className={`p-6 rounded-2xl border ${style.border} ${style.bg} relative overflow-hidden`}>
            {isActive && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/2 to-transparent animate-pulse" />}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-2xl bg-white/5 border ${style.border} flex items-center justify-center flex-shrink-0`}>
                  {isActive ? <RefreshCw size={22} className={`${style.color} animate-spin`} />
                    : run.status === 'PASSED' ? <CheckCircle size={22} className="text-emerald-400" />
                    : run.status === 'FAILED' ? <XCircle size={22} className="text-rose-400" />
                    : <Square size={22} className="text-slate-400" />}
                </div>
                <div>
                  <div className={`text-xl font-black uppercase tracking-tight ${style.color}`}>{run.status}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {run.url && <span className="truncate max-w-[200px] inline-block align-middle">{run.url}</span>}
                    {run.url && ' · '}{run.testType} · {run.browser}
                  </div>
                </div>
              </div>
              {isActive && (
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Circle size={6} className="text-indigo-400 animate-pulse" fill="currentColor" />
                  Polling every 3s…
                </div>
              )}
            </div>
          </div>

          {/* Pipeline */}
          <PipelineViz run={run} />

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: 'Total Tests', value: run.totalTests || 0, color: 'text-white' },
              { label: 'Passed', value: run.passedTests || 0, color: 'text-emerald-400' },
              { label: 'Failed', value: run.failedTests || 0, color: 'text-rose-400' },
              { label: 'Pass Rate', value: run.totalTests > 0 ? `${passRate}%` : '—', color: Number(passRate) >= 70 ? 'text-emerald-400' : 'text-rose-400' },
            ].map(s => (
              <div key={s.label} className="bg-[#0f172a]/40 border border-white/[0.05] rounded-xl p-4">
                <div className={`text-3xl font-black ${s.color} mb-1`}>{s.value}</div>
                <div className="text-xs text-slate-500 font-medium">{s.label}</div>
              </div>
            ))}
          </div>

          {/* Error */}
          {run.errorMessage && (
            <div className="flex items-start gap-3 p-4 bg-rose-500/5 border border-rose-500/20 rounded-xl">
              <AlertCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div>
                <div className="text-sm font-bold text-rose-300 mb-1">Error</div>
                <p className="text-xs text-rose-400/80 font-mono">{run.errorMessage}</p>
              </div>
            </div>
          )}

          {/* Run metadata */}
          <div className="bg-[#0f172a]/40 border border-white/[0.05] rounded-2xl p-5">
            <h2 className="text-sm font-black text-white mb-4">Run Details</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 text-xs">
              {[
                { label: 'Project ID', value: `#${run.projectId}` },
                { label: 'Browser', value: run.browser || 'chrome' },
                { label: 'Test Type', value: run.testType || 'smoke' },
                { label: 'URL', value: run.url, truncate: true },
                { label: 'Started', value: run.startedAt ? new Date(run.startedAt).toLocaleString() : '—' },
                { label: 'Completed', value: run.completedAt ? new Date(run.completedAt).toLocaleString() : '—' },
              ].map(d => (
                <div key={d.label}>
                  <div className="text-[10px] uppercase tracking-widest text-slate-600 mb-1">{d.label}</div>
                  <div className={`text-slate-300 font-medium ${d.truncate ? 'truncate' : ''}`}>{d.value || '—'}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Execution results */}
          {DONE.includes(run.status) && (
            <div className="bg-[#0f172a]/40 border border-white/[0.05] rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-sm font-black text-white">Execution Results</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{executions.length} test case{executions.length !== 1 ? 's' : ''}</p>
                </div>
                {run.status !== 'STOPPED' && (
                  <button onClick={handlePdf} disabled={downloading}
                    className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600/20 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-600/30 rounded-xl text-xs font-semibold transition-all disabled:opacity-50">
                    {downloading ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    Download PDF
                  </button>
                )}
              </div>
              {executions.length === 0 ? (
                <div className="text-center py-8">
                  <Terminal size={32} className="text-slate-700 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">No execution details available</p>
                  <p className="text-xs text-slate-600 mt-1">The execution service may not have recorded step-level results</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {executions.map(exec => <ExecutionRow key={exec.id} exec={exec} />)}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
