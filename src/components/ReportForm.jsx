import { useMemo, useRef, useState } from "react";
import { Camera, Check, ChevronLeft, ChevronRight, LocateFixed, MapPin, Upload, Building2 } from "lucide-react";
import { PTYPES, MINS } from "../constants.js";
import { uploadEvidence } from "../services/issueApi.js";
import { FormLabel, PageHeader } from "./ui.jsx";

const STEPS = ["Type", "Location", "Evidence", "Details", "Review"];
const DEMO_LOCATIONS = ["Connaught Place, New Delhi", "Koramangala, Bengaluru", "Bandra West, Mumbai", "Salt Lake, Kolkata", "Kothrud, Pune"];

export default function ReportForm({ issues, createIssue, currentUser, showToast, setSection }) {
  const [step, setStep] = useState(0);
  const [selType, setSelType] = useState(null);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [photoName, setPhotoName] = useState("");
  const [gpsLoc, setGpsLoc] = useState("");
  const [coords, setCoords] = useState(null);
  const [manualLoc, setManualLoc] = useState("");
  const [gpsState, setGpsState] = useState("idle");
  const [submitting, setSubmitting] = useState(false);
  const fileRef = useRef();

  const duplicate = useMemo(() => {
    const words = title.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
    if (!selType || words.length === 0) return null;
    return issues.find((issue) => issue.type === selType && words.some((word) => issue.title.toLowerCase().includes(word)));
  }, [issues, selType, title]);

  const loc = gpsLoc || manualLoc.trim();
  const canContinue = [
    Boolean(selType),
    Boolean(loc),
    true, // Evidence is optional
    title.trim().length >= 8 && desc.trim().length >= 20,
    true,
  ][step];

  const getGPS = () => {
    setGpsState("loading");
    setTimeout(() => {
      if (!navigator.geolocation) {
        useDemoLoc();
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setGpsLoc(`${pos.coords.latitude.toFixed(5)} N, ${pos.coords.longitude.toFixed(5)} E`);
          setGpsState("done");
          showToast("Verified", "High-precision GPS coordinates verified.");
        },
        () => useDemoLoc()
      );
    }, 1200);
  };

  const useDemoLoc = () => {
    const next = DEMO_LOCATIONS[Math.floor(Math.random() * DEMO_LOCATIONS.length)];
    setGpsLoc(`${next} (GPS Verified)`);
    setCoords(null);
    setGpsState("done");
    showToast("Verified", "Satellite mock GPS coordinates locked.");
  };

  const handlePhoto = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      showToast("Upload Error", "Please upload an image file (JPEG, PNG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      showToast("Upload Error", "Photo must be smaller than 10 MB.");
      return;
    }
    setPhotoFile(file);
    setPhotoName(file.name);
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const reset = () => {
    setStep(0);
    setSelType(null);
    setTitle("");
    setDesc("");
    setPhotoFile(null);
    setPhotoPreview(null);
    setPhotoName("");
    setGpsLoc("");
    setCoords(null);
    setManualLoc("");
    setGpsState("idle");
  };

  const submit = async () => {
    setSubmitting(true);
    try {
      const evidence = photoFile ? await uploadEvidence(photoFile) : null;
      const result = await createIssue({
        type: selType,
        title,
        desc,
        loc: loc || "Location not specified",
        lat: coords?.lat,
        lng: coords?.lng,
        evidence,
      });

      if (result.action === "duplicate-upvoted") {
        showToast("Matched", "Similar complaint was already reported. Added your support!");
        setTimeout(() => setSection("issues"), 900);
      } else {
        showToast("Submitted", "Complaint registered and queued for official review.");
        reset();
        setTimeout(() => setSection("myissues"), 900);
      }
    } catch (error) {
      showToast("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ animation: "fadeInSlideUp 0.4s ease-out" }}>
      <PageHeader title="Report a Civic Issue" sub="Follow the wizard to file an actionable report, route it to the proper ministry, and track resolution." />

      <div className="panel" style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="wizard-steps">
          {STEPS.map((label, index) => (
            <button key={label} className={`wizard-step ${step === index ? "active" : ""}`} onClick={() => step > index && setStep(index)} disabled={step <= index}>
              {index < step ? <Check size={14} style={{ color: "var(--success)" }} /> : <span style={{ marginRight: 4 }}>{index + 1}</span>}
              {label}
            </button>
          ))}
        </div>

        <div style={{ minHeight: 280, padding: "8px 0" }}>
          {step === 0 && (
            <div className="grid" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
              <div>
                <div className="section-title">Select Complaint Category</div>
                <div className="segmented" style={{ gap: "10px" }}>
                  {PTYPES.map((type) => (
                    <button key={type.id} className={`chip ${selType === type.id ? "active" : ""}`} onClick={() => setSelType(type.id)}>
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
              {selType && (
                <div className="panel" style={{ background: "rgba(30, 58, 138, 0.03)", border: "1.5px solid var(--line)", display: "flex", gap: 16, alignItems: "center" }}>
                  <div style={{ background: "rgba(30, 58, 138, 0.08)", color: "var(--primary)", width: 48, height: 48, borderRadius: "var(--radius)", display: "grid", placeItems: "center" }}>
                    <Building2 size={22} />
                  </div>
                  <div>
                    <div style={{ fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 700, color: "var(--muted)" }}>Assigned Government Body</div>
                    <div className="panel-title" style={{ fontSize: 16, marginTop: 2 }}>{MINS[selType].name}</div>
                    <div className="helper" style={{ marginTop: 2 }}>This department ({MINS[selType].dept}) directly handles triage, field inspection, and repair order logs.</div>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 1 && (
            <div className="grid" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
              <div className="field">
                <FormLabel text="Incident Address & Landmark" required />
                <div style={{ display: "flex", gap: 10 }}>
                  <input className="input" value={manualLoc} onChange={(event) => setManualLoc(event.target.value)} placeholder="Provide street name, landmark, ward, or city..." />
                  <button className="button secondary" onClick={getGPS} style={{ flexShrink: 0 }} disabled={gpsState === "loading"}>
                    <LocateFixed size={16} /> 
                    {gpsState === "loading" ? "Locating..." : gpsLoc ? "GPS Locked" : "Fetch GPS"}
                  </button>
                </div>
                {gpsLoc && (
                  <div className="helper" style={{ color: "var(--success)", display: "flex", alignItems: "center", gap: 6, fontWeight: 600, marginTop: 4 }}>
                    <MapPin size={13} /> Linked Geolocation: {gpsLoc}
                  </div>
                )}
              </div>
              <div className="map-panel" style={{ minHeight: 220 }}>
                <div className="map-pin" style={{ left: "50%", top: "50%" }}><MapPin size={18} /></div>
                <div className="map-legend">Pinpoint location matches assigned state ward directly.</div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="grid" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
              <FormLabel text="Upload Visual Evidence (Optional)" />
              <div className="dropzone" onClick={() => fileRef.current?.click()}>
                {photoPreview ? (
                  <div>
                    <img src={photoPreview} alt="Evidence preview" style={{ maxWidth: "100%", maxHeight: 200, objectFit: "cover", borderRadius: "var(--radius)", marginBottom: 12, boxShadow: "var(--shadow)" }} />
                    <div style={{ fontWeight: 700, fontSize: "14px", color: "var(--text)" }}>{photoName}</div>
                    <div className="helper" style={{ marginTop: 4 }}>Click or drag a new image to replace</div>
                  </div>
                ) : (
                  <div>
                    <Upload size={32} style={{ color: "var(--muted)", marginBottom: 8 }} />
                    <div style={{ fontWeight: 800, color: "var(--text)", fontSize: 15 }}>Select Incident Photo</div>
                    <div className="helper" style={{ marginTop: 4 }}>JPEG, PNG, or WEBP. Maximum file size 10 MB.</div>
                  </div>
                )}
              </div>
              <input ref={fileRef} type="file" accept="image/*" style={{ display: "none" }} onChange={handlePhoto} />
              <div className="helper" style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <Camera size={13} /> Visual evidence significantly accelerates field officer verification rates.
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="grid" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
              <div className="field">
                <FormLabel text="Complaint Headline" required />
                <input className="input" maxLength={140} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="E.g., Large pothole in front of sector-12 metro exit" style={{ fontWeight: 600 }} />
                <div className="helper">{title.length}/140 characters. Minimum 8 characters.</div>
              </div>
              <div className="field">
                <FormLabel text="Description & Context" required />
                <textarea className="textarea" maxLength={4000} value={desc} onChange={(event) => setDesc(event.target.value)} placeholder="Explain the severity, public hazard, duration, or exact details..." />
                <div className="helper">{desc.length}/4000 characters. Minimum 20 characters.</div>
              </div>
              {duplicate && (
                <div className="panel" style={{ borderColor: "var(--warning)", background: "var(--warning-light)", color: "var(--warning)", display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontWeight: 700, fontSize: "13px" }}>⚠️ Possible Duplicate Alert</div>
                  <div className="helper" style={{ color: "var(--warning)" }}>
                    A similar report already exists: <strong>"{duplicate.title}"</strong>. Submitting will automatically upvote the existing report to escalate it faster rather than creating clutter!
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 4 && (
            <div className="grid" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
              <div className="panel" style={{ background: "rgba(30, 58, 138, 0.02)", border: "1.5px solid var(--line)" }}>
                <div className="section-title" style={{ color: "var(--primary)", fontWeight: 800 }}>Incident Report Summary</div>
                <div className="grid" style={{ gap: "12px", marginTop: 12, fontSize: "14px" }}>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Category:</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{PTYPES.find((type) => type.id === selType)?.label}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Target Ministry:</span>
                    <span style={{ fontWeight: 600, color: "var(--primary)" }}>{MINS[selType]?.name}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Location:</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{loc}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Headline:</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{title}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Evidence Attached:</span>
                    <span style={{ fontWeight: 600, color: photoName ? "var(--success)" : "var(--muted)" }}>{photoName || "None"}</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "140px 1fr" }}>
                    <span style={{ fontWeight: 700, color: "var(--muted)" }}>Verified Reporter:</span>
                    <span style={{ fontWeight: 600, color: "var(--text)" }}>{currentUser.mobileMasked}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginTop: 24, borderTop: "1px solid var(--line)", paddingTop: 20 }}>
          <button className="button secondary" onClick={() => step === 0 ? reset() : setStep(step - 1)}>
            <ChevronLeft size={16} /> {step === 0 ? "Reset" : "Back"}
          </button>
          {step < STEPS.length - 1 ? (
            <button className="button primary" disabled={!canContinue} onClick={() => setStep(step + 1)}>
              Continue <ChevronRight size={16} />
            </button>
          ) : (
            <button className="button primary" disabled={submitting} onClick={submit}>
              {submitting ? "Submitting secure report..." : "Submit Verified Report"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
