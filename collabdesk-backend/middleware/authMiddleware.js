const jwt = require("jsonwebtoken")
const User = require("../models/User")

module.exports = async (req, res, next) => {
  const token = req.headers.authorization

  if (!token) return res.status(401).json({ msg: "No token" })

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    const user = await User.findById(decoded.id)

    req.user = {
      id: user._id,
      team: user.team
    }

    next()
  } catch {
    res.status(401).json({ msg: "Invalid token" })
  }
}