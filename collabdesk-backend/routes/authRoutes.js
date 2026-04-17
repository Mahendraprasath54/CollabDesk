const router = require("express").Router()
const { register, login, Users } = require("../controllers/authController")

router.post("/register", register)
router.post("/login", login)
router.get("/users", Users)
module.exports = router