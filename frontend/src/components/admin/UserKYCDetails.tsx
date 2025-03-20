import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserKYCDetails } from "../../api/api";

interface KYCDetails {
  userId: string;
  email: string;
  kycStatus: string;
  kycType: string;
  kycDate: string;
  kycUrl: string;
}

const UserKYCDetails: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const [kycDetails, setKYCDetails] = useState<KYCDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (userId) {
      fetchKYCDetails();
    }
  }, [userId]);

  const fetchKYCDetails = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await getUserKYCDetails(token, userId as string);
      setKYCDetails(response.data);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to fetch KYC details. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="kyc-details-container">
      <div className="back-button-container">
        <Link to="/admin/dashboard" className="back-button">
          ← Back to Dashboard
        </Link>
      </div>
      
      <h2>User KYC Details</h2>
      
      {error && <div className="error-message">{error}</div>}
      
      {loading ? (
        <div className="loading">Loading KYC details...</div>
      ) : kycDetails ? (
        <div className="kyc-card">
          <div className="user-info">
            <p>
              <strong>User ID:</strong> {kycDetails.userId}
            </p>
            <p>
              <strong>Email:</strong> {kycDetails.email}
            </p>
            <p>
              <strong>KYC Status:</strong>{" "}
              <span
                className={`status-badge ${
                  kycDetails.kycStatus === "Verified" ? "verified" : "pending"
                }`}
              >
                {kycDetails.kycStatus}
              </span>
            </p>
            <p>
              <strong>KYC Type:</strong> {kycDetails.kycType || "N/A"}
            </p>
            <p>
              <strong>Submission Date:</strong>{" "}
              {kycDetails.kycDate !== "Not provided"
                ? new Date(kycDetails.kycDate).toLocaleDateString()
                : "N/A"}
            </p>
          </div>
          
          {kycDetails.kycUrl && kycDetails.kycUrl !== "Not provided" && (
            <div className="kyc-media">
              <h3>KYC Media</h3>
              {kycDetails.kycType === "video" ? (
                <video
                  controls
                  src={kycDetails.kycUrl}
                  className="kyc-video"
                ></video>
              ) : (
                <img
                  src={kycDetails.kycUrl}
                  alt="KYC Document"
                  className="kyc-image"
                />
              )}
            </div>
          )}
          
         
        </div>
      ) : (
        <div>No KYC details found.</div>
      )}
    </div>
  );
};

export default UserKYCDetails;