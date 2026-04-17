import { useNavigate } from "react-router-dom"

const Header = () => {
  const navigate  = useNavigate()
  const raw       = localStorage.getItem("user")
  const user      = raw ? JSON.parse(raw) : {}

  const userName  = user?.name  || "User"
  const teamName  = user?.team?.name || user?.teamName || "My Team"
  // Show short team ID 6 char 
  const teamId    = user?.team?._id
    ? `#${String(user.team._id).slice(-6).toUpperCase()}`
    : user?.team
    ? `#${String(user.team).slice(-6).toUpperCase()}`
    : "—"

 
  const initials = userName
    .split(" ")
    .map(w => w[0])
    .slice(0, 2)   //to extract initial
    .join("")
    .toUpperCase()

  const handleLogout = () => {
    localStorage.clear()
    navigate("/")
  }

  return (
    <header
      className="sticky top-0 z-50 flex items-center justify-between px-6 py-3 border-b"
      style={{
        background: "rgba(13,14,20,0.85)",
        backdropFilter: "blur(20px)",
        borderColor: "rgba(255,255,255,0.07)"
      }}
    >
      {/* ── Brand ── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-9 h-9 rounded-xl"
          style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
        </div>
        <span className="text-white font-bold text-lg tracking-tight">CollabDesk</span>
      </div>

      {/* ── Right side team info , user + logout ── */}
      <div className="flex items-center gap-3">

        
        <div className="hidden sm:flex flex-col items-end mr-1">
          <span className="text-xs font-semibold text-slate-300 leading-tight">{teamName}</span>
          <span className="text-xs font-mono" style={{ color: "#818cf8" }}>{teamId}</span>
        </div>

        
        <div className="hidden sm:block w-px h-8" style={{ background: "rgba(255,255,255,0.1)" }} />

        {/* Avatar + name (Clickable to Profile) */}
        <div 
          onClick={() => navigate("/profile")}
          className="flex items-center gap-2.5 cursor-pointer group hover:bg-white/5 p-1 rounded-xl transition-all"
        >
          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0 shadow-lg"
            style={{ 
              background: user?.avatar 
                ? `url(${user.avatar}) center/cover` 
                : "linear-gradient(135deg, #7c3aed, #6c63ff)" 
            }}
          >
            {!user?.avatar && initials}
          </div>
          <div className="hidden md:flex flex-col">
            <span className="text-sm font-semibold text-white leading-tight group-hover:text-indigo-400 transition-colors">{userName}</span>
            <span className="text-xs text-slate-400 leading-tight">{user?.role || "member"}</span>
          </div>
        </div>

       
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: "rgba(239,68,68,0.1)",
            color: "#f87171",
            border: "1px solid rgba(239,68,68,0.15)"
          }}
          onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.2)")}
          onMouseLeave={e => (e.currentTarget.style.background = "rgba(239,68,68,0.1)")}
          title="Logout"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}

export default Header
