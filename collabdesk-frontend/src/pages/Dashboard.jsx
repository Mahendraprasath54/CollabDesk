import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import socket from "../utils/socket"
import Header from "../components/Header"
import TaskCard, { STATUS_CONFIG } from "../components/TaskCard"
import TaskModal from "../components/TaskModal"
import TaskDetailModal from "../components/TaskDetailModal"

const Dashboard = () => {
  const navigate = useNavigate()
  const [tasks,      setTasks]     = useState([])
  const [users,      setUsers]     = useState([])
  const [title,      setTitle]     = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [dueDate,    setDueDate]   = useState("")
  const [filter,     setFilter]    = useState("all")
  const [creating,   setCreating]  = useState(false)
  const [showForm,   setShowForm]  = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) } catch { return null }
  })()

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/")
  }, [navigate])

  const fetchTasks = async () => {
    try {
      const res = await API.get("/tasks")
      setTasks(res.data)
    }  catch(e) {
        console.log(e);
     }
  }

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users")
      setUsers(res.data)
    }  catch(e) {
        console.log(e);
     }
  }

  
  const fetchTasksRef = useRef(fetchTasks)
  useEffect(() => { fetchTasksRef.current = fetchTasks })

  useEffect(() => {
    fetchTasks()
    fetchUsers()
    const handler = () => fetchTasksRef.current()
    socket.on("taskUpdated", handler)
    return () => socket.off("taskUpdated", handler)
  }, [])

  const createTask = async (e) => {
    e.preventDefault()
    if (!title || !assignedTo) return
    setCreating(true)
    try {
      await API.post("/tasks", { title, assignedTo, dueDate })
      await fetchTasks()      // update board immediately
      setTitle(""); setAssignedTo(""); setDueDate("")
      setShowForm(false)
    } catch(e) {
        console.log(e);
     } finally {
      setCreating(false)
    }
  }

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/tasks/${id}`, { status })
      await fetchTasks()   // refresh board immediately
    } catch(e) {
      console.log(e)
    }
  }

  const userId  = String(user?._id || user?.id || "")
  const canEdit = (task) =>
    String(task.assignedTo?._id || "") === userId

  // Filter
  let filtered = tasks
  if (filter === "assigned") filtered = tasks.filter(t => t.assignedTo?._id === user?._id)
  if (filter === "created")  filtered = tasks.filter(t => t.createdBy?._id  === user?._id)

  const columns = {
    todo:          filtered.filter(t => t.status === "todo"),
    "in-progress": filtered.filter(t => t.status === "in-progress"),
    done:          filtered.filter(t => t.status === "done")
  }

  const closeModal = () => {
    setShowForm(false)
    setTitle(""); setAssignedTo(""); setDueDate("")
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0e14" }}>
      <Header />

      <main className="flex-1 px-4 md:px-8 py-6 max-w-7xl mx-auto w-full">

        {/* ── Page heading + create button ── */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 fade-up">
          <div>
            <h2 className="text-2xl font-bold text-white">Task Board</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {tasks.length} task{tasks.length !== 1 ? "s" : ""} across your team
            </p>
          </div>
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
              boxShadow: "0 4px 16px rgba(108,99,255,0.3)"
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Task
          </button>
        </div>

       
        {showForm && (
          <TaskModal
            users={users}
            title={title}           setTitle={setTitle}
            assignedTo={assignedTo} setAssignedTo={setAssignedTo}
            dueDate={dueDate}       setDueDate={setDueDate}
            creating={creating}
            onSubmit={createTask}
            onClose={closeModal}
          />
        )}

       
        <div className="flex gap-2 mb-6 fade-up flex-wrap">
          {[
            { key: "all",      label: "All Tasks" },
            { key: "assigned", label: "Assigned to Me" },
            { key: "created",  label: "Created by Me" }
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="px-4 py-1.5 rounded-xl text-sm font-medium transition-all"
              style={{
                background: filter === f.key ? "rgba(108,99,255,0.2)" : "rgba(255,255,255,0.04)",
                color: filter === f.key ? "#818cf8" : "#94a3b8",
                border: `1px solid ${filter === f.key ? "rgba(108,99,255,0.35)" : "rgba(255,255,255,0.08)"}`,
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 fade-up">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
            <div key={key} className="rounded-2xl p-4"
              style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)" }}>

              {/* Column header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ background: cfg.dot }} />
                  <h3 className="text-sm font-semibold text-white">{cfg.label}</h3>
                </div>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}>
                  {columns[key]?.length ?? 0}
                </span>
              </div>

              {/* Tasks */}
              <div className="min-h-24">
                {(columns[key] ?? []).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2"
                      style={{ background: "rgba(255,255,255,0.04)" }}>
                      <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2" />
                      </svg>
                    </div>
                    <p className="text-xs text-slate-600">No tasks here</p>
                  </div>
                ) : (
                  (columns[key] ?? []).map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      user={user}
                      onClick={() => setSelectedTask(task)}
                    />
                  ))
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {selectedTask && (
        <TaskDetailModal
          task={selectedTask}
          user={user}
          onStatusChange={updateStatus}
          onClose={() => setSelectedTask(null)}
        />
      )}
    </div>
  )
}

export default Dashboard