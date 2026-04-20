import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/api";
import toast from "react-hot-toast";
import { Send, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

const PostNotice = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    college: "",
    domain: "notice",
    deadline: "",
    apply_link: "",
    description: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = { ...formData };
      if (!submitData.deadline) {
        delete submitData.deadline;
      }

      await api.post("/notices", submitData);
      toast.success("Notice posted successfully! 🚀");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post notice.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.4 }}
      className="max-w-3xl mx-auto py-8"
    >
      <div className="glass-panel bg-zinc-900/80 rounded-[2rem] p-8 md:p-12 border border-white/10 shadow-2xl relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 pointer-events-none"></div>

        <div className="mb-10 relative z-10">
          <h1 className="text-4xl md:text-5xl font-black font-display text-white tracking-tight mb-3">
            Post an <span className="text-gradient">Opportunity</span>
          </h1>
          <p className="text-zinc-400 font-medium text-lg">
            Publish a new notice, hackathon, or internship to the platform.
          </p>
        </div>

        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-5 mb-10 flex items-start gap-4 text-amber-500 relative z-10 backdrop-blur-sm">
          <AlertCircle className="w-6 h-6 shrink-0 mt-0.5" />
          <p className="text-sm font-medium leading-relaxed">
            You are posting as an Administrator. Please ensure all details are accurate, as notices are immediately live upon submission.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
          <div className="space-y-6">
            {/* Title */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Notice Title <span className="text-rose-500">*</span>
              </label>
              <input
                required
                type="text"
                name="title"
                placeholder="e.g. HackDUCS 2026 - Hackathon"
                value={formData.title}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all font-medium text-lg hover:border-white/20"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* College */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Institution <span className="text-rose-500">*</span>
                </label>
                <input
                  required
                  type="text"
                  name="college"
                  placeholder="e.g. Delhi University"
                  value={formData.college}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-transparent transition-all font-medium hover:border-white/20"
                />
              </div>

              {/* Domain */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Domain Tag <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  name="domain"
                  value={formData.domain}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium appearance-none cursor-pointer hover:border-white/20"
                >
                  <option value="notice">📢 General Notice</option>
                  <option value="internship">💼 Internship</option>
                  <option value="fest">🎉 Fest</option>
                  <option value="hackathon">💻 Hackathon</option>
                  <option value="research">🔬 Research</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Deadline */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Deadline <span className="lowercase text-zinc-600 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="date"
                  name="deadline"
                  value={formData.deadline}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium cursor-text hover:border-white/20"
                  style={{ colorScheme: 'dark' }}
                />
              </div>

              {/* Apply Link */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                  Apply/Source Link <span className="lowercase text-zinc-600 font-normal ml-1">(Optional)</span>
                </label>
                <input
                  type="url"
                  name="apply_link"
                  placeholder="https://..."
                  value={formData.apply_link}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium hover:border-white/20"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest text-zinc-500 mb-2">
                Description
              </label>
              <textarea
                name="description"
                rows="5"
                placeholder="Give details about the event, requirements, rewards..."
                value={formData.description}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-zinc-950 border border-white/10 text-white placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-primary-500/50 transition-all font-medium resize-none hover:border-white/20 leading-relaxed"
              ></textarea>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-white/5">
            <button
              type="submit"
              disabled={loading}
              className={`flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-primary-600 to-blue-600 text-white text-base font-bold shadow-[0_0_20px_rgba(124,58,237,0.4)] transition-all duration-300 ${
                loading ? "opacity-75 cursor-not-allowed" : "hover:scale-105 active:scale-95 hover:shadow-[0_0_30px_rgba(124,58,237,0.6)]"
              }`}
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Send className="w-5 h-5" />
              )}
              {loading ? "Publishing..." : "Submit Opportunity"}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default PostNotice;
