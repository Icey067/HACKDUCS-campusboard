/**
 * AuthContext — manages user authentication state across the app.
 * Handles login, logout, and token persistence.
 */
import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const token = localStorage.getItem("campusboard_token");
    if (token) {
      fetchUser();
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUser = async () => {
    try {
      const { data } = await api.get("/auth/me");
      setUser(data.user);
    } catch {
      localStorage.removeItem("campusboard_token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = (token) => {
    localStorage.setItem("campusboard_token", token);
    fetchUser();
  };

  const loginWithGoogle = () => {
    const apiBase = import.meta.env.VITE_API_URL || "";
    window.location.href = `${apiBase}/api/auth/google`;
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch {
      // Ignore errors
    }
    localStorage.removeItem("campusboard_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        loginWithToken,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
