// ─────────────────────────────────────────────────────────────
//  AADHAAR TEST IDS
// ─────────────────────────────────────────────────────────────
export const AADHAR_IDS = [
  "2345 6789 0123",
  "3456 7890 1234",
  "4567 8901 2345",
  "5678 9012 3456",
  "6789 0123 4567",
  "7890 1234 5678",
  "8901 2345 6789",
  "9012 3456 7890",
  "1234 5678 9012",
  "2468 1357 9024",
];

// ─────────────────────────────────────────────────────────────
//  PROBLEM TYPES
// ─────────────────────────────────────────────────────────────
export const PTYPES = [
  { id: "pothole",      label: "Pothole",      icon: "🕳️" },
  { id: "sewage",       label: "Open Sewage",  icon: "🚰" },
  { id: "garbage",      label: "Garbage Dump", icon: "🗑️" },
  { id: "streetlight",  label: "Street Light", icon: "💡" },
  { id: "waterlog",     label: "Waterlogging", icon: "💧" },
];

// ─────────────────────────────────────────────────────────────
//  MINISTRIES
// ─────────────────────────────────────────────────────────────
export const MINS = {
  pothole: {
    name: "Ministry of Road Transport & Highways",
    dept: "MoRTH",
    icon: "🛣️",
    bg: "#FFF7ED",
    ac: "#C2410C",
  },
  sewage: {
    name: "Ministry of Jal Shakti",
    dept: "Water & Sanitation",
    icon: "💧",
    bg: "#EFF6FF",
    ac: "#1D4ED8",
  },
  garbage: {
    name: "Ministry of Housing & Urban Affairs",
    dept: "MoHUA",
    icon: "🏙️",
    bg: "#F0FDF4",
    ac: "#15803D",
  },
  streetlight: {
    name: "Ministry of Power",
    dept: "Electricity",
    icon: "⚡",
    bg: "#FAF5FF",
    ac: "#7C3AED",
  },
  waterlog: {
    name: "Ministry of Jal Shakti",
    dept: "Water & Sanitation",
    icon: "💧",
    bg: "#EFF6FF",
    ac: "#1D4ED8",
  },
};

// ─────────────────────────────────────────────────────────────
//  RESOLUTION STAGES (7 steps)
// ─────────────────────────────────────────────────────────────
export const STAGES = [
  { icon: "📋", name: "Reported",           desc: "Complaint submitted via FixItBharat portal" },
  { icon: "🔍", name: "Under Review",       desc: "Being reviewed by local ward officer" },
  { icon: "✅", name: "Verified On-Site",   desc: "Field inspector confirmed the issue at location" },
  { icon: "📨", name: "Ministry Notified",  desc: "Assigned ministry received automated alert" },
  { icon: "📄", name: "Work Order Issued",  desc: "Department raised tender / work order for repair" },
  { icon: "🔧", name: "Repair In Progress", desc: "Repair crew deployed — work actively ongoing" },
  { icon: "🎉", name: "Resolved",           desc: "Issue fixed, citizen notified, case closed" },
];

// ─────────────────────────────────────────────────────────────
//  SEED / DEMO ISSUES
// ─────────────────────────────────────────────────────────────
export const SEED_ISSUES = [
  {
    id: "ISS001",
    type: "pothole",
    title: "Massive pothole on NH-48 near Gurugram Toll",
    desc: "A 3×2 ft pothole near the toll plaza. 4 tyre bursts this week. Dangerous at night — no warning signs.",
    loc: "NH-48, Gurugram, Haryana",
    votes: 24,
    stage: 5,
    by: "9012 3456 7890",
    date: "2026-02-20",
    photo: null,
    voters: ["9012 3456 7890"],
    stageDates: [18, 16, 14, 12, 9, 3, null],
  },
  {
    id: "ISS002",
    type: "sewage",
    title: "Open sewage overflow on Ring Road",
    desc: "Cracked pipeline — raw sewage on footpath for 6 days. Skin infections and severe odour reported.",
    loc: "Ring Road, New Delhi",
    votes: 19,
    stage: 3,
    by: "3456 7890 1234",
    date: "2026-02-28",
    photo: null,
    voters: ["3456 7890 1234"],
    stageDates: [5, 4, 3, 1, null, null, null],
  },
  {
    id: "ISS003",
    type: "garbage",
    title: "Illegal garbage dump near Kendriya Vidyalaya",
    desc: "30-ft heap near primary school gate. Rodents daily. Children walk through waste every morning.",
    loc: "Sector 15, Noida, UP",
    votes: 13,
    stage: 2,
    by: "4567 8901 2345",
    date: "2026-03-01",
    photo: null,
    voters: ["4567 8901 2345"],
    stageDates: [4, 2, 1, null, null, null, null],
  },
  {
    id: "ISS004",
    type: "streetlight",
    title: "All street lights out on MG Road 500m stretch",
    desc: "Dark for 2 weeks. 3 accidents reported. CCTV also down. Residents scared after dark.",
    loc: "MG Road, Bengaluru",
    votes: 9,
    stage: 1,
    by: "5678 9012 3456",
    date: "2026-03-03",
    photo: null,
    voters: ["5678 9012 3456"],
    stageDates: [2, 1, null, null, null, null, null],
  },
  {
    id: "ISS005",
    type: "waterlog",
    title: "Chronic waterlogging blocks residential lane",
    desc: "Standing water 4+ days after rain. Lane impassable. Dengue mosquito breeding risk rising.",
    loc: "Salt Lake, Kolkata",
    votes: 6,
    stage: 0,
    by: "6789 0123 4567",
    date: "2026-03-04",
    photo: null,
    voters: ["6789 0123 4567"],
    stageDates: [1, null, null, null, null, null, null],
  },
];
