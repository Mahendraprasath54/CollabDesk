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
const TaskCard = ({ task, user, onStatusChange, canEdit }) => {
  const cfg   = STATUS_CONFIG[task.status] || STATUS_CONFIG.todo
  const isOwn = task.assignedTo?._id === user?._id

  return (
    <div
      className="rounded-xl p-4 mb-3 transition-all"
      style={{
        background: isOwn ? "rgba(108,99,255,0.07)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${isOwn ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.07)"}`,
      }}
    >
      {/* Title row */}
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
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

      {/* Status select */}
      <select
        value={task.status}
        disabled={!canEdit}
        onChange={(e) => onStatusChange(task._id, e.target.value)}
        className="w-full text-xs font-semibold px-3 py-1.5 rounded-lg outline-none transition-all"
        style={{
          background: cfg.bg,
          color: cfg.color,
          border: `1px solid ${cfg.border}`,
          opacity: canEdit ? 1 : 0.5,
          cursor: canEdit ? "pointer" : "not-allowed",
          appearance: "none"
        }}
      >
        <option value="todo">To Do</option>
        <option value="in-progress">In Progress</option>
        <option value="done">Done</option>
      </select>

      {!canEdit && (
        <p className="text-xs text-slate-600 mt-1.5 text-center">View only</p>
      )}
    </div>
  )
}

export default TaskCard
