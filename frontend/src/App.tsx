import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Link,
 
 
} from "react-router-dom";
import { useState, useEffect } from "react";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import Dashboard from "./components/dashboard/Dashboard";
import KYC from "./components/kyc/KYC";
import axios from "axios";
import "./App.css";

interface KYCFiles {
  video?: Blob;
  image?: Blob;
}

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsAuthenticated(false);
      return;
    }

    try {
      await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: {
          "x-auth-token": token,
        },
      });
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
      const formData = new FormData();
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("No authentication token found");
      }

      const cloudName = "dkltkryj8";
      const uploadPreset = "kyc_upload";
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/upload`;

      if (files.video) {
        formData.append("file", files.video, "kyc-video.webm");

        formData.append("upload_preset", uploadPreset);
        formData.append("resource_type", "video");
      } else if (files.image) {
        formData.append("file", files.image, "kyc-image.jpg");
        formData.append("upload_preset", uploadPreset);
        formData.append("resource_type", "image");
      }

      const cloudinaryResponse = await axios.post(cloudinaryUrl, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const { secure_url, public_id, resource_type } = cloudinaryResponse.data;

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/users/upload-kyc`,
        {
          kycUrl: secure_url,
          kycPublicId: public_id,
          kycType: resource_type === "video" ? "video" : "image",
        },
        { headers: { "x-auth-token": token } }
      );

      await checkAuth();
      window.location.href = "/dashboard";
      return true;
    } catch (err) {
      console.error("Error uploading KYC:", err);
      alert("Failed to upload KYC. Please try again.");
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
      </div>
    </Router>
  );
}

export default App;
