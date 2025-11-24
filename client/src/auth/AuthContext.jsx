import { createContext, useContext, useMemo, useState, useEffect } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  //stores user info
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  //Check for existing session
  useEffect(() => {
    const storedUser = localStorage.getItem("auth_user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  //send data to backend
  const register = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = response.ok;

      if (!response.ok) {
        return { error: data.message || "Registration failed" };
      }

      //auto-login after registration
      const { token: accessToken, user: userData } = data;
      setToken(accessToken);
      setUser(userData);
      localStorage.setItem("auth_token", accessToken);
      localStorage.setItem("auth_user", JSON.stringify(userData));

      return { success: true };
    } catch (error) {
      return { error: "Network error" };
    }
  };
  const login = async (email, password) => {
    try {
      const response = await fetch("http://localhost:3001/api/users/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include", // important for session/cookie auth!
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        return { error: data.message || "Login failed" };
      }
          const data = await response.json();
          console.log(data);
      // If successful, store user data in state and localStorage
      if (data.message === "Login successful!") {
        setUser(data.user);

        localStorage.setItem("auth_user", JSON.stringify(data.user));
        return { success: true };
      } else {
        return { error: data.message || "Login failed" };
      }
    } catch (error) {
      return { error: "Network error" };
    }
  };

  const logout = async (navigate) => {
    try {
      await fetch("http://localhost:3001/api/users/logout", {
        method: "POST",
        credentials: "include",
      });
    } catch (e) {
      // Ignore network errors on logout
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_user");
    if (navigate) navigate("/login");
  };


  const value = useMemo(
    () => ({ user, token, register, login, logout, isAuthed: !!user }),
    [user, token],
  );

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
