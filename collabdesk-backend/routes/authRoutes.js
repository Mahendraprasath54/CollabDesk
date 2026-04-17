const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const { register, login, Users, updateProfile } = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)
router.get("/users", Users)
router.put("/profile", auth, updateProfile)

module.exports = router