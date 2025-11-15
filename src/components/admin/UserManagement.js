import React, { useState } from "react";
import "../../styles/UserManagement.css";

const initialUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    phone: "+1 (555) 123-4567",
    joinDate: "2023-05-15",
    status: "active",
    reservations: 3,
    totalSpent: 1250.5,
    lastLogin: "2024-11-14"
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "+1 (555) 234-5678",
    joinDate: "2023-07-22",
    status: "active",
    reservations: 5,
    totalSpent: 2350.0,
    lastLogin: "2024-11-13"
  },
  {
    id: 3,
    name: "Michael Brown",
    email: "michael@example.com",
    phone: "+1 (555) 345-6789",
    joinDate: "2023-09-10",
    status: "active",
    reservations: 2,
    totalSpent: 890.75,
    lastLogin: "2024-11-12"
  },
  {
    id: 4,
    name: "Sarah Johnson",
    email: "sarah@example.com",
    phone: "+1 (555) 456-7890",
    joinDate: "2023-11-01",
    status: "inactive",
    reservations: 1,
    totalSpent: 350.0,
    lastLogin: "2024-10-20"
  },
  {
    id: 5,
    name: "Robert Wilson",
    email: "robert@example.com",
    phone: "+1 (555) 567-8901",
    joinDate: "2024-01-15",
    status: "active",
    reservations: 4,
    totalSpent: 1750.25,
    lastLogin: "2024-11-14"
  }
];

