import { useState, useEffect, useCallback, useRef } from "react";
import { SEED_ISSUES } from "./constants.js";
import { readIssues, writeIssues } from "./utils/storage.js";
import LoginPage    from "./components/LoginPage.jsx";
import Dashboard    from "./components/Dashboard.jsx";
import ReportForm   from "./components/ReportForm.jsx";
import AllIssues    from "./components/AllIssues.jsx";
import MyReports    from "./components/MyReports.jsx";
import Ministries   from "./components/Ministries.jsx";
import { Toast }    from "./components/ui.jsx";

// ─────────────────────────────────────────────────────────────
//  SIDEBAR NAV ITEMS
// ─────────────────────────────────────────────────────────────
const NAV = [
  { id: "dashboard",   icon: "📊", label: "Dashboard"    },
  { id: "report",      icon: "📝", label: "Report Issue"  },
  { id: "issues",      icon: "📌", label: "All Issues"    },
  { id: "myissues",    icon: "👤", label: "My Reports"    },
  { id: "ministries",  icon: "🏛️", label: "Ministries"   },
];

// ─────────────────────────────────────────────────────────────
//  ROOT
// ─────────────────────────────────────────────────────────────
export default function App() {
  const [issues,       setIssues]       = useState([]);
  const [loading,      setLoading]      = useState(true);
  const [currentUser,  setCurrentUser]  = useState(null);
  const [section,      setSection]      = useState("dashboard");
  const [activeFilter, setActiveFilter] = useState("all");
  const [toast,        setToast]        = useState(null);

  /**
   * writingRef: while true, the storage poll skips overwriting local state.
   * This prevents a race where a just-submitted issue disappears before
   * the write has finished.
   */
  const writingRef = useRef(false);
  const pollRef    = useRef(null);

  // ── Initial load ─────────────────────────────────────────
  const loadIssues = useCallback(() => {
    const stored = readIssues();
    if (stored) {
      setIssues(stored);
    } else {
      writeIssues(SEED_ISSUES);
      setIssues(SEED_ISSUES);
    }
    setLoading(false);
  }, []);

  // ── Save: pause poll → write → resume ────────────────────
  const saveIssues = useCallback(async (updated) => {
    writingRef.current = true;
    setIssues(updated);
    writeIssues(updated);
    setTimeout(() => { writingRef.current = false; }, 1500);
  }, []);

  // ── Poll localStorage every 4 s (multi-tab sync) ─────────
  useEffect(() => {
    loadIssues();

    pollRef.current = setInterval(() => {
      if (writingRef.current) return;
      const remote = readIssues();
      if (remote) setIssues(remote);
    }, 4000);

    return () => clearInterval(pollRef.current);
  }, [loadIssues]);

  // ── Toast helper ─────────────────────────────────────────
  const showToast = useCallback((icon, text) => {
    setToast({ icon, text });
    setTimeout(() => setToast(null), 3500);
  }, []);

  // ── Loading splash ───────────────────────────────────────
  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#F8F9FA", fontFamily: "sans-serif" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 52, marginBottom: 12 }}>🇮🇳</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 800, color: "#FF6B00" }}>FixItBharat</div>
          <div style={{ color: "#ADB5BD", fontSize: 13, marginTop: 8 }}>Loading portal…</div>
        </div>
      </div>
    );
  }

  // ── Login gate ───────────────────────────────────────────
  if (!currentUser) {
    return <LoginPage onLogin={(uid) => { setCurrentUser(uid); setSection("dashboard"); }} />;
  }

  // ── Logged-in shell ──────────────────────────────────────
  return (
    <div style={{ fontFamily: "'Noto Sans', sans-serif", minHeight: "100vh", background: "#F8F9FA" }}>
      {/* Indian tricolor stripe */}
      <div style={{ height: 5, background: "linear-gradient(to right,#FF6B00 33%,#fff 33%,#fff 66%,#138808 66%)" }} />

      {/* ── Navbar ── */}
      <nav style={{ background: "#fff", padding: "12px 26px", display: "flex", alignItems: "center", justifyContent: "space-between", boxShadow: "0 2px 12px rgba(0,0,0,.06)", position: "sticky", top: 0, zIndex: 100 }}>
        <div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 800, color: "#FF6B00" }}>
            FixIt<span style={{ color: "#138808" }}>Bharat</span>
          </div>
          <div style={{ fontSize: 10, color: "#ADB5BD", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 }}>
            नागरिक शिकायत पोर्टल · Live Portal
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          {/* User pill */}
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 14px", background: "#F1F3F5", borderRadius: 50 }}>
            <div style={{ width: 28, height: 28, background: "linear-gradient(135deg,#FF6B00,#000080)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 11, fontWeight: 700 }}>
              {currentUser.slice(0, 2)}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, lineHeight: 1 }}>{currentUser.slice(0, 4)} ****</div>
              <div style={{ fontSize: 9, color: "#ADB5BD", letterSpacing: 0.5 }}>Logged in via Aadhaar</div>
            </div>
          </div>
          <button
            onClick={() => setCurrentUser(null)}
            style={{ background: "transparent", border: "1.5px solid #DEE2E6", color: "#495057", padding: "7px 16px", borderRadius: 50, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
            Logout
          </button>
        </div>
      </nav>

      {/* ── Toast ── */}
      <Toast toast={toast} />

      {/* ── Layout ── */}
      <div style={{ display: "flex", minHeight: "calc(100vh - 82px)" }}>

        {/* Sidebar */}
        <aside style={{ width: 215, minWidth: 215, background: "#fff", padding: "18px 12px", boxShadow: "2px 0 12px rgba(0,0,0,.04)", display: "flex", flexDirection: "column", gap: 3 }}>
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase", color: "#ADB5BD", padding: "8px 12px 4px", marginTop: 6 }}>
            Navigation
          </div>

          {NAV.map((n) => (
            <button key={n.id} onClick={() => setSection(n.id)}
              style={{ display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 8, fontSize: 13, fontWeight: section === n.id ? 700 : 500, color: section === n.id ? "#FF6B00" : "#495057", background: section === n.id ? "#FFF3E8" : "transparent", border: "none", cursor: "pointer", textAlign: "left", width: "100%", transition: "all .15s" }}>
              <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>{n.icon}</span>
              {n.label}
              {/* Badge: count of MY reports */}
              {n.id === "myissues" && (
                <span style={{ marginLeft: "auto", background: "#FF6B00", color: "#fff", borderRadius: 50, fontSize: 10, fontWeight: 700, padding: "1px 7px" }}>
                  {issues.filter((i) => i.by === currentUser).length}
                </span>
              )}
            </button>
          ))}

          <div style={{ marginTop: "auto", padding: "12px", background: "#F8F9FA", borderRadius: 10, fontSize: 11, lineHeight: 1.5 }}>
            <div style={{ fontWeight: 700, color: "#138808", marginBottom: 3 }}>💾 Per-Aadhaar Storage</div>
            <div style={{ color: "#ADB5BD" }}>Each ID's reports are saved separately &amp; persist across sessions</div>
          </div>
        </aside>

        {/* Main page content */}
        <main style={{ flex: 1, padding: 26, overflowY: "auto" }}>
          {section === "dashboard"  && <Dashboard  issues={issues} setSection={setSection} currentUser={currentUser} />}
          {section === "report"     && <ReportForm issues={issues} saveIssues={saveIssues} currentUser={currentUser} showToast={showToast} setSection={setSection} />}
          {section === "issues"     && <AllIssues  issues={issues} saveIssues={saveIssues} currentUser={currentUser} activeFilter={activeFilter} setActiveFilter={setActiveFilter} showToast={showToast} />}
          {section === "myissues"   && <MyReports  issues={issues} currentUser={currentUser} showToast={showToast} setSection={setSection} />}
          {section === "ministries" && <Ministries issues={issues} />}
        </main>
      </div>
    </div>
  );
}
