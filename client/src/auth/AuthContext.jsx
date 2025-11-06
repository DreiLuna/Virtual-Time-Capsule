import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("demo_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("demo_token"));

  async function register(email, password) {
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({email, password})
    })

    return response;
  }

  // Fake login API (replace with real fetch to your backend)
  async function login(email, password) {
    await new Promise(r => setTimeout(r, 500)); // simulate latency
    // Demo check
    if (email === "demo@site.com" && password === "password123") {
      const fakeToken = "demo.jwt.token";
      const demoUser = { id: 1, email, name: "Demo User" };
      setUser(demoUser);
      setToken(fakeToken);
      localStorage.setItem("demo_user", JSON.stringify(demoUser));
      localStorage.setItem("demo_token", fakeToken);
      return { ok: true };
    }
    return { ok: false, message: "Invalid email or password." };
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_token");
  }

  const value = useMemo(() => ({ user, token, login, logout, isAuthed: !!token }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
