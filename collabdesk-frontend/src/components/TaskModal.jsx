import { useEffect, useRef } from "react"

const TaskModal = ({ users, title, setTitle, description, setDescription, assignedTo, setAssignedTo, dueDate, setDueDate, creating, onSubmit, onClose }) => {

  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, []) // Empty dependency to focus only on mount

  useEffect(() => {
    document.body.style.overflow = "hidden"
    return () => { document.body.style.overflow = "" }
  }, [])

  const inputStyle = {
    width: "100%",
    padding: "11px 14px",
    background: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "12px",
    color: "#fff",
    fontSize: "14px",
    fontFamily: "inherit",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s"
  }

  const handleFocus = (e) => {
    e.target.style.borderColor  = "rgba(108,99,255,0.7)"
    e.target.style.boxShadow    = "0 0 0 3px rgba(108,99,255,0.12)"
  }
  const handleBlur  = (e) => {
    e.target.style.borderColor = "rgba(255,255,255,0.1)"
    e.target.style.boxShadow   = "none"
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.6)", backdropFilter: "blur(6px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      {/* ── Modal card ── */}
      <div
        className="relative w-full max-w-md rounded-2xl p-6 fade-up"
        style={{
          background: "rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.12)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04) inset"
        }}
      >
        
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h2 className="text-white font-bold text-lg">New Task</h2>
          </div>

          
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8"
            }}
            onMouseEnter={e => {
              e.currentTarget.style.background = "rgba(239,68,68,0.15)"
              e.currentTarget.style.color = "#f87171"
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.2)"
            }}
            onMouseLeave={e => {
              e.currentTarget.style.background = "rgba(255,255,255,0.06)"
              e.currentTarget.style.color = "#94a3b8"
              e.currentTarget.style.borderColor = "rgba(255,255,255,0.08)"
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        
        <form onSubmit={onSubmit} className="space-y-4">

          
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Task Title <span style={{ color: "#818cf8" }}>*</span>
            </label>
            <input
              ref={inputRef}
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Description <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Add more details about this task..."
              rows={3}
              style={{ ...inputStyle, resize: "none" }}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Assign To <span style={{ color: "#818cf8" }}>*</span>
            </label>
            <div className="relative">
              <select
                value={assignedTo}
                onChange={e => setAssignedTo(e.target.value)}
                style={{ ...inputStyle, appearance: "none", cursor: "pointer", paddingRight: "36px" }}
                onFocus={handleFocus}
                onBlur={handleBlur}
              >
                <option value="" style={{ background: "#1a1b26" }}>Select a team member…</option>
                {users.map(u => (
                  <option key={u._id} value={u._id} style={{ background: "#1a1b26" }}>
                    {u.name}
                  </option>
                ))}
              </select>
              <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none text-slate-400"
                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Due Date & Time <span className="text-slate-600 normal-case font-normal">(optional)</span>
            </label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
              style={inputStyle}
              onFocus={handleFocus}
              onBlur={handleBlur}
            />
          </div>

          <div className="pt-1" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{
                background: "rgba(255,255,255,0.05)",
                color: "#94a3b8",
                border: "1px solid rgba(255,255,255,0.08)"
              }}
              onMouseEnter={e => (e.currentTarget.style.background = "rgba(255,255,255,0.09)")}
              onMouseLeave={e => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={creating || !title.trim() || !assignedTo}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                boxShadow: "0 4px 16px rgba(108,99,255,0.3)",
                opacity: (creating || !title.trim() || !assignedTo) ? 0.5 : 1
              }}
            >
              {creating ? <span className="spinner" /> : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              )}
              {creating ? "Adding…" : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TaskModal
