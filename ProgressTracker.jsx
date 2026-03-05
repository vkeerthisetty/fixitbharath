import { STAGES } from "../constants.js";
import { getPct, getEtaDays, getPriorityColor, getPriority, daysAgoLabel } from "../utils/helpers.js";

export default function ProgressTracker({ issue }) {
  const priority = getPriority(issue.votes);
  const col = getPriorityColor(priority);
  const pc = getPct(issue.stage);
  const e = getEtaDays(issue.votes, issue.stage);
  const done = issue.stage >= 6;

  return (
    <div style={{ border: "1.5px solid #E9ECEF", borderRadius: 14, overflow: "hidden", marginTop: 14 }}>

      {/* ── Top bar ── */}
      <div style={{ padding: "11px 16px", background: "linear-gradient(to right,#F8F9FA,#fff)", borderBottom: "1px solid #F1F3F5", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: "#495057", letterSpacing: 0.5, textTransform: "uppercase" }}>
          📊 Resolution Progress
        </span>
        <span style={{ padding: "4px 11px", borderRadius: 50, fontSize: 11, fontWeight: 700, background: done ? "#e8f5e9" : "#FFF7ED", color: done ? "#138808" : "#FF6B00" }}>
          {done ? "✅ Fully Resolved" : `⏱️ ~${e} day${e !== 1 ? "s" : ""} remaining`}
        </span>
      </div>

      {/* ── Progress bar ── */}
      <div style={{ padding: "12px 16px 6px", background: "#fff" }}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
          <span style={{ fontWeight: 600, color: "#495057" }}>
            Stage {issue.stage + 1}/7 · {STAGES[Math.min(issue.stage, 6)].name}
          </span>
          <span style={{ fontWeight: 700, color: col }}>{pc}% complete</span>
        </div>
        <div style={{ height: 11, background: "#F1F3F5", borderRadius: 50, overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${pc}%`, background: col, borderRadius: 50, transition: "width 1.2s ease", position: "relative", overflow: "hidden" }}>
            <div style={{ position: "absolute", top: 0, left: "-100%", width: "100%", height: "100%", background: "linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)", animation: "barShimmer 2.5s infinite" }} />
          </div>
        </div>
      </div>

      {/* ── Stage icon dots ── */}
      <div style={{ display: "flex", padding: "14px 16px 4px", background: "#fff" }}>
        {STAGES.map((s, i) => {
          const isDone = i < issue.stage;
          const isActive = i === issue.stage;
          return (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative" }}>
              {i > 0 && (
                <div style={{ position: "absolute", top: 13, left: "-50%", right: "50%", height: 3, background: isDone || isActive ? "#138808" : "#E9ECEF", zIndex: 0 }} />
              )}
              <div style={{ width: 28, height: 28, borderRadius: "50%", border: `3px solid ${isDone ? "#138808" : isActive ? "#FF6B00" : "#E9ECEF"}`, background: isDone ? "#138808" : isActive ? "#FF6B00" : "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, position: "relative", zIndex: 1, animation: isActive ? "stagePulse 1.5s infinite" : "none", color: isDone || isActive ? "#fff" : "#ADB5BD", fontWeight: 700, transition: "all .3s" }}>
                {isDone ? "✓" : s.icon}
              </div>
              <div style={{ fontSize: 8.5, fontWeight: 600, textAlign: "center", marginTop: 4, color: isDone ? "#138808" : isActive ? "#FF6B00" : "#ADB5BD", lineHeight: 1.3 }}>
                {s.name}
              </div>
              <div style={{ fontSize: 8, color: "#ADB5BD", marginTop: 1 }}>
                {daysAgoLabel(issue.stageDates?.[i])}
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Detail rows ── */}
      <div style={{ padding: "10px 14px 14px", background: "#FAFAFA", borderTop: "1px solid #F1F3F5", display: "flex", flexDirection: "column", gap: 5 }}>
        {STAGES.map((s, i) => {
          const isDone = i < issue.stage;
          const isActive = i === issue.stage;
          const timeLabel = isDone
            ? issue.stageDates?.[i] != null ? daysAgoLabel(issue.stageDates[i]) : "Done"
            : isActive
              ? i >= 6 ? "Completed" : "Active now"
              : "Pending";

          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 9, padding: "8px 11px", borderRadius: 9, background: isDone ? "#e8f5e9" : isActive ? "#FFF7ED" : "#fff", border: `1px solid ${isDone ? "transparent" : isActive ? "#FDDCB5" : "#E9ECEF"}` }}>
              <div style={{ width: 9, height: 9, borderRadius: "50%", background: isDone ? "#138808" : isActive ? "#FF6B00" : "#DEE2E6", flexShrink: 0, marginTop: 4 }} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: isDone ? "#166534" : isActive ? "#92400E" : "#ADB5BD" }}>
                  {s.icon} {s.name}
                </div>
                <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 2, lineHeight: 1.4 }}>{s.desc}</div>
              </div>
              <span style={{ fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 50, flexShrink: 0, background: isDone ? "#e8f5e9" : isActive ? "#FFF7ED" : "#F1F3F5", color: isDone ? "#138808" : isActive ? "#FF6B00" : "#ADB5BD" }}>
                {timeLabel}
              </span>
            </div>
          );
        })}
      </div>

      <style>{`
        @keyframes stagePulse { 0%,100%{box-shadow:0 0 0 4px rgba(255,107,0,.2)} 50%{box-shadow:0 0 0 9px rgba(255,107,0,0)} }
        @keyframes barShimmer { 0%{left:-100%} 100%{left:100%} }
      `}</style>
    </div>
  );
}
