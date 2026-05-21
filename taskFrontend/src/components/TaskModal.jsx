import { useState, useEffect } from "react";
import { getAllUsers } from "../api/userAPI";
import toast from "react-hot-toast";

function TaskModal({ isOpen, onClose, onSubmit, editTask, isAdmin = true }) {
  const isEditing = !!editTask;

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "PENDING",
    priority: "MEDIUM",
    dueDate: "",
    assignee: "",
  });
  const [users, setUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Fetch users for assignee dropdown (admin only)
  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchUsers();
    }
  }, [isOpen, isAdmin]);

  // Pre-fill form when editing
  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title || "",
        description: editTask.description || "",
        status: editTask.status || "PENDING",
        priority: editTask.priority || "MEDIUM",
        dueDate: editTask.dueDate
          ? new Date(editTask.dueDate).toISOString().split("T")[0]
          : "",
        assignee:
          typeof editTask.assignee === "object"
            ? editTask.assignee._id
            : editTask.assignee || "",
      });
    } else {
      setFormData({
        title: "",
        description: "",
        status: "PENDING",
        priority: "MEDIUM",
        dueDate: "",
        assignee: "",
      });
    }
    setErrors({});
  }, [editTask, isOpen]);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers();
      const userList = res.data.payload.filter(
        (u) => u.isUserActive && u.role === "USER"
      );
      setUsers(userList);
    } catch {
      toast.error("Failed to load users");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = "Title is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.dueDate) newErrors.dueDate = "Due date is required";
    if (isAdmin && !formData.assignee) newErrors.assignee = "Assignee is required";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData, editTask?._id);
      onClose();
    } catch {
      // Error is handled in parent
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const errorStyle = { borderColor: "rgba(239, 68, 68, 0.5)" };
  const errorTextStyle = { color: "#f87171", fontSize: "0.75rem", marginTop: "6px" };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 24px 0" }}>
          <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#f1f5f9" }}>
            {isEditing ? "Edit Task" : "Create New Task"}
          </h2>
          <button onClick={onClose} className="btn-icon">
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "18px" }}>
          {/* Title */}
          <div>
            <label htmlFor="task-title" className="form-label">Title</label>
            <input
              id="task-title"
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter task title"
              className="input-field"
              style={errors.title ? errorStyle : {}}
            />
            {errors.title && <p style={errorTextStyle}>{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="task-desc" className="form-label">Description</label>
            <textarea
              id="task-desc"
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe the task..."
              rows={3}
              className="textarea-field"
              style={errors.description ? errorStyle : {}}
            />
            {errors.description && <p style={errorTextStyle}>{errors.description}</p>}
          </div>

          {/* Status + Priority Row */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
            <div>
              <label htmlFor="task-status" className="form-label">Status</label>
              <select
                id="task-status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select-field"
              >
                <option value="PENDING">Pending</option>
                <option value="IN_PROGRESS">In Progress</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>
            <div>
              <label htmlFor="task-priority" className="form-label">Priority</label>
              <select
                id="task-priority"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="select-field"
              >
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
              </select>
            </div>
          </div>

          {/* Due Date */}
          <div>
            <label htmlFor="task-date" className="form-label">Due Date</label>
            <input
              id="task-date"
              type="date"
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
              className="input-field"
              style={errors.dueDate ? errorStyle : {}}
            />
            {errors.dueDate && <p style={errorTextStyle}>{errors.dueDate}</p>}
          </div>

          {/* Assignee (admin only - users auto-assign to self) */}
          {isAdmin && (
            <div>
              <label htmlFor="task-assignee" className="form-label">Assign To</label>
              <select
                id="task-assignee"
                name="assignee"
                value={formData.assignee}
                onChange={handleChange}
                className="select-field"
                style={errors.assignee ? errorStyle : {}}
              >
                <option value="">Select a user...</option>
                {users.map((u) => (
                  <option key={u._id} value={u._id}>
                    {u.firstName} {u.lastName} — {u.email}
                  </option>
                ))}
              </select>
              {errors.assignee && <p style={errorTextStyle}>{errors.assignee}</p>}
              {users.length === 0 && (
                <p style={{ color: "rgba(251,191,36,0.7)", fontSize: "0.75rem", marginTop: "6px" }}>
                  No active users found. Register users first.
                </p>
              )}
            </div>
          )}

          {/* Actions */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginTop: "8px", paddingTop: "8px" }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              {loading ? (
                <>
                  <span className="spinner" />
                  {isEditing ? "Saving…" : "Creating…"}
                </>
              ) : isEditing ? (
                "Save Changes"
              ) : (
                "Create Task"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskModal;
