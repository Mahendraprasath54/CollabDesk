import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import Header from "../components/Header"

const Analytics = () => {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await API.get("/tasks/analytics")
        setData(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchAnalytics()
  }, [])

  if (loading) return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0e14" }}>
      <Header />
      <div className="flex-1 flex items-center justify-center text-slate-500 font-medium">Crunching team data...</div>
    </div>
  )

  if (!data) return null

  const { weekStats, memberStats, highTimeTasks } = data

  const maxMemberTasks = Math.max(...Object.values(memberStats), 1)

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0e14" }}>
      <Header />
      
      <main className="flex-1 p-6 max-w-7xl mx-auto w-full">
        <div className="flex items-center justify-between mb-8 fade-up">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Performance Analytics</h1>
            <p className="text-slate-500">Track team velocity and productivity</p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-sm font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            ← Back to Board
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Velocity Card */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-3xl fade-up" style={{ animationDelay: "0.1s" }}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Velocity Index</h3>
            <div className="flex items-end gap-4 h-32">
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full bg-white/5 rounded-t-xl transition-all duration-1000" 
                  style={{ height: `${(weekStats.lastWeek / Math.max(weekStats.thisWeek, weekStats.lastWeek, 1)) * 100}%`, background: "rgba(255,255,255,0.1)" }} />
                <span className="text-2xl font-bold text-white">{weekStats.lastWeek}</span>
                <span className="text-[10px] text-slate-500 font-bold uppercase">Last Week</span>
              </div>
              <div className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <div className="w-full rounded-t-xl transition-all duration-1000 shadow-[0_0_20px_rgba(108,99,255,0.3)]" 
                  style={{ 
                    height: `${(weekStats.thisWeek / Math.max(weekStats.thisWeek, weekStats.lastWeek, 1)) * 100}%`,
                    background: "linear-gradient(to top, #4f46e5, #818cf8)" 
                  }} />
                <span className="text-2xl font-bold text-white">{weekStats.thisWeek}</span>
                <span className="text-[10px] text-indigo-400 font-bold uppercase">This Week</span>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-xs text-slate-400">
                {weekStats.thisWeek >= weekStats.lastWeek 
                  ? `Velocity increased by ${weekStats.thisWeek - weekStats.lastWeek} tasks.` 
                  : `Velocity decreased by ${weekStats.lastWeek - weekStats.thisWeek} tasks.`}
              </p>
            </div>
          </div>

          {/* Member Contribution */}
          <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-3xl fade-up" style={{ animationDelay: "0.2s" }}>
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Team Contribution</h3>
            <div className="space-y-4">
              {Object.entries(memberStats).length === 0 ? (
                <p className="text-slate-500 text-sm italic">No completed tasks yet.</p>
              ) : Object.entries(memberStats).map(([name, count], i) => (
                <div key={name} className="space-y-1.5 transition-all hover:translate-x-1 duration-300">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="text-white">{name}</span>
                    <span className="text-indigo-400">{count} Done</span>
                  </div>
                  <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-1000"
                      style={{ 
                        width: `${(count / maxMemberTasks) * 100}%`,
                        background: `linear-gradient(90deg, #4f46e5 ${i * 10}%, #818cf8)`
                      }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Slow Tasks / High Time */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-3xl fade-up" style={{ animationDelay: "0.3s" }}>
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-6">Complexity Report (Longest Tasks)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                  <th className="pb-4 pl-2">Task Title</th>
                  <th className="pb-4 text-center">Time Taken</th>
                  <th className="pb-4 text-right pr-2">Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {highTimeTasks.length === 0 ? (
                  <tr><td colSpan="3" className="py-8 text-center text-slate-500 text-sm">Not enough data to calculate complexity.</td></tr>
                ) : highTimeTasks.map((t, i) => (
                  <tr key={i} className="group hover:bg-white/[0.02] transition-colors">
                    <td className="py-4 pl-2">
                      <span className="text-sm font-semibold text-white group-hover:text-indigo-400 transition-colors uppercase tracking-tight">{t.title}</span>
                    </td>
                    <td className="py-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: "rgba(244,63,94,0.1)", color: "#f43f5e" }}>
                        {t.duration} Hours
                      </span>
                    </td>
                    <td className="py-4 text-right pr-2">
                      <span className="text-xs text-slate-500 italic">High Complexity Item</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  )
}

export default Analytics
