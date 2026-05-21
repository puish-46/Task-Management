import { useState, useEffect } from "react";
import useAuthStore from "../store/authStore";
import useTaskStore from "../store/taskStore";
import {
  getAllTasks,
  createTask,
  updateTask as updateTaskAPI,
  deleteTask as deleteTaskAPI,
} from "../api/taskAPI";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import UserManagement from "./UserManagement";
import toast from "react-hot-toast";

function Home() {
  const { user } = useAuthStore();
  const { tasks, setTasks, addTask, updateTask, removeTask, setLoading, loading } =
    useTaskStore();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [activeTab, setActiveTab] = useState("tasks");

  const isAdmin = user?.role === "ADMIN";

  // Fetch tasks on mount
  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getAllTasks();
      setTasks(res.data.payload);
    } catch {
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  // Create or update task (from modal)
  const handleTaskSubmit = async (formData, taskId) => {
    try {
      if (taskId) {
        const res = await updateTaskAPI(taskId, formData);
        updateTask(res.data.payload);
        toast.success("Task updated successfully");
      } else {
        const res = await createTask(formData);
        await fetchTasks();
        toast.success("Task created successfully");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Operation failed";
      toast.error(msg);
      throw err;
    }
  };

  // Delete task (admin)
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await deleteTaskAPI(taskId);
      removeTask(taskId);
      toast.success("Task deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  // Status change (user)
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const res = await updateTaskAPI(taskId, { status: newStatus });
      updateTask(res.data.payload);
      toast.success("Status updated");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleCreate = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  // Stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter((t) => t.status === "PENDING").length,
    inProgress: tasks.filter((t) => t.status === "IN_PROGRESS").length,
    completed: tasks.filter((t) => t.status === "COMPLETED").length,
  };

  // Grouped tasks for user view
  const pendingTasks = tasks.filter((t) => t.status === "PENDING");
  const inProgressTasks = tasks.filter((t) => t.status === "IN_PROGRESS");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  if (loading && tasks.length === 0) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "96px 0" }}>
        <div style={{ textAlign: "center" }}>
          <div className="spinner-lg" style={{ margin: "0 auto 16px" }} />
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>Loading your tasks…</p>
        </div>
      </div>
    );
  }

  /* ─── ADMIN DASHBOARD ─── */
  if (isAdmin) {
    return (
      <div className="animate-fade-in">
        {/* Welcome */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f1f5f9" }}>
            Welcome back,{" "}
            <span className="gradient-text">{user.firstName}</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "6px" }}>
            Here&rsquo;s your admin dashboard overview
          </p>
        </div>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }} className="stagger">
          <div className="stat-card animate-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(6,182,212,0.2))", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px", color: "#2dd4bf" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f1f5f9", lineHeight: 1 }}>{stats.total}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Total Tasks</p>
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(234,179,8,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px", color: "#fbbf24" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#fbbf24", lineHeight: 1 }}>{stats.pending}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Pending</p>
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(6,182,212,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px", color: "#22d3ee" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#22d3ee", lineHeight: 1 }}>{stats.inProgress}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>In Progress</p>
              </div>
            </div>
          </div>

          <div className="stat-card animate-slide-up">
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: "rgba(16,185,129,0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "22px", height: "22px", color: "#34d399" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p style={{ fontSize: "1.75rem", fontWeight: 700, color: "#34d399", lineHeight: 1 }}>{stats.completed}</p>
                <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>Completed</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="glass-card-static" style={{ display: "inline-flex", padding: "4px", borderRadius: "14px", marginBottom: "28px" }}>
          <button
            onClick={() => setActiveTab("tasks")}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
              background: activeTab === "tasks" ? "linear-gradient(135deg, #14b8a6, #06b6d4)" : "transparent",
              color: activeTab === "tasks" ? "#fff" : "#94a3b8",
              boxShadow: activeTab === "tasks" ? "0 4px 12px rgba(20,184,166,0.3)" : "none",
            }}
          >
            Tasks ({stats.total})
          </button>
          <button
            onClick={() => setActiveTab("users")}
            style={{
              padding: "10px 24px",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 600,
              border: "none",
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
              background: activeTab === "users" ? "linear-gradient(135deg, #14b8a6, #06b6d4)" : "transparent",
              color: activeTab === "users" ? "#fff" : "#94a3b8",
              boxShadow: activeTab === "users" ? "0 4px 12px rgba(20,184,166,0.3)" : "none",
            }}
          >
            Users
          </button>
        </div>

        {/* Content */}
        {activeTab === "tasks" ? (
          <>
            {/* Create button */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: "20px" }}>
              <button onClick={handleCreate} className="btn-primary">
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                New Task
              </button>
            </div>

            {tasks.length === 0 ? (
              <div className="glass-card-static" style={{ padding: "64px 32px", textAlign: "center" }}>
                <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(30,41,59,0.8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "32px", height: "32px", color: "#475569" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <h3 style={{ color: "#cbd5e1", fontWeight: 600, marginBottom: "4px", fontSize: "1.1rem" }}>
                  No tasks yet
                </h3>
                <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
                  Create your first task to get started
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gap: "16px", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }} className="stagger">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    isAdmin={true}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <UserManagement />
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditingTask(null);
          }}
          onSubmit={handleTaskSubmit}
          editTask={editingTask}
          isAdmin={true}
        />
      </div>
    );
  }

  /* ─── USER DASHBOARD — Kanban-style columns ─── */
  return (
    <div className="animate-fade-in">
      {/* Welcome + New Task button */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "32px", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <h1 style={{ fontSize: "1.75rem", fontWeight: 700, color: "#f1f5f9" }}>
            Hi, <span className="gradient-text">{user?.firstName}</span> 👋
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "6px" }}>
            You have{" "}
            <span style={{ color: "#2dd4bf", fontWeight: 600 }}>
              {stats.pending + stats.inProgress}
            </span>{" "}
            task{stats.pending + stats.inProgress !== 1 ? "s" : ""} to work on
          </p>
        </div>
        <button onClick={handleCreate} className="btn-primary">
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          New Task
        </button>
      </div>

      {/* Mini Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "32px" }} className="stagger">
        <div className="stat-card animate-slide-up" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#fbbf24" }}>{stats.pending}</p>
          <p style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
            Pending
          </p>
        </div>
        <div className="stat-card animate-slide-up" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#22d3ee" }}>{stats.inProgress}</p>
          <p style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
            In Progress
          </p>
        </div>
        <div className="stat-card animate-slide-up" style={{ textAlign: "center" }}>
          <p style={{ fontSize: "1.5rem", fontWeight: 700, color: "#34d399" }}>{stats.completed}</p>
          <p style={{ fontSize: "0.65rem", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.05em", marginTop: "4px" }}>
            Completed
          </p>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="glass-card-static" style={{ padding: "64px 32px", textAlign: "center" }}>
          <div style={{ width: "64px", height: "64px", borderRadius: "16px", background: "rgba(30,41,59,0.8)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "32px", height: "32px", color: "#475569" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 style={{ color: "#cbd5e1", fontWeight: 600, marginBottom: "4px", fontSize: "1.1rem" }}>
            No tasks yet
          </h3>
          <p style={{ color: "#64748b", fontSize: "0.875rem" }}>
            Create your first task to get started
          </p>
        </div>
      ) : (
        /* Kanban Columns */
        <div style={{ display: "grid", gap: "24px", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))" }}>
          {/* Pending Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#fbbf24" }} />
              <h2 style={{ fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Pending
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#475569", marginLeft: "auto" }}>
                {pendingTasks.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="stagger">
              {pendingTasks.length === 0 ? (
                <p style={{ fontSize: "0.75rem", color: "#475569", textAlign: "center", padding: "24px 0" }}>
                  No pending tasks
                </p>
              ) : (
                pendingTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isAdmin={false} onStatusChange={handleStatusChange} onDelete={handleDelete} />
                ))
              )}
            </div>
          </div>

          {/* In Progress Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22d3ee" }} />
              <h2 style={{ fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                In Progress
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#475569", marginLeft: "auto" }}>
                {inProgressTasks.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="stagger">
              {inProgressTasks.length === 0 ? (
                <p style={{ fontSize: "0.75rem", color: "#475569", textAlign: "center", padding: "24px 0" }}>
                  No tasks in progress
                </p>
              ) : (
                inProgressTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isAdmin={false} onStatusChange={handleStatusChange} />
                ))
              )}
            </div>
          </div>

          {/* Completed Column */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
              <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#34d399" }} />
              <h2 style={{ fontSize: "0.8rem", fontWeight: 600, color: "#cbd5e1", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Completed
              </h2>
              <span style={{ fontSize: "0.75rem", color: "#475569", marginLeft: "auto" }}>
                {completedTasks.length}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="stagger">
              {completedTasks.length === 0 ? (
                <p style={{ fontSize: "0.75rem", color: "#475569", textAlign: "center", padding: "24px 0" }}>
                  No completed tasks
                </p>
              ) : (
                completedTasks.map((task) => (
                  <TaskCard key={task._id} task={task} isAdmin={false} onStatusChange={handleStatusChange} />
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Task Modal for users */}
      <TaskModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTask(null);
        }}
        onSubmit={handleTaskSubmit}
        editTask={editingTask}
        isAdmin={false}
      />
    </div>
  );
}

export default Home;