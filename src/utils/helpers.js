export const getPriority = (votes) => {
  if (votes >= 20) return "critical";
  if (votes >= 12) return "high";
  if (votes >= 6) return "medium";
  return "low";
};

export const getEtaDays = (votes, stage) => {
  if (stage >= 6) return 0;
  const base = Math.max(2, 22 - votes);
  const stageBonus = [0, -1, -2, -3, -5, -8, 0][Math.min(stage, 6)];
  return Math.max(1, base + stageBonus);
};

export const getPct = (stage) => Math.round((stage / 6) * 100);

export const getPriorityColor = (priority) =>
  ({ critical: "#b42318", high: "#c85a1f", medium: "#b7791f", low: "#177245" })[priority];

export const todayStr = () => new Date().toISOString().slice(0, 10);

export const daysAgoLabel = (n) => {
  if (n == null) return "-";
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
};
