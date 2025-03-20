import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUsers } from "../../api/api";

interface User {
  _id: string;
  email: string;
  kycVerified: boolean;
  kycType: string;
  kycDate: string;
}

const AdminDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    fetchUsers();
  }, [page, search]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("adminToken");
      if (!token) {
        setError("No authentication token found");
        setLoading(false);
        return;
      }

      const response = await getUsers(token, page, 10, search);
      setUsers(response.data.users);
      setTotalPages(response.data.totalPages);
      setError("");
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to fetch users. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="dashboard-container">
      <h2>Admin Dashboard</h2>
      <div className="search-container">
        <form onSubmit={handleSearchSubmit}>
          <input
            type="text"
            placeholder="Search by email"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button type="submit">Search</button>
        </form>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">Loading users...</div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>KYC Status</th>
                  <th>KYC Type</th>
                  <th>KYC Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user._id}>
                      <td>{user.email}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            user.kycVerified ? "verified" : "pending"
                          }`}
                        >
                          {user.kycVerified ? "Verified" : "Pending"}
                        </span>
                      </td>
                      <td>{user.kycType || "N/A"}</td>
                      <td>
                        {user.kycDate
                          ? new Date(user.kycDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td>
                        <Link
                          to={`/admin/user/${user._id}`}
                          className="view-button"
                        >
                          View KYC
                        </Link>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5}>No users found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="pagination">
            <button
              onClick={() => handlePageChange(page - 1)}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => handlePageChange(page + 1)}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;