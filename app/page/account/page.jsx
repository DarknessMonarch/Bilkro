"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/Auth";
import styles from "@/app/styles/account.module.css";

export default function Account() {
  const { 
    isAdmin, 
    username, 
    email, 
    profileImage,
    getAllUsers, 
    getUsersByRole, 
    toggleAdmin, 
    deleteUserAccount, 
    bulkDeleteAccounts 
  } = useAuthStore();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("allUsers");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");

  // Fetch users based on active tab
  useEffect(() => {
    async function fetchUsers() {
      setLoading(true);
      setError(null);
      try {
        let result;
        
        if (activeTab === "adminUsers") {
          result = await getUsersByRole("admin");
        } else {
          result = await getAllUsers();
        }
        
        if (result.success) {
          setUsers(result.data.users || []);
        } else {
          setError(result.message || "Failed to fetch users");
        }
      } catch (err) {
        setError("An unexpected error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    if (isAdmin) {
      fetchUsers();
    }
  }, [activeTab, getAllUsers, getUsersByRole, isAdmin]);

  // Handle admin toggle
  const handleToggleAdmin = async (userId, isCurrentlyAdmin) => {
    if (!confirm(`${isCurrentlyAdmin ? "Remove" : "Grant"} admin privileges?`)) {
      return;
    }

    setLoading(true);
    try {
      const result = await toggleAdmin(userId, !isCurrentlyAdmin);
      
      if (result.success) {
        // Update the users list
        setUsers(users.map(user => 
          user._id === userId ? { ...user, isAdmin: !isCurrentlyAdmin } : user
        ));
      } else {
        setError(result.message || "Failed to update admin status");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user? This action cannot be undone.")) {
      return;
    }

    setLoading(true);
    try {
      const result = await deleteUserAccount(userId);
      
      if (result.success) {
        // Remove user from the list
        setUsers(users.filter(user => user._id !== userId));
      } else {
        setError(result.message || "Failed to delete user");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedUsers.length === 0) {
      setError("No users selected for deletion");
      return;
    }
    
    setConfirmDelete(true);
  };

  const confirmBulkDelete = async () => {
    setLoading(true);
    try {
      const result = await bulkDeleteAccounts(selectedUsers);
      
      if (result.success) {
        // Remove deleted users from the list
        setUsers(users.filter(user => !selectedUsers.includes(user._id)));
        setSelectedUsers([]);
        setConfirmDelete(false);
      } else {
        setError(result.message || "Failed to delete users");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Handle user selection for bulk actions
  const handleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  // Filter users based on search term and role
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterRole === "all") return matchesSearch;
    if (filterRole === "admin") return matchesSearch && user.isAdmin;
    if (filterRole === "regular") return matchesSearch && !user.isAdmin;
    
    return matchesSearch;
  });

  // Cancel bulk delete operation
  const cancelBulkDelete = () => {
    setConfirmDelete(false);
  };

  // Toggle select all users
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user._id));
    }
  };

  if (!isAdmin) {
    return (
      <div className={styles.accountDashboard}>
        <div className={styles.unauthorizedMessage}>
          <h2>Access Denied</h2>
          <p>You need administrator privileges to access this dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.accountDashboard}>
      <div className={styles.dashboardHeader}>
        <div className={styles.adminProfile}>
          {profileImage && (
            <div className={styles.profileImageContainer}>
              <img src={profileImage} alt={username} className={styles.profileImage} />
            </div>
          )}
          <div className={styles.adminInfo}>
            <h2>{username}</h2>
            <p>{email}</p>
            <span className={styles.adminBadge}>Administrator</span>
          </div>
        </div>
        
        <h1 className={styles.dashboardTitle}>Account Management</h1>
      </div>

      <div className={styles.tabsContainer}>
        <button 
          className={`${styles.tabButton} ${activeTab === "allUsers" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("allUsers")}
        >
          All Users
        </button>
        <button 
          className={`${styles.tabButton} ${activeTab === "adminUsers" ? styles.activeTab : ""}`}
          onClick={() => setActiveTab("adminUsers")}
        >
          Administrators
        </button>
      </div>

      <div className={styles.controlsContainer}>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search users..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          <select 
            className={styles.roleFilter}
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="all">All Roles</option>
            <option value="admin">Admins Only</option>
            <option value="regular">Regular Users</option>
          </select>
        </div>
        
        <div className={styles.actionsContainer}>
          <button 
            className={`${styles.bulkDeleteButton} ${selectedUsers.length === 0 ? styles.disabled : ""}`}
            onClick={handleBulkDelete}
            disabled={selectedUsers.length === 0}
          >
            Delete Selected ({selectedUsers.length})
          </button>
        </div>
      </div>

      {error && <div className={styles.errorMessage}>{error}</div>}
      
      {loading ? (
        <div className={styles.loadingState}>Loading users...</div>
      ) : (
        <div className={styles.tableContainer}>
          <table className={styles.usersTable}>
            <thead>
              <tr>
                <th>
                  <input 
                    type="checkbox" 
                    checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>User</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user._id}>
                    <td>
                      <input 
                        type="checkbox" 
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => handleSelectUser(user._id)}
                      />
                    </td>
                    <td className={styles.userCell}>
                      <div className={styles.userInfo}>
                        <div className={styles.userImageWrapper}>
                          {user.profileImage ? (
                            <img 
                              src={user.profileImage} 
                              alt={user.username} 
                              className={styles.userThumbnail}
                            />
                          ) : (
                            <div className={styles.userInitial}>
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <span className={styles.userName}>{user.username}</span>
                      </div>
                    </td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`${styles.userBadge} ${user.isAdmin ? styles.adminBadge : ""}`}>
                        {user.isAdmin ? "Admin" : "User"}
                      </span>
                    </td>
                    <td className={styles.actionCell}>
                      <button 
                        className={`${styles.actionButton} ${styles.toggleButton}`}
                        onClick={() => handleToggleAdmin(user._id, user.isAdmin)}
                      >
                        {user.isAdmin ? "Revoke Admin" : "Make Admin"}
                      </button>
                      <button 
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleDeleteUser(user._id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className={styles.noData}>
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {confirmDelete && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal}>
            <h3>Confirm Bulk Deletion</h3>
            <p>Are you sure you want to delete {selectedUsers.length} user accounts?</p>
            <p className={styles.warningText}>This action cannot be undone!</p>
            
            <div className={styles.modalActions}>
              <button 
                className={styles.cancelButton}
                onClick={cancelBulkDelete}
              >
                Cancel
              </button>
              <button 
                className={styles.confirmButton}
                onClick={confirmBulkDelete}
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}