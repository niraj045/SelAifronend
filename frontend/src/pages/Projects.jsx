import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import {
  Plus, Search, Globe, Play, Trash2, Edit3, ChevronRight,
  X, Loader2, FolderKanban, ExternalLink, CheckCircle,
  XCircle, Clock, Activity
} from 'lucide-react';
import { projectsApi } from '../api/projectsApi';
import { testRunsApi } from '../api/testRunsApi';

const TEST_TYPES = ['smoke', 'functional', 'regression'];
const BROWSERS = ['chrome', 'firefox', 'edge'];

const LAST_RUN_BADGE = {
  PASSED: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  FAILED: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
  RUNNING: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  PENDING: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  STOPPED: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
};

function ProjectModal({ project, onClose, onSave }) {
  const [form, setForm] = useState({
    name: project?.name || '',
    url: project?.url || '',
    description: project?.description || '',
    browserType: project?.browserType || 'chrome',
    testType: project?.testType || 'smoke',
    createdBy: 'user123',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    let url = form.url.trim();
    if (url && !/^https?:\/\//i.test(url)) url = 'https://' + url;
    setSaving(true);
    try {
      await onSave(project?.id || null, { ...form, url });
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to save. Please try again.');
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 10 }}
        className="relative z-10 w-full max-w-lg bg-[#0f172a] border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-white/[0.06]">
          <h3 className="text-lg font-black text-white">{project?.id ? 'Edit Project' : 'New Project'}</h3>
          <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="px-4 py-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-400 text-sm">{error}</div>}

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Project Name *</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="My Website QA"
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" required />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Website URL *</label>
            <div className="relative">
              <Globe size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
              <input value={form.url} onChange={e => setForm(f => ({ ...f, url: e.target.value }))} placeholder="https://example.com"
                className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all" required />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Description</label>
            <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Brief description..." rows={2}
              className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all resize-none" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Browser</label>
              <select value={form.browserType} onChange={e => setForm(f => ({ ...f, browserType: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
                {BROWSERS.map(b => <option key={b} value={b}>{b.charAt(0).toUpperCase() + b.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 block">Test Type</label>
              <select value={form.testType} onChange={e => setForm(f => ({ ...f, testType: e.target.value }))}
                className="w-full px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer">
                {TEST_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
              </select>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 bg-white/[0.03] border border-white/[0.06] text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/[0.06] transition-all">Cancel</button>
            <button type="submit" disabled={saving} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 disabled:opacity-60">
              {saving && <Loader2 size={16} className="animate-spin" />}
              {project?.id ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function Projects() {
  const navigate = useNavigate();
  const [projects, setProjects] = useState([]);
  const [allRuns, setAllRuns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [startingRun, setStartingRun] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const [projectData, runData] = await Promise.all([
        searchQuery.trim()
          ? projectsApi.search(searchQuery.trim())
          : filterType !== 'all'
          ? projectsApi.getByType(filterType)
          : projectsApi.getAll(),
        testRunsApi.getAll().catch(() => []),
      ]);
      setProjects(Array.isArray(projectData) ? projectData : []);
      setAllRuns(Array.isArray(runData) ? runData : []);
    } catch {
      setProjects([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, [searchQuery, filterType]);

  const handleSave = async (id, form) => {
    if (id) await projectsApi.update(id, form);
    else await projectsApi.create(form);
    load();
  };

  const handleDelete = async (id) => {
    try {
      await projectsApi.delete(id);
      setDeleteConfirm(null);
      load();
    } catch {}
  };

  const handleStartRun = async (project) => {
    setStartingRun(project.id);
    try {
      const run = await testRunsApi.start({
        projectId: project.id,
        url: project.url,
        browser: project.browserType || 'chrome',
        testType: project.testType || 'smoke',
      });
      navigate(`/app/runs/${run.id}`);
    } catch {
      alert('Failed to start test run. Ensure the Java backend is running on port 8080.');
    }
    setStartingRun(null);
  };

  const getProjectRunInfo = (projectId) => {
    const runs = allRuns.filter(r => r.projectId === projectId);
    const lastRun = runs.length > 0 ? [...runs].sort((a, b) => b.id - a.id)[0] : null;
    return { count: runs.length, lastRun };
  };

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <FolderKanban size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Projects</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">Your <span className="text-indigo-400">Projects</span></h1>
        </div>
        <motion.button whileHover={{ scale: 1.02, y: -1 }} onClick={() => { setEditingProject(null); setShowModal(true); }}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-semibold text-sm transition-all shadow-lg shadow-indigo-600/20 flex items-center gap-2">
          <Plus size={16} /> Add Project
        </motion.button>
      </motion.header>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search projects..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all" />
        </div>
        <div className="flex gap-2 flex-wrap">
          {['all', ...TEST_TYPES].map(t => (
            <button key={t} onClick={() => setFilterType(t)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterType === t ? 'bg-indigo-600 text-white' : 'bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white hover:bg-white/[0.06]'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : projects.length === 0 ? (
        <div className="text-center py-24">
          <FolderKanban size={52} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">No projects found</h3>
          <p className="text-slate-500 text-sm mb-6">Create your first project to start running automated tests</p>
          <button onClick={() => { setEditingProject(null); setShowModal(true); }}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all">
            Create First Project
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {projects.map((project, idx) => {
            const { count: runCount, lastRun } = getProjectRunInfo(project.id);
            return (
              <motion.div key={project.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }}
                className="group bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/3 rounded-full blur-2xl group-hover:bg-indigo-600/6 transition-all pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center">
                      <Globe size={18} className="text-indigo-400" />
                    </div>
                    <div className="flex items-center gap-1">
                      {lastRun && (
                        <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black uppercase tracking-wider ${LAST_RUN_BADGE[lastRun.status] || LAST_RUN_BADGE.STOPPED}`}>
                          {lastRun.status}
                        </span>
                      )}
                      <button onClick={() => { setEditingProject(project); setShowModal(true); }}
                        className="p-2 text-slate-600 hover:text-indigo-400 hover:bg-indigo-500/10 rounded-lg transition-all">
                        <Edit3 size={14} />
                      </button>
                      <button onClick={() => setDeleteConfirm(project)}
                        className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-white mb-1 group-hover:text-indigo-300 transition-colors line-clamp-1 cursor-pointer"
                    onClick={() => navigate(`/app/projects/${project.id}`)}>{project.name}</h3>
                  <a href={project.url} target="_blank" rel="noopener noreferrer"
                    className="text-xs text-slate-500 hover:text-indigo-400 flex items-center gap-1 transition-colors mb-3" onClick={e => e.stopPropagation()}>
                    <ExternalLink size={10} />
                    <span className="truncate max-w-[200px]">{project.url}</span>
                  </a>

                  {project.description && <p className="text-xs text-slate-500 line-clamp-2 mb-4">{project.description}</p>}

                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-2.5 py-1 bg-white/5 border border-white/[0.08] text-slate-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {project.browserType || 'chrome'}
                    </span>
                    <span className="px-2.5 py-1 bg-indigo-500/8 border border-indigo-500/15 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-lg">
                      {project.testType || 'smoke'}
                    </span>
                    {runCount > 0 && (
                      <span className="ml-auto text-[10px] text-slate-500 font-medium">
                        {runCount} run{runCount !== 1 ? 's' : ''}
                      </span>
                    )}
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => navigate(`/app/projects/${project.id}`)}
                      className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2">
                      <Play size={14} fill="currentColor" /> Open & Test
                    </button>
                    <Link to={`/app/runs?project=${project.id}`} className="px-3 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white rounded-xl transition-all" title="View runs">
                      <Activity size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <ProjectModal project={editingProject} onClose={() => { setShowModal(false); setEditingProject(null); }} onSave={handleSave} />
        )}
      </AnimatePresence>

      {/* Delete Confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setDeleteConfirm(null)} />
            <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.96 }}
              className="relative z-10 w-full max-w-sm bg-[#0f172a] border border-white/[0.08] rounded-2xl p-6 shadow-2xl">
              <h3 className="text-lg font-black text-white mb-2">Delete Project?</h3>
              <p className="text-sm text-slate-400 mb-6">
                Delete <span className="text-white font-semibold">"{deleteConfirm.name}"</span>? This cannot be undone.
              </p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)} className="flex-1 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/[0.06] transition-all">Cancel</button>
                <button onClick={() => handleDelete(deleteConfirm.id)} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl text-sm transition-all">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
