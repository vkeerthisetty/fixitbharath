import { getPriorityColor } from "../utils/helpers.js";

export const PageHeader = ({ title, sub }) => (
  <div style={{ marginBottom: 22 }}>
    <div style={{ fontFamily: "Georgia, serif", fontSize: 25, fontWeight: 800 }}>{title}</div>
    {sub && <div style={{ color: "#ADB5BD", fontSize: 13, marginTop: 4 }}>{sub}</div>}
  </div>
);

export const SectionLabel = ({ label }) => (
  <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#ADB5BD", marginBottom: 12, paddingBottom: 8, borderBottom: "1px solid #F1F3F5" }}>
    {label}
  </div>
);

export const FormLabel = ({ step, text }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
    <span style={{ width: 22, height: 22, background: "#FF6B00", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
      {step}
    </span>
    <label style={{ fontSize: 13, fontWeight: 700, color: "#495057" }}>{text}</label>
  </div>
);

export const PriorityBadge = ({ priority, label }) => {
  const bg = { critical: "#FEF2F2", high: "#FFF7ED", medium: "#FFFBEB", low: "#F0FDF4" }[priority];
  return (
    <span style={{ padding: "4px 11px", borderRadius: 50, fontSize: 11, fontWeight: 700, textTransform: "uppercase", background: bg, color: getPriorityColor(priority), flexShrink: 0, whiteSpace: "nowrap" }}>
      {label || priority}
    </span>
  );
};

export const MiniProgressBar = ({ pct, color }) => (
  <div style={{ marginTop: 8 }}>
    <div style={{ height: 6, background: "#F1F3F5", borderRadius: 50, overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: 50 }} />
    </div>
  </div>
);

export const PulsingDot = () => (
  <>
    <div style={{ width: 8, height: 8, background: "#DC2626", borderRadius: "50%", animation: "pulseDot 1.5s infinite", flexShrink: 0 }} />
    <style>{`@keyframes pulseDot{0%,100%{opacity:1}50%{opacity:.2}}`}</style>
  </>
);

export const EmptyState = ({ icon, title, children }) => (
  <div style={{ textAlign: "center", padding: "60px 20px", color: "#ADB5BD" }}>
    <div style={{ fontSize: 48, marginBottom: 12 }}>{icon}</div>
    <div style={{ fontSize: 16, fontWeight: 600, color: "#495057", marginBottom: 8 }}>{title}</div>
    {children}
  </div>
);

export const Toast = ({ toast }) => {
  if (!toast) return null;
  return (
    <>
      <div style={{ position: "fixed", top: 90, right: 22, background: "#fff", borderRadius: 10, padding: "13px 18px", boxShadow: "0 8px 40px rgba(0,0,0,.14)", borderLeft: "4px solid #138808", fontSize: 13, zIndex: 1000, display: "flex", alignItems: "center", gap: 10, maxWidth: 310, animation: "toastIn .3s ease" }}>
        <span style={{ fontSize: 18 }}>{toast.icon}</span>
        <span style={{ fontWeight: 500 }}>{toast.text}</span>
      </div>
      <style>{`@keyframes toastIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}`}</style>
    </>
  );
};
