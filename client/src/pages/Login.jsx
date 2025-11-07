
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

//^ Importing assets
import house_icon from "../assets/house_icon.png"
//$ importing css
import "../css/Landing.css"

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", showPw: false });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onChange(e) {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setError("");

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.error) {
      setError(result.message || "Login failed.");
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="center">
      <div>
        <img src={house_icon} className="logo House" alt="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}></img>
      </div>
      <form onSubmit={onSubmit} className="card">
        <h2>Sign In</h2>
        <p className="help">
          Use <code>demo@site.com</code> / <code>password123</code> (demo).
        </p>

        {error && <div className="error">{error}</div>}

        <label className="label">Email</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
          className="input"
          placeholder="you@example.com"
          autoComplete="email"
        />

        <label className="label">Password</label>
        <div className="input-wrap">
          <input
            name="password"
            type={form.showPw ? "text" : "password"}
            value={form.password}
            onChange={onChange}
            className="input"
            placeholder="••••••••"
            autoComplete="current-password"
          />
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, showPw: !f.showPw }))}
            className="toggle"
          >
            {form.showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading} className="btn" style={{ marginTop: '5px' }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>

        <div className="row">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            onChange={onChange}
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        <div style={{ marginTop: 12 }}>
          <small>
            New here?{" "}
            <button type="button" className="link-like" onClick={() => navigate("/signup")}>
              Create account
            </button>
          </small>
        </div>
      </form>
    </div>
  );
}
