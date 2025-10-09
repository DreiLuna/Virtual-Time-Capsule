import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

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
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message || "Login failed.");
      return;
    }
    navigate("/dashboard");
  }

  return (
    <div className="center">
      <form onSubmit={onSubmit} className="card">
        <h1 className="h1">Sign in</h1>
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

        <div className="row">
          <input
            id="remember"
            name="remember"
            type="checkbox"
            onChange={onChange}
          />
          <label htmlFor="remember">Remember me</label>
        </div>

        <button disabled={loading} className="btn">
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
