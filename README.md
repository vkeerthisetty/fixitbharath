# 🇮🇳 FixItBharat — नागरिक शिकायत पोर्टल

**Citizen Civic Issue Reporting & Resolution Tracker**  
Built for the public good — report potholes, sewage, garbage, street lights, and waterlogging directly to the responsible ministry.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 🗂️ Project Structure

```
fixitbharat/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── AllIssues.jsx       # All reported issues with filters
│   │   ├── Dashboard.jsx       # Overview stats & activity feed
│   │   ├── IssueCard.jsx       # Single issue card with upvote + progress
│   │   ├── LoginPage.jsx       # Aadhaar login screen
│   │   ├── Ministries.jsx      # Ministry dashboard
│   │   ├── MyReports.jsx       # Per-Aadhaar personal report history
│   │   ├── ProgressTracker.jsx # 7-stage resolution tracker
│   │   ├── ReportForm.jsx      # Issue submission form
│   │   └── ui.jsx              # Shared UI primitives
│   ├── utils/
│   │   ├── helpers.js          # Priority, ETA, color helpers
│   │   └── storage.js          # localStorage read/write
│   ├── App.jsx                 # Root component + routing
│   ├── constants.js            # Aadhaar IDs, problem types, ministries, seed data
│   └── main.jsx                # React entry point
├── index.html
├── package.json
└── vite.config.js
```

---

## ✨ Features

| Feature | Details |
|---|---|
| 🔐 Aadhaar Login | 10 test IDs, per-user data isolation |
| 📝 Issue Reporting | Title, description, photo upload, GPS location |
| 👤 My Reports | Each Aadhaar sees only their own complaints |
| 👍 Community Upvoting | Vote to escalate — auto-priority at 6/12/20 votes |
| 📊 Progress Tracker | 7-stage tracker with dates and ETA |
| 🏛️ Ministry Assignment | Auto-routes to correct government ministry |
| 💾 Persistent Storage | Issues survive page refresh via localStorage |
| 🔄 Multi-tab Sync | Polls every 4 s to sync across browser tabs |

---

## 🗺️ Problem Types & Ministries

| Problem | Ministry |
|---|---|
| 🕳️ Pothole | Ministry of Road Transport & Highways (MoRTH) |
| 🚰 Open Sewage | Ministry of Jal Shakti |
| 🗑️ Garbage Dump | Ministry of Housing & Urban Affairs (MoHUA) |
| 💡 Street Light | Ministry of Power |
| 💧 Waterlogging | Ministry of Jal Shakti |

---

## 🔑 Test Credentials

Use any Aadhaar from the login screen. Password: **`demo123`**

Each Aadhaar ID gets its own separate "My Reports" view — reports filed under one ID are **never visible** under another.

---

## 🛠️ Tech Stack

- **React 18** + **Vite**
- **localStorage** for persistence (no backend required)
- Pure CSS-in-JS inline styles (no external CSS framework)
- No external UI libraries — fully self-contained

---

## 📦 Build for Production

```bash
npm run build
# Output goes to /dist — ready to deploy on Vercel / Netlify / GitHub Pages
```

---

*Made with ❤️ for the Hackathon — FixItBharat aims to bridge the gap between citizens and government.*
