import { STAGES } from "../constants.js";
import { daysAgoLabel } from "../utils/helpers.js";

export default function ProgressTracker({ issue, compact = false }) {
  const current = Math.min(issue.stage, STAGES.length - 1);
  const visibleStages = compact ? STAGES.slice(Math.max(0, current - 1), Math.min(STAGES.length, current + 2)) : STAGES;

  return (
    <div className="timeline" style={{ gap: compact ? "12px" : "18px" }}>
      {visibleStages.map((stage) => {
        const realIndex = STAGES.indexOf(stage);
        const done = realIndex < current;
        const active = realIndex === current;
        const timeLabel = done
          ? issue.stageDates?.[realIndex] != null ? daysAgoLabel(issue.stageDates[realIndex]) : "Verified"
          : active
            ? "Current Stage"
            : "Queue Pending";

        return (
          <div key={stage.name} className={`timeline-item ${done ? "done" : ""} ${active ? "active" : ""}`} style={{ animation: "fadeInSlideUp 0.3s ease" }}>
            <span className="timeline-dot" />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div style={{ 
                fontWeight: active ? 800 : 700, 
                fontSize: 13, 
                color: active ? "var(--text)" : done ? "var(--text)" : "var(--muted)",
                fontFamily: "'Outfit', sans-serif"
              }}>
                {stage.name}
              </div>
              <div className="helper" style={{ fontSize: 11, lineHeight: 1.3 }}>{stage.desc}</div>
            </div>
            <span 
              className="helper" 
              style={{ 
                fontWeight: active || done ? 700 : 500, 
                color: active ? "var(--accent)" : done ? "var(--success)" : "var(--muted)",
                fontSize: 11,
                whiteSpace: "nowrap"
              }}
            >
              {timeLabel}
            </span>
          </div>
        );
      })}
    </div>
  );
}
