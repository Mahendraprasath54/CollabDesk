const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
  name: String,
  team_id: String,
  joinCode: { 
    type: String, 
    unique: true,
    default: () => Math.random().toString(36).substring(2, 8).toUpperCase()
  }
}, { timestamps: true })

module.exports = mongoose.model("Team", teamSchema)