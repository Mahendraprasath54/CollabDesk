import { useEffect, useState } from "react"
import API from "../utils/api"
import socket from "../utils/socket"

const Dashboard = () => {
  const [tasks, setTasks] = useState([])

  const fetchTasks = async () => {
    const res = await API.get("/tasks")
    setTasks(res.data)
  }

  useEffect(() => {
    fetchTasks()

    socket.on("taskUpdated", () => {
      fetchTasks()
    })

    return () => socket.off("taskUpdated")
  }, [])

  const updateStatus = async (id, status) => {
    await API.put(`/tasks/${id}`, { status })
  }

  const columns = {
    todo: tasks.filter(t => t.status === "todo"),
    "in-progress": tasks.filter(t => t.status === "in-progress"),
    done: tasks.filter(t => t.status === "done")
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl mb-4">CollabDesk</h1>

      <div className="grid grid-cols-3 gap-4">
        {Object.keys(columns).map(col => (
          <div key={col} className="border p-4 rounded">
            <h2 className="font-bold mb-2">{col}</h2>

            {columns[col].map(task => (
              <div key={task._id} className="border p-2 mb-2 rounded">
                <p>{task.title}</p>

                <select
                  value={task.status}
                  onChange={(e) => updateStatus(task._id, e.target.value)}
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