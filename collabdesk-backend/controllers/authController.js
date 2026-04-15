const User = require("../models/User")
const Team = require("../models/Team")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const {
  validateRegister,
  validateLogin
} = require("../utils/validators")

exports.register = async (req, res) => {
  try {
    const error = validateRegister(req.body)
    if (error) return res.status(400).json({ msg: error })

    const { name, email, password } = req.body

    const existing = await User.findOne({ email })
    if (existing) return res.status(400).json({ msg: "User already exists" })

    const hashed = await bcrypt.hash(password, 10)

    let team = await Team.findOne()
    if (!team) {
      team = await Team.create({ name: "Default Team" })
    }

    const user = await User.create({
      name,
      email,
      password: hashed,
      team: team._id
    })

    res.json(user)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const error = validateLogin(req.body)
    if (error) return res.status(400).json({ msg: error })

    const { email, password } = req.body

    const user = await User.findOne({ email })
    if (!user) return res.status(400).json({ msg: "Invalid credentials" })

    const match = await bcrypt.compare(password, user.password)
    if (!match) return res.status(400).json({ msg: "Invalid credentials" })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.json({ token, user })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}