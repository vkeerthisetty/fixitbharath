import { MINS } from "../constants.js";
import { getPriority } from "../utils/helpers.js";
import { PageHeader } from "./ui.jsx";

export default function Ministries({ issues }) {
  // Build ministry map from all issues
  const mm = {};
  Object.entries(MINS).forEach(([, m]) => {
    if (!mm[m.name]) mm[m.name] = { ...m, issues: [] };
  });
  issues.forEach((i) => {
    const m = MINS[i.type];
    if (m) mm[m.name].issues.push(i);
  });

  return (
    <div>
      <PageHeader title="🏛️ Ministry Dashboard" sub="Issue assignments & resolution rates by ministry" />

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
        {Object.entries(mm).map(([name, data]) => {
          const count    = data.issues.length;
          const resolved = data.issues.filter((i) => i.stage >= 6).length;
          const critical = data.issues.filter((i) => getPriority(i.votes) === "critical").length;
          const rate     = count > 0 ? Math.round((resolved / count) * 100) : 0;

          return (
            <div key={name} style={{ background: "#fff", borderRadius: 16, padding: 20, boxShadow: "0 4px 20px rgba(0,0,0,.06)" }}>
              {/* Header */}
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14, paddingBottom: 12, borderBottom: "1px solid #F1F3F5" }}>
                <div style={{ width: 44, height: 44, borderRadius: 10, background: data.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{data.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{name}</div>
                  <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 2 }}>{data.dept}</div>
                </div>
              </div>

              {/* Stats grid */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 14 }}>
                {[
                  { v: count,    l: "Total",    bg: "#F8F9FA", c: "#212529" },
                  { v: critical, l: "Critical",  bg: "#FEF2F2", c: "#DC2626" },
                  { v: resolved, l: "Resolved",  bg: "#e8f5e9", c: "#138808" },
                ].map((s) => (
                  <div key={s.l} style={{ textAlign: "center", padding: "10px 8px", background: s.bg, borderRadius: 8 }}>
                    <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 800, color: s.c }}>{s.v}</div>
                    <div style={{ fontSize: 10, color: "#ADB5BD" }}>{s.l}</div>
                  </div>
                ))}
              </div>

              {/* Resolution rate bar */}
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 5, display: "flex", justifyContent: "space-between" }}>
                <span>Resolution Rate</span>
                <span style={{ color: data.ac }}>{rate}%</span>
              </div>
              <div style={{ height: 8, background: "#F1F3F5", borderRadius: 50, overflow: "hidden" }}>
                <div style={{ height: "100%", width: `${rate}%`, background: data.ac, borderRadius: 50 }} />
              </div>

              {/* Notifications */}
              {count > 0
                ? <div style={{ marginTop: 10, fontSize: 12, fontWeight: 600, color: data.ac }}>📨 {count} notification{count !== 1 ? "s" : ""} dispatched</div>
                : <div style={{ marginTop: 10, fontSize: 12, color: "#ADB5BD" }}>No issues assigned yet</div>
              }
              {critical > 0 && (
                <div style={{ marginTop: 8, padding: "8px 12px", background: "#FEF2F2", borderRadius: 8, fontSize: 12, color: "#DC2626", fontWeight: 600 }}>
                  ⚠️ {critical} critical issue{critical !== 1 ? "s" : ""} need immediate action
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
