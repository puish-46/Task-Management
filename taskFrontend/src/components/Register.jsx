import { useState } from "react";
import { useNavigate, NavLink } from "react-router";
import { registerUser } from "../api/authAPI";
import toast from "react-hot-toast";

function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
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
    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
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
      // Always register as USER — admin is seeded directly in DB
      await registerUser({ ...formData, role: "USER" });
      toast.success("Account created! Please sign in.");
      navigate("/login");
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Registration failed. Please try again.";
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
          <h1 className="gradient-text" style={{ fontSize: "2rem", fontWeight: 700, marginBottom: "8px" }}>
            Create Account
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            Join TaskFlow and start managing your tasks
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card-static" style={{ padding: "32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {/* Name Row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
              <div>
                <label htmlFor="reg-firstName" className="form-label">
                  First Name
                </label>
                <input
                  id="reg-firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="John"
                  className="input-field"
                  style={errors.firstName ? { borderColor: "rgba(239, 68, 68, 0.5)" } : {}}
                />
                {errors.firstName && (
                  <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "6px" }}>
                    {errors.firstName}
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="reg-lastName" className="form-label">
                  Last Name
                </label>
                <input
                  id="reg-lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                  className="input-field"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="reg-email" className="form-label">
                Email Address
              </label>
              <input
                id="reg-email"
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
              <label htmlFor="reg-password" className="form-label">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Min 6 characters"
                className="input-field"
                style={errors.password ? { borderColor: "rgba(239, 68, 68, 0.5)" } : {}}
                autoComplete="new-password"
              />
              {errors.password && (
                <p style={{ color: "#f87171", fontSize: "0.75rem", marginTop: "6px" }}>
                  {errors.password}
                </p>
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
                  Creating account…
                </>
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Footer link */}
          <p style={{ textAlign: "center", fontSize: "0.875rem", color: "#64748b", marginTop: "24px" }}>
            Already have an account?{" "}
            <NavLink
              to="/login"
              style={{ color: "#2dd4bf", fontWeight: 500, textDecoration: "none" }}
            >
              Sign in
            </NavLink>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;