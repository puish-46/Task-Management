# TaskFlow ⚡ — Premium Task Management Application

A full-stack, state-of-the-art task management application built using the MERN stack. Designed with a dark-themed glassmorphism interface, real-time role management, user-private dashboards, and dynamic Kanban board capabilities.

### 🔗 Live Deployments
* **Live Frontend (Vercel)**: [https://task-management-liart-ten.vercel.app](https://task-management-liart-ten.vercel.app)
* **Live Backend API (Render)**: [https://task-management-bjik.onrender.com](https://task-management-bjik.onrender.com)

---

## ✨ Features

### 👑 Admin Powers (The Command Center)
* **User Management**: Activate, deactivate, or delete user accounts instantly.
* **Global Task Administration**: Create, edit, assign, and delete tasks for any registered user.
* **Consolidated Stats Dashboard**: Track overall progress across all users with graphical KPI cards.

### 👤 User Capabilities (Private & Productive)
* **Self Task Creation**: Create and manage personal tasks directly.
* **Confidentiality & Privacy**: Users only see and interact with their own tasks (invisible to other non-admin users).
* **Kanban Board**: Drag-and-drop-style status updates across columns (Pending, In Progress, Completed).
* **Status Updates**: Change the state of tasks as work progresses.

---

## 🛠️ Tech Stack

* **Frontend**: React (Vite), Zustand (Global State Management), Tailwind CSS & Custom Glassmorphic CSS.
* **Backend**: Node.js, Express.js, JWT Cookie-Based Authentication, Cors Origin Protection.
* **Database**: MongoDB Atlas (Mongoose ODM).

---

## 📁 Repository Structure

```bash
Task-Management/
├── taskBackend/          # Node.js/Express.js Backend API
│   ├── APIs/             # Route controllers (user, task, common auth)
│   ├── middlewares/      # VerifyToken role-based protection
│   ├── models/           # Mongoose schemas (User & Task)
│   └── server.js         # Entry point & DB Connection
└── taskFrontend/         # React/Vite Frontend
    ├── src/
    │   ├── api/          # Axios instances and API services
    │   ├── components/   # UI elements (Home, Dashboard, Modals, Navbar)
    │   ├── store/        # Zustand state stores (auth, task)
    │   └── index.css     # Glassmorphic global design system
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
Ensure you have Node.js and MongoDB installed locally.

### 2. Configure Backend
```bash
cd taskBackend
npm install
```
Create a `.env` file inside `/taskBackend`:
```env
PORT=5000
DB_URL=mongodb://localhost:27017/taskDB
SECRET_KEY=your_jwt_secret_key
FRONTEND_URL=http://localhost:5173
ADMIN_EMAIL=admin@taskmanager.com
ADMIN_PASSWORD=Admin@123
```
Start backend:
```bash
npm run dev # or nodemon server.js
```

### 3. Configure Frontend
```bash
cd ../taskFrontend
npm install
```
Create a `.env.local` file inside `/taskFrontend`:
```env
VITE_API_URL=http://localhost:5000
```
Start frontend:
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.
