const express = require("express")
const http = require("http")
const { Server } = require("socket.io")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")
const Task = require("./models/Task")

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
})

app.set("io", io)

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"]
}))

app.use(express.json())

connectDB()

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

app.get("/", (req, res) => {
  res.send("CollabDesk API running")
})

io.on("connection", (socket) => {
  socket.on("joinTeam", (teamId) => {
    if (teamId) {
      socket.join(teamId.toString())
    }
  })

  socket.on("disconnect", () => {})
})

const runCleanup = async () => {
  try {
    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)

    const result = await Task.deleteMany({
      dueDate: { $lt: startOfToday },
      status: { $ne: "done" }
    })

    if (result.deletedCount > 0) {
      io.emit("taskUpdated")
    }
  } catch (err) {}
}

setTimeout(runCleanup, 5000)
setInterval(runCleanup, 30 * 60 * 1000)

const PORT = process.env.PORT || 5000
server.listen(PORT)