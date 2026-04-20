import { Search, SlidersHorizontal, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const DOMAINS = [
  { value: "internship", label: "Internships", emoji: "💼" },
  { value: "fest", label: "Fests", emoji: "🎉" },
  { value: "hackathon", label: "Hackathons", emoji: "💻" },
  { value: "research", label: "Research", emoji: "🔬" },
  { value: "notice", label: "Notices", emoji: "📢" },
];

const DEADLINES = [
  { value: "", label: "Any Deadline" },
  { value: "upcoming", label: "Upcoming" },
  { value: "this_week", label: "This Week" },
  { value: "this_month", label: "This Month" },
];

const FilterBar = ({ filters, onFilterChange }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const handleChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFilterChange({
      domain: "",
      college: "",
      search: "",
      deadline: "",
      sort: "newest",
    });
  };

  const hasActiveFilters = filters.domain || filters.college || filters.search || filters.deadline;

  return (
    <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full relative z-20">
      {/* ── Search Bar ── */}
      <div className="relative group">
        <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-blue-600 rounded-2xl blur-lg opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
        <div className="relative glass-panel bg-zinc-900/80 rounded-2xl flex items-center p-2 border border-white/10 overflow-hidden">
          <div className="pl-4 pr-3 text-zinc-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Search for opportunities, colleges, names..."
            value={filters.search}
            onChange={(e) => handleChange("search", e.target.value)}
            className="w-full bg-transparent text-white font-medium placeholder:text-zinc-500 focus:outline-none py-3 text-sm md:text-base"
          />
          <div className="flex items-center gap-2 pr-2 shrink-0">
            {filters.search && (
              <button 
                onClick={() => handleChange("search", "")}
                className="p-2 text-zinc-500 hover:text-white rounded-xl hover:bg-white/5 transition-colors"
                title="Clear Search"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <div className="w-px h-8 bg-white/10 hidden sm:block"></div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                showAdvanced || filters.college || filters.deadline
                  ? "bg-white text-zinc-950 shadow-md"
                  : "bg-white/5 text-zinc-300 hover:bg-white/10"
              }`}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* ── Mobile Filter Toggle ── */}
      <button
        onClick={() => setShowAdvanced(!showAdvanced)}
        className="sm:hidden flex items-center justify-center gap-2 w-full py-3 rounded-2xl glass-panel text-sm font-semibold text-zinc-300"
      >
        <SlidersHorizontal className="w-4 h-4" />
        {showAdvanced ? "Hide Filters" : "Advanced Filters"}
      </button>

      {/* ── Advanced Filters Drawer ── */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="glass-panel rounded-3xl p-5 md:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-zinc-900/60 border border-white/5">
              
              {/* Domains list */}
              <div className="lg:col-span-3">
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-3">
                  Opportunity Type
                </label>
                <div className="flex flex-wrap gap-2.5">
                  <button
                    onClick={() => handleChange("domain", "")}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                      filters.domain === "" 
                        ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-2 ring-primary-500 ring-offset-2 ring-offset-zinc-900" 
                        : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 ring-1 ring-inset ring-white/5"
                    }`}
                  >
                    All Domains
                  </button>
                  {DOMAINS.map((d) => (
                    <button
                      key={d.value}
                      onClick={() => handleChange("domain", d.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                        filters.domain === d.value
                          ? "bg-primary-600 text-white shadow-lg shadow-primary-600/30 ring-2 ring-primary-500 ring-offset-2 ring-offset-zinc-900"
                          : "bg-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-700 ring-1 ring-inset ring-white/5"
                      }`}
                    >
                      <span>{d.emoji}</span>
                      {d.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* College */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  College Filter
                </label>
                <input
                  type="text"
                  placeholder="e.g. IITs, NITs, DU..."
                  value={filters.college}
                  onChange={(e) => handleChange("college", e.target.value)}
                  className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all"
                />
              </div>

              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Deadline
                </label>
                <div className="relative">
                  <select
                    value={filters.deadline}
                    onChange={(e) => handleChange("deadline", e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer transition-all"
                  >
                    {DEADLINES.map((d) => (
                      <option key={d.value} value={d.value}>{d.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Sort */}
              <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase tracking-widest mb-2">
                  Sort Order
                </label>
                <div className="relative">
                  <select
                    value={filters.sort}
                    onChange={(e) => handleChange("sort", e.target.value)}
                    className="w-full bg-zinc-950 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 appearance-none cursor-pointer transition-all"
                  >
                    <option value="newest">Newest Posted</option>
                    <option value="deadline">Deadline Closing Soon</option>
                  </select>
                </div>
              </div>

              {/* Reset Bottom Bar */}
              {hasActiveFilters && (
                <div className="lg:col-span-3 flex justify-end pt-4 mt-2 border-t border-white/5">
                  <button
                    onClick={clearFilters}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all border border-rose-500/10"
                  >
                    <X className="w-4 h-4" />
                    Reset All Filters
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FilterBar;
