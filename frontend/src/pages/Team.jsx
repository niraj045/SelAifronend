import { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Mail, UserPlus, MoreVertical, Shield } from 'lucide-react';

export default function Team() {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('VIEWER');

  const members = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'OWNER', status: 'Active' },
    { id: 2, name: 'Alice Smith', email: 'alice@example.com', role: 'ADMIN', status: 'Active' },
    { id: 3, name: 'Bob Jones', email: 'bob@example.com', role: 'QA', status: 'Active' },
  ];

  const pending = [
    { id: 4, email: 'sarah@example.com', role: 'VIEWER', sentAt: '2 days ago' }
  ];

  const handleInvite = (e) => {
    e.preventDefault();
    if (!email) return;
    alert(`Mock invite sent to ${email} as ${role}`);
    setEmail('');
  };

  const getRoleColor = (r) => {
    switch(r) {
      case 'OWNER': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'ADMIN': return 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20';
      case 'QA': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
      default: return 'text-slate-400 bg-slate-500/10 border-slate-500/20';
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-2 mb-1">
          <Users size={16} className="text-indigo-400" />
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Workspace</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
          Team <span className="text-indigo-400">Members</span>
        </h1>
        <p className="text-sm text-slate-400 mt-2">Manage who has access to your QA projects and reports.</p>
      </motion.header>

      {/* Invite form */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl p-6"
      >
        <h2 className="text-sm font-black text-white mb-4">Invite Team Member</h2>
        <form onSubmit={handleInvite} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="Email address"
              className="w-full pl-11 pr-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 transition-all"
              required
            />
          </div>
          <select
            value={role}
            onChange={e => setRole(e.target.value)}
            className="px-4 py-3 bg-white/[0.03] border border-white/[0.06] rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all cursor-pointer appearance-none min-w-[140px]"
          >
            <option value="VIEWER">Viewer</option>
            <option value="QA">QA Tester</option>
            <option value="ADMIN">Admin</option>
          </select>
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={16} /> Invite
          </button>
        </form>
      </motion.div>

      {/* Members List */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden"
      >
        <div className="p-6 border-b border-white/[0.05] flex items-center justify-between">
          <h2 className="text-sm font-black text-white">Active Members</h2>
          <span className="text-xs text-slate-500">{members.length} users</span>
        </div>
        <div className="divide-y divide-white/[0.03]">
          {members.map(member => (
            <div key={member.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black text-xs shadow-lg shadow-indigo-500/20 flex-shrink-0">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <div className="text-sm font-bold text-white">{member.name}</div>
                  <div className="text-xs text-slate-500">{member.email}</div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider hidden sm:block ${getRoleColor(member.role)}`}>
                  {member.role}
                </span>
                <button className="p-2 text-slate-500 hover:text-white rounded-lg transition-colors">
                  <MoreVertical size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Pending Invites */}
      {pending.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#0f172a]/40 backdrop-blur-xl border border-white/[0.05] rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-white/[0.05]">
            <h2 className="text-sm font-black text-white">Pending Invites</h2>
          </div>
          <div className="divide-y divide-white/[0.03]">
            {pending.map(p => (
              <div key={p.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 flex-shrink-0">
                    <Mail size={16} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{p.email}</div>
                    <div className="text-xs text-slate-500">Invited {p.sentAt}</div>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <span className={`px-2.5 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider hidden sm:block ${getRoleColor(p.role)}`}>
                    {p.role}
                  </span>
                  <button className="text-xs text-rose-400 hover:text-rose-300 font-semibold transition-colors">
                    Revoke
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
