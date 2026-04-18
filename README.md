 CollabDesk — Real-Time Collaborative Task Board

CollabDesk is a full-stack, real-time collaborative task management platform designed for teams to create, assign, and track work seamlessly across structured workflows.
This project simulates a modern workplace tool by combining **task management**, **team collaboration**, **live activity updates**, and **analytics insights** into a single system.


✨ Features

🔐 Authentication & User Flow

* User registration & login
* Secure password hashing using bcrypt
* JWT-based authentication
* Users belong to a team (workspace)
* New users remain inactive until assigned to a team by admin

👥 Team & Admin Management

* Dedicated **Admin Control Panel**
* Create teams dynamically
* Assign users to teams
* View all users and their current team status
* Ensures structured collaboration instead of open access

 📋 Task Management System

* Create tasks with:

  * Title
  * Description
  * Assigned user
  * Due date
* Stage-based workflow:

  * 🟡 To Do
  * 🔵 In Progress
  * 🟢 Done

🔒 Role-Based Permission Control

* Only the **task creator** can move tasks between stages
* Other users can view but cannot modify restricted actions
* Implemented at:

  * Backend level (secure enforcement)
  * Frontend level (UX control)


 ⚡ Real-Time Collaboration (Socket.io)

* Instant updates across all users
* No manual refresh required
* Tasks update live when:

  * Created
  * Assigned
  * Status changed


 💬 Live Activity Feed (Team Awareness)

* Every action is broadcasted to all team members in real-time

Examples:

"Mahendra created 'Backend API Task'"
"Prasath moved 'UI Task' to In Progress"
"Task assigned to Pradeep"


* Built using Socket.io events
* Creates a **shared awareness system**
* Makes the app feel like tools such as Slack / Microsoft Teams

🔍 Smart Task Filtering

* View tasks by:

  * All tasks
  * Assigned to me
  * Created by me
* Improves usability without breaking shared collaboration


📊 Performance Analytics

* Dedicated analytics dashboard
* Track:

  * Tasks completed per user
  * Team contribution
  * Long-running tasks
* Helps identify:

  * High performers
  * Bottlenecks
  * Productivity trends

👤 User Profile

* Update personal details:

  * Name
  * Avatar URL
  * Bio
* Enhances user identity within the team


### 🚫 Team Isolation (Workspace Logic)

* Each team operates independently
* Tasks and updates are NOT shared across teams
* Ensures proper multi-team architecture

---

🏗️ Tech Stack

 Frontend

* React (Vite)
* Tailwind CSS
* Axios
* Socket.io-client

 Backend

* Node.js
* Express.js
* MongoDB with Mongoose
* Socket.io

---

📡 API Overview

Auth Routes
POST /api/auth/register
POST /api/auth/login
GET /api/auth/users
POST /api/auth/create-team
PUT /api/auth/profile

Task Routes
GET /api/tasks
POST /api/tasks
PUT /api/tasks/:id
GET /api/tasks/analytics


⚙️ Setup Instructions

 1️⃣ Clone Repository

git clone <your-repo-link>
cd collabdesk

 2️⃣ Backend Setup

cd collabdesk-backend
npm install

Create `.env` file:

PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret

Run backend:  npm run dev
3️⃣ Frontend Setup

cd collabdesk-frontend
npm install
npm run dev

🔑 Admin Access

Email: admin@novintix.com
Password: novi123

 🧠 Key Design Decisions

* Used **Socket.io** instead of polling for efficient real-time updates
* Implemented **role-based task control** to ensure secure operations
* Designed **team-level isolation** for scalable multi-workspace support
* Maintained **modular architecture** for easy scalability and maintenance
* Added **activity broadcasting** to simulate real-world collaboration tools


 🚀 Future Improvements

* Drag & drop task movement
* Notifications system
* Role hierarchy (Admin / Manager / Member)
* Task comments & history tracking
* Email-based team invitations

 📸 Screenshots

* Authentication Flow (Register / Login)
* Awaiting Team Assignment Screen
* Admin Panel (Team Management)
* Task Board (Real-Time Updates)
* Task Detail Modal
* Analytics Dashboard
* User Profile Page

🧑‍💻 Author

**Mahendra Prasath**
Full Stack Developer (MERN)

Interested in building real-time systems, scalable backend architectures, and DevOps-driven applications.


⭐ Conclusion

CollabDesk is designed as a **real-time collaborative system**, not just a task manager.

It combines:

* Multi-user collaboration
* Real-time synchronization
* Role-based permissions
* Team-based architecture
* Live activity communication
* Admin-driven management
* Data-driven analytics

This project reflects practical full-stack development skills along with system design thinking required for real-world applications.
“Built not just to manage tasks, but to enable teamwork.”
