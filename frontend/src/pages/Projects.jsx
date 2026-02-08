import { motion, useInView } from 'framer-motion';
import { Plus, Search, Filter, Grid, List, Folder, ArrowRight } from 'lucide-react';
import { useRef } from 'react';

const Projects = () => {
    const projects = [
        { id: 1, name: 'E-Commerce Website', url: 'https://shop.example.com', tests: 42, lastRun: '2h ago', status: 'passing' },
        { id: 2, name: 'Marketing Site', url: 'https://marketing.example.com', tests: 18, lastRun: '5h ago', status: 'passing' },
        { id: 3, name: 'Admin Dashboard', url: 'https://admin.example.com', tests: 67, lastRun: '1d ago', status: 'failing' },
    ];

    return (
        <div className="space-y-12">
            {/* Hero Section */}
            <ScrollReveal>
                <div className="text-center space-y-6">
                    <motion.h1 
                        className="text-6xl md:text-7xl font-black tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {["Your", "Projects"].map((word, idx) => (
                            <motion.span
                                key={idx}
                                className={idx === 0 ? "block text-white" : "block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"}
                                initial={{ y: 50, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                            >
                                {word}
                            </motion.span>
                        ))}
                    </motion.h1>
                    <motion.p 
                        className="text-xl text-gray-400 max-w-2xl mx-auto"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                    >
                        Manage and monitor all your testing projects
                    </motion.p>
                </div>
            </ScrollReveal>

            {/* Actions Bar */}
            <ScrollReveal delay={0.2}>
                <div className="flex flex-col md:flex-row items-center gap-4">
                    <div className="flex-1 w-full relative group">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-0 group-hover:opacity-30 transition duration-500" />
                        <div className="relative flex items-center bg-white/5 backdrop-blur-xl border border-white/20 rounded-2xl px-6 py-4">
                            <Search className="text-gray-400 mr-3" size={20} />
                            <input 
                                type="text"
                                placeholder="Search projects..."
                                className="flex-1 bg-transparent border-none text-white placeholder-gray-500 focus:outline-none text-lg"
                            />
                        </div>
                    </div>
                    
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative"
                    >
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl blur opacity-60 group-hover:opacity-100 transition duration-500" />
                        <div className="relative px-6 py-4 bg-black rounded-2xl flex items-center gap-3 border border-white/20">
                            <Plus size={20} />
                            <span className="font-bold">New Project</span>
                        </div>
                    </motion.button>
                </div>
            </ScrollReveal>

            {/* Projects Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project, idx) => (
                    <ScrollReveal key={project.id} delay={idx * 0.1}>
                        <ProjectCard project={project} />
                    </ScrollReveal>
                ))}
            </div>
        </div>
    );
};

// Scroll Reveal Component
const ScrollReveal = ({ children, delay = 0 }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: 0.3 });
    
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 60 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
        >
            {children}
        </motion.div>
    );
};

// Project Card with Fantasy.co Style
const ProjectCard = ({ project }) => {
    return (
        <motion.div
            whileHover={{ y: -12 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="group relative h-full"
        >
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl opacity-0 group-hover:opacity-60 transition duration-500" />
            
            <div className="relative h-full bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-2xl border border-white/20 rounded-3xl p-8 overflow-hidden">
                <motion.div 
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)',
                        backgroundSize: '30px 30px'
                    }}
                />
                
                <div className="relative z-10 space-y-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                            <motion.div 
                                className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-white/10"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                            >
                                <Folder size={28} className="text-blue-400" />
                            </motion.div>
                            <div>
                                <h3 className="font-black text-xl text-white mb-1">{project.name}</h3>
                                <p className="text-xs text-gray-400 truncate max-w-[200px]">{project.url}</p>
                            </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            project.status === 'passing' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-red-500/20 text-red-400 border border-red-500/30'
                        }`}>
                            {project.status}
                        </span>
                    </div>

                    <div className="flex items-center justify-between text-sm pt-4 border-t border-white/10">
                        <span className="text-gray-400">{project.tests} tests</span>
                        <span className="text-gray-400">Last run {project.lastRun}</span>
                    </div>

                    <motion.div
                        whileHover={{ x: 4 }}
                        className="flex items-center gap-2 text-blue-400 font-semibold cursor-pointer"
                    >
                        <span>View Details</span>
                        <ArrowRight size={16} />
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
};

export default Projects;
