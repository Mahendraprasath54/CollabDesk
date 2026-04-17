const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: { origin: "*" }
})

app.set("io", io)

app.use(cors())
app.use(express.json())

connectDB()

app.use("/api/auth",  require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

// ── Expired task cleanup ──────────────────────────────
// Deletes non-done tasks whose dueDate has passed.
// Runs 5 s after startup (so DB is ready) then every 30 min.
const Task = require("./models/Task")

const runCleanup = async () => {
  try {
    // Delete non-done tasks due BEFORE today (not today itself)
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
    const result = await Task.deleteMany({
      dueDate: { $lt: startOfToday },
      status:  { $ne: "done" }
    })
    if (result.deletedCount > 0) {
      io.emit("taskUpdated") // push real-time refresh to all clients
      console.log(`🧹 Deleted ${result.deletedCount} expired task(s)`)
    }
  } catch (err) {
    console.error("Cleanup error:", err.message)
  }
}

setTimeout(runCleanup, 5000)                 // run once on startup
setInterval(runCleanup, 30 * 60 * 1000)     // then every 30 minutes

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on ${PORT}`))