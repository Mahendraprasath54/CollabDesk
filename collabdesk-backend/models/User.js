const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: {
    type: String,
    enum: ["member", "admin"],
    default: "member"
  },
  team: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Team"
  },
  avatar: String,
  bio: String
}, { timestamps: true })

module.exports = mongoose.model("User", userSchema)