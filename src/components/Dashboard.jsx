import { ArrowRight, CheckCircle2, Clock, FileText, MapPin, PlusCircle, Search, AlertCircle } from "lucide-react";
import { getPriority } from "../utils/helpers.js";
import IssueCard from "./IssueCard.jsx";

export default function Dashboard({ issues, setSection, currentUser }) {
  const mine = issues.filter((issue) => issue.by === currentUser.id);
  const activeMine = mine.filter((issue) => issue.stage < 6);
  const resolved = mine.filter((issue) => issue.stage >= 6).length;
  const nearby = [...issues].sort((a, b) => b.votes - a.votes).slice(0, 3);
  const critical = issues.filter((issue) => getPriority(issue.votes) === "critical").length;

  return (
    <div className="grid" style={{ gap: "24px" }}>
      <div className="grid grid-2">
        <section className="panel" style={{ minHeight: 280, display: "flex", flexDirection: "column", justifyContent: "center", gap: 20 }}>
          <div>
            <div className="eyebrow" style={{ color: "var(--accent)" }}>Verified Civic Portal</div>
            <h1 style={{ 
              fontFamily: "'Outfit', sans-serif", 
              margin: "6px 0 10px", 
              fontSize: "34px", 
              lineHeight: 1.15, 
              letterSpacing: "-0.02em",
              fontWeight: 800,
              color: "var(--text)"
            }}>
              Report local civic issues & track official resolution.
            </h1>
            <p className="page-subtitle" style={{ maxWidth: "560px", fontSize: "14px", lineHeight: 1.55 }}>
              Submit GPS-tagged complaints directly to central departments, upvote local reports to escalate priority, and watch the live verification workflow.
            </p>
          </div>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <button className="button primary" onClick={() => setSection("report")}>
              <PlusCircle size={18} /> Report an Issue
            </button>
            <button className="button secondary" onClick={() => setSection("issues")}>
              <Search size={18} /> Browse Nearby
            </button>
          </div>
        </section>

        <section className="map-panel" style={{ minHeight: 280 }}>
          {nearby.map((issue, index) => (
            <button
              key={issue.id}
              className={`map-pin ${getPriority(issue.votes)}`}
              title={issue.title}
              style={{ left: `${25 + index * 26}%`, top: `${35 + (index % 2) * 25}%` }}
              onClick={() => setSection("issues")}
            >
              <MapPin size={18} />
            </button>
          ))}
          <div className="map-legend">Civic hotspot map preview</div>
        </section>
      </div>

      <div className="grid grid-4">
        {[
          { label: "My Active Reports", value: activeMine.length, icon: FileText, color: "#2563eb" },
          { label: "Resolved Reports", value: resolved, icon: CheckCircle2, color: "#059669" },
          { label: "Nearby Issues", value: issues.length, icon: MapPin, color: "#1e3a8a" },
          { label: "Critical Actions", value: critical, icon: AlertCircle, color: "#dc2626" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card panel" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="helper" style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "11px", letterSpacing: "0.05em" }}>{stat.label}</span>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, marginTop: 8, fontFamily: "'Outfit', sans-serif", color: "var(--text)" }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-2">
        <section className="panel" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <div>
              <div className="panel-title">My Recent Complaints</div>
              <div className="helper">Reports filed under your verified mobile link.</div>
            </div>
            <button className="button secondary" onClick={() => setSection("myissues")} style={{ height: 38, padding: "0 14px", fontSize: 13 }}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid" style={{ gap: "14px", flex: 1 }}>
            {activeMine.length === 0 ? (
              <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "40px 0", color: "var(--muted)", fontStyle: "italic", fontSize: "13px" }}>
                No active complaints reported yet.
              </div>
            ) : (
              activeMine.slice(0, 2).map((issue) => (
                <IssueCard key={issue.id} issue={issue} currentUser={currentUser} showVote={false} showToast={() => {}} compact />
              ))
            )}
          </div>
        </section>

        <section className="panel" style={{ display: "flex", flexDirection: "column" }}>
          <div className="panel-header">
            <div>
              <div className="panel-title">Escalated Civic Incidents</div>
              <div className="helper">Support existing issues to avoid reporting duplicates.</div>
            </div>
            <button className="button secondary" onClick={() => setSection("issues")} style={{ height: 38, padding: "0 14px", fontSize: 13 }}>
              Full List <ArrowRight size={14} />
            </button>
          </div>
          <div className="grid" style={{ gap: "14px", flex: 1 }}>
            {nearby.length === 0 ? (
              <div style={{ display: "grid", placeItems: "center", height: "100%", padding: "40px 0", color: "var(--muted)", fontStyle: "italic", fontSize: "13px" }}>
                No reports found in your area.
              </div>
            ) : (
              nearby.map((issue) => (
                <IssueCard key={issue.id} issue={issue} currentUser={currentUser} showVote={false} showToast={() => {}} compact />
              ))
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
