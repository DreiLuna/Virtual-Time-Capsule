import { createContext, useContext, useMemo, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const raw = localStorage.getItem("demo_user");
    return raw ? JSON.parse(raw) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("demo_token"));

  async function postRequest(url, data) {
    // Sending data to backend
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    // Parse JSON data from response
    const result = await response.json();
    // Checks for valid response
    if (!response.ok) {
      return {error: result.message || "Request failed"}
    }
    // Returns parsed JSON data
    return result
  }

  async function register(email, password) {
    return await postRequest("http://localhost:5000/register", {email, password})
  }

  async function login(email, password) {
    const result = await postRequest("http://localhost:5000/login", { email, password })
    setToken(result.access_token);

    // Fake login API (replace with real fetch to your backend)
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

    // This is being passed onto the login page which has the same
    // code, so please replace with better idea if anyone has any
    if (result.error) {
      return result
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("demo_user");
    localStorage.removeItem("demo_token");
  }

  const value = useMemo(() => ({ user, token, register, login, logout, isAuthed: !!token }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
