import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import API from "../utils/api"
import Header from "../components/Header"

const Profile = () => {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [name, setName] = useState("")
  const [bio, setBio]  = useState("")
  const [avatar, setAvatar] = useState("")
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem("user")
    if (!stored) {
      navigate("/")
      return
    }
    const userData = JSON.parse(stored)
    setUser(userData)
    setName(userData.name || "")
    setBio(userData.bio || "")
    setAvatar(userData.avatar || "")
  }, [navigate])

  const handleUpdate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)
    try {
      const res = await API.put("/auth/profile", { name, bio, avatar })
      localStorage.setItem("user", JSON.stringify(res.data))
      setUser(res.data)
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } catch (err) {
      console.error(err)
      alert("Failed to update profile")
    } finally {
      setSaving(false)
    }
  }

  if (!user) return null

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0d0e14" }}>
      <Header />
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-lg bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur-3xl shadow-2xl fade-up">
          
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl font-bold text-white shadow-lg"
              style={{ background: avatar ? `url(${avatar}) center/cover` : "linear-gradient(135deg, #6c63ff, #4f46e5)" }}>
              {!avatar && name[0]?.toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Your Profile</h2>
              <p className="text-slate-400 text-sm">Personalize your team identity</p>
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all"
                placeholder="Enter your name"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Avatar URL</label>
              <input
                type="text"
                value={avatar}
                onChange={e => setAvatar(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all font-mono text-xs"
                placeholder="https://example.com/photo.jpg"
              />
              <p className="text-[10px] text-slate-600">Paste an image link to set your profile picture</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Bio</label>
              <textarea
                value={bio}
                onChange={e => setBio(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 px-4 text-white focus:outline-none focus:border-indigo-500/50 transition-all resize-none h-24 text-sm"
                placeholder="Tell your team a bit about yourself..."
              />
            </div>

            <div className="pt-4 flex items-center justify-between">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="text-sm font-semibold text-slate-500 hover:text-slate-300 transition-colors"
              >
                Back to Board
              </button>
              
              <button
                type="submit"
                disabled={saving}
                className="px-8 py-3 rounded-xl text-sm font-bold text-white transition-all shadow-lg flex items-center gap-2"
                style={{ background: "linear-gradient(135deg, #6c63ff, #4f46e5)" }}
              >
                {saving ? "Saving..." : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Save Profile
                  </>
                )}
              </button>
            </div>

            {success && (
              <p className="text-center text-emerald-400 text-sm font-semibold animate-pulse">
                Profile updated successfully!
              </p>
            )}
          </form>
        </div>
      </main>
    </div>
  )
}

export default Profile
