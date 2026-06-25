import React from "react";
import { Navigate } from "react-router-dom";
import { getCurrentUser, isAuthenticated } from "../services/authService";

/**
 * ProtectedRoute component for role-based access control
 * @param {Object} props
 * @param {React.Component} props.children - Component to render if authorized
 * @param {string|string[]} props.allowedRoles - Role(s) that can access this route (e.g., "farmer", "buyer", or ["farmer", "buyer"])
 * @param {string} props.redirectTo - Where to redirect if not authorized (default: "/login")
 */
const ProtectedRoute = ({ children, allowedRoles, redirectTo = "/login" }) => {
  const authenticated = isAuthenticated();
  const user = getCurrentUser();

  // If not authenticated, redirect to login
  if (!authenticated) {
    return <Navigate to="/login" replace />;
  }

  // If no role restriction, just check authentication
  if (!allowedRoles) {
    return children;
  }

  // Convert single role to array for easier checking
  const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

  // Check if user's role is in allowed roles
  const isAuthorized = rolesArray.includes(user?.role);

  // If not authorized, redirect based on user role
  if (!isAuthorized) {
    // Redirect farmers to dashboard if they try to access buyer pages
    if (user?.role === "farmer") {
      return <Navigate to="/dashboard" replace />;
    }
    // Redirect buyers to marketplace if they try to access farmer pages
    if (user?.role === "buyer") {
      return <Navigate to="/marketplace" replace />;
    }
    // Default redirect
    return <Navigate to={redirectTo} replace />;
  }

  // User is authorized, render the component
  return children;
};

export default ProtectedRoute;
