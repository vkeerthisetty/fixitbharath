import { CheckCircle2, Clock, FilePlus2, FileText, Wrench } from "lucide-react";
import { EmptyState, PageHeader } from "./ui.jsx";
import IssueCard from "./IssueCard.jsx";

export default function MyReports({ issues, currentUser, showToast, setSection }) {
  const mine = issues.filter((issue) => issue.by === currentUser.id);
  const groups = [
    { key: "review", title: "Under Review", icon: Clock, color: "var(--warning)", bg: "var(--warning-light)", items: mine.filter((issue) => issue.stage === 0) },
    { key: "progress", title: "Action In Progress", icon: Wrench, color: "var(--primary-light)", bg: "rgba(59, 130, 246, 0.08)", items: mine.filter((issue) => issue.stage > 0 && issue.stage < 6) },
    { key: "resolved", title: "Resolved Cases", icon: CheckCircle2, color: "var(--success)", bg: "var(--success-light)", items: mine.filter((issue) => issue.stage >= 6) },
  ];

  return (
    <div style={{ animation: "fadeInSlideUp 0.4s ease-out" }}>
      <PageHeader
        title="My Civic Dashboard"
        sub={`Logged in as ${currentUser.mobileMasked} • total of ${mine.length} complaint${mine.length !== 1 ? "s" : ""} registered`}
        action={
          <button className="button primary" onClick={() => setSection("report")}>
            <FilePlus2 size={16} /> New Incident Report
          </button>
        }
      />

      <div className="grid grid-3" style={{ marginBottom: "24px" }}>
        {groups.map((group) => {
          const Icon = group.icon;
          return (
            <div key={group.key} className="stat-card panel" style={{ display: "flex", flexDirection: "row", alignItems: "center", gap: 16 }}>
              <div style={{ background: group.bg, color: group.color, width: 44, height: 44, borderRadius: "var(--radius-sm)", display: "grid", placeItems: "center" }}>
                <Icon size={20} />
              </div>
              <div>
                <div style={{ fontSize: "28px", fontWeight: 800, fontFamily: "'Outfit', sans-serif", color: "var(--text)" }}>{group.items.length}</div>
                <div className="helper" style={{ fontWeight: 600 }}>{group.title}</div>
              </div>
            </div>
          );
        })}
      </div>

      {mine.length === 0 ? (
        <EmptyState icon={<FileText size={36} style={{ color: "var(--muted)" }} />} title="No incident reports logged yet">
          <p className="helper" style={{ marginBottom: 12 }}>File your first verified local complaint to begin the tracking process.</p>
          <button className="button primary" onClick={() => setSection("report")}>Report Your First Issue</button>
        </EmptyState>
      ) : (
        <div className="grid" style={{ gap: "24px" }}>
          {groups.map((group) => {
            const Icon = group.icon;
            if (group.items.length === 0) return null;
            return (
              <section key={group.key} className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <div className="panel-header" style={{ marginBottom: 0, borderBottom: "1.5px solid var(--line)", paddingBottom: 12 }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <Icon size={20} style={{ color: group.color }} />
                    <div>
                      <div className="panel-title" style={{ fontSize: 16 }}>{group.title}</div>
                      <div className="helper">{group.items.length} active case{group.items.length === 1 ? "" : "s"} assigned</div>
                    </div>
                  </div>
                </div>
                <div className="grid" style={{ gap: "16px" }}>
                  {group.items
                    .sort((a, b) => b.date.localeCompare(a.date))
                    .map((issue) => (
                      <IssueCard key={issue.id} issue={issue} currentUser={currentUser} showVote={false} showToast={showToast} />
                    ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
