import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import house_icon from "../assets/house_icon.png"
import "../css/Landing.css"

export default function AccountCreation() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPw, setShowPw] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setError("");
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //CHECK FOR VALIDATION
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }

    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    if (!form.password.length >= 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    const result = await auth2.register(form.email, form.password);
    setLoading(false);

    if (result.error) {
      setError(result.message || "Registration failed.");
      return;
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <div className="center">
      <div>
        <img
          src={house_icon}
          className="logo House"
          alt="logo"
          onClick={() => navigate('/')}
          style={{ cursor: 'pointer' }}
        />
      </div>
      <form onSubmit={handleSubmit} className="card">
        <h2>Create Account</h2>

        {error && <div className="error">{error}</div>}

        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label className="label">Password</label>
        <div className="input-wrap">
          <input
            name="password"
            type={showPw ? "text" : "password"}
            value={form.password}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <label className="label">Confirm password</label>
          <input
            name="confirmPassword"
            type={showPw ? "text" : "password"}
            value={form.confirmPassword}
            onChange={handleChange}
            className="input"
            placeholder="••••••••"
            autoComplete="new-password"
          />
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            className="toggle"
          >
            {showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading} className="btn" style={{ marginTop: '5px' }}>
          {loading ? "Creating…" : "Create Account"}
        </button>

        <div style={{ marginTop: 12 }}>
          <small>
            Already have an account?{" "}
            <button
              type="button"
              className="link-like"
              onClick={() => navigate("/login")}
            >
              Sign in
            </button>
          </small>
        </div>
      </form>
    </div>
  );
}
