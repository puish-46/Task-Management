import { useState, useEffect } from "react";
import { getAllUsers, toggleUserActive, deleteUser } from "../api/userAPI";
import toast from "react-hot-toast";

function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await getAllUsers();
      const nonAdminUsers = res.data.payload.filter((u) => u.role !== "ADMIN");
      setUsers(nonAdminUsers);
    } catch {
      toast.error("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (userId) => {
    try {
      const res = await toggleUserActive(userId);
      const isActive = res.data.payload;
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isUserActive: isActive } : u
        )
      );
      toast.success(
        `User ${isActive ? "activated" : "deactivated"} successfully`
      );
    } catch (err) {
      toast.error(err.response?.data?.message || "Toggle failed");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    try {
      await deleteUser(userId);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
      toast.success("User deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: "48px 0" }}>
        <div className="spinner-lg" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <div>
          <h2 style={{ fontSize: "1.125rem", fontWeight: 700, color: "#f1f5f9", display: "flex", alignItems: "center", gap: "8px" }}>
            <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px", color: "#2dd4bf" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            User Management
          </h2>
          <p style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "4px" }}>
            {users.length} registered user{users.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {users.length === 0 ? (
        <div className="glass-card-static" style={{ padding: "48px 32px", textAlign: "center" }}>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>No registered users yet.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }} className="stagger">
          {users.map((user) => (
            <div
              key={user._id}
              className="glass-card-static animate-fade-in"
              style={{ padding: "16px 20px", display: "flex", flexWrap: "wrap", alignItems: "center", gap: "12px" }}
            >
              {/* Avatar + Info */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1 1 200px", minWidth: 0 }}>
                <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #0d9488, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem", flexShrink: 0 }}>
                  {user.firstName?.charAt(0)}
                  {user.lastName?.charAt(0)}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#e2e8f0", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.firstName} {user.lastName}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "#64748b", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {user.email}
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <span className={`badge ${user.isUserActive ? "badge-active" : "badge-inactive"}`}>
                {user.isUserActive ? "Active" : "Inactive"}
              </span>

              {/* Actions */}
              <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
                <button
                  onClick={() => handleToggle(user._id)}
                  style={{
                    fontSize: "0.75rem",
                    fontWeight: 500,
                    padding: "6px 14px",
                    borderRadius: "8px",
                    transition: "all 0.2s",
                    cursor: "pointer",
                    fontFamily: "inherit",
                    background: user.isUserActive ? "rgba(234,179,8,0.1)" : "rgba(16,185,129,0.1)",
                    color: user.isUserActive ? "#fbbf24" : "#34d399",
                    border: `1px solid ${user.isUserActive ? "rgba(234,179,8,0.2)" : "rgba(16,185,129,0.2)"}`,
                  }}
                  title={user.isUserActive ? "Deactivate" : "Activate"}
                >
                  {user.isUserActive ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(user._id)}
                  className="btn-icon"
                  title="Delete user"
                  onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(239,68,68,0.15)"; e.currentTarget.style.color = "#f87171"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "rgba(51,65,85,0.4)"; e.currentTarget.style.color = "#94a3b8"; }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserManagement;
