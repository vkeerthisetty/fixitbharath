import { useState } from "react";
import { KeyRound, ShieldCheck, Smartphone, Lock, Eye } from "lucide-react";
import { demoIdentities, requestLoginOtp, verifyLoginOtp } from "../services/auth.js";

export default function LoginPage({ onLogin }) {
  const [aadhaar, setAadhaar] = useState("");
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [challenge, setChallenge] = useState(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [suc, setSuc] = useState("");

  const onlyDigits = (value) => value.replace(/\D/g, "");
  const formatAadhaar = (value) =>
    onlyDigits(value)
      .slice(0, 12)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();

  const startOtp = async () => {
    setErr("");
    setSuc("");
    const aadhaarDigits = onlyDigits(aadhaar);
    const mobileDigits = onlyDigits(mobile);

    if (aadhaarDigits.length !== 12 || mobileDigits.length !== 10) {
      setErr("Please enter a valid 12-digit Aadhaar number and a 10-digit mobile number.");
      return;
    }

    setBusy(true);
    try {
      const nextChallenge = await requestLoginOtp({ aadhaar, mobile });
      setChallenge(nextChallenge);
      setSuc(`OTP successfully generated! Demo OTP: ${nextChallenge.demoOtp}`);
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  const verifyOtp = async () => {
    setErr("");
    setSuc("");
    if (!challenge) {
      setErr("Please request an OTP first.");
      return;
    }
    if (onlyDigits(otp).length !== 6) {
      setErr("Please enter the 6-digit OTP.");
      return;
    }

    setBusy(true);
    try {
      const user = await verifyLoginOtp({ aadhaar, mobile, otp: onlyDigits(otp) });
      setSuc("Verification successful! Securely signing in...");
      setTimeout(() => onLogin(user), 600);
    } catch (error) {
      setErr(error.message);
    } finally {
      setBusy(false);
    }
  };

  const fillDemo = (identity) => {
    setAadhaar(identity.demoAadhaar);
    setMobile(identity.demoMobile);
    setOtp("");
    setChallenge(null);
    setErr("");
    setSuc("");
  };

  return (
    <div className="login-shell" style={{ animation: "fadeInSlideUp 0.6s ease" }}>
      <section className="login-intro">
        <div className="brand" style={{ marginBottom: 40 }}>
          <div className="brand-mark" style={{ background: "var(--saffron-gradient)", width: 44, height: 44, fontSize: 22 }}>FB</div>
          <div>
            <div className="brand-title" style={{ fontSize: 24 }}>FixItBharat</div>
            <div className="brand-subtitle" style={{ color: "#94a3b8" }}>Citizen Triage & Resolution</div>
          </div>
        </div>

        <div className="eyebrow" style={{ color: "#ff9933" }}>Verified Public reporting portal</div>
        <h1 style={{ 
          fontFamily: "'Outfit', sans-serif", 
          fontSize: "44px", 
          lineHeight: 1.15, 
          letterSpacing: "-0.02em", 
          margin: "12px 0 16px", 
          maxWidth: "600px",
          fontWeight: 800,
          background: "linear-gradient(135deg, #ffffff 0%, #cbd5e1 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent"
        }}>
          Report local civic issues with secure Aadhaar OTP verification.
        </h1>
        <p style={{ color: "#94a3b8", fontSize: "15px", lineHeight: 1.6, maxWidth: "520px", marginBottom: "32px" }}>
          To maintain transparency and prevent spam, FixItBharat links complaints to verified citizens using masked references. Raw credentials are never displayed publicly.
        </p>

        <div className="grid grid-3" style={{ maxWidth: "680px" }}>
          {[
            { icon: ShieldCheck, title: "Verified Identity", desc: "Masked profile" },
            { icon: Smartphone, title: "Secure OTP", desc: "Instant SMS demo" },
            { icon: KeyRound, title: "Reference IDs", desc: "No raw Aadhaar" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.title} className="panel" style={{ 
                background: "rgba(255, 255, 255, 0.03)", 
                border: "1px solid rgba(255, 255, 255, 0.08)",
                padding: "16px",
                borderRadius: "var(--radius)",
                color: "#ffffff"
              }}>
                <Icon size={22} style={{ color: "#ff9933" }} />
                <div style={{ fontWeight: 700, marginTop: 10, fontSize: "14px", fontFamily: "'Outfit', sans-serif" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: 4 }}>{item.desc}</div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="login-form-wrap">
        <div style={{ maxWidth: "420px", width: "100%", margin: "0 auto" }}>
          <div style={{ display: "inline-flex", padding: "6px 12px", borderRadius: "999px", background: "rgba(30, 58, 138, 0.06)", color: "var(--primary)", alignItems: "center", gap: 6, fontSize: 12, fontWeight: 700, marginBottom: 16 }}>
            <Lock size={12} /> SECURE NATIONAL GATEWAY
          </div>
          
          <h2 style={{ fontFamily: "'Outfit', sans-serif", fontSize: "28px", fontWeight: 800, letterSpacing: "-0.01em", color: "var(--text)" }}>Sign in to Portal</h2>
          <p style={{ color: "var(--muted)", fontSize: "14px", marginTop: 4, marginBottom: 28 }}>
            Enter your credentials or choose a pre-configured profile below.
          </p>

          {err && (
            <div className="panel" style={{ 
              borderColor: "var(--danger)", 
              background: "var(--danger-light)", 
              color: "var(--danger)", 
              padding: "12px 16px", 
              fontSize: "13px", 
              fontWeight: 600,
              borderRadius: "var(--radius)",
              marginBottom: 20
            }}>
              {err}
            </div>
          )}
          
          {suc && (
            <div className="panel" style={{ 
              borderColor: "var(--success)", 
              background: "var(--success-light)", 
              color: "var(--success)", 
              padding: "12px 16px", 
              fontSize: "13px", 
              fontWeight: 600,
              borderRadius: "var(--radius)",
              marginBottom: 20
            }}>
              {suc}
            </div>
          )}

          <div className="grid" style={{ gap: "16px" }}>
            <div className="field">
              <label className="field-label">Aadhaar Card Number</label>
              <div style={{ position: "relative" }}>
                <input 
                  className="input" 
                  value={aadhaar} 
                  onChange={(event) => setAadhaar(formatAadhaar(event.target.value))} 
                  placeholder="0000 0000 0000"
                  style={{ letterSpacing: "0.08em", fontWeight: 600 }}
                  disabled={busy}
                />
              </div>
            </div>

            <div className="field">
              <label className="field-label">Aadhaar-Linked Mobile</label>
              <input 
                className="input" 
                value={mobile} 
                onChange={(event) => setMobile(onlyDigits(event.target.value).slice(0, 10))} 
                placeholder="10-digit mobile number"
                disabled={busy}
              />
            </div>

            {challenge && (
              <div className="field" style={{ animation: "fadeInSlideUp 0.3s ease" }}>
                <label className="field-label">Enter 6-Digit One-Time Password (OTP)</label>
                <input 
                  className="input" 
                  value={otp} 
                  onChange={(event) => setOtp(onlyDigits(event.target.value).slice(0, 6))} 
                  onKeyDown={(event) => event.key === "Enter" && verifyOtp()} 
                  placeholder="XXXXXX" 
                  style={{ letterSpacing: "0.12em", textAlign: "center", fontWeight: 700, fontSize: "16px" }}
                  disabled={busy}
                />
                <span className="helper">Demo OTP is <strong>123456</strong></span>
              </div>
            )}

            <button 
              className="button primary" 
              disabled={busy} 
              onClick={challenge ? verifyOtp : startOtp}
              style={{ width: "100%", marginTop: "8px" }}
            >
              {busy ? "Securing connection..." : challenge ? "Verify OTP & Access Portal" : "Generate Secure OTP"}
            </button>
          </div>

          <div className="section-title" style={{ marginTop: 32, marginBottom: 12 }}>Verified Demo Citizens</div>
          <div className="grid" style={{ gap: "10px" }}>
            {demoIdentities.map((identity) => (
              <button 
                key={identity.id} 
                className="button secondary" 
                onClick={() => fillDemo(identity)} 
                style={{ 
                  justifyContent: "space-between", 
                  width: "100%", 
                  padding: "12px 16px",
                  height: "auto",
                  border: "1.5px solid var(--line)"
                }}
              >
                <div style={{ textAlign: "left" }}>
                  <div style={{ fontWeight: 700, fontSize: "13px", color: "var(--text)" }}>{identity.aadhaarMasked}</div>
                  <div className="helper" style={{ fontSize: "11px" }}>Linked Mobile: {identity.mobileMasked}</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, color: "var(--primary)", fontSize: "11px", fontWeight: 700 }}>
                  <Eye size={12} /> SELECT
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
