import { Routes, Route, Navigate } from "react-router-dom"
import Login    from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Analytics from "./pages/Analytics"
import AdminDashboard from "./pages/AdminDashboard"

function App() {
  const user = (() => {
    try { return JSON.parse(localStorage.getItem("user")) } catch { return null }
  })()
  const isAuth = !!localStorage.getItem("token")
  const isAdmin = user?.role === "admin"

  return (
    <Routes>
      <Route path="/"          element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route
        path="/dashboard"
        element={isAuth ? (isAdmin ? <Navigate to="/admin" replace /> : <Dashboard />) : <Navigate to="/" replace />}
      />
      <Route
        path="/admin"
        element={isAuth && isAdmin ? <AdminDashboard /> : <Navigate to="/" replace />}
      />
      <Route
        path="/profile"
        element={isAuth ? <Profile /> : <Navigate to="/" replace />}
      />
      <Route
        path="/analytics"
        element={isAuth ? <Analytics /> : <Navigate to="/" replace />}
      />
      {/* Catch-all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App