// ── Status config — shared across board columns ──────
export const STATUS_CONFIG = {
  todo: {
    label: "To Do",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    border: "rgba(245,158,11,0.2)",
    dot: "#f59e0b"
  },
  "in-progress": {
    label: "In Progress",
    color: "#6c63ff",
    bg: "rgba(108,99,255,0.1)",
    border: "rgba(108,99,255,0.2)",
    dot: "#818cf8"
  },
  done: {
    label: "Done",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
    border: "rgba(16,185,129,0.2)",
    dot: "#34d399"
  }
}

// ── Urgency helper ────────────────────────────────────
// Returns whole days until due date (0 = due today, 1 = tomorrow…)
// Returns null if no dueDate.
export const getDaysLeft = (dueDate) => {
  if (!dueDate) return null
  const now = new Date(); now.setHours(0, 0, 0, 0)
  const due = new Date(dueDate); due.setHours(0, 0, 0, 0)
  return Math.round((due - now) / (1000 * 60 * 60 * 24))
}

const URGENCY = {
  critical: { border: "rgba(239,68,68,0.6)",   bg: "rgba(239,68,68,0.08)",   badge: "#f87171", badgeBg: "rgba(239,68,68,0.15)",  badgeBorder: "rgba(239,68,68,0.3)"  },
  warning:  { border: "rgba(245,158,11,0.55)", bg: "rgba(245,158,11,0.06)",  badge: "#fbbf24", badgeBg: "rgba(245,158,11,0.12)", badgeBorder: "rgba(245,158,11,0.3)" },
}

// ── TaskCard component ────────────────────────────────
const TaskCard = ({ task, user, onClick }) => {
  const cfg    = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const isOwn  = String(task.assignedTo?._id || "") === String(user?._id || user?.id || "")

  const daysLeft = getDaysLeft(task.dueDate)
  const isDone   = task.status === "done"
  const isCritical = !isDone && daysLeft !== null && daysLeft <= 1   // today or tomorrow
  const isWarning  = !isDone && daysLeft !== null && daysLeft <= 3 && !isCritical

  const urgency = isCritical ? URGENCY.critical : isWarning ? URGENCY.warning : null

  // Due date label
  const dueDateLabel = () => {
    if (daysLeft === null) return null
    const timeStr = new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    if (daysLeft === 0) return `Due today at ${timeStr}`
    if (daysLeft === 1) return `Due tomorrow at ${timeStr}`
    if (daysLeft <= 3) return `In ${daysLeft} days`
    return new Date(task.dueDate).toLocaleDateString()
  }

  const borderBase  = urgency ? urgency.border  : isOwn ? "rgba(108,99,255,0.2)"  : "rgba(255,255,255,0.07)"
  const borderHover = urgency ? urgency.border  : isOwn ? "rgba(108,99,255,0.4)"  : "rgba(255,255,255,0.14)"
  const bgBase      = urgency ? urgency.bg      : isOwn ? "rgba(108,99,255,0.07)" : "rgba(255,255,255,0.03)"

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 mb-3 transition-all cursor-pointer group"
      style={{
        background: bgBase,
        border: `1px solid ${borderBase}`,
        boxShadow: urgency ? `0 0 0 1px ${urgency.border}` : "none"
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = urgency
          ? `0 8px 24px rgba(0,0,0,0.3), 0 0 0 1px ${urgency.border}`
          : "0 8px 24px rgba(0,0,0,0.3)"
        e.currentTarget.style.borderColor = borderHover
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform  = "translateY(0)"
        e.currentTarget.style.boxShadow  = urgency ? `0 0 0 1px ${urgency.border}` : "none"
        e.currentTarget.style.borderColor = borderBase
      }}
    >
      {/* Title + badge row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-white leading-snug">{task.title}</p>
        <div className="flex flex-col items-end gap-1 shrink-0">
          {isOwn && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
              style={{ background: "rgba(108,99,255,0.15)", color: "#818cf8" }}>
              Mine
            </span>
          )}
          {urgency && (
            <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: urgency.badgeBg, color: urgency.badge, border: `1px solid ${urgency.badgeBorder}` }}>
              {isCritical && (
                <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              )}
              {dueDateLabel()}
            </span>
          )}
        </div>
      </div>

      {/* Meta */}
      <div className="space-y-1 mb-3">
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          <span className="text-xs text-slate-400">{task.assignedTo?.name || "Unassigned"}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-xs text-slate-500">by {task.createdBy?.name || "Unknown"}</span>
        </div>
        {task.dueDate && (
          <div className="flex items-center gap-1.5">
            <svg className="w-3 h-3" style={{ color: isCritical ? "#f87171" : isWarning ? "#fbbf24" : "#64748b" }}
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs font-medium"
              style={{ color: isCritical ? "#f87171" : isWarning ? "#fbbf24" : "#94a3b8" }}>
              {new Date(task.dueDate).toLocaleDateString()} at {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        )}
      </div>

      {/* Status pill + view hint */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
          <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: cfg.dot }} />
          {cfg.label}
        </span>
        <span className="text-xs text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          View
        </span>
      </div>
    </div>
  )
}

export default TaskCard
