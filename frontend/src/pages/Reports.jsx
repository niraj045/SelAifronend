import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  FileText, Download, Trash2, Search, Eye, ChevronRight,
  Code, FileJson, BarChart3, Loader2, AlertCircle
} from 'lucide-react';
import { reportsApi } from '../api/reportsApi';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [downloadingId, setDownloadingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewType, setPreviewType] = useState(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const data = await reportsApi.getAll();
      setReports(Array.isArray(data) ? data : []);
    } catch {
      setReports([]);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const handleDownloadPdf = async (testRunId) => {
    setDownloadingId(testRunId);
    try {
      await reportsApi.downloadPdf(testRunId);
    } catch {
      alert('PDF not available. Backend may still be generating it.');
    }
    setDownloadingId(null);
  };

  const handleDelete = async (testRunId) => {
    setDeletingId(testRunId);
    try {
      await reportsApi.delete(testRunId);
      load();
    } catch {
      alert('Failed to delete report.');
    }
    setDeletingId(null);
  };

  const handlePreview = async (testRunId, type) => {
    setPreviewLoading(true);
    setPreviewType(type);
    try {
      const data = type === 'html'
        ? await reportsApi.getHtml(testRunId)
        : await reportsApi.getMarkdown(testRunId);
      setPreviewData(data);
    } catch {
      setPreviewData('Preview not available.');
    }
    setPreviewLoading(false);
  };

  const filtered = reports.filter(r =>
    !searchQuery || String(r.testRunId || r.id || '').includes(searchQuery)
  );

  const reportId = (r) => r.testRunId ?? r.id;

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
            <BarChart3 size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Reports</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Test <span className="text-indigo-400">Reports</span>
          </h1>
        </div>
        <button onClick={load} className="px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 rounded-xl font-semibold text-sm hover:bg-white/[0.06] transition-all">
          Refresh
        </button>
      </motion.header>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search by run ID..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/30 transition-all"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <div className="w-10 h-10 border-2 border-white/10 border-t-indigo-500 rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24">
          <FileText size={52} className="text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-black text-white mb-2">No reports found</h3>
          <p className="text-slate-500 text-sm mb-6">Reports are generated after test runs complete</p>
          <Link to="/app/runs">
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all">
              View Test Runs
            </button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((report, idx) => {
            const rid = reportId(report);
            return (
              <motion.div
                key={rid}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.04 }}
                className="group flex flex-col sm:flex-row sm:items-center gap-4 p-5 bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl hover:border-indigo-500/15 transition-all"
              >
                <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white text-indigo-400 transition-all">
                  <FileText size={18} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-base font-black text-white group-hover:text-indigo-300 transition-colors">
                    Test Run #{rid} Report
                  </div>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {report.testType && (
                      <span className="px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-bold uppercase tracking-wider rounded-md">
                        {report.testType}
                      </span>
                    )}
                    {report.status && (
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md border ${
                        report.status === 'PASSED'
                          ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                          : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                      }`}>
                        {report.status}
                      </span>
                    )}
                    {report.totalTests > 0 && (
                      <span className="px-2 py-0.5 bg-white/5 border border-white/[0.08] text-slate-400 text-[10px] font-bold rounded-md">
                        {report.totalTests} tests
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={() => handlePreview(rid, 'html')}
                    className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="Preview HTML"
                  >
                    <Eye size={13} /> HTML
                  </button>
                  <button
                    onClick={() => handlePreview(rid, 'markdown')}
                    className="px-3 py-2 bg-white/[0.03] border border-white/[0.06] text-slate-400 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5"
                    title="Preview Markdown"
                  >
                    <Code size={13} /> MD
                  </button>
                  <button
                    onClick={() => handleDownloadPdf(rid)}
                    disabled={downloadingId === rid}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 disabled:opacity-60"
                  >
                    {downloadingId === rid ? <Loader2 size={13} className="animate-spin" /> : <Download size={13} />}
                    PDF
                  </button>
                  <button
                    onClick={() => handleDelete(rid)}
                    disabled={deletingId === rid}
                    className="p-2 text-slate-600 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-all"
                  >
                    {deletingId === rid ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
                  </button>
                  <Link to={`/app/runs/${rid}`} className="p-2 bg-white/[0.03] border border-white/[0.06] text-slate-500 hover:text-white rounded-xl transition-all">
                    <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Preview Modal */}
      {(previewData !== null || previewLoading) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => { setPreviewData(null); setPreviewType(null); }} />
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative z-10 w-full max-w-3xl bg-[#0f172a] border border-white/[0.08] rounded-3xl shadow-2xl max-h-[80vh] flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between p-5 border-b border-white/[0.06] flex-shrink-0">
              <div className="flex items-center gap-2">
                {previewType === 'html' ? <Eye size={16} className="text-indigo-400" /> : <Code size={16} className="text-indigo-400" />}
                <span className="text-sm font-black text-white uppercase tracking-wider">
                  {previewType === 'html' ? 'HTML Report' : 'Markdown Report'}
                </span>
              </div>
              <button
                onClick={() => { setPreviewData(null); setPreviewType(null); }}
                className="p-2 hover:bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all"
              >
                ✕
              </button>
            </div>
            <div className="flex-1 overflow-auto p-5">
              {previewLoading ? (
                <div className="flex justify-center py-12">
                  <Loader2 size={32} className="animate-spin text-indigo-500" />
                </div>
              ) : previewType === 'html' ? (
                <iframe
                  srcDoc={previewData}
                  className="w-full h-96 rounded-xl border border-white/[0.05] bg-white"
                  title="HTML Report Preview"
                />
              ) : (
                <pre className="text-xs text-slate-300 whitespace-pre-wrap font-mono leading-relaxed">
                  {previewData}
                </pre>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
