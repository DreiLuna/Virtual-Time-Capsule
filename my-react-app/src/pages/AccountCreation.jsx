import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

//^ Importing assets
import house_icon from "../assets/house_icon.png"
//$ importing css
import "../css/Landing.css"

export default function AccountCreation() {
  const auth = useAuth();
  const navigate = useNavigate();

  const createFn = 
    auth?.createAccount ??
    auth?.signup ??
    auth?.register ??
    auth?.createUser ??
    auth?.create;

  const [form, setForm] = useState({ 
    email: "",
    password: "",
    confirmPassword: "", 
    showPw: false 
  });

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
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!createFn) {
      setError("Account creation is not available.");
      return;
    }

    setLoading(true);
    const res = await login(form.email, form.password);
    setLoading(false);
    if (!res.ok) {
      setError(res.message || "Account Creation failed.");
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
        <h2>Create Account</h2>

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
        <label className="label">Confirm password</label>
        <input
          name="confirmPassword"
          type={form.showPw ? "text" : "password"}
          value={form.confirmPassword}
          onChange={onChange}
          className="input"
          placeholder="••••••••"
          autoComplete="new-password"
        />
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, showPw: !f.showPw }))}
            className="toggle"
          >
            {form.showPw ? "Hide" : "Show"}
          </button>
        </div>

        <button disabled={loading} className="btn">
          {loading ? "Creating…" : "Create Account"}
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
            Already have an account?{" "}
            <button type="button" className="link-like" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </small>
        </div>
      </form>
    </div>
  );
}
