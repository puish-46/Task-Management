import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { loginUser } from "../api/authAPI";
import useAuthStore from "../store/authStore";
import toast from "react-hot-toast";

function Login() {
  const navigate = useNavigate();
  const { setUser, setLoading, loading } = useAuthStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
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
      const res = await loginUser(formData);
      setUser(res.data.payload);
      toast.success(`Welcome back, ${res.data.payload.firstName}!`);
      navigate("/home");
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 10rem)", display: "flex", alignItems: "center", justifyContent: "center", padding: "32px 16px" }}>
      <div style={{ width: "100%", maxWidth: "440px" }} className="animate-slide-up">
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>Welcome Back</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Sign in to your account to continue
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card-static" style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Email */}
            <div>
              <label htmlFor="login-email" className="form-label">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="input-field"
                style={errors.email ? { borderColor: "rgba(239, 68, 68, 0.5)" } : {}}
                autoComplete="email"
              />
              {errors.email && (
                <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "6px" }}>{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="login-password" className="form-label">Password</label>
              <input
                id="login-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="input-field"
                style={errors.password ? { borderColor: "rgba(239, 68, 68, 0.5)" } : {}}
                autoComplete="current-password"
              />
              {errors.password && (
                <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "6px" }}>{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: "100%", padding: "14px", marginTop: "8px", fontSize: "1rem" }}
            >
              {loading ? (
                <>
                  <span className="spinner" />
                  Signing in…
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b", marginTop: "24px" }}>
            Don't have an account?{" "}
            <NavLink
              to="/register"
              style={{ color: "#2dd4bf", fontWeight: 500, textDecoration: "none" }}
            >
              Create one
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;