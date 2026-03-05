import { useState, useRef } from "react";
import { AADHAR_IDS } from "../constants.js";

export default function LoginPage({ onLogin }) {
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState("");
  const [suc, setSuc] = useState("");
  const r2 = useRef(), r3 = useRef(), rp = useRef();

  const handleDigits = (val, setter, nextRef) => {
    const v = val.replace(/\D/g, "");
    setter(v);
    if (v.length === 4 && nextRef) nextRef.current?.focus();
  };

  const fillTest = (id) => {
    const parts = id.split(" ");
    setA1(parts[0]); setA2(parts[1]); setA3(parts[2]);
    rp.current?.focus();
  };

  const doLogin = () => {
    const aadhaar = `${a1} ${a2} ${a3}`;
    setErr(""); setSuc("");
    if (a1.length !== 4 || a2.length !== 4 || a3.length !== 4) {
      setErr("❌ Aadhaar must be 12 digits (XXXX-XXXX-XXXX)"); return;
    }
    if (!AADHAR_IDS.includes(aadhaar)) {
      setErr("❌ Aadhaar not found in registry. Use a test ID below."); return;
    }
    if (pwd !== "demo123") {
      setErr("❌ Wrong password. Use: demo123"); return;
    }
    setSuc("✅ Aadhaar verified! Logging in…");
    setTimeout(() => onLogin(aadhaar), 700);
  };

  const inp = {
    width: "100%", padding: "12px 16px", border: "1.5px solid #E9ECEF",
    borderRadius: 8, fontSize: 14, outline: "none", fontFamily: "inherit",
    color: "#212529", background: "#fff", transition: "border-color .2s",
  };
  const onFocus = (e) => (e.target.style.borderColor = "#FF6B00");
  const onBlur  = (e) => (e.target.style.borderColor = "#E9ECEF");

  return (
    <div style={{ fontFamily: "'Noto Sans', sans-serif", background: "linear-gradient(135deg,#fff8f3,#f0f4ff,#f0fff0)", minHeight: "100vh" }}>
      {/* Tricolor stripe */}
      <div style={{ height: 5, background: "linear-gradient(to right,#FF6B00 33%,#fff 33%,#fff 66%,#138808 66%)" }} />

      <nav style={{ background: "#fff", padding: "13px 28px", boxShadow: "0 2px 12px rgba(0,0,0,.06)" }}>
        <div style={{ fontFamily: "Georgia, serif", fontSize: 22, fontWeight: 800, color: "#FF6B00" }}>
          FixIt<span style={{ color: "#138808" }}>Bharat</span>
        </div>
        <div style={{ fontSize: 10, color: "#ADB5BD", letterSpacing: "1.5px", textTransform: "uppercase", marginTop: 1 }}>
          नागरिक शिकायत पोर्टल · Citizen Issue Tracker
        </div>
      </nav>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "48px 20px" }}>
        <div style={{ background: "#fff", borderRadius: 24, padding: "44px 38px", width: "100%", maxWidth: 450, boxShadow: "0 20px 60px rgba(0,0,0,.10)" }}>

          <div style={{ width: 70, height: 70, background: "linear-gradient(135deg,#FF6B00,#000080)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 18px", fontSize: 30 }}>🇮🇳</div>
          <div style={{ fontFamily: "Georgia, serif", fontSize: 26, fontWeight: 800, textAlign: "center", color: "#FF6B00", marginBottom: 4 }}>FixItBharat</div>
          <div style={{ textAlign: "center", fontSize: 13, color: "#ADB5BD", marginBottom: 28 }}>Secure Aadhaar Login</div>

          {err && <div style={{ background: "#FFF0F0", border: "1px solid #FFB3B3", color: "#CC0000", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{err}</div>}
          {suc && <div style={{ background: "#e8f5e9", border: "1px solid #A5D6A7", color: "#138808", padding: "10px 14px", borderRadius: 8, fontSize: 13, marginBottom: 14 }}>{suc}</div>}

          {/* Aadhaar input */}
          <label style={{ fontSize: 12, fontWeight: 700, color: "#495057", display: "block", marginBottom: 6, letterSpacing: 0.3 }}>AADHAAR NUMBER</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 6 }}>
            {[[a1, setA1, r2, null], [a2, setA2, r3, r2], [a3, setA3, null, r3]].map(([v, set, nxt, ref], i) => (
              <input key={i} ref={ref || undefined} type="text" maxLength={4} value={v}
                onChange={(e) => handleDigits(e.target.value, set, nxt)}
                onFocus={onFocus} onBlur={onBlur} placeholder="XXXX"
                style={{ ...inp, flex: 1, textAlign: "center", letterSpacing: 3, fontSize: 17, fontWeight: 700, fontFamily: "monospace", padding: "12px 6px" }} />
            ))}
          </div>
          <div style={{ fontSize: 11, color: "#ADB5BD", marginBottom: 16 }}>Format: XXXX – XXXX – XXXX (12 digits)</div>

          {/* Password */}
          <label style={{ fontSize: 12, fontWeight: 700, color: "#495057", display: "block", marginBottom: 6, letterSpacing: 0.3 }}>PASSWORD</label>
          <input type="password" value={pwd} ref={rp}
            onChange={(e) => setPwd(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && doLogin()}
            onFocus={onFocus} onBlur={onBlur}
            placeholder="Enter your password"
            style={{ ...inp, marginBottom: 16 }} />

          <button onClick={doLogin} style={{ width: "100%", padding: 13, border: "none", borderRadius: 50, background: "linear-gradient(135deg,#FF6B00,#FF8C00)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", boxShadow: "0 4px 16px rgba(255,107,0,.3)", marginBottom: 20 }}>
            🔐 Verify &amp; Login
          </button>

          {/* Test IDs */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, color: "#ADB5BD", fontSize: 11 }}>
            <div style={{ flex: 1, height: 1, background: "#E9ECEF" }} />
            Test Aadhaar IDs — click to autofill
            <div style={{ flex: 1, height: 1, background: "#E9ECEF" }} />
          </div>
          <div style={{ background: "#F8F9FA", border: "1px solid #E9ECEF", borderRadius: 8, padding: 10, maxHeight: 185, overflowY: "auto" }}>
            {AADHAR_IDS.map((id) => (
              <div key={id} onClick={() => fillTest(id)}
                style={{ display: "flex", justifyContent: "space-between", padding: "7px 10px", borderRadius: 6, cursor: "pointer", fontFamily: "monospace", fontSize: 13 }}
                onMouseEnter={(e) => (e.currentTarget.style.background = "#FFF3E8")}
                onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                <span>{id}</span>
                <span style={{ background: "#e8f5e9", color: "#138808", padding: "2px 8px", borderRadius: 50, fontSize: 10, fontWeight: 700 }}>✓ Verified</span>
              </div>
            ))}
          </div>
          <p style={{ fontSize: 11, color: "#ADB5BD", textAlign: "center", marginTop: 10 }}>
            Password for all IDs: <strong>demo123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
