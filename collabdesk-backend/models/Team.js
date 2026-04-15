const mongoose = require("mongoose")

const teamSchema = new mongoose.Schema({
  name: String
}, { timestamps: true })

module.exports = mongoose.model("Team", teamSchema)