import { useEffect, useState } from "react"
import API from "../utils/api"
import socket from "../utils/socket"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])
  const [users, setUsers] = useState([])
  const [title, setTitle] = useState("")
  const [assignedTo, setAssignedTo] = useState("")
  const [dueDate, setDueDate] = useState("")
  const [filter, setFilter] = useState("all")

  const user = JSON.parse(localStorage.getItem("user"))

  const fetchTasks = async () => {
    const res = await API.get("/tasks")
    setTasks(res.data)
  }

  const fetchUsers = async () => {
    const res = await API.get("/auth/users")
    setUsers(res.data)
  }

  useEffect(() => {
    fetchTasks()
    fetchUsers()

    socket.on("taskUpdated", fetchTasks)

    return () => socket.off("taskUpdated")
  }, [])

  const createTask = async () => {
    if (!title || !assignedTo) {
      alert("Title and assignee required")
      return
    }

    await API.post("/tasks", {
      title,
      assignedTo,
      dueDate
    })

    setTitle("")
    setAssignedTo("")
    setDueDate("")
  }

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status })
  }

  const canEdit = (task) => {
    return (
      task.createdBy?._id === user._id ||
      task.assignedTo?._id === user._id
    )
  }

  // ✅ FILTER LOGIC
  let filteredTasks = tasks

  if (filter === "assigned") {
    filteredTasks = tasks.filter(
      t => t.assignedTo?._id === user._id
    )
  }

  if (filter === "created") {
    filteredTasks = tasks.filter(
      t => t.createdBy?._id === user._id
    )
  }

  // ✅ USE filteredTasks HERE
  const columns = {
    todo: filteredTasks.filter(t => t.status === "todo"),
    "in-progress": filteredTasks.filter(t => t.status === "in-progress"),
    done: filteredTasks.filter(t => t.status === "done")
  }

  return (
    <div className="p-6">

      {/* 🔥 HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">CollabDesk</h1>

        <div className="text-right">
          <p className="font-semibold">Hi, {user?.name}</p>
          <p className="text-xs text-gray-500">Team: {user?.team}</p>

          <button
            onClick={() => {
              localStorage.clear()
              window.location.href = "/"
            }}
            className="text-red-500 text-xs mt-1"
          >
            Logout
          </button>
        </div>
      </div>

      {/* 🔥 CREATE TASK */}
      <div className="mb-6 p-4 border rounded">
        <h2 className="mb-3 font-bold">Create Task</h2>

        <input
          className="border p-2 mr-2"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <select
          className="border p-2 mr-2"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
        >
          <option value="">Assign User</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          className="border p-2 mr-2"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />

        <button
          onClick={createTask}
          className="bg-green-500 text-white px-4 py-2"
        >
          Add Task
        </button>
      </div>

      {/* 🔥 FILTER BUTTONS */}
      <div className="mb-4 flex gap-2">
        <button onClick={() => setFilter("all")} className="border px-3 py-1">
          All
        </button>
        <button onClick={() => setFilter("assigned")} className="border px-3 py-1">
          Assigned to Me
        </button>
        <button onClick={() => setFilter("created")} className="border px-3 py-1">
          Created by Me
        </button>
      </div>

      {/* 🔥 BOARD */}
      <div className="grid grid-cols-3 gap-4">
        {Object.keys(columns).map(col => (
          <div key={col} className="border p-4 rounded">
            <h2 className="font-bold mb-2">{col}</h2>

            {columns[col].map(task => (
              <div
                key={task._id}
                className={`border p-2 mb-2 rounded ${
                  task.assignedTo?._id === user._id
                    ? "bg-yellow-100"
                    : ""
                }`}
              >
                <p className="font-semibold">{task.title}</p>

                <p className="text-xs text-gray-500">
                  Assigned: {task.assignedTo?.name}
                </p>

                <p className="text-xs text-gray-400">
                  Created: {task.createdBy?.name}
                </p>

                {!canEdit(task) && (
                  <p className="text-xs text-red-500">
                    You can't edit this
                  </p>
                )}

                <select
                  value={task.status}
                  disabled={!canEdit(task)}
                  onChange={(e) =>
                    updateStatus(task._id, e.target.value)
                  }
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Dashboard