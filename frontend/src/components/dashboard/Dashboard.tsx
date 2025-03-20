import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

interface User {
  _id: string;
  email: string;
  createdAt: string;
  kycVerified: boolean;
}

const Dashboard: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        headers: { "x-auth-token": token },
      });


      console.log("userresponse",response)
      setUser(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError("Failed to load user details. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  const handleKYCUpdate = () => {
    navigate("/kyc");
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="dashboard-container">
      <h2>Welcome, {user?.email}</h2>

      {user?.kycVerified ? (
        <p>Your KYC is verified. Enjoy using the platform!</p>
      ) : (
        <div className="kyc-warning">
          <p>Your KYC is not verified. Please update your KYC to continue.</p>
          <button onClick={handleKYCUpdate} className="kyc-button">Update KYC</button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

