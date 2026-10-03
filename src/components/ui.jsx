import { AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { getPriorityColor } from "../utils/helpers.js";

export const PageHeader = ({ title, sub, action }) => (
  <div className="page-header">
    <div className="panel-header" style={{ marginBottom: 0, alignItems: "center" }}>
      <div>
        <div className="page-title">{title}</div>
        {sub && <div className="page-subtitle">{sub}</div>}
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
  </div>
);

export const SectionLabel = ({ label }) => (
  <div className="section-title">{label}</div>
);

export const FormLabel = ({ text, required }) => (
  <label className="field-label">
    {text}{required ? <span style={{ color: "var(--danger)", marginLeft: 4 }}>*</span> : ""}
  </label>
);

export const PriorityBadge = ({ priority, label }) => (
  <span className={`status-badge status-${priority}`} style={{ color: getPriorityColor(priority) }}>
    {priority === "critical" ? <AlertCircle size={13} /> : <Clock size={13} />}
    <span style={{ textTransform: "capitalize" }}>{label || priority}</span>
  </span>
);

export const StatusBadge = ({ status }) => {
  const label = {
    pending_review: "Pending review",
    approved: "Approved",
    rejected: "Rejected",
    resolved: "Resolved",
  }[status] || status?.replaceAll("_", " ") || "Unknown";

  const tone = status === "approved" ? "approved" : status === "rejected" ? "rejected" : "pending";

  return (
    <span className={`status-badge status-${tone}`}>
      {tone === "approved" ? <CheckCircle2 size={13} /> : <Clock size={13} />}
      <span>{label}</span>
    </span>
  );
};

export const MiniProgressBar = ({ pct, color }) => (
  <div style={{ height: 8, background: "#e2e8f0", borderRadius: 999, overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", background: color || "var(--primary-light)", borderRadius: 999 }} />
  </div>
);

export const PulsingDot = () => (
  <span 
    style={{ 
      width: 10, 
      height: 10, 
      borderRadius: 999, 
      background: "var(--success)", 
      display: "inline-block",
      boxShadow: "0 0 0 3px var(--success-light)"
    }} 
  />
);

export const EmptyState = ({ icon, title, children }) => (
  <div className="panel" style={{ textAlign: "center", padding: "54px 24px", display: "grid", placeItems: "center", gap: 12 }}>
    <div style={{ display: "flex", justifyContent: "center", color: "var(--muted)", background: "var(--bg)", width: 72, height: 72, borderRadius: 999, alignItems: "center", boxShadow: "var(--shadow)" }}>
      {icon}
    </div>
    <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", fontFamily: "'Outfit', sans-serif" }}>{title}</div>
    {children && <div style={{ marginTop: 6 }}>{children}</div>}
  </div>
);

export const AshokaChakraLoader = ({ message }) => {
  return (
    <div className="chakra-container" style={{ padding: "64px 20px" }}>
      <div className="chakra-wheel">
        <div className="chakra-spokes">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="chakra-spoke"
              style={{ transform: `rotate(${i * 15}deg)` }}
            />
          ))}
        </div>
      </div>
      <div 
        className="brand-title" 
        style={{ 
          color: "#1e3a8a", 
          background: "none", 
          WebkitTextFillColor: "initial", 
          fontWeight: 800, 
          fontSize: 22,
          marginTop: 12
        }}
      >
        FixItBharat
      </div>
      <div className="page-subtitle" style={{ fontSize: 14, fontWeight: 500, color: "var(--muted)" }}>
        {message || "Loading civic workspace..."}
      </div>
    </div>
  );
};

export const Toast = ({ toast }) => {
  if (!toast) return null;
  const isError = toast.icon?.toLowerCase().includes("error");
  const isSuccess = ["submitted", "supported", "resolved", "updated", "success", "matched", "verified"].includes(toast.icon?.toLowerCase());
  const toastClass = isError ? "toast toast-error" : isSuccess ? "toast toast-success" : "toast";
  return (
    <div className={toastClass}>
      <strong>{toast.icon}</strong>
      <span>{toast.text}</span>
    </div>
  );
};
