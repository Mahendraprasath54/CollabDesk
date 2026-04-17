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

// ── TaskCard component ───────────────────────────────
const TaskCard = ({ task, user, onClick }) => {
  const cfg   = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const isOwn = task.assignedTo?._id === user?._id

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 mb-3 transition-all cursor-pointer group"
      style={{
        background: isOwn ? "rgba(108,99,255,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isOwn ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.07)"}`,
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = "translateY(-2px)"
        e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.3)"
        e.currentTarget.style.borderColor = isOwn ? "rgba(108,99,255,0.4)" : "rgba(255,255,255,0.14)"
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = "translateY(0)"
        e.currentTarget.style.boxShadow = "none"
        e.currentTarget.style.borderColor = isOwn ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.07)"
      }}
    >
      {/* Title + badge row */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <p className="text-sm font-semibold text-white leading-snug">{task.title}</p>
        {isOwn && (
          <span className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(108,99,255,0.15)", color: "#818cf8" }}>
            Mine
          </span>
        )}
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
            <svg className="w-3 h-3 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs text-slate-400">{new Date(task.dueDate).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Status pill + click hint */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1.5"
          style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
        >
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
