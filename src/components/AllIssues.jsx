import { useState } from "react";
import { ListFilter, MapPin, Search } from "lucide-react";
import { PTYPES } from "../constants.js";
import { getPriority } from "../utils/helpers.js";
import { EmptyState, PageHeader } from "./ui.jsx";
import IssueCard from "./IssueCard.jsx";

export default function AllIssues({ issues, voteIssue, currentUser, activeFilter, setActiveFilter, showToast }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIssueId, setSelectedIssueId] = useState(null);

  // Live filter + search logic
  const filtered = activeFilter === "all" ? issues : issues.filter((issue) => issue.type === activeFilter);
  const searched = filtered.filter((issue) => 
    issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
    issue.loc.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const sorted = [...searched].sort((a, b) => b.votes - a.votes);

  const handlePinClick = (issueId) => {
    setSelectedIssueId(issueId);
    showToast("Selected", `Navigating to complaint ${issueId}`);
    setTimeout(() => {
      const element = document.getElementById(`issue-card-${issueId}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };

  return (
    <div style={{ animation: "fadeInSlideUp 0.4s ease-out" }}>
      <PageHeader title="Browse Civic Hotspots" sub="Search active issues, support neighbor reports, and view location hotspots." />

      <div className="grid grid-2">
        <section className="panel" style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div className="panel-header" style={{ marginBottom: 0 }}>
            <div>
              <div className="panel-title">Active Reports Queue</div>
              <div className="helper">{sorted.length} complaints matching parameters</div>
            </div>
            <ListFilter size={18} style={{ color: "var(--muted)" }} />
          </div>

          <div className="segmented" style={{ gap: "8px" }}>
            {["all", ...PTYPES.map((type) => type.id)].map((filter) => {
              const type = PTYPES.find((item) => item.id === filter);
              return (
                <button key={filter} className={`chip ${activeFilter === filter ? "active" : ""}`} onClick={() => { setActiveFilter(filter); setSelectedIssueId(null); }}>
                  {filter === "all" ? "All Categories" : type?.label}
                </button>
              );
            })}
          </div>

          <div className="field">
            <div style={{ position: "relative" }}>
              <Search size={16} style={{ position: "absolute", left: 14, top: 14, color: "var(--muted)" }} />
              <input 
                className="input" 
                style={{ paddingLeft: 42 }} 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by landmark, road, PIN code, or keywords..." 
              />
            </div>
          </div>

          <div className="grid" style={{ gap: "16px", overflowY: "auto", maxHeight: "680px", paddingRight: "4px" }}>
            {sorted.length === 0 ? (
              <EmptyState icon={<MapPin size={34} />} title="No civic issues found" />
            ) : (
              sorted.map((issue) => (
                <div key={issue.id} id={`issue-card-${issue.id}`}>
                  <IssueCard 
                    issue={issue} 
                    voteIssue={voteIssue} 
                    currentUser={currentUser} 
                    showVote 
                    showToast={showToast} 
                    highlighted={issue.id === selectedIssueId}
                  />
                </div>
              ))
            )}
          </div>
        </section>

        <section className="map-panel" aria-label="Issue map preview">
          {sorted.slice(0, 10).map((issue, index) => (
            <button
              key={issue.id}
              className={`map-pin ${getPriority(issue.votes)} ${selectedIssueId === issue.id ? "critical" : ""}`}
              title={issue.title}
              style={{
                left: `${15 + ((index * 22) % 72)}%`,
                top: `${20 + ((index * 27) % 64)}%`,
                transform: selectedIssueId === issue.id ? "translate(-50%, -50%) scale(1.3)" : "translate(-50%, -50%)"
              }}
              onClick={() => handlePinClick(issue.id)}
            >
              <MapPin size={18} />
            </button>
          ))}
          <div className="map-legend">
            <strong>Interactive Map Node Tracker</strong>
            <div className="helper" style={{ marginTop: 4 }}>Click glowing pins to scroll and highlight the incident description.</div>
          </div>
        </section>
      </div>
    </div>
  );
}
