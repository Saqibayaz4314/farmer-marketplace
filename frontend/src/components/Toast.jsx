import React, { useState, useEffect, useCallback, useMemo, createContext, useContext } from "react";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle, FaTimes } from "react-icons/fa";

// Toast Context
const ToastContext = createContext(null);

// Toast types config
const TOAST_CONFIG = {
  success: {
    icon: FaCheckCircle,
    bg: "bg-gradient-to-r from-green-500 to-emerald-600",
    border: "border-green-400",
    iconColor: "text-white",
  },
  error: {
    icon: FaExclamationCircle,
    bg: "bg-gradient-to-r from-red-500 to-rose-600",
    border: "border-red-400",
    iconColor: "text-white",
  },
  warning: {
    icon: FaExclamationTriangle,
    bg: "bg-gradient-to-r from-amber-500 to-orange-500",
    border: "border-amber-400",
    iconColor: "text-white",
  },
  info: {
    icon: FaInfoCircle,
    bg: "bg-gradient-to-r from-blue-500 to-indigo-600",
    border: "border-blue-400",
    iconColor: "text-white",
  },
};

// Individual Toast
const ToastItem = ({ toast, onRemove }) => {
  const [isExiting, setIsExiting] = useState(false);
  const config = TOAST_CONFIG[toast.type] || TOAST_CONFIG.info;
  const Icon = config.icon;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onRemove(toast.id), 300);
    }, toast.duration || 3500);
    return () => clearTimeout(timer);
  }, [toast, onRemove]);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => onRemove(toast.id), 300);
  };

  return (
    <div
      className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl border ${config.bg} ${config.border} text-white min-w-[300px] max-w-[420px] backdrop-blur-sm transition-all duration-300 ${
        isExiting
          ? "opacity-0 translate-x-[100px] scale-95"
          : "opacity-100 translate-x-0 scale-100"
      }`}
      style={{
        animation: !isExiting ? "toastSlideIn 0.4s cubic-bezier(0.21, 1.02, 0.73, 1)" : undefined,
      }}
    >
      <div className="flex-shrink-0">
        <Icon className={`text-xl ${config.iconColor} drop-shadow-sm`} />
      </div>
      <p className="flex-1 text-sm font-medium leading-snug">{toast.message}</p>
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-lg hover:bg-white/20 transition-colors"
      >
        <FaTimes className="text-xs opacity-80" />
      </button>
    </div>
  );
};

// Toast Container (renders all toasts)
export const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <>
      {/* CSS Animation */}
      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translateX(100px) scale(0.9);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }
      `}</style>

      {/* Toast Stack */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-3 pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <ToastItem toast={toast} onRemove={removeToast} />
          </div>
        ))}
      </div>
    </>
  );
};

// Toast Provider
export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 3500) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type, duration }]);
  }, []);

  const toast = useMemo(() => ({
    success: (msg, dur) => addToast(msg, "success", dur),
    error: (msg, dur) => addToast(msg, "error", dur),
    warning: (msg, dur) => addToast(msg, "warning", dur),
    info: (msg, dur) => addToast(msg, "info", dur),
  }), [addToast]);

  // Fix: useCallback cannot be used with object literal, use useMemo pattern
  const value = { toasts, removeToast, toast };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

// Hook
export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastProvider;
