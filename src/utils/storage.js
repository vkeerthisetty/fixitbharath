/**
 * storage.js
 *
 * Thin wrapper around localStorage so the rest of the app doesn't
 * need to know about the underlying storage mechanism.
 *
 * Keys used:
 *   fixitbharat-issues     – JSON array of ALL issues (shared)
 *   fib-user-<aadhaar>     – JSON array of issue IDs filed by that user
 */

const ISSUES_KEY = "fixitbharat-issues";
const userKey = (uid) => `fib-user-${uid.replace(/\s/g, "")}`;

// ── Issues (all) ──────────────────────────────────────────────

export function readIssues() {
  try {
    const raw = localStorage.getItem(ISSUES_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function writeIssues(list) {
  try {
    localStorage.setItem(ISSUES_KEY, JSON.stringify(list));
    return true;
  } catch (e) {
    console.error("writeIssues failed:", e);
    return false;
  }
}

// ── Per-user issue ID list ────────────────────────────────────

export function readUserIssueIds(uid) {
  try {
    const raw = localStorage.getItem(userKey(uid));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function appendUserIssueId(uid, issueId) {
  const existing = readUserIssueIds(uid);
  const updated = [...existing, issueId];
  try {
    localStorage.setItem(userKey(uid), JSON.stringify(updated));
  } catch (e) {
    console.error("appendUserIssueId failed:", e);
  }
}
