import { useState, useRef } from "react";
import { PTYPES, MINS } from "../constants.js";
import { todayStr } from "../utils/helpers.js";
import { appendUserIssueId } from "../utils/storage.js";
import { PageHeader, FormLabel, PulsingDot } from "./ui.jsx";

const DEMO_LOCATIONS = [
  "Connaught Place, New Delhi",
  "Koramangala, Bengaluru",
  "Bandra West, Mumbai",
  "Salt Lake, Kolkata",
  "Kothrud, Pune",
];

export default function ReportForm({ issues, saveIssues, currentUser, showToast, setSection }) {
  const [selType,   setSelType]   = useState(null);
  const [title,     setTitle]     = useState("");
  const [desc,      setDesc]      = useState("");
  const [photo,     setPhoto]     = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [gpsLoc,    setGpsLoc]    = useState("");
  const [manualLoc, setManualLoc] = useState("");
  const [gpsState,  setGpsState]  = useState("idle"); // idle | loading | done
  const [submitting,setSubmitting]= useState(false);
  const fileRef = useRef();

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => { setPhoto(ev.target.result); setPhotoName(file.name); };
    reader.readAsDataURL(file);
  };

  const getGPS = () => {
    setGpsState("loading");
    if (!navigator.geolocation) { useDemoLoc(); return; }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setGpsLoc(`${pos.coords.latitude.toFixed(5)}°N, ${pos.coords.longitude.toFixed(5)}°E`);
        setGpsState("done");
      },
      () => useDemoLoc()
    );
  };

  const useDemoLoc = () => {
    const loc = DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];
    setGpsLoc(loc + " (demo)");
    setGpsState("done");
  };

  const reset = () => {
    setSelType(null); setTitle(""); setDesc(""); setPhoto(null);
    setPhotoName(""); setGpsLoc(""); setManualLoc(""); setGpsState("idle");
  };

  const submit = async () => {
    if (!selType)       { showToast("❗", "Select a problem type"); return; }
    if (!title.trim())  { showToast("❗", "Enter an issue title"); return; }
    if (!desc.trim())   { showToast("❗", "Add a description"); return; }

    setSubmitting(true);
    const loc = gpsLoc || manualLoc.trim() || "Location not specified";

    // Duplicate detection: same type + a key word matches
    const words = title.toLowerCase().split(/\s+/).filter((w) => w.length > 4);
    const dup = issues.find(
      (i) => i.type === selType && words.some((w) => i.title.toLowerCase().includes(w))
    );

    if (dup) {
      const updated = issues.map((i) =>
        i.id === dup.id && !i.voters.includes(currentUser)
          ? { ...i, votes: i.votes + 1, voters: [...i.voters, currentUser] }
          : i
      );
      await saveIssues(updated);
      showToast("🔄", `Similar issue found! Votes boosted to ${dup.votes + 1}`);
      setSubmitting(false);
      setTimeout(() => setSection("issues"), 1000);
      return;
    }

    // Brand-new issue
    const newIssue = {
      id:         "ISS-" + Date.now(),
      type:       selType,
      title:      title.trim(),
      desc:       desc.trim(),
      loc,
      votes:      1,
      stage:      0,
      by:         currentUser,           // ← Aadhaar ID
      date:       todayStr(),
      photo:      photo,                 // base64 string or null
      voters:     [currentUser],
      stageDates: [0, null, null, null, null, null, null],
    };

    await saveIssues([newIssue, ...issues]);
    appendUserIssueId(currentUser, newIssue.id); // personal record
    showToast("✅", `Issue saved! Assigned to ${MINS[selType].name}`);
    reset();
    setSubmitting(false);
    setTimeout(() => setSection("myissues"), 900);
  };

  // Shared input style
  const inp = { width: "100%", padding: "12px 16px", border: "1.5px solid #E9ECEF", borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit", color: "#212529", background: "#fff" };
  const onF = (e) => (e.target.style.borderColor = "#FF6B00");
  const onB = (e) => (e.target.style.borderColor = "#E9ECEF");

  return (
    <div>
      <PageHeader title="📝 Report an Issue" sub="Your complaint is saved immediately and linked to your Aadhaar" />

      <div style={{ background: "#fff", borderRadius: 16, padding: 28, boxShadow: "0 4px 24px rgba(0,0,0,.07)", maxWidth: 680 }}>

        {/* ── Step 1: Type ── */}
        <FormLabel step="1" text="Problem Type *" />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 10, marginBottom: 12 }}>
          {PTYPES.map((t) => (
            <button key={t.id} onClick={() => setSelType(t.id)}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "13px 6px", border: `2px solid ${selType === t.id ? "#FF6B00" : "#E9ECEF"}`, borderRadius: 12, background: selType === t.id ? "#FFF3E8" : "#fff", cursor: "pointer", fontSize: 11, fontWeight: 600, color: selType === t.id ? "#FF6B00" : "#ADB5BD", transition: "all .2s" }}>
              <span style={{ fontSize: 24 }}>{t.icon}</span>{t.label}
            </button>
          ))}
        </div>

        {selType && (() => {
          const m = MINS[selType];
          return (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "10px 14px", background: m.bg, borderRadius: 12, marginBottom: 18 }}>
              <span style={{ fontSize: 20 }}>{m.icon}</span>
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: m.ac }}>{m.name}</div>
                <div style={{ fontSize: 11, color: "#ADB5BD" }}>{m.dept} · notified automatically</div>
              </div>
              <PulsingDot />
            </div>
          );
        })()}

        {/* ── Step 2: Title ── */}
        <FormLabel step="2" text="Issue Title *" />
        <input value={title} onChange={(e) => setTitle(e.target.value)} onFocus={onF} onBlur={onB}
          placeholder="e.g. Deep pothole on MG Road near bus stop 14"
          style={{ ...inp, marginBottom: 16 }} />

        {/* ── Step 3: Description ── */}
        <FormLabel step="3" text="Detailed Description *" />
        <textarea value={desc} onChange={(e) => setDesc(e.target.value)} onFocus={onF} onBlur={onB}
          placeholder="Severity, size, duration, impact on daily life, nearest landmark…"
          style={{ ...inp, minHeight: 110, resize: "vertical", marginBottom: 16 }} />

        {/* ── Step 4: Photo ── */}
        <FormLabel step="4" text="📷 Photo Evidence" />
        <div onClick={() => fileRef.current?.click()}
          style={{ border: "2px dashed #DEE2E6", borderRadius: 10, padding: 26, textAlign: "center", cursor: "pointer", background: "#F8F9FA", marginBottom: photo ? 8 : 16 }}
          onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.background = "#FFF3E8"; }}
          onMouseLeave={(e) => { e.currentTarget.style.borderColor = "#DEE2E6"; e.currentTarget.style.background = "#F8F9FA"; }}>
          {photo
            ? <><div style={{ color: "#138808", fontWeight: 700, fontSize: 13 }}>✅ {photoName}</div><div style={{ color: "#ADB5BD", fontSize: 11, marginTop: 3 }}>Click to change</div></>
            : <><div style={{ fontSize: 34, marginBottom: 8 }}>📷</div><div style={{ fontSize: 13, color: "#495057" }}><strong style={{ color: "#FF6B00" }}>Click to upload</strong> or drag &amp; drop</div><div style={{ fontSize: 11, color: "#ADB5BD", marginTop: 4 }}>PNG · JPG · WEBP · max 10 MB</div></>
          }
        </div>
        <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
        {photo && <img src={photo} alt="preview" style={{ width: "100%", maxHeight: 200, objectFit: "cover", borderRadius: 10, marginBottom: 16, border: "2px solid #E9ECEF" }} />}

        {/* ── Step 5: Location ── */}
        <FormLabel step="5" text="📍 Location Tag" />
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 14px", background: "#F8F9FA", border: "1.5px solid #E9ECEF", borderRadius: 8, marginBottom: 8 }}>
          <span style={{ fontSize: 18 }}>📍</span>
          <span style={{ flex: 1, fontSize: 13, color: gpsLoc ? "#212529" : "#ADB5BD" }}>
            {gpsLoc || "Tap 'Get GPS' to auto-detect location"}
          </span>
          <button onClick={getGPS} style={{ padding: "7px 14px", border: "1.5px solid #E9ECEF", borderRadius: 50, background: "#fff", fontSize: 12, fontWeight: 600, cursor: "pointer", color: "#495057", flexShrink: 0 }}>
            {gpsState === "loading" ? "📡 Fetching…" : "📡 Get GPS"}
          </button>
        </div>
        <input value={manualLoc} onChange={(e) => setManualLoc(e.target.value)} onFocus={onF} onBlur={onB}
          placeholder="Or type address — e.g. Sector 12, Dwarka, New Delhi 110075"
          style={{ ...inp, marginBottom: 22 }} />

        {/* ── Buttons ── */}
        <div style={{ display: "flex", gap: 12 }}>
          <button onClick={submit} disabled={submitting}
            style={{ padding: "12px 28px", border: "none", borderRadius: 50, background: submitting ? "#ADB5BD" : "linear-gradient(135deg,#FF6B00,#FF8C00)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: submitting ? "not-allowed" : "pointer", boxShadow: "0 4px 16px rgba(255,107,0,.3)" }}>
            {submitting ? "⏳ Saving…" : "🚀 Submit Report"}
          </button>
          <button onClick={reset} style={{ padding: "12px 22px", border: "1.5px solid #E9ECEF", borderRadius: 50, background: "#F1F3F5", color: "#495057", fontSize: 14, fontWeight: 600, cursor: "pointer" }}>
            ↺ Reset
          </button>
        </div>

        {/* Attribution note */}
        <div style={{ marginTop: 16, padding: "10px 14px", background: "#EFF6FF", borderRadius: 10, fontSize: 12, color: "#1D4ED8", display: "flex", gap: 8, alignItems: "center" }}>
          <span>ℹ️</span>
          <span>Saved under Aadhaar <strong>{currentUser}</strong> — visible in <strong>My Reports</strong></span>
        </div>
      </div>
    </div>
  );
}
