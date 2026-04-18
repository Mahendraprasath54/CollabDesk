import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import Header from "../components/Header"

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [selectedUsers, setSelectedUsers] = useState([])
  const [teamName, setTeamName] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) } catch { return null }
  })()

  useEffect(() => {
    if (!localStorage.getItem("token")) navigate("/")
    if (user?.role !== "admin") navigate("/dashboard")
    fetchUsers()
  }, [navigate])

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users")
      setUsers(res.data.filter(u => u.role !== "admin"))
    } catch (e) {
      console.error(e)
    }
  }

  const toggleUserSelection = (userId) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    )
  }

  const handleCreateTeam = async (e) => {
    e.preventDefault()
    if (!teamName || selectedUsers.length === 0) return
    setLoading(true)
    try {
      await API.post("/auth/create-team", {
        teamName,
        memberIds: selectedUsers
      })
      setMessage({ type: "success", text: `Team "${teamName}" created successfully!` })
      setTeamName("")
      setSelectedUsers([])
      fetchUsers()
    } catch (e) {
      setMessage({ type: "error", text: e.response?.data?.msg || "Failed to create team" })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0e14" }}>
      <Header />
      
      <main className="flex-1 px-4 md:px-8 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-10 fade-up">
          <h2 className="text-3xl font-bold text-white mb-2">Admin Control Center</h2>
          <p className="text-slate-400">Manage employees and form strategic teams</p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-xl flex items-center gap-3 fade-up ${
            message.type === "success" ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-400" : "bg-red-500/10 border border-red-500/20 text-red-400"
          }`}>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
              message.type === "success" ? "bg-emerald-500/20" : "bg-red-500/20"
            }`}>
              {message.type === "success" ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </div>
            <p className="text-sm font-medium">{message.text}</p>
            <button onClick={() => setMessage(null)} className="ml-auto opacity-50 hover:opacity-100 transition-opacity">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Create Team Form */}
          <div className="lg:col-span-1 fade-up" style={{ animationDelay: "100ms" }}>
            <div className="rounded-2xl p-6 border border-white/10" style={{ background: "rgba(255,255,255,0.03)", position: "sticky", top: "100px" }}>
              <h3 className="text-lg font-semibold text-white mb-6">Form New Team</h3>
              <form onSubmit={handleCreateTeam} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Team Name</label>
                  <input
                    type="text"
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="e.g. Frontend Vanguard"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500/50 transition-all placeholder:text-slate-600"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Selection</label>
                  <div className="flex items-center justify-between px-1">
                    <span className="text-sm text-slate-400">{selectedUsers.length} members selected</span>
                    {selectedUsers.length > 0 && (
                      <button type="button" onClick={() => setSelectedUsers([])} className="text-[10px] text-indigo-400 font-bold hover:underline">CLEAR</button>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || !teamName || selectedUsers.length === 0}
                  className="w-full py-3.5 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                    boxShadow: "0 4px 20px rgba(108,99,255,0.2)"
                  }}
                >
                  {loading && <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
                  Create & Assign Team
                </button>
              </form>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-2 space-y-4 fade-up" style={{ animationDelay: "200ms" }}>
            <div className="flex items-center justify-between px-2 mb-2">
              <h3 className="text-lg font-semibold text-white">Employees</h3>
              <span className="text-xs text-slate-500 font-medium">{users.length} total</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {users.map(u => (
                <div
                  key={u._id}
                  onClick={() => toggleUserSelection(u._id)}
                  className={`group relative p-4 rounded-2xl border transition-all cursor-pointer ${
                    selectedUsers.includes(u._id)
                      ? "bg-indigo-500/10 border-indigo-500/40"
                      : "bg-white/5 border-white/5 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold transition-all ${
                      selectedUsers.includes(u._id) ? "bg-indigo-500 text-white" : "bg-white/5 text-slate-400 group-hover:bg-white/10"
                    }`}>
                      {u.name.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold text-white truncate">{u.name}</h4>
                      <p className="text-[10px] text-slate-500 truncate mb-1">{u.email}</p>
                      {u.team ? (
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-800 border border-slate-700">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="text-[9px] font-bold text-slate-400">TEAM: {u.team.name}</span>
                        </div>
                      ) : (
                        <span className="text-[9px] font-bold text-amber-500/70">UNASSIGNED</span>
                      )}
                    </div>
                    <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedUsers.includes(u._id) ? "bg-indigo-500 border-indigo-500" : "border-white/10"
                    }`}>
                      {selectedUsers.includes(u._id) && (
                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {users.length === 0 && (
              <div className="py-20 text-center rounded-3xl border-2 border-dashed border-white/5 bg-white/[0.02]">
                <p className="text-slate-500 text-sm">No employees found in the system</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard
