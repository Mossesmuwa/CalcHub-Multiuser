import { createContext, useContext, useState } from "react";
import { CheckIcon, AlertIcon, InfoIcon } from "../components/Icons";

const ToastContext = createContext();

const ICONS = { success: CheckIcon, error: AlertIcon, info: InfoIcon };

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  // action is optional: { label, onClick } - shows a button inside the toast, e.g. "Undo"
  function showToast(message, type = "info", action = null) {
    setToast({ message, type, action, key: Date.now() });
    setTimeout(() => setToast(null), action ? 5000 : 2600);
  }

  const Icon = toast ? ICONS[toast.type] : null;

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div className={`toast toast-${toast.type}`} key={toast.key}>
          <Icon size={16} />
          <span>{toast.message}</span>
          {toast.action && (
            <button
              className="toast-action"
              onClick={() => {
                toast.action.onClick();
                setToast(null);
              }}
            >
              {toast.action.label}
            </button>
          )}
        </div>
      )}
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}
