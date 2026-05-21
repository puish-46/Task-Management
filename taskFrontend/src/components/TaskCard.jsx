function TaskCard({ task, isAdmin, onEdit, onDelete, onStatusChange }) {
  const statusMap = {
    PENDING: { label: "Pending", class: "badge-pending" },
    IN_PROGRESS: { label: "In Progress", class: "badge-in-progress" },
    COMPLETED: { label: "Completed", class: "badge-completed" },
  };

  const priorityMap = {
    LOW: { label: "Low", class: "badge-low" },
    MEDIUM: { label: "Medium", class: "badge-medium" },
    HIGH: { label: "High", class: "badge-high" },
  };

  const statusInfo = statusMap[task.status] || statusMap.PENDING;
  const priorityInfo = priorityMap[task.priority] || priorityMap.MEDIUM;

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const isOverdue = () => {
    if (!task.dueDate || task.status === "COMPLETED") return false;
    return new Date(task.dueDate) < new Date();
  };

  const statusOptions = ["PENDING", "IN_PROGRESS", "COMPLETED"];

  return (
    <div className="glass-card animate-fade-in" style={{ padding: "20px", display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Top Row: Priority + Status */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span className={`badge ${priorityInfo.class}`}>
          {task.priority === "HIGH" && (
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "12px", height: "12px" }} viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          )}
          {priorityInfo.label}
        </span>
        <span className={`badge ${statusInfo.class}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Title */}
      <h3 style={{ fontSize: "1rem", fontWeight: 600, color: "#f1f5f9", lineHeight: 1.4 }}>
        {task.title}
      </h3>

      {/* Description */}
      {task.description && (
        <p className="line-clamp-2" style={{ fontSize: "0.875rem", color: "#94a3b8", lineHeight: 1.6 }}>
          {task.description}
        </p>
      )}

      {/* Meta Row */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px", fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
        {/* Due Date */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", color: isOverdue() ? "#f87171" : "inherit" }}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "14px", height: "14px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {formatDate(task.dueDate)}
          {isOverdue() && <span style={{ fontSize: "0.6rem", fontWeight: 700, textTransform: "uppercase" }}>Overdue</span>}
        </div>

        {/* Assignee */}
        {task.assignee && (
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }}>
            <div style={{ width: "20px", height: "20px", borderRadius: "6px", background: "linear-gradient(135deg, #0d9488, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.55rem", color: "#fff", fontWeight: 700 }}>
              {task.assignee.firstName?.charAt(0)}
              {task.assignee.lastName?.charAt(0)}
            </div>
            <span style={{ color: "#94a3b8" }}>
              {task.assignee.firstName} {task.assignee.lastName?.charAt(0)}.
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "8px", paddingTop: "12px", borderTop: "1px solid rgba(51,65,85,0.4)" }}>
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(task)}
              className="btn-icon"
              title="Edit task"
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
            <button
              onClick={() => onDelete(task._id)}
              className="btn-icon"
              title="Delete task"
              style={{ color: "#94a3b8" }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(51,65,85,0.4)"; e.currentTarget.style.color = "#94a3b8"; }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
          </>
        ) : (
          <>
            <select
              value={task.status}
              onChange={(e) => onStatusChange(task._id, e.target.value)}
              className="select-field"
              style={{ fontSize: "0.75rem", padding: "8px 12px", flex: 1 }}
            >
              {statusOptions.map((s) => (
                <option key={s} value={s}>
                  {statusMap[s].label}
                </option>
              ))}
            </select>
            {onDelete && (
              <button
                onClick={() => onDelete(task._id)}
                className="btn-icon"
                title="Delete task"
                style={{ color: "#94a3b8" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(51,65,85,0.4)"; e.currentTarget.style.color = "#94a3b8"; }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
