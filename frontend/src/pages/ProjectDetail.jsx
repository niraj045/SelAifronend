import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Plus, Send, Bot, Globe, Play, Clock, CheckCircle2,
  XCircle, Loader2, ChevronRight, Sparkles, MessageSquare,
  RefreshCw, AlertCircle, FolderKanban, Zap, BarChart3
} from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { testRunsApi } from '../api/testRunsApi';

const STATUS_STYLES = {
  PASSED:  { icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20', dot: 'bg-emerald-400' },
  FAILED:  { icon: XCircle,      color: 'text-rose-400',    bg: 'bg-rose-500/10 border-rose-500/20',    dot: 'bg-rose-400'    },
  RUNNING: { icon: Loader2,      color: 'text-indigo-400',  bg: 'bg-indigo-500/10 border-indigo-500/20', dot: 'bg-indigo-400 animate-pulse' },
  PENDING: { icon: Clock,        color: 'text-amber-400',   bg: 'bg-amber-500/10 border-amber-500/20',  dot: 'bg-amber-400'   },
  STOPPED: { icon: AlertCircle,  color: 'text-slate-400',   bg: 'bg-slate-500/10 border-slate-500/20',  dot: 'bg-slate-400'   },
};

function StatusBadge({ status }) {
  const s = STATUS_STYLES[status] || STATUS_STYLES.PENDING;
  const Icon = s.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold border ${s.bg} ${s.color}`}>
      <Icon size={11} className={status === 'RUNNING' ? 'animate-spin' : ''} />
      {status}
    </span>
  );
}

// Chat message bubble
function ChatBubble({ role, content }) {
  const isUser = role === 'user';
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold
        ${isUser ? 'bg-indigo-600 text-white' : 'bg-violet-600/20 border border-violet-500/30 text-violet-400'}`}>
        {isUser ? 'U' : <Bot size={14} />}
      </div>
      <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed
        ${isUser
          ? 'bg-indigo-600 text-white rounded-tr-sm'
          : 'bg-white/[0.04] border border-white/[0.07] text-slate-200 rounded-tl-sm'
        }`}>
        {content}
      </div>
    </motion.div>
  );
}

export default function ProjectDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [runs, setRuns] = useState([]);
  const [loading, setLoading] = useState(true);

  // New test form state
  const [showNewTest, setShowNewTest] = useState(false);
  const [testUrl, setTestUrl] = useState('');
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: "Hi! Tell me what you want to test on this page. For example: \"Test the login form with valid and invalid credentials\" or \"Check that the search feature works and shows results\"." }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [userPrompt, setUserPrompt] = useState('');
  const [launching, setLaunching] = useState(false);
  const [browser, setBrowser] = useState('chrome');
  const [testType, setTestType] = useState('smoke');
  const chatEndRef = useRef(null);

  // Polling for running tests
  const pollingRef = useRef(null);

  useEffect(() => {
    loadData();
    return () => clearInterval(pollingRef.current);
  }, [id]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Poll any RUNNING/PENDING runs every 3s
  useEffect(() => {
    clearInterval(pollingRef.current);
    const hasLive = runs.some(r => r.status === 'RUNNING' || r.status === 'PENDING');
    if (hasLive) {
      pollingRef.current = setInterval(loadRuns, 3000);
    }
    return () => clearInterval(pollingRef.current);
  }, [runs]);

  async function loadData() {
    setLoading(true);
    try {
      const proj = await projectsApi.getById(id);
      setProject(proj);
      setTestUrl(proj.url || '');
      const runsData = await testRunsApi.getByProject(id).catch(() => []);
      setRuns(runsData);
    } catch {
      navigate('/app/projects');
    }
    setLoading(false);
  }

  async function loadRuns() {
    try {
      const runsData = await testRunsApi.getByProject(id);
      setRuns(runsData);
    } catch {}
  }

  function handleChatSend() {
    const msg = chatInput.trim();
    if (!msg) return;
    setChatMessages(prev => [
      ...prev,
      { role: 'user', content: msg },
      { role: 'assistant', content: `Got it! I'll focus on: "${msg}". Set your URL above and click Run Test to start.` }
    ]);
    setUserPrompt(prev => prev ? `${prev}. ${msg}` : msg);
    setChatInput('');
  }

  function handleChatKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSend();
    }
  }

  async function handleRunTest() {
    const url = testUrl.trim();
    if (!url) return;
    setLaunching(true);
    try {
      const run = await testRunsApi.start({
        projectId: Number(id),
        url: url.startsWith('http') ? url : `https://${url}`,
        browser,
        testType,
        userPrompt: userPrompt || null,
      });
      setRuns(prev => [run, ...prev]);
      setShowNewTest(false);
      setChatMessages([
        { role: 'assistant', content: "Hi! Tell me what you want to test on this page. For example: \"Test the login form with valid and invalid credentials\" or \"Check that the search feature works and shows results\"." }
      ]);
      setUserPrompt('');
      navigate(`/app/runs/${run.id}`);
    } catch (e) {
      alert(e?.response?.data?.message || 'Failed to start test run.');
    }
    setLaunching(false);
  }

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <Loader2 size={28} className="animate-spin text-indigo-400" />
    </div>
  );

  return (
    <div className="p-6 md:p-8 max-w-[1400px] mx-auto">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <button onClick={() => navigate('/app/projects')}
            className="flex items-center gap-1.5 text-slate-500 hover:text-white text-sm transition-colors">
            <ArrowLeft size={14} /> Projects
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-slate-300 text-sm font-medium">{project?.name}</span>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <FolderKanban size={16} className="text-indigo-400" />
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Project</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">{project?.name}</h1>
            {project?.url && (
              <a href={project.url} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-indigo-400 mt-1 transition-colors">
                <Globe size={12} /> {project.url}
              </a>
            )}
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={() => setShowNewTest(true)}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm shadow-lg shadow-indigo-600/20 transition-all">
            <Plus size={16} /> New Test
          </motion.button>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* Test Runs list */}
        <div className="xl:col-span-3 space-y-3">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Test Runs</h2>

          {runs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center mb-4">
                <Zap size={22} className="text-indigo-400" />
              </div>
              <p className="text-white font-semibold mb-1">No tests yet</p>
              <p className="text-slate-500 text-sm">Click "New Test" and describe what you want to test.</p>
            </div>
          ) : (
            runs.map((run, i) => (
              <motion.div key={run.id}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 hover:bg-white/[0.04] transition-all group cursor-pointer"
                onClick={() => navigate(`/app/runs/${run.id}`)}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <StatusBadge status={run.status} />
                      <span className="text-xs text-slate-500">#{run.id}</span>
                      <span className="text-xs text-slate-600">·</span>
                      <span className="text-xs text-slate-500">{run.browser} · {run.testType}</span>
                    </div>

                    {run.userPrompt && (
                      <div className="flex items-start gap-2 mb-2">
                        <MessageSquare size={12} className="text-violet-400 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-slate-300 italic truncate">"{run.userPrompt}"</p>
                      </div>
                    )}

                    <p className="text-xs text-slate-500 truncate">
                      <Globe size={10} className="inline mr-1" />{run.url}
                    </p>

                    {run.errorMessage && (
                      <p className="text-xs text-rose-400 mt-1 truncate">{run.errorMessage}</p>
                    )}
                  </div>

                  <div className="text-right flex-shrink-0">
                    <div className="text-lg font-black text-white">
                      {run.totalTests ?? 0}
                      <span className="text-xs font-normal text-slate-500 ml-1">tests</span>
                    </div>
                    {(run.totalTests > 0) && (
                      <div className="text-xs text-slate-500">
                        <span className="text-emerald-400">{run.passedTests}</span>
                        <span className="mx-1">/</span>
                        <span className="text-rose-400">{run.failedTests} fail</span>
                      </div>
                    )}
                    <ChevronRight size={14} className="text-slate-600 group-hover:text-slate-300 transition-colors ml-auto mt-1" />
                  </div>
                </div>

                {/* Mini pass/fail bar */}
                {run.totalTests > 0 && (
                  <div className="mt-3 h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all"
                      style={{ width: `${(run.passedTests / run.totalTests) * 100}%` }} />
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Stats sidebar */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-black text-white uppercase tracking-widest mb-4">Summary</h2>

          {[
            { label: 'Total Runs', value: runs.length, icon: BarChart3, color: 'text-indigo-400' },
            { label: 'Passed', value: runs.filter(r => r.status === 'PASSED').length, icon: CheckCircle2, color: 'text-emerald-400' },
            { label: 'Failed', value: runs.filter(r => r.status === 'FAILED').length, icon: XCircle, color: 'text-rose-400' },
          ].map(stat => (
            <div key={stat.label} className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/[0.03] flex items-center justify-center">
                <stat.icon size={18} className={stat.color} />
              </div>
              <div>
                <div className="text-2xl font-black text-white">{stat.value}</div>
                <div className="text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}

          <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl p-4">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-2">Project URL</div>
            <p className="text-sm text-slate-300 break-all">{project?.url || '—'}</p>
          </div>
        </div>
      </div>

      {/* New Test Slide-up Panel */}
      <AnimatePresence>
        {showNewTest && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
              onClick={() => setShowNewTest(false)}
            />
            <motion.div
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0f1e] border-t border-white/[0.07] rounded-t-3xl shadow-2xl max-h-[85vh] flex flex-col"
            >
              {/* Panel header */}
              <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-500/15 border border-indigo-500/25 rounded-xl flex items-center justify-center">
                    <Sparkles size={14} className="text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-white font-black text-base">New Test</h3>
                    <p className="text-xs text-slate-500">Tell the AI what to test in plain language</p>
                  </div>
                </div>
                <button onClick={() => setShowNewTest(false)}
                  className="text-slate-500 hover:text-white transition-colors text-xl font-light w-8 h-8 flex items-center justify-center rounded-lg hover:bg-white/5">
                  ✕
                </button>
              </div>

              <div className="flex-1 overflow-y-auto min-h-0">
                <div className="p-5 space-y-5">
                  {/* URL + options row */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-1">
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Test URL</label>
                      <div className="relative">
                        <Globe size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                        <input
                          type="url"
                          value={testUrl}
                          onChange={e => setTestUrl(e.target.value)}
                          placeholder="https://example.com"
                          className="w-full pl-8 pr-3 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Browser</label>
                      <select value={browser} onChange={e => setBrowser(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                        <option value="chrome">Chrome</option>
                        <option value="firefox">Firefox</option>
                        <option value="edge">Edge</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 block">Test Type</label>
                      <select value={testType} onChange={e => setTestType(e.target.value)}
                        className="w-full px-3 py-2.5 bg-white/[0.03] border border-white/[0.07] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 appearance-none cursor-pointer">
                        <option value="smoke">Smoke</option>
                        <option value="functional">Functional</option>
                        <option value="regression">Regression</option>
                      </select>
                    </div>
                  </div>

                  {/* Chat area */}
                  <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 block flex items-center gap-1.5">
                      <Bot size={11} /> AI Instructions
                    </label>

                    <div className="bg-white/[0.02] border border-white/[0.05] rounded-2xl overflow-hidden">
                      {/* Messages */}
                      <div className="h-48 overflow-y-auto p-4 space-y-3">
                        {chatMessages.map((msg, i) => (
                          <ChatBubble key={i} role={msg.role} content={msg.content} />
                        ))}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Prompt preview chip */}
                      {userPrompt && (
                        <div className="mx-4 mb-2 flex items-start gap-2 px-3 py-2 bg-violet-500/10 border border-violet-500/20 rounded-xl">
                          <Sparkles size={11} className="text-violet-400 flex-shrink-0 mt-0.5" />
                          <p className="text-xs text-violet-300 flex-1 truncate">Prompt: {userPrompt}</p>
                          <button onClick={() => { setUserPrompt(''); setChatMessages(msgs => msgs.slice(0,1)); }}
                            className="text-violet-500 hover:text-violet-300 text-xs flex-shrink-0">clear</button>
                        </div>
                      )}

                      {/* Chat input */}
                      <div className="border-t border-white/[0.05] flex items-end gap-2 p-3">
                        <textarea
                          value={chatInput}
                          onChange={e => setChatInput(e.target.value)}
                          onKeyDown={handleChatKeyDown}
                          placeholder="e.g. Test the login with wrong password, then correct password…"
                          rows={2}
                          className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 resize-none focus:outline-none leading-relaxed"
                        />
                        <button onClick={handleChatSend} disabled={!chatInput.trim()}
                          className="flex-shrink-0 w-8 h-8 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg flex items-center justify-center transition-all">
                          <Send size={13} className="text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Run button */}
              <div className="p-5 border-t border-white/[0.06] flex-shrink-0">
                <motion.button
                  whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  onClick={handleRunTest}
                  disabled={!testUrl.trim() || launching}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
                >
                  {launching ? (
                    <><Loader2 size={16} className="animate-spin" /> Launching AI Test…</>
                  ) : (
                    <><Play size={16} /> Run Test{userPrompt ? ' with AI Instructions' : ''}</>
                  )}
                </motion.button>
                {!testUrl.trim() && (
                  <p className="text-center text-xs text-slate-600 mt-2">Enter a URL to enable this button</p>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