const emptyUser = {
  id: null,
  name: "",
  email: "",
  phone: "",
  status: "active",
  reservations: 0,
  totalSpent: 0,
  joinDate: "",
  lastLogin: ""
};

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");

  const [selectedUser, setSelectedUser] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const [editUser, setEditUser] = useState(emptyUser);
  const [showEditModal, setShowEditModal] = useState(false);

  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const filteredUsers = users.filter((user) => {
    const matchesStatus = filter === "all" || user.status === filter;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalRevenue = users.reduce((sum, u) => sum + u.totalSpent, 0);

  const getStatusColor = (status) => {
    return status === "active" ? "status-active" : "status-inactive";
  };

  const getStatusIcon = (status) => {
    return status === "active" ? "🟢" : "⚪";
  };

  const openDetail = (user) => {
    setSelectedUser(user);
    setShowDetailModal(true);
  };

  const openEdit = (user) => {
    setEditUser(user || { ...emptyUser, id: Date.now() });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditUser((prev) => ({
      ...prev,
      [name]:
        name === "totalSpent" || name === "reservations"
          ? Number(value)
          : value
    }));
  };

  const saveUser = (e) => {
    e.preventDefault();

    setUsers((prev) => {
      const exists = prev.find((u) => u.id === editUser.id);
      if (exists) {
        return prev.map((u) => (u.id === editUser.id ? editUser : u));
      }
      return [...prev, { ...editUser }];
    });

    setShowEditModal(false);
  };

  const openDeleteConfirmation = (user) => {
    setDeleteConfirmation(user);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    if (deleteConfirmation) {
      setUsers((prev) => prev.filter((u) => u.id !== deleteConfirmation.id));
      setShowDeleteModal(false);
      setDeleteConfirmation(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setDeleteConfirmation(null);
  };

  return (
    <div className="user-management-container">
      <div className="management-header">
        <div>
          <h1>User Management</h1>
          <p className="subtitle">Manage and monitor all registered users</p>
        </div>
        <button className="btn primary" onClick={() => openEdit(null)}>
          + Add user
        </button>
      </div>

      {/* Stats Overview */}
      <div className="stats-overview">
        <div className="stat-card stat-users">
          <div className="stat-info">
            <h4>Total Users</h4>
            <p className="stat-number">{users.length}</p>
          </div>
          <div className="stat-icon">👥</div>
        </div>
        <div className="stat-card stat-active">
          <div className="stat-info">
            <h4>Active Users</h4>
            <p className="stat-number">{activeUsers}</p>
          </div>
          <div className="stat-icon">🟢</div>
        </div>
        <div className="stat-card stat-revenue">
          <div className="stat-info">
            <h4>Total Revenue</h4>
            <p className="stat-number">${totalRevenue.toFixed(2)}</p>
          </div>
          <div className="stat-icon">💰</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="search-filter-section">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <span className="search-icon">🔍</span>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All Users
          </button>
          <button
            className={`filter-btn ${filter === "active" ? "active" : ""}`}
            onClick={() => setFilter("active")}
          >
            Active
          </button>
          <button
            className={`filter-btn ${filter === "inactive" ? "active" : ""}`}
            onClick={() => setFilter("inactive")}
          >
            Inactive
          </button>
        </div>
      </div>

      {/* Users Table - Desktop */}
      <div className="table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Join Date</th>
              <th>Status</th>
              <th>Reservations</th>
              <th>Total Spent</th>
              <th>Last Login</th>
              <th className="center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id}>
                <td>
                  <div className="user-name">
                    <span className="avatar">{user.name.charAt(0)}</span>
                    {user.name}
                  </div>
                </td>
                <td>{user.email}</td>
                <td>{user.phone}</td>
                <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                <td>
                  <span className={`status-badge ${getStatusColor(user.status)}`}>
                    {getStatusIcon(user.status)} {user.status}
                  </span>
                </td>
                <td className="center">{user.reservations}</td>
                <td className="amount">${user.totalSpent.toFixed(2)}</td>
                <td>{new Date(user.lastLogin).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn-icon"
                      onClick={() => openDetail(user)}
                      title="View Details"
                    >
                      👁️
                    </button>
                    <button
                      className="btn-icon"
                      onClick={() => openEdit(user)}
                      title="Edit"
                    >
                      ✎
                    </button>
                    <button
                      className="btn-icon danger"
                      onClick={() => openDeleteConfirmation(user)}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Users Cards - Mobile */}
      <div className="users-cards">
        {filteredUsers.map((user) => (
          <div key={user.id} className="user-card">
            <div className="card-header">
              <div className="user-info">
                <span className="avatar">{user.name.charAt(0)}</span>
                <div>
                  <h3>{user.name}</h3>
                  <p>{user.email}</p>
                </div>
              </div>
              <span className={`status-badge ${getStatusColor(user.status)}`}>
                {getStatusIcon(user.status)} {user.status}
              </span>
            </div>

            <div className="card-details">
              <div className="detail-row">
                <span>Phone</span>
                <strong>{user.phone}</strong>
              </div>
              <div className="detail-row">
                <span>Joined</span>
                <strong>{new Date(user.joinDate).toLocaleDateString()}</strong>
              </div>
              <div className="detail-row">
                <span>Reservations</span>
                <strong>{user.reservations}</strong>
              </div>
              <div className="detail-row">
                <span>Total Spent</span>
                <strong>${user.totalSpent.toFixed(2)}</strong>
              </div>
              <div className="detail-row">
                <span>Last Login</span>
                <strong>{new Date(user.lastLogin).toLocaleDateString()}</strong>
              </div>
            </div>

            <div className="card-actions">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => openDetail(user)}
              >
                View Details
              </button>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => openEdit(user)}
              >
                Edit
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => openDeleteConfirmation(user)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length === 0 && (
        <div className="empty-state">
          <p>👤 No users found matching your search criteria.</p>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && deleteConfirmation && (
        <div className="modal-overlay" onClick={cancelDelete}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Delete User</h2>
              <button className="modal-close" onClick={cancelDelete}>
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="confirmation-message">
                <p className="warning-icon">⚠️</p>
                <p className="confirmation-text">
                  Are you sure you want to delete <strong>{deleteConfirmation.name}</strong>?
                </p>
                <p className="confirmation-subtitle">
                  This action cannot be undone. All user data and reservations will be permanently removed.
                </p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={cancelDelete}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                onClick={confirmDelete}
              >
                Delete User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="modal-overlay" onClick={() => setShowDetailModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>User Details</h2>
              <button
                className="modal-close"
                onClick={() => setShowDetailModal(false)}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Personal Information</h3>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Name</label>
                    <p>{selectedUser.name}</p>
                  </div>
                  <div className="info-field">
                    <label>Email</label>
                    <p>{selectedUser.email}</p>
                  </div>
                  <div className="info-field">
                    <label>Phone</label>
                    <p>{selectedUser.phone}</p>
                  </div>
                  <div className="info-field">
                    <label>Status</label>
                    <p>
                      <span
                        className={`status-badge ${getStatusColor(
                          selectedUser.status
                        )}`}
                      >
                        {getStatusIcon(selectedUser.status)}{" "}
                        {selectedUser.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="modal-section">
                <h3>Account Activity</h3>
                <div className="info-grid">
                  <div className="info-field">
                    <label>Join Date</label>
                    <p>
                      {new Date(selectedUser.joinDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="info-field">
                    <label>Last Login</label>
                    <p>
                      {new Date(selectedUser.lastLogin).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="info-field">
                    <label>Total Reservations</label>
                    <p>{selectedUser.reservations}</p>
                  </div>
                  <div className="info-field">
                    <label>Total Amount Spent</label>
                    <p className="amount">
                      ${selectedUser.totalSpent.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-secondary"
                onClick={() => setShowDetailModal(false)}
              >
                Close
              </button>
              <button className="btn btn-primary">Send Email</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit / Add User Modal */}
      {showEditModal && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editUser.id ? "Edit user" : "Add user"}</h2>
              <button
                className="modal-close"
                onClick={() => setShowEditModal(false)}
              >
                ✕
              </button>
            </div>

            <form className="modal-body" onSubmit={saveUser}>
              <div className="info-grid">
                <div className="info-field">
                  <label>Name</label>
                  <input
                    name="name"
                    value={editUser.name}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="info-field">
                  <label>Email</label>
                  <input
                    type="email"
                    name="email"
                    value={editUser.email}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="info-field">
                  <label>Phone</label>
                  <input
                    name="phone"
                    value={editUser.phone}
                    onChange={handleEditChange}
                    required
                  />
                </div>
                <div className="info-field">
                  <label>Status</label>
                  <select
                    name="status"
                    value={editUser.status}
                    onChange={handleEditChange}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
                <div className="info-field">
                  <label>Reservations</label>
                  <input
                    type="number"
                    name="reservations"
                    min="0"
                    value={editUser.reservations}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="info-field">
                  <label>Total Spent</label>
                  <input
                    type="number"
                    step="0.01"
                    name="totalSpent"
                    min="0"
                    value={editUser.totalSpent}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="info-field">
                  <label>Join Date</label>
                  <input
                    type="date"
                    name="joinDate"
                    value={editUser.joinDate}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="info-field">
                  <label>Last Login</label>
                  <input
                    type="date"
                    name="lastLogin"
                    value={editUser.lastLogin}
                    onChange={handleEditChange}
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
