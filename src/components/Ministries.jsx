import { useState } from "react";
import { AlertTriangle, Building2, CheckCircle2, ClipboardList, Map, Wrench, ChevronLeft, ArrowRight, ShieldAlert } from "lucide-react";
import { MINS, STAGES } from "../constants.js";
import { getPriority } from "../utils/helpers.js";
import { MiniProgressBar, PageHeader, StatusBadge } from "./ui.jsx";
import IssueCard from "./IssueCard.jsx";

function TriageControl({ issue, onUpdateStage, showToast }) {
  const [stage, setStage] = useState(issue.stage);
  const [note, setNote] = useState("");
  const [updating, setUpdating] = useState(false);

  const handleSubmit = async () => {
    if (Number(stage) === issue.stage) {
      showToast("Info", "Please select a different stage to advance the complaint.");
      return;
    }
    setUpdating(true);
    try {
      await onUpdateStage(issue.id, Number(stage), note || `Status advanced to ${STAGES[stage].name} by verified official.`);
      showToast("Updated", `Complaint ${issue.id} successfully moved to ${STAGES[stage].name}.`);
      setNote("");
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="panel" style={{ background: "rgba(30, 58, 138, 0.02)", border: "1.5px solid var(--line)", marginTop: 12, display: "grid", gap: 12, padding: 16 }}>
      <div style={{ fontWeight: 800, fontSize: 13, color: "var(--primary)", display: "flex", alignItems: "center", gap: 6 }}>
        <Wrench size={14} /> Official Workflow Control
      </div>
      <div className="grid grid-2" style={{ gap: 12 }}>
        <div className="field">
          <label className="field-label" style={{ fontSize: 11 }}>Update Resolution Stage</label>
          <select 
            className="input" 
            value={stage} 
            onChange={(e) => setStage(Number(e.target.value))}
            style={{ height: 38, padding: "0 10px", fontSize: 12, border: "1.5px solid var(--line)", background: "white", borderRadius: "var(--radius)" }}
          >
            {STAGES.map((s, idx) => (
              <option key={s.name} value={idx} disabled={idx < issue.stage}>
                Stage {idx}: {s.name} {idx < issue.stage ? "(Archived)" : idx === issue.stage ? "(Current)" : ""}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label className="field-label" style={{ fontSize: 11 }}>Official Audit Comments</label>
          <input 
            className="input" 
            value={note} 
            onChange={(e) => setNote(e.target.value)} 
            placeholder="E.g., Field check confirmed, dispatching contractor team..."
            style={{ height: 38, fontSize: 12 }}
          />
        </div>
      </div>
      <button 
        className="button primary" 
        onClick={handleSubmit} 
        disabled={updating || Number(stage) === issue.stage} 
        style={{ minHeight: 36, height: 36, fontSize: 12, padding: "0 14px", justifySelf: "end" }}
      >
        {updating ? "Advancing Stage..." : "Verify & Save Status"}
      </button>
    </div>
  );
}

export default function Ministries({ issues, currentUser, onUpdateStage, showToast }) {
  const [selectedDept, setSelectedDept] = useState(null);

  // Group issues by assigned ministry name
  const departments = {};
  Object.entries(MINS).forEach(([, ministry]) => {
    if (!departments[ministry.name]) {
      departments[ministry.name] = { ...ministry, issues: [] };
    }
  });

  issues.forEach((issue) => {
    const ministry = MINS[issue.type];
    if (ministry && departments[ministry.name]) {
      departments[ministry.name].issues.push(issue);
    }
  });

  if (selectedDept) {
    const data = departments[selectedDept];
    const deptIssues = data ? data.issues : [];
    const openIssues = deptIssues.filter((issue) => issue.stage < 6);

    return (
      <div style={{ animation: "fadeInSlideUp 0.4s ease-out" }}>
        <PageHeader 
          title={`${selectedDept} Control`}
          sub={`Triage Workspace • ${openIssues.length} pending review out of ${deptIssues.length} assigned complaints`}
          action={
            <button className="button secondary" onClick={() => setSelectedDept(null)}>
              <ChevronLeft size={16} /> Back to Departments
            </button>
          }
        />

        <div className="grid grid-2">
          <section className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="panel-title">Pending Action Items</div>
                <div className="helper">Active issues requiring triage or stage updates.</div>
              </div>
              <ClipboardList size={18} style={{ color: "var(--muted)" }} />
            </div>

            <div className="grid" style={{ gap: 20 }}>
              {openIssues.length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontStyle: "italic" }}>
                  All complaints assigned to this department are currently resolved!
                </div>
              ) : (
                openIssues.map((issue) => (
                  <div key={issue.id} className="panel" style={{ border: "1px solid var(--line)", background: "white", padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "start", marginBottom: 12 }}>
                      <div>
                        <div style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase" }}>Complaint {issue.id}</div>
                        <div style={{ fontSize: 16, fontWeight: 800, color: "var(--text)", marginTop: 2 }}>{issue.title}</div>
                        <div className="helper" style={{ marginTop: 4 }}>📍 Location: {issue.loc}</div>
                      </div>
                      <StatusBadge status={issue.moderationStatus} />
                    </div>
                    <div className="issue-desc" style={{ fontSize: 13, marginBottom: 12 }}>{issue.desc}</div>
                    {issue.photo && (
                      <img src={issue.photo} alt="evidence" style={{ width: "100%", maxHeight: 160, objectFit: "cover", borderRadius: "var(--radius-sm)", marginBottom: 12 }} />
                    )}
                    
                    <TriageControl issue={issue} onUpdateStage={onUpdateStage} showToast={showToast} />
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel-header" style={{ marginBottom: 0 }}>
              <div>
                <div className="panel-title">Resolved History Archive</div>
                <div className="helper">Complaints that have been successfully verified and closed.</div>
              </div>
              <CheckCircle2 size={18} style={{ color: "var(--success)" }} />
            </div>

            <div className="grid" style={{ gap: 14 }}>
              {deptIssues.filter((issue) => issue.stage >= 6).length === 0 ? (
                <div style={{ padding: "40px 0", textAlign: "center", color: "var(--muted)", fontStyle: "italic" }}>
                  No resolved complaints in the historical archive yet.
                </div>
              ) : (
                deptIssues.filter((issue) => issue.stage >= 6).map((issue) => (
                  <div key={issue.id} className="panel" style={{ border: "1px solid var(--line)", background: "white", padding: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{issue.title}</div>
                      <div className="helper" style={{ marginTop: 2 }}>Closed date: {issue.date} • {issue.votes} upvotes</div>
                    </div>
                    <span className="status-badge status-resolved">Resolved</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div style={{ animation: "fadeInSlideUp 0.4s ease-out" }}>
      <PageHeader title="Ministry Resolution Panel" sub="Official workspace for active triaging, field inspection dates, and action verification." />

      <div style={{ background: "var(--sidebar-gradient)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "var(--radius-lg)", padding: "20px 24px", color: "white", display: "flex", alignItems: "center", gap: 16, marginBottom: 24, boxShadow: "var(--shadow)" }}>
        <div style={{ background: "rgba(255,255,255,0.1)", color: "var(--accent)", width: 48, height: 48, borderRadius: "var(--radius)", display: "grid", placeItems: "center" }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <div style={{ fontWeight: 800, fontSize: 16, fontFamily: "'Outfit', sans-serif" }}>Dual Triage Workspace Enabled</div>
          <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>You are authenticated under a developer simulation profile. Click any ministry below to act as an official and manage active queues.</div>
        </div>
      </div>

      <div className="grid grid-3" style={{ marginBottom: "24px" }}>
        {[
          { label: "Pending Workflow Queue", value: issues.filter((issue) => issue.stage < 6).length, icon: ClipboardList, color: "var(--primary-light)" },
          { label: "Critical Incidents Active", value: issues.filter((issue) => getPriority(issue.votes) === "critical").length, icon: AlertTriangle, color: "var(--danger)" },
          { label: "Successfully Resolved", value: issues.filter((issue) => issue.stage >= 6).length, icon: CheckCircle2, color: "var(--success)" },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="stat-card panel" style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span className="helper" style={{ fontWeight: 700, textTransform: "uppercase", fontSize: "11px" }}>{stat.label}</span>
                <Icon size={18} style={{ color: stat.color }} />
              </div>
              <div style={{ fontSize: "32px", fontWeight: 800, marginTop: 8, fontFamily: "'Outfit', sans-serif", color: "var(--text)" }}>{stat.value}</div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-2">
        {Object.entries(departments).map(([name, data]) => {
          const total = data.issues.length;
          const resolved = data.issues.filter((issue) => issue.stage >= 6).length;
          const critical = data.issues.filter((issue) => getPriority(issue.votes) === "critical").length;
          const inProgress = data.issues.filter((issue) => issue.stage > 0 && issue.stage < 6).length;
          const rate = total > 0 ? Math.round((resolved / total) * 100) : 0;

          return (
            <section key={name} className="panel" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div className="panel-header" style={{ marginBottom: 0 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="brand-mark" style={{ background: "rgba(30, 58, 138, 0.06)", color: "var(--primary)", boxShadow: "none", width: 44, height: 44, borderRadius: "var(--radius-sm)" }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <div className="panel-title" style={{ fontSize: 16 }}>{name}</div>
                    <div className="helper" style={{ fontWeight: 600 }}>{data.dept}</div>
                  </div>
                </div>
              </div>

              <div className="grid grid-3" style={{ marginBottom: 4, background: "var(--bg)", padding: 12, borderRadius: "var(--radius)" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16 }}>{total}</div>
                  <div className="helper" style={{ fontSize: 11 }}>Assigned Cases</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: "var(--primary)" }}>{inProgress}</div>
                  <div className="helper" style={{ fontSize: 11 }}>In Progress</div>
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 16, color: critical ? "var(--danger)" : "var(--text)" }}>{critical}</div>
                  <div className="helper" style={{ fontSize: 11 }}>Critical Priority</div>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 2, fontSize: 12, fontWeight: 700 }}>
                <span>Department Resolution Rate</span>
                <span style={{ color: "var(--success)" }}>{rate}%</span>
              </div>
              <MiniProgressBar pct={rate} color="var(--success)" />

              <div style={{ display: "flex", gap: 8, marginTop: 12, flexWrap: "wrap" }}>
                <button className="button secondary" onClick={() => setSelectedDept(name)} style={{ minHeight: 38, height: 38, padding: "0 14px", fontSize: 12 }}>
                  <ClipboardList size={14} /> Open Triage Console <ArrowRight size={14} style={{ marginLeft: 4 }} />
                </button>
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}
