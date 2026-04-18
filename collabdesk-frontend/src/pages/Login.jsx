import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../utils/api"

const Login = () => {
  const [email, setEmail]       = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    
    if (localStorage.getItem("token")) navigate("/dashboard")
  }, [navigate])

  const handleLogin = async (e) => {
   
    e.preventDefault()
    
    setError("")
    if (!email || !password) { setError("Please fill in all fields."); return }
    setLoading(true)
        try {
        const res = await API.post("/auth/login", { email, password })
        localStorage.setItem("token", res.data.token)
        localStorage.setItem("user",  JSON.stringify(res.data.user))
        
        if (res.data.user.role === "admin") {
          window.location.href = "/admin"
        } else {
          window.location.href = "/dashboard"
        }
        } catch (err) {
        setError(err.response?.data?.msg || "Invalid credentials. Please try again.")
        } finally {
        setLoading(false)
        }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6c63ff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md fade-up">
        
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">CollabDesk</h1>
          <p className="text-slate-400 mt-1 text-sm">Sign in to your workspace</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8 border border-white/10"
          style={{ background: "rgba(255,255,255,0.04)", backdropFilter: "blur(20px)" }}>

          {error && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(239,68,68,0.12)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)" }}>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                placeholder="you@company.com"
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(108,99,255,0.7)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Password
              </label>
              <input
                type="password"
                value={password}
                placeholder="••••••••"
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.1)"
                }}
                onFocus={e => e.target.style.borderColor = "rgba(108,99,255,0.7)"}
                onBlur={e  => e.target.style.borderColor = "rgba(255,255,255,0.1)"}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                boxShadow: "0 4px 20px rgba(108,99,255,0.35)"
              }}
              onMouseEnter={e => !loading && (e.target.style.transform = "translateY(-1px)")}
              onMouseLeave={e => (e.target.style.transform = "translateY(0)")}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p className="mt-5 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold" style={{ color: "#818cf8" }}
              onMouseEnter={e => (e.target.style.color = "#a5b4fc")}
              onMouseLeave={e => (e.target.style.color = "#818cf8")}>
              Create one free
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login