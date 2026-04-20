import { useState, useEffect } from "react";
import api from "../lib/api";
import NoticeCard from "../components/NoticeCard";
import LoadingSkeleton from "../components/LoadingSkeleton";
import EmptyState from "../components/EmptyState";
import { Bookmark } from "lucide-react";
import { motion } from "framer-motion";

const Bookmarks = () => {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/bookmarks");
      setBookmarks(data.bookmarks);
    } catch (err) {
      console.error("Failed to load bookmarks", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkChange = (noticeId, isBookmarked) => {
    if (!isBookmarked) {
      setBookmarks((prev) => prev.filter((b) => b.notice_id !== noticeId && b.id !== noticeId));
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
      className="space-y-12 max-w-7xl mx-auto"
    >
      <div className="flex items-center gap-4 border-b border-white/10 pb-8">
        <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-primary-500/20 to-blue-500/20 border border-primary-500/30 flex items-center justify-center p-[2px]">
          <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center">
            <Bookmark className="w-7 h-7 text-primary-400" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight leading-tight">
            Saved Notices
          </h1>
          <p className="text-zinc-500 font-medium text-lg mt-1">
            Opportunities you've bookmarked for later.
          </p>
        </div>
      </div>

      {loading ? (
        <LoadingSkeleton count={3} />
      ) : bookmarks.length === 0 ? (
        <EmptyState message="You haven't bookmarked any notices yet. Browse the feed to find interesting opportunities!" />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {bookmarks.map((notice, i) => (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
              key={notice.id}
            >
              <NoticeCard 
                notice={notice} 
                isBookmarked={true}
                onBookmarkChange={handleBookmarkChange}
              />
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default Bookmarks;
