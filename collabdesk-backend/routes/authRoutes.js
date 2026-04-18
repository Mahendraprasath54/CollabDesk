const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const { register, login, Users, updateProfile, createTeam } = require("../controllers/authController")
const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ msg: "Admin access required" })
  next()
}

router.post("/register", register)
router.post("/login", login)
router.get("/users", auth, Users)
router.put("/profile", auth, updateProfile)
router.post("/create-team", auth, isAdmin, createTeam)

module.exports = router