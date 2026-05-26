import { motion } from 'framer-motion';
import { CreditCard, Check, Sparkles, Building, Zap } from 'lucide-react';

export default function Subscription() {
  const plans = [
    {
      name: 'Starter',
      price: '$49',
      interval: '/month',
      desc: 'Perfect for small teams getting started with automated QA.',
      features: ['Up to 5 Projects', '1,000 Test Runs/mo', 'Basic Reporting', 'Community Support'],
      icon: Zap,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      popular: false
    },
    {
      name: 'Growth',
      price: '$149',
      interval: '/month',
      desc: 'Advanced features for scaling QA operations.',
      features: ['Unlimited Projects', '10,000 Test Runs/mo', 'Advanced Analytics + PDF', 'Parallel Execution', 'Priority Support'],
      icon: Sparkles,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      interval: '',
      desc: 'Dedicated infrastructure and compliance for large organizations.',
      features: ['Unlimited Everything', 'Dedicated Cloud Clusters', 'SSO & Advanced Security', 'Custom Integrations', '24/7 SLA Support'],
      icon: Building,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      popular: false
    }
  ];

  return (
    <div className="p-6 md:p-8 max-w-[1600px] mx-auto">
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto mb-16 mt-8"
      >
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.2)]">
            <CreditCard size={24} className="text-indigo-400" />
          </div>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
          Simple, transparent <span className="text-indigo-400">pricing</span>
        </h1>
        <p className="text-slate-400 text-sm md:text-base">
          Choose the plan that best fits your team's needs. Upgrade or downgrade at any time.
        </p>
      </motion.header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative p-8 rounded-3xl border backdrop-blur-xl ${
              plan.popular 
                ? 'bg-[#0f172a]/60 border-indigo-500/50 shadow-2xl shadow-indigo-500/10 scale-100 md:scale-105 z-10' 
                : 'bg-[#0f172a]/30 border-white/[0.08] hover:border-white/20'
            } transition-all`}
          >
            {plan.popular && (
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-indigo-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-indigo-500/30">
                Most Popular
              </div>
            )}
            
            <div className={`w-12 h-12 rounded-xl mb-6 flex items-center justify-center border ${plan.bg} ${plan.color}`}>
              <plan.icon size={20} />
            </div>
            
            <h3 className="text-xl font-black text-white mb-2">{plan.name}</h3>
            <p className="text-xs text-slate-400 mb-6 h-10">{plan.desc}</p>
            
            <div className="mb-8">
              <span className="text-4xl font-black text-white tracking-tighter">{plan.price}</span>
              <span className="text-sm text-slate-500 font-medium">{plan.interval}</span>
            </div>

            <button className={`w-full py-3 rounded-xl text-sm font-bold transition-all mb-8 ${
              plan.popular 
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20' 
                : 'bg-white/[0.03] hover:bg-white/[0.08] text-white border border-white/[0.06]'
            }`}>
              {plan.name === 'Enterprise' ? 'Contact Sales' : 'Current Plan'}
            </button>

            <div className="space-y-4">
              <div className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">Includes</div>
              {plan.features.map(f => (
                <div key={f} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check size={12} className="text-emerald-400" />
                  </div>
                  <span className="text-sm text-slate-300 font-medium">{f}</span>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
