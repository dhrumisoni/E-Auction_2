import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("adminToken");

  if (!token) {
    // If not logged in → redirect to login page
    return <Navigate to="/admin/login" replace />;
  }

  return children; // Allow access
};

export default ProtectedRoute;
