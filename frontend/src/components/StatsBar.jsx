import { Briefcase, PartyPopper, Code2, Microscope, Bell } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { label: "Internships", icon: Briefcase, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20", domain: "internship" },
  { label: "Fests", icon: PartyPopper, color: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/20", domain: "fest" },
  { label: "Hackathons", icon: Code2, color: "text-primary-400", bg: "bg-primary-500/10", border: "border-primary-500/20", domain: "hackathon" },
  { label: "Research", icon: Microscope, color: "text-sky-400", bg: "bg-sky-500/10", border: "border-sky-500/20", domain: "research" },
  { label: "Notices", icon: Bell, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20", domain: "notice" },
];

const StatsBar = ({ notices, onDomainClick }) => {
  const getCounts = (domain) => notices?.filter((n) => n.domain === domain).length || 0;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
      {stats.map((stat, i) => {
        const count = getCounts(stat.domain);
        return (
          <motion.button
            key={stat.domain}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            onClick={() => onDomainClick(stat.domain)}
            className={`group relative glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between items-start text-left border ${stat.border} hover:bg-zinc-800/80 transition-all cursor-pointer overflow-hidden`}
          >
            {/* Watermark Icon */}
            <stat.icon className={`absolute -right-4 -bottom-4 w-24 h-24 ${stat.color} opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-300`} />
            
            <div className={`p-2.5 rounded-xl ${stat.bg} mb-4`}>
              <stat.icon className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
            </div>
            
            <div className="relative z-10 w-full">
              <div className="text-3xl md:text-4xl font-display font-black text-white mb-1">
                {count}
              </div>
              <div className="text-xs md:text-sm font-bold uppercase tracking-wider text-zinc-400 group-hover:text-zinc-200 transition-colors">
                {stat.label}
              </div>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
};

export default StatsBar;
