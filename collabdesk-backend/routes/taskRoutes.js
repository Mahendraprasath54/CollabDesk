const router = require("express").Router()
const auth = require("../middleware/authMiddleware")
const {
  createTask,
  getTasks,
  updateTask,
  getAnalytics
} = require("../controllers/taskController")

router.post("/", auth, createTask)
router.get("/", auth, getTasks)
router.get("/analytics", auth, getAnalytics)
router.put("/:id", auth, updateTask)

module.exports = router