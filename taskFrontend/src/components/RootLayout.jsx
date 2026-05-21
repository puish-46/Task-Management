import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router";
import useAuthStore from "../store/authStore";
import { logoutUser } from "../api/authAPI";
import toast from "react-hot-toast";

function RootLayout() {
  const { isAuthenticated, user, logoutUser: clearUser } = useAuthStore();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutUser();
      clearUser();
      toast.success("Logged out successfully");
      navigate("/login");
    } catch (err) {
      toast.error("Logout failed");
    }
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
      {/* ─── Navbar ─── */}
      <nav className="glass" style={{ position: "sticky", top: 0, zIndex: 40, padding: "0 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "64px" }}>
          {/* Logo */}
          <NavLink to={isAuthenticated ? "/home" : "/login"} style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "linear-gradient(135deg, #14b8a6, #06b6d4, #0ea5e9)", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#fff", fontSize: "0.875rem" }}>
              TF
            </div>
            <span className="gradient-text" style={{ fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.02em" }}>
              TaskFlow
            </span>
          </NavLink>

          {/* Desktop Nav */}
          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/home"
                  style={({ isActive }) => ({
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                    textDecoration: "none",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    color: isActive ? "#fff" : "#94a3b8",
                  })}
                >
                  Dashboard
                </NavLink>

                <div style={{ width: "1px", height: "24px", background: "#334155", margin: "0 8px" }} />

                {/* User Info */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#e2e8f0", lineHeight: 1.3, margin: 0 }}>
                      {user?.firstName} {user?.lastName}
                    </p>
                    <span className={`badge ${user?.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                      {user?.role}
                    </span>
                  </div>
                  <div style={{ width: "36px", height: "36px", borderRadius: "12px", background: "linear-gradient(135deg, #14b8a6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: "0.875rem" }}>
                    {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                  </div>
                </div>

                <button onClick={handleLogout} className="btn-secondary" style={{ fontSize: "0.875rem", padding: "8px 16px" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "16px", height: "16px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink
                  to="/login"
                  style={({ isActive }) => ({
                    padding: "8px 16px",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    transition: "all 0.2s",
                    textDecoration: "none",
                    background: isActive ? "rgba(255,255,255,0.1)" : "transparent",
                    color: isActive ? "#fff" : "#94a3b8",
                  })}
                >
                  Login
                </NavLink>
                <NavLink to="/register" className="btn-primary" style={{ fontSize: "0.875rem", padding: "8px 20px", textDecoration: "none" }}>
                  Register
                </NavLink>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="btn-icon mobile-only"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" style={{ width: "20px", height: "20px" }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="mobile-only animate-slide-down" style={{ paddingBottom: "16px" }}>
            <div className="glass-card-static" style={{ borderRadius: "12px", padding: "12px", display: "flex", flexDirection: "column", gap: "4px" }}>
              {isAuthenticated ? (
                <>
                  {/* User info */}
                  <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", marginBottom: "8px" }}>
                    <div style={{ width: "40px", height: "40px", borderRadius: "12px", background: "linear-gradient(135deg, #14b8a6, #06b6d4)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700 }}>
                      {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
                    </div>
                    <div>
                      <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "#e2e8f0", margin: 0 }}>
                        {user?.firstName} {user?.lastName}
                      </p>
                      <span className={`badge ${user?.role === "ADMIN" ? "badge-admin" : "badge-user"}`}>
                        {user?.role}
                      </span>
                    </div>
                  </div>
                  <NavLink
                    to="/home"
                    onClick={closeMobileMenu}
                    style={{ display: "block", padding: "10px 16px", borderRadius: "8px", fontSize: "0.875rem", color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Dashboard
                  </NavLink>
                  <button
                    onClick={() => { closeMobileMenu(); handleLogout(); }}
                    style={{ width: "100%", textAlign: "left", padding: "10px 16px", borderRadius: "8px", fontSize: "0.875rem", color: "#f87171", background: "transparent", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink
                    to="/login"
                    onClick={closeMobileMenu}
                    style={{ display: "block", padding: "10px 16px", borderRadius: "8px", fontSize: "0.875rem", color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Login
                  </NavLink>
                  <NavLink
                    to="/register"
                    onClick={closeMobileMenu}
                    style={{ display: "block", padding: "10px 16px", borderRadius: "8px", fontSize: "0.875rem", color: "#cbd5e1", textDecoration: "none" }}
                  >
                    Register
                  </NavLink>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* ─── Page Content ─── */}
      <main style={{ flex: 1, padding: "32px 24px" }}>
        <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
          <Outlet />
        </div>
      </main>

      {/* ─── Footer ─── */}
      <footer style={{ padding: "24px 16px", textAlign: "center", fontSize: "0.75rem", color: "#475569" }}>
        © {new Date().getFullYear()} TaskFlow. Built with ❤️
      </footer>

      {/* ─── Responsive CSS ─── */}
      <style>{`
        .mobile-only { display: none; }
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .mobile-only { display: flex !important; }
        }
      `}</style>
    </div>
  );
}

export default RootLayout;