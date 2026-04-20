import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext.jsx";
import App from "./App.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: "#1e293b",
              color: "#e2e8f0",
              border: "1px solid rgba(99, 102, 241, 0.3)",
              borderRadius: "12px",
              fontSize: "14px",
            },
            success: {
              iconTheme: { primary: "#10b981", secondary: "#1e293b" },
            },
            error: {
              iconTheme: { primary: "#f43f5e", secondary: "#1e293b" },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
