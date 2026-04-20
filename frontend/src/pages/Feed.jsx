import { useState, useEffect, useCallback } from "react";
import api from "../lib/api";
import NoticeCard from "../components/NoticeCard";
import FilterBar from "../components/FilterBar";
import StatsBar from "../components/StatsBar";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

const Feed = () => {
  const { isAuthenticated } = useAuth();
  const [notices, setNotices] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filters, setFilters] = useState({
    domain: "",
    college: "",
    search: "",
    deadline: "",
    sort: "newest",
  });

  const fetchNotices = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/notices", { params: filters });
      setNotices(data.notices);
      
      if (isAuthenticated) {
        const bmData = await api.get("/bookmarks");
        const ids = new Set(bmData.data.bookmarks.map(b => b.notice_id || b.id));
        setBookmarkedIds(ids);
      }
    } catch (err) {
      setError("Failed to load notices. Please try again later.");
    } finally {
      setLoading(false);
    }
  }, [filters, isAuthenticated]);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  const handleFilterChange = (newFilters) => setFilters(newFilters);
  const handleDomainStatsClick = (domain) => setFilters(prev => ({ ...prev, domain }));
  const handleBookmarkChange = (noticeId, isBookmarked) => {
    setBookmarkedIds(prev => {
      const next = new Set(prev);
      if (isBookmarked) next.add(noticeId);
      else next.delete(noticeId);
      return next;
    });
  };

  return (
    <div className="space-y-10 relative mt-4 md:mt-10">
      {/* Hero Section Container */}
      <div className="text-center max-w-4xl mx-auto space-y-6">
        <div className="inline-block px-4 py-2 bg-primary-500/10 border border-primary-500/20 text-primary-300 text-sm font-bold tracking-wide uppercase rounded-full shadow-lg">
          🔥 Live Opportunities
        </div>
        
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-black text-white leading-tight">
          Launch Your <br className="hidden sm:block" />
          <span className="text-gradient">Career Engine</span>
        </h1>
        
        <p className="text-zinc-400 text-lg md:text-xl font-medium max-w-2xl mx-auto">
          The unified discovery platform for Indian college students. Explore the best internships, hackathons, and fests curated just for you.
        </p>
      </div>

      <div className="pt-4">
        <StatsBar notices={notices} onDomainClick={handleDomainStatsClick} />
      </div>
      
      <div className="pt-2">
        <FilterBar filters={filters} onFilterChange={handleFilterChange} />
      </div>

      <div className="min-h-[400px]">
        {error ? (
          <div className="glass-panel p-8 rounded-2xl text-center flex flex-col items-center border-rose-500/20 bg-rose-500/5">
            <h3 className="text-xl font-bold text-rose-400 mb-2">Oops!</h3>
            <p className="text-rose-300">{error}</p>
          </div>
        ) : loading ? (
          <LoadingSkeleton count={6} />
        ) : notices.length === 0 ? (
          <EmptyState onReset={() => handleFilterChange({ domain: "", college: "", search: "", deadline: "", sort: "newest" })} />
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {notices.map((notice, index) => (
              <motion.div
                key={notice.id}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <NoticeCard 
                  notice={notice} 
                  isBookmarked={bookmarkedIds.has(notice.id)}
                  onBookmarkChange={handleBookmarkChange}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Feed;
