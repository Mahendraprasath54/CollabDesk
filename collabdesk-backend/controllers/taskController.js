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
    const tasks = await Task.find({ team: req.user.team })
      .populate("assignedTo", "name")
      .populate("createdBy", "name")

    res.json(tasks)
  } catch (err) {
    res.status(500).json({ err: err.message })
  }
}

exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)

    if (!task) return res.status(404).json({ msg: "Not found" })

    // Only the assignee can move the task between stages
    if (task.assignedTo?.toString() !== req.user.id) {
      return res.status(403).json({ msg: "Only the assignee can move this task." })
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