// ─────────────────────────────────────────────────────────────
//  PRIORITY HELPERS
// ─────────────────────────────────────────────────────────────

/** Returns priority level string based on vote count */
export const getPriority = (votes) => {
  if (votes >= 20) return "critical";
  if (votes >= 12) return "high";
  if (votes >= 6)  return "medium";
  return "low";
};

/** Returns estimated days to resolve based on votes and current stage */
export const getEtaDays = (votes, stage) => {
  if (stage >= 6) return 0;
  const base = Math.max(2, 22 - votes);
  const stageBonus = [0, -1, -2, -3, -5, -8, 0][Math.min(stage, 6)];
  return Math.max(1, base + stageBonus);
};

/** Returns completion percentage 0–100 */
export const getPct = (stage) => Math.round((stage / 6) * 100);

/** Returns hex color for a priority level */
export const getPriorityColor = (priority) =>
  ({ critical: "#DC2626", high: "#FF6B00", medium: "#F59E0B", low: "#138808" })[priority];

// ─────────────────────────────────────────────────────────────
//  DATE HELPERS
// ─────────────────────────────────────────────────────────────

/** Returns today as YYYY-MM-DD */
export const todayStr = () => new Date().toISOString().slice(0, 10);

/**
 * Given a "days ago" offset (e.g. 5 = 5 days ago), returns a formatted
 * date string like "28 Feb". Returns "—" for null/undefined.
 */
export const daysAgoLabel = (n) => {
  if (n == null) return "—";
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
