 import { useEffect, useState } from "react"
 import API from "../utils/api"
 import { STATUS_CONFIG } from "./TaskCard"

const STATUSES = ["todo", "in-progress", "done"]

const TaskDetailModal = ({ task, user, onStatusChange, onClose }) => {
  const [selected, setSelected] = useState(task.status)
  const [saving,   setSaving]   = useState(false)
  const [localDesc, setLocalDesc] = useState(task.description || "")
  const [savingDesc, setSavingDesc] = useState(false)
  const [localPriority, setLocalPriority] = useState(task.priority || "medium")
  const [savingPrio, setSavingPrio] = useState(false)

  const userId      = String(user?._id || user?.id || "")
  const creatorId   = String(task.createdBy?._id || task.createdBy || "")
  const assigneeId  = String(task.assignedTo?._id || task.assignedTo || "")

  const isCreator   = creatorId === userId
  const isAssignee  = assigneeId === userId
  const canEdit     = isCreator

  // Diagnostics for debugging permission mismatch
  useEffect(() => {
    console.log("Modal Auth Diagnostic:", { userId, creatorId, isMatch: isCreator })
  }, [userId, creatorId])

  // Update internal state if the task prop changes (from fetchTasks)
  useEffect(() => {
    setSelected(task.status)
    setLocalDesc(task.description || "")
    setLocalPriority(task.priority || "medium")
  }, [task.status, task.description, task.priority])

  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose() }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [onClose])

  const handleSave = async () => {
    if (selected === task.status) { onClose(); return }
    try {
      setSaving(true)
      await onStatusChange(task._id, selected)
      setSaving(false)
      onClose()
    } finally {
      setAddingComment(false)
    }
  }

  const handleUpdatePriority = async (newPrio) => {
    if (!canEdit || newPrio === task.priority) return
    setSavingPrio(true)
    try {
      await API.put(`/tasks/${task._id}`, { priority: newPrio })
      setLocalPriority(newPrio)
    } catch (e) {
      console.error("Priority update failed", e)
      alert("Failed to update priority")
    } finally {
      setSavingPrio(false)
    }
  }

  const handleUpdateDescription = async () => {
    if (localDesc === task.description) return
    setSavingDesc(true)
    try {
      await API.put(`/tasks/${task._id}`, { description: localDesc })
    } catch (e) {
      console.error("Description update failed", e)
      alert("Failed to save description")
    } finally {
      setSavingDesc(false)
    }
  }

  const cfg = STATUS_CONFIG[selected] || STATUS_CONFIG.todo

  const initials = (name = "") =>
    name.split(" ").map(w => w[0]).slice(0, 2).join("").toUpperCase() || "?"

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(0,0,0,0.65)", backdropFilter: "blur(8px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl fade-up overflow-hidden flex flex-col"
        style={{
          maxHeight: "92vh",
          background: "rgba(20,21,32,0.92)",
          backdropFilter: "blur(28px)",
          WebkitBackdropFilter: "blur(28px)",
          border: "1px solid rgba(255,255,255,0.1)",
          boxShadow: "0 32px 80px rgba(0,0,0,0.7)"
        }}
      >
        <div className="h-1 w-full shrink-0"
          style={{ background: `linear-gradient(90deg, ${cfg.dot}, transparent)` }} />

        <div className="p-6 overflow-y-auto custom-scrollbar">

          <div className="flex items-start justify-between gap-4 mb-5">
            <div className="flex-1">
              <span
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full mb-2"
                style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: cfg.dot }} />
                {cfg.label}
              </span>
              <h2 className="text-xl font-bold text-white leading-snug">{task.title}</h2>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 shrink-0 flex items-center justify-center rounded-xl transition-all"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)", color: "#94a3b8" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171" }}
              onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#94a3b8" }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-5">
            {[
              { label: "Created by",  name: task.createdBy?.name,  grad: "135deg, #7c3aed, #6c63ff", badge: isCreator  ? "Creator · You"   : null },
              { label: "Assigned to", name: task.assignedTo?.name, grad: "135deg, #0891b2, #06b6d4", badge: isAssignee ? "Assignee · You"  : null }
            ].map(({ label, name, grad, badge }) => (
              <div key={label} className="rounded-xl p-3"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                <p className="text-xs text-slate-500 mb-2 uppercase tracking-wider font-semibold">{label}</p>

                <div className="flex items-center gap-2">

                  <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(${grad})` }}>
                    {initials(name)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white leading-tight">{name || "—"}</p>
                    {badge && (
                      <p className="text-xs font-semibold" style={{ color: "#818cf8" }}>{badge}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Due date ── */}
          {task.dueDate && (
            <div className="flex items-center gap-2 mb-5 px-3 py-2 rounded-xl"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-sm text-slate-300">
                Due <span className="font-semibold text-white">
                  {new Date(task.dueDate).toLocaleDateString("en-US", { weekday: "short", year: "numeric", month: "short", day: "numeric" })} at {new Date(task.dueDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </span>
            </div>
          )}

          <div className="mb-5">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">
                {canEdit ? "Move to stage" : "Current Stage"}
              </p>

              {!canEdit && (
                <span className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full"
                  style={{ background: "rgba(239,68,68,0.1)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  View only
                </span>
              )}
            </div>

            <div className="flex gap-2">
              {STATUSES.map(s => {
                const c      = STATUS_CONFIG[s]
                const active = selected === s
                return (
                  <button
                    key={s}
                    disabled={!canEdit}
                    onClick={() => canEdit && setSelected(s)}
                    className="flex-1 flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl transition-all"
                    style={{
                      background: active ? c.bg      : "rgba(255,255,255,0.03)",
                      border:    `2px solid ${active ? c.border : "rgba(255,255,255,0.06)"}`,
                      cursor:    canEdit ? "pointer" : "not-allowed",
                      transform: active ? "scale(1.04)" : "scale(1)",
                      opacity:   !canEdit && !active ? 0.4 : 1
                    }}
                    onMouseEnter={e => { if (canEdit && !active) e.currentTarget.style.background = "rgba(255,255,255,0.07)" }}
                    onMouseLeave={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.03)" }}
                  >
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: c.dot }} />
                    <span className="text-xs font-semibold" style={{ color: active ? c.color : "#64748b" }}>
                      {c.label}
                    </span>
                    {active && (
                      <svg className="w-3 h-3" style={{ color: c.color }} fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="mt-5">
              <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold mb-3">Set Priority</p>
              <div className="flex gap-2">
                {[
                  { val: "low",    label: "Low",    color: "#94a3b8", bg: "rgba(148,163,184,0.1)", border: "rgba(148,163,184,0.3)" },
                  { val: "medium", label: "Medium", color: "#10b981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.3)" },
                  { val: "high",   label: "High",   color: "#f43f5e", bg: "rgba(225,29,72,0.1)",   border: "rgba(225,29,72,0.3)" }
                ].map(p => {
                  const active = localPriority === p.val
                  return (
                    <button
                      key={p.val}
                      disabled={!canEdit || savingPrio}
                      onClick={() => handleUpdatePriority(p.val)}
                      className="flex-1 py-2 px-1 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all"
                      style={{
                        background: active ? p.bg : "rgba(255,255,255,0.03)",
                        border: `1px solid ${active ? p.border : "rgba(255,255,255,0.08)"}`,
                        color: active ? p.color : "#475569",
                        cursor: canEdit ? "pointer" : "not-allowed",
                        opacity: !active && !canEdit ? 0.4 : 1
                      }}
                    >
                      {active && savingPrio ? "..." : p.label}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="mt-4 pt-3 flex flex-col gap-1 items-center border-t border-white/5">
              <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-widest">Permissions</p>
              <div className="flex gap-4">
                <span className="text-[10px] flex items-center gap-1" style={{ color: "#94a3b8" }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" /> Description: Open to Team
                </span>
                <span className="text-[10px] flex items-center gap-1" style={{ color: canEdit ? "#818cf8" : "#f87171" }}>
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: canEdit ? "#818cf8" : "#f87171" }} /> 
                  Stages & Priority: {canEdit ? "You can Move" : "Creator Only"}
                </span>
              </div>
            </div>
          </div>

          {/* ── Collaborative Content: Description ── */}
          <div className="mb-5">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Description</p>
              {localDesc !== (task.description || "") && (
                <button 
                  onClick={handleUpdateDescription}
                  disabled={savingDesc}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold text-white transition-all"
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                    boxShadow: "0 4px 12px rgba(108,99,255,0.25)"
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = "translateY(-1px)"}
                  onMouseLeave={e => e.currentTarget.style.transform = "translateY(0)"}
                >
                  {savingDesc ? (
                    <div className="w-2.5 h-2.5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  ) : (
                    <svg className="w-2.5 h-2.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {savingDesc ? "Saving" : "Save Changes"}
                </button>
              )}
            </div>
            <textarea
              value={localDesc}
              onChange={e => setLocalDesc(e.target.value)}
              placeholder="Add a detailed description..."
              className="w-full rounded-xl p-3 text-sm text-slate-300 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all custom-scrollbar min-h-[140px]"
              style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
            />
          </div>

          <div className="mb-4" style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }} />

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={saving || savingDesc}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-all"
              style={{ background: "rgba(255,255,255,0.05)", color: "#94a3b8", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Close
            </button>

            {canEdit && (
              <button
                onClick={handleSave}
                disabled={saving || savingDesc}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all"
                style={{
                  background: selected !== task.status
                    ? "linear-gradient(135deg, #6c63ff, #4f46e5)"
                    : "rgba(255,255,255,0.06)",
                  boxShadow: selected !== task.status ? "0 4px 16px rgba(108,99,255,0.3)" : "none",
                  color:     selected !== task.status ? "#fff" : "#64748b"
                }}
              >
                {saving
                  ? <span className="spinner" />
                  : <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                }
                {saving ? "Saving…" : "Save Status"}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskDetailModal
