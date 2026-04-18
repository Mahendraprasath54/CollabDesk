const mongoose = require("mongoose")
const User = require("./models/User")
const Team = require("./models/Team")
require("dotenv").config()

const test = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("Connected")
    
    const user = await User.findOne({ role: "member" })
    if (!user) {
        console.log("No member found to test with")
        return
    }
    
    const teamName = "Test Team " + Date.now()
    const memberIds = [user._id.toString()]
    
    console.log("Creating team...")
    const team = await Team.create({ name: teamName, team_id: teamName })
    console.log("Team created:", team._id)
    
    const res = await User.updateMany(
      { _id: { $in: memberIds } },
      { $set: { team: team._id, team_id: teamName } }
    )
    console.log("Update result:", res)
    
    await Team.deleteOne({ _id: team._id })
    console.log("Cleanup done")
  } catch (err) {
    console.error("TEST FAILED:", err)
  } finally {
    mongoose.connection.close()
  }
}

test()
