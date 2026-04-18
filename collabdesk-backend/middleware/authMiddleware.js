const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith("Bearer "))
    return res.status(401).json({ msg: "No token" })

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)

    req.user = {
      id:   user._id.toString(),
      name: user.name,
      team: user.team,
      team_id: user.team_id,
      role: user.role
    }

    next()
  } catch {
    res.status(401).json({ msg: "Invalid token" })
  }
}