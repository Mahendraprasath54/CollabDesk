import { Routes, Route, Navigate } from "react-router-dom"
import Login    from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Analytics from "./pages/Analytics"

function App() {
  const isAuth = !!localStorage.getItem("token")

  return (
    <Routes>
      <Route path="/"          element={<Login />} />
      <Route path="/register"  element={<Register />} />
      <Route
        path="/dashboard"
        element={isAuth ? <Dashboard /> : <Navigate to="/" replace />}
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