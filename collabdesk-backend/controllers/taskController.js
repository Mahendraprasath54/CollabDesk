const Task = require("../models/Task")

exports.createTask = async (req, res) => {
  try {
    const task = await Task.create({
      ...req.body,
      createdBy: req.user.id,
      team: req.user.team
    })

    req.app.get("io").emit("taskUpdated")

    res.json(task)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

exports.getTasks = async (req, res) => {
  try {
    // Purge expired non-done tasks: delete only tasks due BEFORE today (not today itself)
    const startOfToday = new Date(); startOfToday.setHours(0, 0, 0, 0)
    const expired = await Task.deleteMany({
      team:    req.user.team,
      dueDate: { $lt: startOfToday },
      status:  { $ne: "done" }
    })
    if (expired.deletedCount > 0) {
      req.app.get("io").emit("taskUpdated")
    }

    const tasks = await Task.find({ team: req.user.team })
      .populate("assignedTo", "name")
      .populate("createdBy",  "name")

    res.json(tasks)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}



exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
    if (!task) return res.status(404).json({ msg: "Not found" })

    // Logic for stage transitions
    if (req.body.status && req.body.status !== task.status) {
      // 1. Permission Check
      if (task.createdBy?.toString() !== req.user.id) {
        return res.status(403).json({ msg: "Only the creator can move stages." })
      }
      
      // 2. Analytics Timestamps
      if (req.body.status === "in-progress" && !task.startedAt) {
        req.body.startedAt = new Date()
      }
      if (req.body.status === "done") {
        req.body.completedAt = new Date()
      }
    }

    // Capture changes for notification
    let activityMsg = ""
    if (req.body.status && req.body.status !== task.status) {
      activityMsg = `${req.user.name || "A member"} moved "${task.title}" to ${req.body.status}`
    } else if (req.body.description !== task.description) {
      activityMsg = `${req.user.name || "A member"} updated the description of "${task.title}"`
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    req.app.get("io").emit("taskUpdated")
    if (activityMsg) {
      req.app.get("io").emit("taskNotification", activityMsg)
    }

    res.json(updated)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

exports.getAnalytics = async (req, res) => {
  try {
    const tasks = await Task.find({ team: req.user.team }).populate("assignedTo", "name")
    
    const now = new Date()
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000)

    // 1. This week vs Last week
    const thisWeek = tasks.filter(t => t.status === "done" && t.completedAt >= oneWeekAgo).length
    const lastWeek = tasks.filter(t => t.status === "done" && t.completedAt >= twoWeeksAgo && t.completedAt < oneWeekAgo).length

    // 2. Member contributions
    const memberStats = {}
    tasks.filter(t => t.status === "done").forEach(t => {
      const name = t.assignedTo?.name || "Unassigned"
      memberStats[name] = (memberStats[name] || 0) + 1
    })

    // 3. High time tasks (Longest duration)
    const highTimeTasks = tasks
      .filter(t => t.startedAt && t.completedAt)
      .map(t => ({
        title: t.title,
        duration: Math.round((t.completedAt - t.startedAt) / (1000 * 60 * 60)), // hours
      }))
      .sort((a, b) => b.duration - a.duration)
      .slice(0, 5)

    res.json({
      weekStats: { thisWeek, lastWeek },
      memberStats,
      highTimeTasks
    })
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}