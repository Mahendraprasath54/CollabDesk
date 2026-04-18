import { useState, useEffect } from "react"
import { useNavigate, Link } from "react-router-dom"
import API from "../utils/api"

const Register = () => {
  const [form, setForm]       = useState({ name: "", email: "", password: "", confirm: "" })
  const [error, setError]     = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (localStorage.getItem("token")) navigate("/dashboard")
  }, [navigate])

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setError("")
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError(""); setSuccess("")

    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields."); return
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters."); return
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match."); return
    }

    setLoading(true)
    try {
      const res = await API.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password
      })
      
      const { token, user } = res.data
      localStorage.setItem("token", token)
      localStorage.setItem("user", JSON.stringify(user))

      setSuccess("Account created! Welcome to CollabDesk...")
      setTimeout(() => navigate("/dashboard"), 1500)
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const inputStyle = {
    background: "rgba(255,255,255,0.06)",
    border: "1px solid rgba(255,255,255,0.1)"
  }
  const focusBorder = (e) => (e.target.style.borderColor = "rgba(108,99,255,0.7)")
  const blurBorder  = (e) => (e.target.style.borderColor = "rgba(255,255,255,0.1)")

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      {/* Background decorative blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #6c63ff 0%, transparent 70%)" }} />
        <div className="absolute -bottom-32 -left-32 w-96 h-96 rounded-full opacity-10"
          style={{ background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)" }} />
      </div>

      <div className="relative w-full max-w-md fade-up">
        {/* Brand */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-4"
            style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white">Create Account</h1>
          <p className="text-slate-400 mt-1 text-sm">Join your team on CollabDesk</p>
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

          {success && (
            <div className="mb-5 flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium"
              style={{ background: "rgba(16,185,129,0.12)", color: "#34d399", border: "1px solid rgba(16,185,129,0.2)" }}>
              <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {success}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Name */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Full Name
              </label>
              <input name="name" value={form.name} onChange={handleChange}
                placeholder="John Doe"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Email Address
              </label>
              <input name="email" type="email" value={form.email} onChange={handleChange}
                placeholder="you@company.com"
                className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
            </div>

            {/* Password row */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Password
                </label>
                <input name="password" type="password" value={form.password} onChange={handleChange}
                  placeholder="Min 6 chars"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Confirm
                </label>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange}
                  placeholder="Repeat it"
                  className="w-full px-4 py-3 rounded-xl text-sm text-white placeholder-slate-500 outline-none transition-all"
                  style={inputStyle} onFocus={focusBorder} onBlur={blurBorder} />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white transition-all flex items-center justify-center gap-2 mt-1"
              style={{
                background: "linear-gradient(135deg, #6c63ff, #4f46e5)",
                boxShadow: "0 4px 20px rgba(108,99,255,0.35)"
              }}
            >
              {loading ? <span className="spinner" /> : null}
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
            <span className="text-xs text-slate-500">or</span>
            <div className="flex-1 h-px" style={{ background: "rgba(255,255,255,0.08)" }} />
          </div>

          <p className="mt-5 text-center text-sm text-slate-400">
            Already have an account?{" "}
            <Link to="/" className="font-semibold" style={{ color: "#818cf8" }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
