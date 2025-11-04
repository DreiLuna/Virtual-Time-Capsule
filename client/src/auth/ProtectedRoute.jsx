import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute({ redirectTo = "/login" }) {
  const { isAuthed } = useAuth();
  return isAuthed ? <Outlet /> : <Navigate to={redirectTo} replace />;
}
