import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./auth/AuthContext";
import ProtectedRoute from "./auth/ProtectedRoute";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";  
import "./index.css";

function HomeDefault() {
  const { isAuthed } = useAuth();
  return isAuthed ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

const router = createBrowserRouter([
  { path: "/", element: <HomeDefault /> },
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />, // gate everything below
    children: [{ path: "/dashboard", element: <Dashboard /> }],
  },
  { path: "*", element: <Login /> }, // default
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);