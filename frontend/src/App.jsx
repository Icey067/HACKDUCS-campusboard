import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";

// Pages
import Feed from "./pages/Feed";
import Bookmarks from "./pages/Bookmarks";
import PostNotice from "./pages/PostNotice";
import AuthCallback from "./pages/AuthCallback";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/" replace />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user?.is_admin) return <Navigate to="/" replace />;
  return children;
}

function App() {
  const { loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center w-full">
        <div className="w-12 h-12 border-4 border-primary-500/20 border-t-primary-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col w-full">
      {/* Dynamic Background Mesh */}
      <div className="mesh-bg"></div>

      <Navbar />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mb-20 z-10 relative">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<Feed />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
          <Route path="/bookmarks" element={<ProtectedRoute><Bookmarks /></ProtectedRoute>} />
          <Route path="/post" element={<AdminRoute><PostNotice /></AdminRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
