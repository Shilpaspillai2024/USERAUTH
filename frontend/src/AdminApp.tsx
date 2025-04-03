import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
} from "react-router-dom";
import AdminLogin from "./components/admin/AdminLogin";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserKYCDetails from "./components/admin/UserKYCDetails";
import "./App.css";

function AdminApp() {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  
  useEffect(() => {
    const adminToken = localStorage.getItem("adminToken");
    if (adminToken) {
      setIsAdminAuthenticated(true);
    }
  }, []);

  const handleAdminLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAdminAuthenticated(false);
  };

  const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
 //   <Router>
      <div className="App">
        {isAdminAuthenticated && (
          <nav className="navbar">
            <div className="navbar-brand">Admin Portal</div>
            <div className="navbar-links">
              <Link to="/admin/dashboard">Dashboard</Link>
              <button onClick={handleAdminLogout} className="logout-button">
                Logout
              </button>
            </div>
          </nav>
        )}

        <Routes>
          <Route
            path="/admin/login"
            element={
              isAdminAuthenticated ? (
                <Navigate to="/admin/dashboard" />
              ) : (
                <AdminLogin setIsAdminAuthenticated={setIsAdminAuthenticated} />
              )
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin/user/:userId"
            element={
              <ProtectedAdminRoute>
                <UserKYCDetails />
              </ProtectedAdminRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <Navigate to={isAdminAuthenticated ? "/admin/dashboard" : "/admin/login"} />
            }
          />
        </Routes>
      </div>
  //  </Router>
  );
}

export default AdminApp;