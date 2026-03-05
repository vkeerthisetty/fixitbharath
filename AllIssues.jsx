import { PTYPES } from "../constants.js";
import { PageHeader, EmptyState } from "./ui.jsx";
import IssueCard from "./IssueCard.jsx";

export default function AllIssues({ issues, saveIssues, currentUser, activeFilter, setActiveFilter, showToast }) {
  const filtered = activeFilter === "all" ? issues : issues.filter((i) => i.type === activeFilter);
  const sorted   = [...filtered].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      <PageHeader title="📌 All Reported Issues" sub={`${issues.length} total · sorted by votes · tap ▲ to upvote`} />

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
        {["all", ...PTYPES.map((t) => t.id)].map((f) => {
          const t = PTYPES.find((x) => x.id === f);
          return (
            <div key={f} onClick={() => setActiveFilter(f)}
              style={{ padding: "6px 15px", borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: "pointer", border: `1.5px solid ${activeFilter === f ? "#FF6B00" : "#E9ECEF"}`, background: activeFilter === f ? "#FFF3E8" : "#fff", color: activeFilter === f ? "#FF6B00" : "#495057", transition: "all .15s" }}>
              {f === "all" ? "🗂️ All" : `${t?.icon} ${t?.label}`}
            </div>
          );
        })}
      </div>

      {sorted.length === 0
        ? <EmptyState icon="🗺️" title="No issues in this category yet" />
        : sorted.map((iss) => (
            <IssueCard key={iss.id} issue={iss} allIssues={issues} saveIssues={saveIssues} currentUser={currentUser} showVote={true} showToast={showToast} />
          ))
      }
    </div>
  );
}
