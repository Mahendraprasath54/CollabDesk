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

app.use("/api/auth", require("./routes/authRoutes"))
app.use("/api/tasks", require("./routes/taskRoutes"))

io.on("connection", (socket) => {
  console.log("User connected:", socket.id)
  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id)
  })
})

const PORT = process.env.PORT || 5000
server.listen(PORT, () => console.log(`Server running on ${PORT}`))