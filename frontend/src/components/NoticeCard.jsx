import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Calendar, Building2, ExternalLink, Bookmark, BookmarkCheck, Clock, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

const NoticeCard = ({ notice, isBookmarked: initialBookmarked, onBookmarkChange }) => {
  const { isAuthenticated } = useAuth();
  const [bookmarked, setBookmarked] = useState(initialBookmarked || false);
  const [bookmarkLoading, setBookmarkLoading] = useState(false);

  const getDaysUntil = (deadline) => {
    if (!deadline) return null;
    const now = new Date();
    const dl = new Date(deadline);
    const diff = Math.ceil((dl - now) / (1000 * 60 * 60 * 24));
    return diff;
  };

  const daysLeft = getDaysUntil(notice.deadline);
  const isUrgent = daysLeft !== null && daysLeft <= 3 && daysLeft >= 0;
  const isPast = daysLeft !== null && daysLeft < 0;

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error("Sign in to bookmark notices");
      return;
    }

    setBookmarkLoading(true);
    try {
      const { data } = await api.post(`/bookmarks/${notice.id}`);
      setBookmarked(data.bookmarked);
      toast.success(data.bookmarked ? "Saved to Bookmarks! 🔖" : "Removed from Bookmarks");
      onBookmarkChange?.(notice.id, data.bookmarked);
    } catch {
      toast.error("Failed to update bookmark");
    } finally {
      setBookmarkLoading(false);
    }
  };

  const domainLabels = {
    internship: "Internship",
    fest: "Fest",
    hackathon: "Hackathon",
    research: "Research",
    notice: "Notice",
  };

  // Provide an icon for visually distinguishing card type based on domains
  let bgGradient = "from-zinc-900 to-zinc-950";
  if (notice.domain === 'hackathon') bgGradient = "from-primary-900/20 to-zinc-900";
  if (notice.domain === 'fest') bgGradient = "from-rose-900/20 to-zinc-900";
  if (notice.domain === 'internship') bgGradient = "from-emerald-900/20 to-zinc-900";

  return (
    <motion.div 
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className={`group relative glass-panel rounded-3xl p-6 bg-gradient-to-b ${bgGradient} overflow-hidden flex flex-col h-full border border-white/5 hover:border-white/20 transition-colors duration-500`}
    >
      {/* ── Subtle glow on hover ── */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-tr from-primary-500/5 via-transparent to-primary-400/10 pointer-events-none transition-opacity duration-500" />
      
      {/* ── Header: Domain tag + Bookmark ── */}
      <div className="flex items-start justify-between mb-5 relative z-10 shrink-0">
        <span className={`domain-tag ${notice.domain}`}>
          {domainLabels[notice.domain] || notice.domain}
        </span>

        <button
          onClick={handleBookmark}
          disabled={bookmarkLoading}
          className={`p-2.5 rounded-full backdrop-blur-md transition-all duration-300 ${
            bookmarked
              ? "text-primary-400 bg-primary-500/20 ring-1 ring-primary-500/30"
              : "text-zinc-500 bg-zinc-800/50 hover:bg-zinc-700/50 hover:text-white"
          } ${bookmarkLoading ? "opacity-50 cursor-not-allowed transform scale-90" : "hover:scale-110 active:scale-95"}`}
        >
          {bookmarked ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
        </button>
      </div>

      {/* ── Title ── */}
      <h3 className="text-xl font-display font-bold text-white mb-3 group-hover:text-primary-300 transition-colors duration-300 leading-snug line-clamp-2 relative z-10">
        {notice.title}
      </h3>

      {/* ── College ── */}
      <div className="flex items-center gap-2 text-zinc-400 font-medium text-sm mb-4 relative z-10 shrink-0">
        <Building2 className="w-4 h-4 shrink-0 text-zinc-500" />
        <span className="truncate">{notice.college}</span>
      </div>

      {/* ── Description ── */}
      <p className="text-zinc-500 text-sm leading-relaxed mb-6 line-clamp-3 relative z-10 grow">
        {notice.description}
      </p>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between pt-5 border-t border-white/10 shrink-0 mt-auto relative z-10">
        {notice.deadline ? (
          <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-black/20 ring-1 ring-white/5">
            {isUrgent && <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse shadow-[0_0_8px_rgba(244,63,94,0.8)]" />}
            {!isUrgent && <Calendar className="w-4 h-4 text-zinc-500" />}
            <div className="flex flex-col">
              <span className={`text-[11px] font-bold uppercase tracking-wider ${
                  isPast ? "text-zinc-600 line-through" : isUrgent ? "text-rose-400" : "text-zinc-400"
                }`}>
                {isPast ? "Ended" : daysLeft === 0 ? "Today" : daysLeft === 1 ? "Tomorrow" : `${daysLeft} Days`}
              </span>
              <span className="text-zinc-600 text-[10px] font-semibold">
                {new Date(notice.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "2-digit" })}
              </span>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-zinc-600 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black/20 ring-1 ring-white/5">
            <Clock className="w-4 h-4" />
            OPEN
          </div>
        )}

        {notice.apply_link && (
          <a
            href={notice.apply_link}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-primary-600 hover:bg-primary-500 text-white shadow-[0_0_15px_rgba(124,58,237,0.3)] hover:shadow-[0_0_20px_rgba(124,58,237,0.5)] transition-all duration-300 hover:scale-110 active:scale-95"
            title="Apply Now"
          >
            <ArrowUpRight className="w-5 h-5" />
          </a>
        )}
      </div>
    </motion.div>
  );
};

export default NoticeCard;
