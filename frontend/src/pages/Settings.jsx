import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Globe, Key, Bell, Users, Code, Shield, Cpu, Zap, Database, CheckCircle, AlertCircle, Loader2, Eye, EyeOff } from 'lucide-react';

const STORAGE_KEY = 'selai_settings';

const defaultSettings = {
  apiGatewayUrl: 'http://localhost:8080',
  aiEngineUrl: 'http://localhost:5000',
  primaryProvider: 'openai',
  openaiModel: 'gpt-4-turbo-preview',
  groqModel: 'llama-3.1-70b-versatile',
  defaultBrowser: 'chrome',
  defaultTestType: 'smoke',
  headlessBrowser: true,
  enableFallback: true,
  screenshotOnFail: true,
  notifyOnComplete: false,
};

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-black text-white uppercase tracking-widest pb-3 border-b border-white/[0.05]">{title}</h3>
      {children}
    </div>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
      <div className="sm:w-56 flex-shrink-0">
        <div className="text-sm font-semibold text-slate-300">{label}</div>
        {hint && <div className="text-xs text-slate-600 mt-0.5">{hint}</div>}
      </div>
      <div className="flex-1">{children}</div>
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = 'text', secret = false }) {
  const [show, setShow] = useState(false);
  const inputType = secret ? (show ? 'text' : 'password') : type;
  return (
    <div className="relative">
      <input
        type={inputType}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all pr-10"
      />
      {secret && (
        <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors">
          {show ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      )}
    </div>
  );
}

function SelectInput({ value, onChange, options }) {
  return (
    <select
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all appearance-none cursor-pointer"
    >
      {options.map(o => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl hover:bg-white/[0.03] transition-all">
      <span className="text-sm text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-all duration-300 ${checked ? 'bg-indigo-600' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${checked ? 'translate-x-5' : ''}`} />
      </button>
    </div>
  );
}

const tabs = [
  { id: 'services', label: 'Services', icon: Globe },
  { id: 'ai', label: 'AI Engine', icon: Cpu },
  { id: 'execution', label: 'Execution', icon: Zap },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export default function Settings() {
  const [activeTab, setActiveTab] = useState('services');
  const [settings, setSettings] = useState(() => {
    try {
      return { ...defaultSettings, ...JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') };
    } catch { return defaultSettings; }
  });
  const [saved, setSaved] = useState(false);
  const [testing, setTesting] = useState(null); // 'backend' | 'ai'
  const [testResult, setTestResult] = useState({});

  const update = (key) => (val) => setSettings(s => ({ ...s, [key]: val }));

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const testConnection = async (which) => {
    setTesting(which);
    setTestResult(r => ({ ...r, [which]: null }));
    try {
      const url = which === 'backend'
        ? `${settings.apiGatewayUrl}/api/projects`
        : `${settings.aiEngineUrl}/api/health`;
      const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
      setTestResult(r => ({ ...r, [which]: res.ok ? 'ok' : `HTTP ${res.status}` }));
    } catch (e) {
      setTestResult(r => ({ ...r, [which]: 'error: ' + (e.message || 'unreachable') }));
    }
    setTesting(null);
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto">
      {/* Header */}
      <motion.header initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Shield size={16} className="text-indigo-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Configuration</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
            Platform <span className="text-indigo-400">Settings</span>
          </h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
            saved
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20'
          }`}
        >
          {saved ? <CheckCircle size={16} /> : <Save size={16} />}
          {saved ? 'Saved!' : 'Save Changes'}
        </motion.button>
      </motion.header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tab sidebar */}
        <div className="space-y-1">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left ${
                  active ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : 'text-slate-500 hover:text-slate-200 hover:bg-white/[0.03]'
                }`}>
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 12 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6 space-y-8"
            >
              {activeTab === 'services' && (
                <>
                  <Section title="Java Backend (API Gateway)">
                    <Field label="API Gateway URL" hint="Spring Cloud Gateway entry point">
                      <div className="flex gap-2">
                        <TextInput value={settings.apiGatewayUrl} onChange={update('apiGatewayUrl')} placeholder="http://localhost:8080" />
                        <button onClick={() => testConnection('backend')} disabled={testing === 'backend'}
                          className="flex-shrink-0 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                          {testing === 'backend' ? <Loader2 size={12} className="animate-spin" /> : 'Test'}
                        </button>
                      </div>
                      {testResult.backend && (
                        <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${testResult.backend === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {testResult.backend === 'ok' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {testResult.backend === 'ok' ? 'Connected successfully' : testResult.backend}
                        </div>
                      )}
                    </Field>
                  </Section>

                  <Section title="Python AI Engine">
                    <Field label="AI Engine URL" hint="FastAPI server for test generation">
                      <div className="flex gap-2">
                        <TextInput value={settings.aiEngineUrl} onChange={update('aiEngineUrl')} placeholder="http://localhost:5000" />
                        <button onClick={() => testConnection('ai')} disabled={testing === 'ai'}
                          className="flex-shrink-0 px-4 py-2.5 bg-white/[0.03] border border-white/[0.06] text-slate-300 hover:text-white rounded-xl text-xs font-semibold transition-all flex items-center gap-2 disabled:opacity-50">
                          {testing === 'ai' ? <Loader2 size={12} className="animate-spin" /> : 'Test'}
                        </button>
                      </div>
                      {testResult.ai && (
                        <div className={`mt-2 flex items-center gap-2 text-xs font-medium ${testResult.ai === 'ok' ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {testResult.ai === 'ok' ? <CheckCircle size={12} /> : <AlertCircle size={12} />}
                          {testResult.ai === 'ok' ? 'AI Engine is online' : testResult.ai}
                        </div>
                      )}
                    </Field>
                  </Section>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                    <p className="text-xs text-amber-400 font-medium">
                      These URLs are stored in your browser only. To change the actual server URLs, update the respective <code className="font-mono bg-white/5 px-1 rounded">application.properties</code> files in each Java service.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'ai' && (
                <>
                  <Section title="LLM Provider">
                    <Field label="Primary Provider" hint="Which AI to try first">
                      <SelectInput value={settings.primaryProvider} onChange={update('primaryProvider')} options={[
                        { value: 'openai', label: 'OpenAI GPT-4 (Best quality)' },
                        { value: 'groq', label: 'Groq Llama 70B (Fastest, free)' },
                      ]} />
                    </Field>
                    <Field label="OpenAI Model">
                      <SelectInput value={settings.openaiModel} onChange={update('openaiModel')} options={[
                        { value: 'gpt-4-turbo-preview', label: 'GPT-4 Turbo (Recommended)' },
                        { value: 'gpt-4o', label: 'GPT-4o' },
                        { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo (Cheaper)' },
                      ]} />
                    </Field>
                    <Field label="Groq Model">
                      <SelectInput value={settings.groqModel} onChange={update('groqModel')} options={[
                        { value: 'llama-3.1-70b-versatile', label: 'Llama 3.1 70B Versatile' },
                        { value: 'llama-3.1-8b-instant', label: 'Llama 3.1 8B Instant (Fastest)' },
                        { value: 'mixtral-8x7b-32768', label: 'Mixtral 8x7B' },
                      ]} />
                    </Field>
                  </Section>

                  <Section title="AI Behaviour">
                    <Toggle checked={settings.enableFallback} onChange={update('enableFallback')} label="Enable model fallback (OpenAI → Groq → HuggingFace)" />
                  </Section>

                  <div className="p-4 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                    <p className="text-xs text-indigo-400 font-medium">
                      API keys are stored only in <code className="font-mono bg-white/5 px-1 rounded">SelAiPython/ai-engine/.env</code> — never in the browser. Edit that file to change keys.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'execution' && (
                <>
                  <Section title="Browser Defaults">
                    <Field label="Default Browser" hint="Used when creating new projects">
                      <SelectInput value={settings.defaultBrowser} onChange={update('defaultBrowser')} options={[
                        { value: 'chrome', label: 'Chrome' },
                        { value: 'firefox', label: 'Firefox' },
                        { value: 'edge', label: 'Edge' },
                      ]} />
                    </Field>
                    <Field label="Default Test Type">
                      <SelectInput value={settings.defaultTestType} onChange={update('defaultTestType')} options={[
                        { value: 'smoke', label: 'Smoke' },
                        { value: 'functional', label: 'Functional' },
                        { value: 'regression', label: 'Regression' },
                      ]} />
                    </Field>
                  </Section>

                  <Section title="Selenium Options">
                    <Toggle checked={settings.headlessBrowser} onChange={update('headlessBrowser')} label="Run browser in headless mode (no visible window)" />
                    <Toggle checked={settings.screenshotOnFail} onChange={update('screenshotOnFail')} label="Capture screenshot on step failure" />
                  </Section>

                  <div className="p-4 bg-amber-500/5 border border-amber-500/15 rounded-xl">
                    <p className="text-xs text-amber-400 font-medium">
                      Selenium browser settings are applied in the Java Execution Service. Update <code className="font-mono bg-white/5 px-1 rounded">execution-service/application.properties</code> to apply them server-side.
                    </p>
                  </div>
                </>
              )}

              {activeTab === 'notifications' && (
                <>
                  <Section title="Alerts">
                    <Toggle checked={settings.notifyOnComplete} onChange={update('notifyOnComplete')} label="Browser notification when test run completes" />
                  </Section>

                  <div className="p-4 bg-slate-500/5 border border-slate-500/15 rounded-xl">
                    <p className="text-xs text-slate-500 font-medium">
                      Email and Slack notifications require backend integration. This will be added in a future release.
                    </p>
                  </div>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
