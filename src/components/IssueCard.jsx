import { ArrowUp, Building2, Calendar, MapPin, ShieldCheck, Clock } from "lucide-react";
import { PTYPES, MINS, STAGES } from "../constants.js";
import { getPriority, getEtaDays } from "../utils/helpers.js";
import { PriorityBadge, StatusBadge } from "./ui.jsx";
import ProgressTracker from "./ProgressTracker.jsx";

export default function IssueCard({ issue, voteIssue, currentUser, showVote, showToast, compact = false, highlighted = false }) {
  const priority = getPriority(issue.votes);
  const type = PTYPES.find((item) => item.id === issue.type);
  const ministry = MINS[issue.type];
  const isVoted = issue.voters?.includes(currentUser.id);
  const currentStage = STAGES[Math.min(issue.stage, STAGES.length - 1)];
  const eta = getEtaDays(issue.votes, issue.stage);

  const handleVote = async (e) => {
    e.stopPropagation(); // Avoid triggering any container clicks
    if (isVoted) {
      showToast("Info", "You already support this civic issue.");
      return;
    }

    try {
      const updatedIssue = await voteIssue(issue.id);
      showToast("Supported", `Added support! ${updatedIssue.votes} verified citizens backing this issue.`);
    } catch (error) {
      showToast("Error", error.message);
    }
  };

  return (
    <article 
      className={`issue-card ${highlighted ? "highlighted-card" : ""}`} 
      style={{ animation: "fadeInSlideUp 0.4s ease" }}
    >
      <div className="issue-card-header">
        <div>
          <div className="eyebrow" style={{ color: "var(--primary-light)", fontWeight: 700, fontSize: 11 }}>{type?.label || issue.type}</div>
          <div className="issue-title" style={{ marginTop: 2 }}>{issue.title}</div>
        </div>
        <div style={{ flexShrink: 0 }}>
          <PriorityBadge priority={priority} />
        </div>
      </div>

      <div className="meta-row">
        <span><MapPin size={13} style={{ color: "var(--primary-light)" }} /> {issue.loc}</span>
        <span><Calendar size={13} style={{ color: "var(--muted)" }} /> {issue.date}</span>
        <span><Building2 size={13} style={{ color: "var(--muted)" }} /> {ministry?.dept}</span>
        <span><ShieldCheck size={13} style={{ color: "var(--success)" }} /> {issue.reporterDisplay || "Verified citizen"}</span>
      </div>

      <div className="meta-row" style={{ gap: 8 }}>
        <StatusBadge status={issue.moderationStatus} />
        <span className="status-badge status-pending" style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          <Clock size={13} /> {currentStage.name}
        </span>
        {issue.stage < 6 && eta > 0 && (
          <span className="status-badge" style={{ background: "rgba(30, 58, 138, 0.04)", color: "var(--primary)", fontWeight: 700 }}>
            ETA: {eta} Days
          </span>
        )}
      </div>

      {!compact && issue.desc && (
        <div className="issue-desc" style={{ marginTop: 4 }}>{issue.desc}</div>
      )}

      {!compact && (issue.photoUrl || issue.photo) && (
        <img className="issue-photo" src={issue.photoUrl || issue.photo} alt="Issue evidence" style={{ marginTop: 8 }} />
      )}

      {!compact && (
        <div style={{ borderTop: "1.5px solid var(--line)", borderBottom: "1.5px solid var(--line)", padding: "16px 0", marginTop: 8 }}>
          <div className="section-title" style={{ fontSize: 11, marginBottom: 12 }}>Resolution Status Workflow</div>
          <ProgressTracker issue={issue} compact />
        </div>
      )}

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginTop: 8, borderTop: compact ? "1px solid var(--line)" : "none", paddingTop: compact ? 12 : 0 }}>
        <div>
          <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 14 }}>{issue.votes} verified citizen support{issue.votes === 1 ? "" : "s"}</div>
          <div className="helper" style={{ fontSize: 11 }}>Limited to 1 support per unique citizen token.</div>
        </div>
        {showVote && (
          <button className={`button ${isVoted ? "secondary" : "primary"}`} onClick={handleVote} style={{ minHeight: 38, height: 38, padding: "0 16px" }}>
            <ArrowUp size={16} /> 
            <span>{isVoted ? "Supported" : "Support"}</span>
          </button>
        )}
      </div>
    </article>
  );
}
