import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GraduationCap, Bookmark, PlusCircle, LogIn, LogOut, Menu, X } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const { user, isAuthenticated, loginWithGoogle, logout } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { path: "/", label: "Feed", icon: GraduationCap },
    ...(isAuthenticated
      ? [
          { path: "/bookmarks", label: "Bookmarks", icon: Bookmark },
          { path: "/post", label: "Post Notice", icon: PlusCircle },
        ]
      : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-white/10 w-full transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-600 to-blue-500 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-display font-black text-white tracking-tight hidden sm:block">
              Campus<span className="text-primary-400">Board</span>
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  isActive(link.path)
                    ? "bg-primary-500/15 text-primary-300"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Auth Controls */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white font-bold text-sm shadow-md">
                    {user?.name?.charAt(0)?.toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-zinc-300">
                    {user?.name?.split(" ")[0]}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-rose-400/10 transition"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={loginWithGoogle}
                className="flex items-center gap-2 px-5 py-2.5 bg-white text-zinc-950 font-bold text-sm rounded-lg hover:bg-zinc-200 transition-all shadow-md active:scale-95"
              >
                <LogIn className="w-4 h-4" />
                Sign in
              </button>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 text-zinc-300 rounded-lg hover:bg-white/5 focus:outline-none"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-white/10 bg-zinc-900/95 backdrop-blur-xl"
          >
            <div className="px-4 py-6 space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${
                    isActive(link.path)
                      ? "bg-primary-500/15 text-primary-300"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </Link>
              ))}
              
              <div className="my-4 border-t border-white/5"></div>
              
              {isAuthenticated ? (
                <button
                  onClick={() => { logout(); setMobileOpen(false); }}
                  className="flex w-full items-center gap-3 px-4 py-3 rounded-xl font-medium text-rose-400 hover:bg-rose-400/10"
                >
                  <LogOut className="w-5 h-5" />
                  Logout
                </button>
              ) : (
                <button
                  onClick={() => { loginWithGoogle(); setMobileOpen(false); }}
                  className="flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl font-bold bg-primary-600 text-white"
                >
                  <LogIn className="w-5 h-5" />
                  Sign in with Google
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
