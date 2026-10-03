import { SEED_ISSUES, MINS } from "../constants.js";
import { todayStr } from "../utils/helpers.js";

const DB_KEY = "fixitbharat-db-v2";
const LEGACY_USERS = {
  "9012 3456 7890": "citizen_001",
  "3456 7890 1234": "citizen_002",
  "2345 6789 0123": "citizen_003",
  "4567 8901 2345": "citizen_003",
  "5678 9012 3456": "citizen_002",
  "6789 0123 4567": "citizen_001",
};

const delay = () => new Promise((resolve) => setTimeout(resolve, 250));

function normalizeSeedIssue(issue) {
  const reporterId = LEGACY_USERS[issue.by] || "citizen_001";
  return {
    ...issue,
    by: reporterId,
    reporterId,
    reporterDisplay: "Verified citizen",
    photoUrl: issue.photo || null,
    photo: issue.photo || null,
    voters: (issue.voters || []).map((voter) => LEGACY_USERS[voter] || voter),
    statusHistory: (issue.stageDates || []).map((daysAgo, stage) => ({
      stage,
      actorType: stage === 0 ? "citizen" : "department",
      note: stage === 0 ? "Report submitted" : "Workflow checkpoint recorded",
      daysAgo,
    })),
    assignedMinistry: MINS[issue.type]?.name || "Unassigned",
    moderationStatus: "approved",
  };
}

function initialDb() {
  return {
    issues: SEED_ISSUES.map(normalizeSeedIssue),
    auditLogs: [],
    uploads: [],
  };
}

function readDb() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const db = initialDb();
      writeDb(db);
      return db;
    }
    return JSON.parse(raw);
  } catch {
    const db = initialDb();
    writeDb(db);
    return db;
  }
}

function writeDb(db) {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

function audit(db, action, actorId, targetId, metadata = {}) {
  db.auditLogs.unshift({
    id: `audit_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    action,
    actorId,
    targetId,
    metadata,
    createdAt: new Date().toISOString(),
  });
}

function findDuplicate(issues, type, title) {
  const words = title.toLowerCase().split(/\s+/).filter((word) => word.length > 4);
  return issues.find(
    (issue) =>
      issue.type === type &&
      issue.moderationStatus !== "rejected" &&
      words.some((word) => issue.title.toLowerCase().includes(word))
  );
}

export async function listIssues() {
  await delay();
  return readDb().issues;
}

export async function uploadEvidence(file) {
  if (!file) return null;
  if (!file.type.startsWith("image/")) {
    throw new Error("Only image evidence is supported.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("Photo must be smaller than 10 MB.");
  }

  const dataUrl = await new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const db = readDb();
  const upload = {
    id: `upload_${Date.now()}`,
    fileName: file.name,
    mimeType: file.type,
    size: file.size,
    url: dataUrl,
    createdAt: new Date().toISOString(),
  };
  db.uploads.unshift(upload);
  writeDb(db);
  return upload;
}

export async function createIssue(payload, actor) {
  const db = readDb();
  const title = payload.title.trim();
  const duplicate = findDuplicate(db.issues, payload.type, title);

  if (duplicate) {
    const updated = await voteIssue(duplicate.id, actor);
    return { action: "duplicate-upvoted", issue: updated };
  }

  const issue = {
    id: `ISS-${Date.now()}`,
    type: payload.type,
    title,
    desc: payload.desc.trim(),
    loc: payload.loc || "Location not specified",
    lat: payload.lat || null,
    lng: payload.lng || null,
    votes: 1,
    stage: 0,
    by: actor.id,
    reporterId: actor.id,
    reporterDisplay: actor.mobileMasked || "Verified citizen",
    date: todayStr(),
    photo: payload.evidence?.url || null,
    photoUrl: payload.evidence?.url || null,
    evidenceId: payload.evidence?.id || null,
    voters: [actor.id],
    assignedMinistry: MINS[payload.type]?.name || "Unassigned",
    moderationStatus: "pending_review",
    stageDates: [0, null, null, null, null, null, null],
    statusHistory: [
      {
        stage: 0,
        actorType: "citizen",
        actorId: actor.id,
        note: "Report submitted and queued for triage",
        createdAt: new Date().toISOString(),
      },
    ],
    createdAt: new Date().toISOString(),
  };

  db.issues.unshift(issue);
  audit(db, "issue.created", actor.id, issue.id, { type: issue.type });
  writeDb(db);
  await delay();
  return { action: "created", issue };
}

export async function voteIssue(issueId, actor) {
  const db = readDb();
  const issue = db.issues.find((item) => item.id === issueId);
  if (!issue) throw new Error("Issue not found.");
  issue.voters = issue.voters || [];
  if (issue.voters.includes(actor.id)) return issue;

  const currentVotes = Number.isFinite(Number(issue.votes)) ? Number(issue.votes) : issue.voters.length;
  issue.voters.push(actor.id);
  issue.votes = Math.max(currentVotes + 1, issue.voters.length);
  audit(db, "issue.voted", actor.id, issue.id);
  writeDb(db);
  await delay();
  return issue;
}

export async function updateIssueStage(issueId, nextStage, actor, note) {
  const db = readDb();
  const issue = db.issues.find((item) => item.id === issueId);
  if (!issue) throw new Error("Issue not found.");
  if (nextStage < issue.stage || nextStage > 6) {
    throw new Error("Invalid workflow transition.");
  }

  issue.stage = nextStage;
  issue.stageDates[nextStage] = 0;
  issue.statusHistory.unshift({
    stage: nextStage,
    actorType: "department",
    actorId: actor.id,
    note: note || "Status updated",
    createdAt: new Date().toISOString(),
  });
  audit(db, "issue.stage_updated", actor.id, issue.id, { nextStage });
  writeDb(db);
  await delay();
  return issue;
}
