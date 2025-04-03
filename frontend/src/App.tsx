import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
  useNavigate,
} from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import KYC from "./components/kyc/KYC";
import "./App.css";
import { getUserData, uploadKYC } from "./api/api";
import { ToastContainer,toast } from "react-toastify";

interface KYCFiles {
  video?: Blob;
  image?: Blob;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate=useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      await getUserData(token);
      setIsAuthenticated(true);
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
      setIsAuthenticated(false);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  const handleKYCSubmit = async (files: KYCFiles) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const result = await uploadKYC(files, token);

      if (result) {
        toast.success("KYC updated successfully")
        await checkAuth();
      //  window.location.href = "/dashboard";
      navigate('/dashboard')
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error uploading KYC:", err);
      toast.error("Failed to upload KYC. Please try again.");
      return false;
    }
  };

  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    return isAuthenticated ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        {isAuthenticated && (
          <nav className="navbar">
            <div className="navbar-brand">MERN Authentication</div>
            <div className="navbar-links">
              <Link to="/dashboard">Dashboard</Link>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/register" element={<Register />} />
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/dashboard" />
              ) : (
                <Login setIsAuthenticated={setIsAuthenticated} />
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/kyc"
            element={
              <ProtectedRoute>
                <KYC onSubmit={handleKYCSubmit} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/"
            element={
              <Navigate to={isAuthenticated ? "/dashboard" : "/login"} />
            }
          />
        </Routes>


        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

export default App;
