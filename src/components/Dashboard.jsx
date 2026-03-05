import { PTYPES, MINS, STAGES } from "../constants.js";
import { getPriority, getPriorityColor, getPct, getEtaDays } from "../utils/helpers.js";
import { PageHeader, SectionLabel, PriorityBadge, MiniProgressBar, PulsingDot } from "./ui.jsx";

export default function Dashboard({ issues, setSection, currentUser }) {
  const total    = issues.length;
  const resolved = issues.filter((i) => i.stage >= 6).length;
  const critical = issues.filter((i) => getPriority(i.votes) === "critical").length;
  const inProg   = issues.filter((i) => i.stage === 5).length;
  const mine     = issues.filter((i) => i.by === currentUser).length;

  const stats = [
    { label: "Total Issues",  value: total,    icon: "📋", border: "#FF6B00", bg: "#FFF3E8" },
    { label: "Critical",      value: critical,  icon: "🔥", border: "#DC2626", bg: "#FEF2F2" },
    { label: "In Progress",   value: inProg,    icon: "🔧", border: "#000080", bg: "#EEF2FF" },
    { label: "Resolved",      value: resolved,  icon: "✅", border: "#138808", bg: "#e8f5e9" },
    { label: "My Reports",    value: mine,      icon: "👤", border: "#7C3AED", bg: "#FAF5FF" },
  ];

  // Ministry summary
  const ministryMap = {};
  issues.forEach((i) => {
    const m = MINS[i.type];
    if (!m) return;
    ministryMap[m.name] = ministryMap[m.name] || { ...m, count: 0 };
    ministryMap[m.name].count++;
  });

  return (
    <div>
      <PageHeader title="📊 Overview Dashboard" sub="Real-time civic issue tracking — live across all citizens" />

      {/* Stats row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 12, marginBottom: 26 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "16px 18px", boxShadow: "0 4px 20px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 12, borderTop: `3px solid ${s.border}` }}>
            <div style={{ width: 42, height: 42, borderRadius: 12, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 2, fontWeight: 500 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Top issues */}
        <div>
          <SectionLabel label="🔥 Top Priority Issues" />
          {[...issues].sort((a, b) => b.votes - a.votes).slice(0, 3).map((iss) => {
            const p = getPriority(iss.votes);
            const t = PTYPES.find((x) => x.id === iss.type);
            const e = getEtaDays(iss.votes, iss.stage);
            return (
              <div key={iss.id} style={{ background: "#fff", borderRadius: 14, padding: "15px 17px", boxShadow: "0 3px 16px rgba(0,0,0,.06)", marginBottom: 12, borderLeft: `4px solid ${getPriorityColor(p)}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ fontWeight: 700, fontSize: 13, flex: 1 }}>{t?.icon} {iss.title}</div>
                  <PriorityBadge priority={p} />
                </div>
                <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 4 }}>
                  📍 {iss.loc} · 👍 {iss.votes} votes · {STAGES[iss.stage]?.name}
                </div>
                <MiniProgressBar pct={getPct(iss.stage)} color={getPriorityColor(p)} />
                <div style={{ display: "inline-flex", alignItems: "center", gap: 3, padding: "3px 9px", background: "#FFF7ED", color: "#FF6B00", borderRadius: 50, fontSize: 10, fontWeight: 700, marginTop: 7 }}>
                  ⏱️ ~{e} day{e !== 1 ? "s" : ""} remaining
                </div>
              </div>
            );
          })}
          <button onClick={() => setSection("report")}
            style={{ width: "100%", padding: 11, border: "2px dashed #FF6B00", borderRadius: 12, background: "#FFF3E8", color: "#FF6B00", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
            + Report a New Issue
          </button>
        </div>

        {/* Ministry summary */}
        <div>
          <SectionLabel label="🏛️ Ministry Notifications" />
          {Object.entries(ministryMap).map(([name, data]) => (
            <div key={name} style={{ padding: "11px 13px", background: data.bg, borderRadius: 12, marginBottom: 10, display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 20 }}>{data.icon}</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 12, color: data.ac }}>{name.replace("Ministry of ", "")}</div>
                <div style={{ fontSize: 10, color: "#ADB5BD" }}>{data.count} issue{data.count !== 1 ? "s" : ""} assigned</div>
              </div>
              <PulsingDot />
            </div>
          ))}
        </div>
      </div>

      {/* Recent activity */}
      <SectionLabel label="📈 Recent Activity" />
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {[...issues].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 6).map((iss) => {
          const t = PTYPES.find((x) => x.id === iss.type);
          const p = getPriority(iss.votes);
          return (
            <div key={iss.id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "11px 15px", background: "#fff", borderRadius: 12, boxShadow: "0 2px 10px rgba(0,0,0,.05)" }}>
              <div style={{ width: 34, height: 34, background: "#F1F3F5", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{t?.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{iss.title}</div>
                <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 1 }}>📍 {iss.loc} · {iss.date} · by {iss.by.slice(0, 4)} ****</div>
              </div>
              <PriorityBadge priority={p} label={STAGES[iss.stage]?.name} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
