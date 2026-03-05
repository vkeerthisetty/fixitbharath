import { PTYPES, MINS } from "../constants.js";
import { getPriority, getPriorityColor, getEtaDays } from "../utils/helpers.js";
import { PriorityBadge } from "./ui.jsx";
import ProgressTracker from "./ProgressTracker.jsx";

export default function IssueCard({ issue, allIssues, saveIssues, currentUser, showVote, showToast }) {
  const priority  = getPriority(issue.votes);
  const type      = PTYPES.find((t) => t.id === issue.type);
  const ministry  = MINS[issue.type];
  const color     = getPriorityColor(priority);
  const isVoted   = issue.voters?.includes(currentUser);

  const voteMessages = {
    critical: "🚨 Critical — auto-escalated to ministry!",
    high:     "🔥 High-impact civic issue",
    medium:   "📈 Growing community concern",
    low:      "📋 Newly reported",
  };

  const handleVote = async () => {
    if (isVoted) { showToast("ℹ️", "You already upvoted this issue"); return; }
    const newVotes = issue.votes + 1;
    const updated = allIssues.map((i) =>
      i.id === issue.id
        ? { ...i, votes: newVotes, voters: [...(i.voters || []), currentUser] }
        : i
    );
    await saveIssues(updated);

    if (newVotes === 5)       showToast("📈", `5 citizens affected — gaining traction!`);
    else if (newVotes === 12) showToast("🔥", `High priority unlocked — 12 votes!`);
    else if (newVotes === 20) showToast("🚨", `CRITICAL — 20+ votes! Ministry auto-alerted.`);
    else                      showToast("👍", `Upvoted · ${newVotes} total votes`);
  };

  return (
    <div style={{ background: "#fff", borderRadius: 16, padding: "19px 21px", boxShadow: "0 4px 18px rgba(0,0,0,.06)", marginBottom: 18, borderLeft: `4px solid ${color}` }}>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: 15 }}>{type?.icon} {issue.title}</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 5, fontSize: 12, color: "#ADB5BD" }}>
            <span>📍 {issue.loc}</span>
            <span>📅 {issue.date}</span>
            <span>🏛️ {ministry?.name?.replace("Ministry of ", "Min. of ") || ""}</span>
            <span>by {issue.by.slice(0, 4)} ****</span>
            {issue.stage >= 2 && (
              <span style={{ background: "#e8f5e9", color: "#138808", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>
                ✅ Field Verified
              </span>
            )}
          </div>
        </div>
        <PriorityBadge priority={priority} />
      </div>

      {/* ── Description ── */}
      {issue.desc && (
        <div style={{ fontSize: 13, color: "#495057", lineHeight: 1.65, padding: "10px 13px", background: "#F8F9FA", borderRadius: 10, borderLeft: `3px solid ${color}`, marginBottom: 10 }}>
          {issue.desc}
        </div>
      )}

      {/* ── Photo ── */}
      {issue.photo && (
        <img src={issue.photo} alt="evidence" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10, marginBottom: 12, border: "2px solid #E9ECEF" }} />
      )}

      {/* ── Progress Tracker ── */}
      <ProgressTracker issue={issue} />

      {/* ── Upvote ── */}
      {showVote && (
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 14, padding: "13px 15px", background: "#F8F9FA", borderRadius: 14, border: "1.5px solid #E9ECEF" }}>
          <button
            onClick={handleVote}
            onMouseEnter={(e) => { if (!isVoted) { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#FFF3E8"; } }}
            onMouseLeave={(e) => { if (!isVoted) { e.currentTarget.style.borderColor = "#E9ECEF"; e.currentTarget.style.background = "#fff"; } }}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, minWidth: 66, height: 66, border: `2.5px solid ${isVoted ? "#FF6B00" : "#E9ECEF"}`, borderRadius: 14, background: isVoted ? "#FF6B00" : "#fff", cursor: "pointer", padding: 4, transition: "all .2s", flexShrink: 0 }}
          >
            <span style={{ fontSize: 20, lineHeight: 1 }}>{isVoted ? "✅" : "▲"}</span>
            <span style={{ fontFamily: "Georgia, serif", fontSize: 18, fontWeight: 800, color: isVoted ? "#fff" : "#212529", lineHeight: 1 }}>
              {issue.votes}
            </span>
            <span style={{ fontSize: 9, fontWeight: 700, color: isVoted ? "rgba(255,255,255,.8)" : "#ADB5BD", letterSpacing: 0.5 }}>
              {isVoted ? "VOTED" : "UPVOTE"}
            </span>
          </button>

          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color }}>{voteMessages[priority]}</div>
            <div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 3 }}>
              {issue.votes} citizen{issue.votes !== 1 ? "s" : ""} affected · more votes = faster resolution
            </div>
            {!isVoted
              ? <div style={{ fontSize: 11, color: "#FF6B00", marginTop: 5, fontWeight: 600 }}>👆 Upvote to push this issue up the queue</div>
              : <div style={{ fontSize: 11, color: "#138808", marginTop: 5, fontWeight: 600 }}>✅ You have upvoted this issue</div>
            }
          </div>
        </div>
      )}
    </div>
  );
}
