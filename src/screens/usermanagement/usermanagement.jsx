import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

const UserManagement = () => {
  const [users, setUsers] = useState([
    { name: "John Doe", workMotel: "Sunrise Inn", location: "New York", role: "Admin", isEnabled: true },
    { name: "Jane Smith", workMotel: "Cozy Stay", location: "Los Angeles", role: "Clerk", isEnabled: false },
  ]);
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    password: "",
    workMotel: "",
    location: "",
    role: "User",
  });
  const [editingUser, setEditingUser] = useState(null);

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editingUser !== null) {
      setUsers((prevUsers) => {
        const updatedUsers = [...prevUsers];
        updatedUsers[editingUser] = { ...newUser, isEnabled: prevUsers[editingUser].isEnabled };
        return updatedUsers;
      });
      setEditingUser(null);
    } else {
      setUsers([...users, { ...newUser, isEnabled: true }]);
    }
    setNewUser({ name: "", password: "", workMotel: "", location: "", role: "User" });
    setShowPopup(false);
    setEditPopup(false);
  };

  const toggleEnableStatus = (index) => {
    setUsers((prevUsers) => {
      const updatedUsers = [...prevUsers];
      updatedUsers[index].isEnabled = !updatedUsers[index].isEnabled;
      return updatedUsers;
    });
  };

  const handleEdit = (index) => {
    setEditingUser(index);
    setNewUser({
      name: users[index].name,
      password: "",
      workMotel: users[index].workMotel,
      location: users[index].location,
      role: users[index].role,
    });
    setEditPopup(true);
  };

  return (
    <div className="p-4">
      <h1 className="mb-4">User Management</h1>
      <button className="btn btn-primary mb-3" onClick={() => setShowPopup(true)}>
        Create User
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Work Motel</th>
            <th>Location</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.name}</td>
              <td>{user.workMotel}</td>
              <td>{user.location}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(index)}>
                  View/Edit
                </button>
                <button
                  className={`btn btn-sm ${user.isEnabled ? "btn-danger" : "btn-success"}`}
                  onClick={() => toggleEnableStatus(index)}
                >
                  {user.isEnabled ? "Disable" : "Enable"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {(showPopup || editPopup) && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{editPopup ? "Edit User" : "Create User"}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowPopup(false);
                    setEditPopup(false);
                    setEditingUser(null);
                  }}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                      type="password"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required={!editPopup}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Work Motel</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.workMotel}
                      onChange={(e) => setNewUser({ ...newUser, workMotel: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.location}
                      onChange={(e) => setNewUser({ ...newUser, location: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      required
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Clerk">Clerk</option>
                    </select>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">
                    {editPopup ? "Save Changes" : "Create User"}
                  </button>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => {
                      setShowPopup(false);
                      setEditPopup(false);
                      setEditingUser(null);
                    }}
                  >
                    Close
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
