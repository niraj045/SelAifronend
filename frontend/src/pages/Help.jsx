import { motion } from 'framer-motion';
import { Book, MessageCircle, Mail, FileText, Video, ExternalLink } from 'lucide-react';

const Help = () => {
    const resources = [
        {
            icon: Book,
            title: 'Documentation',
            description: 'Comprehensive guides and API references',
            link: 'View Docs',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: Video,
            title: 'Video Tutorials',
            description: 'Step-by-step video walkthroughs',
            link: 'Watch Now',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: MessageCircle,
            title: 'Community Forum',
            description: 'Connect with other SelAI users',
            link: 'Join Forum',
            color: 'from-green-500 to-emerald-500'
        },
        {
            icon: Mail,
            title: 'Email Support',
            description: 'Get help from our support team',
            link: 'Contact Us',
            color: 'from-orange-500 to-red-500'
        }
    ];

    const faqs = [
        {
            question: 'How do I create my first test?',
            answer: 'Simply enter your website URL in the dashboard, and our AI will automatically analyze your site and generate relevant test cases.'
        },
        {
            question: 'What browsers are supported?',
            answer: 'SelAI supports all major browsers including Chrome, Firefox, Safari, and Edge. You can configure your preferred browser in Settings.'
        },
        {
            question: 'How does AI test generation work?',
            answer: 'Our AI analyzes your website structure, user flows, and common patterns to automatically generate comprehensive test scenarios without manual scripting.'
        },
        {
            question: 'Can I integrate with CI/CD pipelines?',
            answer: 'Yes! SelAI provides integrations with Jenkins, GitHub Actions, GitLab CI, and other popular CI/CD tools. Check the Integrations section in Settings.'
        }
    ];

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div>
                <h1 className="text-3xl font-bold text-white">Help & Support</h1>
                <p className="text-gray-400 mt-1">Find answers and get assistance</p>
            </div>

            {/* Resource Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {resources.map((resource, idx) => {
                    const Icon = resource.icon;
                    return (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ y: -4 }}
                            className="group relative"
                        >
                            <div className={`absolute -inset-0.5 bg-gradient-to-r ${resource.color} rounded-xl blur opacity-20 group-hover:opacity-40 transition`} />
                            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 h-full flex flex-col">
                                <div className={`p-3 bg-gradient-to-r ${resource.color} rounded-lg w-fit mb-4`}>
                                    <Icon size={24} className="text-white" />
                                </div>
                                <h3 className="font-semibold text-white text-lg mb-2">{resource.title}</h3>
                                <p className="text-gray-400 text-sm mb-4 flex-1">{resource.description}</p>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex items-center gap-2 text-sm font-medium text-blue-400 hover:text-blue-300"
                                >
                                    {resource.link}
                                    <ExternalLink size={14} />
                                </motion.button>
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* FAQ Section */}
            <div>
                <h2 className="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, idx) => (
                        <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 + idx * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 hover:border-blue-500/50 transition-all"
                        >
                            <h3 className="font-semibold text-white text-lg mb-3 flex items-start gap-3">
                                <span className="text-blue-400 mt-1">Q:</span>
                                {faq.question}
                            </h3>
                            <p className="text-gray-400 pl-8">{faq.answer}</p>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Contact Support */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="relative group"
            >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-20 group-hover:opacity-40 transition" />
                <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-8 text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">Still need help?</h3>
                    <p className="text-gray-400 mb-6">Our support team is here to assist you</p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg font-semibold flex items-center gap-2 mx-auto"
                    >
                        <MessageCircle size={18} />
                        Start Live Chat
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
};

export default Help;
