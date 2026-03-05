import { PageHeader, EmptyState } from "./ui.jsx";
import IssueCard from "./IssueCard.jsx";

export default function MyReports({ issues, currentUser, showToast, setSection }) {
  // ── Only show issues filed by this exact Aadhaar ID ──
  const mine = issues.filter((i) => i.by === currentUser);

  const stats = [
    { label: "Filed",        value: mine.length,                                  icon: "📋", bg: "#FFF3E8", color: "#FF6B00" },
    { label: "In Progress",  value: mine.filter((i) => i.stage > 0 && i.stage < 6).length, icon: "🔧", bg: "#EEF2FF", color: "#000080" },
    { label: "Resolved",     value: mine.filter((i) => i.stage >= 6).length,      icon: "✅", bg: "#e8f5e9", color: "#138808" },
    { label: "Total Votes",  value: mine.reduce((s, i) => s + i.votes, 0),        icon: "👍", bg: "#FAF5FF", color: "#7C3AED" },
  ];

  return (
    <div>
      <PageHeader
        title="👤 My Reports"
        sub={`Aadhaar: ${currentUser} · ${mine.length} complaint${mine.length !== 1 ? "s" : ""} filed`}
      />

      {/* Per-user summary */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 22 }}>
        {stats.map((s) => (
          <div key={s.label} style={{ background: "#fff", borderRadius: 14, padding: "14px 16px", boxShadow: "0 3px 16px rgba(0,0,0,.06)", display: "flex", alignItems: "center", gap: 10, borderTop: `3px solid ${s.color}` }}>
            <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: "Georgia, serif", fontSize: 24, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 2 }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {mine.length === 0 ? (
        <EmptyState icon="📝" title="No complaints filed yet">
          <div style={{ fontSize: 13, color: "#ADB5BD", marginBottom: 20 }}>
            Report a civic issue to get started
          </div>
          <button onClick={() => setSection("report")}
            style={{ padding: "12px 28px", border: "none", borderRadius: 50, background: "linear-gradient(135deg,#FF6B00,#FF8C00)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer" }}>
            + Report Your First Issue
          </button>
        </EmptyState>
      ) : (
        <div>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#ADB5BD", marginBottom: 14, paddingBottom: 8, borderBottom: "1px solid #F1F3F5" }}>
            Your Complaints — latest first
          </div>
          {/* Newest first, no vote button on own issues */}
          {[...mine].sort((a, b) => b.date.localeCompare(a.date)).map((iss) => (
            <IssueCard key={iss.id} issue={iss} allIssues={[]} saveIssues={null} currentUser={currentUser} showVote={false} showToast={showToast} />
          ))}
        </div>
      )}
    </div>
  );
}
