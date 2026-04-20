import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  useEffect(() => {
    const token = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      toast.error("Authentication failed. Please try again.");
      navigate("/", { replace: true });
      return;
    }

    if (token) {
      loginWithToken(token);
      toast.success("Successfully logged in! 🎉");
      navigate("/", { replace: true });
    } else {
      navigate("/", { replace: true });
    }
  }, [searchParams, navigate, loginWithToken]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col flex-1 items-center justify-center py-32"
    >
      <div className="w-16 h-16 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin mb-6 shadow-[0_0_20px_rgba(124,58,237,0.5)]"></div>
      <h2 className="text-3xl font-black font-display text-white mb-2 tracking-tight">Authenticating...</h2>
      <p className="text-zinc-500 font-medium">Securing your session.</p>
    </motion.div>
  );
};

export default AuthCallback;
