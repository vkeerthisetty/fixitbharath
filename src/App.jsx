import { useState, useEffect, useCallback, useRef } from "react";
import { BarChart3, Building2, FileText, Home, Map, PlusCircle, Search, UserRound } from "lucide-react";
import { listIssues, createIssue, voteIssue, updateIssueStage } from "./services/issueApi.js";
import LoginPage from "./components/LoginPage.jsx";
import Dashboard from "./components/Dashboard.jsx";
import ReportForm from "./components/ReportForm.jsx";
import AllIssues from "./components/AllIssues.jsx";
import MyReports from "./components/MyReports.jsx";
import Ministries from "./components/Ministries.jsx";
import { Toast, AshokaChakraLoader } from "./components/ui.jsx";

const NAV = [
  { id: "dashboard", icon: Home, label: "Home" },
  { id: "report", icon: PlusCircle, label: "Report" },
  { id: "issues", icon: Map, label: "Nearby" },
  { id: "myissues", icon: FileText, label: "My Reports" },
  { id: "ministries", icon: Building2, label: "Departments" },
];

export default function App() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [section, setSection] = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("all");
  const [toast, setToast] = useState(null);
  const writingRef = useRef(false);
  const pollRef = useRef(null);

  const refreshIssues = useCallback(async () => {
    writingRef.current = true;
    const updated = await listIssues();
    setIssues(updated);
    setTimeout(() => {
      writingRef.current = false;
    }, 800);
  }, []);

  const loadIssues = useCallback(async () => {
    const loaded = await listIssues();
    setIssues(loaded);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadIssues();
    pollRef.current = setInterval(() => {
      if (!writingRef.current) listIssues().then(setIssues);
    }, 5000);
    return () => clearInterval(pollRef.current);
  }, [loadIssues]);

  const showToast = useCallback((icon, text) => {
    setToast({ icon, text });
    setTimeout(() => setToast(null), 3500);
  }, []);

  const handleCreateIssue = useCallback(
    async (payload) => {
      const result = await createIssue(payload, currentUser);
      await refreshIssues();
      return result;
    },
    [currentUser, refreshIssues]
  );

  const handleVoteIssue = useCallback(
    async (issueId) => {
      const issue = await voteIssue(issueId, currentUser);
      await refreshIssues();
      return issue;
    },
    [currentUser, refreshIssues]
  );

  const handleUpdateStage = useCallback(
    async (issueId, nextStage, note) => {
      const issue = await updateIssueStage(issueId, nextStage, currentUser, note);
      await refreshIssues();
      return issue;
    },
    [currentUser, refreshIssues]
  );

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "var(--bg-gradient)" }}>
        <div className="panel" style={{ textAlign: "center", border: "none", boxShadow: "none", background: "transparent" }}>
          <AshokaChakraLoader message="Loading civic workspace & matching databases..." />
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <LoginPage onLogin={(user) => { setCurrentUser(user); setSection("dashboard"); }} />;
  }

  const activeNav = NAV.find((item) => item.id === section);
  const ActiveIcon = activeNav?.icon || BarChart3;

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-mark">FB</div>
          <div>
            <div className="brand-title">FixItBharat</div>
            <div className="brand-subtitle">Citizen portal</div>
          </div>
        </div>

        <div className="nav-list">
          {NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button key={item.id} className={`nav-button ${section === item.id ? "active" : ""}`} onClick={() => setSection(item.id)}>
                <Icon size={18} />
                <span>{item.label}</span>
                {item.id === "myissues" && (
                  <span style={{ marginLeft: "auto", fontSize: 12 }}>
                    {issues.filter((issue) => issue.by === currentUser.id).length}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="sidebar-note">
          <strong style={{ color: "#172033" }}>Verified session</strong>
          <div style={{ marginTop: 5 }}>{currentUser.mobileMasked}</div>
          <div style={{ marginTop: 8 }}>Raw Aadhaar is not used as a public identifier.</div>
        </div>
      </aside>

      <div className="content">
        <header className="topbar">
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <ActiveIcon size={18} />
            <strong>{activeNav?.label || "FixItBharat"}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <button className="button secondary" onClick={() => setSection("issues")}>
              <Search size={16} /> Search issues
            </button>
            <button className="button primary" onClick={() => setSection("report")}>
              <PlusCircle size={16} /> Report
            </button>
            <button className="button ghost" onClick={() => setCurrentUser(null)}>
              <UserRound size={16} /> Logout
            </button>
          </div>
        </header>

        <main className="page">
          {section === "dashboard" && <Dashboard issues={issues} setSection={setSection} currentUser={currentUser} />}
          {section === "report" && <ReportForm issues={issues} createIssue={handleCreateIssue} currentUser={currentUser} showToast={showToast} setSection={setSection} />}
          {section === "issues" && <AllIssues issues={issues} voteIssue={handleVoteIssue} currentUser={currentUser} activeFilter={activeFilter} setActiveFilter={setActiveFilter} showToast={showToast} />}
          {section === "myissues" && <MyReports issues={issues} currentUser={currentUser} showToast={showToast} setSection={setSection} />}
          {section === "ministries" && <Ministries issues={issues} currentUser={currentUser} onUpdateStage={handleUpdateStage} showToast={showToast} />}
        </main>
      </div>

      <div className="mobile-tabs">
        {NAV.map((item) => {
          const Icon = item.icon;
          return (
            <button key={item.id} className={`mobile-tab ${section === item.id ? "active" : ""}`} onClick={() => setSection(item.id)}>
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      <Toast toast={toast} />
    </div>
  );
}
