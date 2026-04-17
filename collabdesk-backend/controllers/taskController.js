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

    // Only the creator can move the task between stages
    const creatorId = task.createdBy?.toString()
    const requesterId = req.user.id
    
    if (creatorId !== requesterId) {
      console.log(`Permission Denied: Creator(${creatorId}) !== Requester(${requesterId})`)
      return res.status(403).json({ msg: "Only the creator can move this task." })
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )

    req.app.get("io").emit("taskUpdated")

    res.json(updated)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}