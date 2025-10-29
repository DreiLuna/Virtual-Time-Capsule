import { useAuth } from "../auth/AuthContext";

//$ importing css
import "../css/Landing.css"

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="topbar">
        <h1 className="title">Welcome, {user?.name}!</h1>
        <button onClick={logout} className="btn">Log out</button>
      </div>

      <p className="container muted">
        This is a protected page. Only visible when authenticated.
      </p>
    </div>
  );
}

