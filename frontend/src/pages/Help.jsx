import { motion } from 'framer-motion';
import { Book, MessageCircle, Mail, FileText, Video, ExternalLink, Sparkles, ChevronRight, Search, Play, HelpCircle, LifeBuoy, Globe, Terminal } from 'lucide-react';

const Help = () => {
    const resources = [
        {
            icon: Book,
            title: 'Neural Archive',
            description: 'The complete technical baseline for the Aetherium engine core.',
            link: 'Access Documentation',
            color: 'text-indigo-400'
        },
        {
            icon: Video,
            title: 'Visual Synthetics',
            description: 'Direct optical walkthroughs of complex neural mappings.',
            link: 'Watch Stream',
            color: 'text-purple-400'
        },
        {
            icon: Terminal,
            title: 'Developer Console',
            description: 'API specifications and terminal bypass protocols.',
            link: 'View Docs',
            color: 'text-emerald-400'
        },
        {
            icon: Globe,
            title: 'Global Collective',
            description: 'Synchronize knowledge with node controllers worldwide.',
            link: 'Join Forum',
            color: 'text-amber-400'
        }
    ];

    return (
        <div className="p-8 md:p-12 lg:p-16 max-w-[1700px] mx-auto space-y-16">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-24">
                <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}>
                    <div className="flex items-center gap-3 mb-4">
                        <LifeBuoy className="text-indigo-500" size={20} />
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Nexus</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter uppercase italic leading-tight">
                        Support <span className="text-indigo-500">Center.</span>
                    </h1>
                </motion.div>
                
                <div className="relative group w-full md:w-96">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search collective knowledge..." 
                        className="w-full pl-16 pr-6 py-4 bg-[#020617] border border-white/[0.05] rounded-[1.5rem] text-[13px] text-white focus:outline-none focus:border-indigo-500/30 transition-all placeholder-slate-800 font-medium"
                    />
                </div>
            </header>

            {/* Resource Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {resources.map((res, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[#0f172a]/20 backdrop-blur-3xl border border-white/[0.03] rounded-[3rem] p-12 hover:border-indigo-500/20 transition-all group overflow-hidden"
                    >
                         <div className={`p-6 rounded-3xl bg-white/[0.03] border border-white/[0.05] ${res.color} mb-10 w-fit group-hover:bg-white group-hover:text-[#020617] transition-all duration-500 shadow-xl`}>
                            <res.icon size={32} />
                        </div>
                        <h3 className="text-2xl font-black text-white tracking-tighter uppercase mb-3 leading-tight transition-colors group-hover:text-indigo-400">{res.title}</h3>
                        <p className="text-[13px] text-slate-500 font-medium italic leading-relaxed mb-10">"{res.description}"</p>
                        <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest text-indigo-400 group-hover:text-white transition-colors">
                            {res.link} <ChevronRight size={14} />
                        </button>
                    </motion.div>
                ))}
            </div>

            {/* FAQs / Community Section */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-12">
                <div className="xl:col-span-2 space-y-8">
                    <h3 className="text-xl font-black text-white uppercase tracking-[0.2em] px-4 border-l-4 border-indigo-600">Common Query Logs</h3>
                    <div className="space-y-4">
                        {[
                            { q: 'Initializing first neural shard?', a: 'Direct the engine to your target endpoint. Collective heuristic mapping begins autonomously upon ingestion.' },
                            { q: 'Securing API shunts?', a: 'Parameters for key rotation and OAuth2 shrouding are located within the Sentinel Settings panel.' },
                            { q: 'Recursive healing threshold?', a: 'By default, healing kicks in after 2ms of instability. This can be tuned in parameters.' },
                        ].map((faq, i) => (
                            <div key={i} className="p-10 bg-white/[0.01] border border-white/[0.03] rounded-[2.5rem] hover:bg-white/[0.03] transition-all group">
                                <div className="flex gap-6">
                                     <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mt-1">Q_LOG:</div>
                                     <div className="flex-1">
                                         <h4 className="text-lg font-black text-white tracking-tight uppercase mb-4 group-hover:text-indigo-400 transition-colors">{faq.q}</h4>
                                         <p className="text-xs text-slate-500 leading-relaxed font-medium italic">"{faq.a}"</p>
                                     </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="space-y-8">
                    <div className="bg-gradient-to-br from-indigo-600/10 to-transparent border border-indigo-500/20 rounded-[3rem] p-12 group overflow-hidden">
                        <div className="flex items-center justify-between mb-10">
                            <Sparkles className="text-indigo-500" size={32} fill="currentColor" />
                            <div className="px-3 py-1 bg-indigo-500 text-[#020617] text-[8px] font-black uppercase tracking-widest rounded-md">LIVE HUD</div>
                        </div>
                        <h4 className="text-2xl font-black text-white tracking-tighter uppercase mb-4 leading-tight">Human Coordinator</h4>
                        <p className="text-[13px] text-slate-500 font-medium leading-relaxed italic mb-10">
                            Direct downlink to our sentient support coordinators for high-priority protocol resolution.
                        </p>
                        <button className="w-full py-5 bg-white text-[#020617] rounded-2xl font-black text-xs uppercase tracking-widest hover:shadow-2xl transition-all">
                            Initialize Uplink
                        </button>
                    </div>

                    <div className="p-12 bg-[#020617] border border-white/5 rounded-[3rem] space-y-8">
                        <div className="text-[10px] font-black text-white uppercase tracking-[0.3em]">System Entropy</div>
                        <div className="space-y-6">
                            {[
                                { label: 'Node Clusters', value: 'Steady' },
                                { label: 'Shard Latency', value: '4ms' },
                                { label: 'Uplink Health', value: '100%' },
                            ].map((stat, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <span className="text-[11px] font-bold text-slate-600 uppercase tracking-widest">{stat.label}</span>
                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{stat.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Help;
