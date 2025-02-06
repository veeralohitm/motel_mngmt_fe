import React, { useState, useEffect } from "react";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import Swal from 'sweetalert2'

//const BASE_URL = "http://localhost:3000/"
const BASE_URL = "https://hotel-app-bk.onrender.com/"
const API_URL = `${BASE_URL}users`;
const MOTEL_API_URL = `${BASE_URL}motels`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [motels, setMotels] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [editPopup, setEditPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMotel, setSelectedMotel] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    initials: "",
    fullname: "",
    email: "",
    street: "",
    city: "",
    state: "",
    zipcode: "",
    country: "",
    phone: "",
    birthday: "",
    hiring_date: "",
    motel_name:"",
    motel_id:"",
    motel_location:"",
    enabled: true,
  });
  const [editingUser, setEditingUser] = useState(null);
  const [editUserData, setEditUserData] = useState({
    username: "",
    password: "",
    hiring_date: "",
    role: "",
  });

  const handleDelete = async (userId) => {
    const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, delete it!"
      });
      if (result.isConfirmed) {
        try {
        await axios.delete(`${API_URL}/${userId}`);
        Swal.fire("Deleted!", "The user has been deleted.", "success");
        setUsers(users.filter(user => user.user_id !== userId)); // Update UI after deletion
      } catch (error) {
        console.error("Error deleting user:", error);
        Swal.fire("Error!", error.response.data.error, "error");
      }
    }
  };
  const filteredUsers = users.filter(
    (user) =>
      user.username.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedMotel ? user.motel_id === selectedMotel : true)
  );
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const displayUsers = filteredUsers.slice((currentPage - 1) * usersPerPage, currentPage * usersPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get(API_URL);
        const motelsResponse = await axios.get(MOTEL_API_URL);
        setUsers(usersResponse.data);
        setMotels(motelsResponse.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
   // if (editingUser !== null) {
    //  await axios.put(`${API_URL}/${users[editingUser].id}`, newUser);
    //} else {
    //console.log(newUser)
    try {
    await axios.post(API_URL, newUser);
    Swal.fire({
        title: 'Success!',
        text: 'User created successfully.',
        icon: 'success',
        confirmButtonText: 'OK'
      });}
      catch (error) {
        console.error("Error creating user:", error);
        Swal.fire({
          title: 'Error!',
          text: error.response.data.error,
          icon: 'error',
          confirmButtonText: 'Retry'
      });}
    //}
    setUsers((await axios.get(API_URL)).data);
    setNewUser({
      username: "",
      password: "",
      initials: "",
      fullname: "",
      email: "",
      street: "",
      city: "",
      state: "",
      zipcode: "",
      country: "",
      phone: "",
      birthday: "",
      hiring_date: "",
      motel_name:"",
      motel_id:"",
      motel_location:"",
      enabled: true,
    });
   
     setShowPopup(false);
    //setEditPopup(false);
    //setEditingUser(null);
  };

  const toggleEnableStatus = async (index) => {
    const user = users[index];
    user.enabled = !user.enabled;
    await axios.put(`${API_URL}/${user.id}`, user);
    setUsers((await axios.get(API_URL)).data);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log(editingUser.user_id)
    await axios.put(`${API_URL}/${editingUser.user_id}`, editUserData);
    setUsers((await axios.get(API_URL)).data);
    setEditPopup(false);
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditUserData({
      username: user.username,
      password: user.password,
      role: user.role,
    });
    setEditPopup(true);
  };


  return (
    <div className="p-4">
      <h1 className="mb-4">User Management</h1>
      <div className="mb-3 d-flex">
        <input
          type="text"
          className="form-control me-2"
          placeholder="Search by username"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      <button className="btn btn-primary mb-3" onClick={() => setShowPopup(true)}>
        Create User
      </button>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>User Name</th>
            <th>Motel Name</th>
            <th>Motel Location</th>
            <th>User ID</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayUsers.map((user) => (
            <tr key={user.user_id}>
              <td>{user.username}</td>
              <td>{user.motel_name}</td>
              <td>{user.motel_location}</td>
              <td>{user.uid}</td>
              <td>{user.role}</td>
              <td>
                <button className="btn btn-sm btn-info me-2" onClick={() => handleEdit(user)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-warning ms-2" onClick={() => handleDelete(user.user_id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)}>Previous</button>
          </li>
          {[...Array(totalPages)].map((_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(index + 1)}>{index + 1}</button>
            </li>
          ))}
          <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)}>Next</button>
          </li>
        </ul>
      </nav>
      </table>

      {showPopup && (
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
                    <div class="container">
                        <div class="row">
                            <div class="col-md-6">
                            <label className="form-label">Username</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.username}
                      onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
                      required
                    />
                    <label className="form-label">Password</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      required
                    />
                    <label className="form-label">Email</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      
                    />
                      <label className="form-label">Hiring Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={newUser.hiring_date}
                      onChange={(e) => setNewUser({ ...newUser, hiring_date: e.target.value })}
                      required
                    />
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
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                    <label className="form-label">Motel</label>
<select
  className="form-select"
  value={newUser.motel_id}
  onChange={(e) => { 
    const selectedMotel = motels.find(motel => String(motel.motel_id) === e.target.value);

    if (selectedMotel) {
      setNewUser({ 
        ...newUser, 
        motel_id: selectedMotel.motel_id || "",       // Ensure it has a default value
        motel_name: selectedMotel.motel_name || "",   // Store motel name safely
        motel_location: selectedMotel.motel_location || "" // Store motel location safely
      });
    } else {
      setNewUser({ ...newUser, motel_id: "", motel_name: "", motel_location: "" });
    }
  }}
  required
>
  <option value="">Select Motel</option>
  {motels.map((motel) => (
    <option key={motel.motel_id} value={String(motel.motel_id)}>
      {motel.motel_name}
    </option>
  ))}
</select>
                            </div>
                            <div class="col-md-6">
                            <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.fullname}
                      onChange={(e) => setNewUser({ ...newUser, fullname: e.target.value })}
                      required
                    />
                    <label className="form-label">Initials</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.initials}
                      onChange={(e) => setNewUser({ ...newUser, initials: e.target.value })}
                      
                    />
                     <label className="form-label">Phonenumber</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.phone}
                      onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
                      
                    />
                     <label className="form-label">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.street}
                      onChange={(e) => setNewUser({ ...newUser, street: e.target.value })}
                      
                    />
                    <label className="form-label">City</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.city}
                      onChange={(e) => setNewUser({ ...newUser, city: e.target.value })}
                      
                    />
                     <label className="form-label">State</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.state}
                      onChange={(e) => setNewUser({ ...newUser, state: e.target.value })}
                      
                    />
                      <label className="form-label">Country</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.country}
                      onChange={(e) => setNewUser({ ...newUser, country: e.target.value })}
                      
                    />
                      <label className="form-label">ZipCode</label>
                    <input
                      type="text"
                      className="form-control"
                      value={newUser.zipcode}
                      onChange={(e) => setNewUser({ ...newUser, zipcode: e.target.value })}
                      
                    />
                            </div>
                        </div>
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
      {editPopup && (
        <div className="modal show d-block">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit User</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setEditPopup(false)}
                ></button>
              </div>
              <form onSubmit={handleEditSubmit}>
                <div className="modal-body">
                  <label>Username</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editUserData.username}
                    onChange={(e) => setEditUserData({ ...editUserData, username: e.target.value })}
                  />
                  <label>Password</label>
                  <input type="text" className="form-control" 
                   value={editUserData.password}
                   onChange={(e) => setEditUserData({ ...editUserData, password: e.target.value })}
                  />
                  <label>Role</label>
                  <select
                      className="form-select"
                      value={editUserData.role}
                      onChange={(e) => setEditUserData({ ...editUserData, role: e.target.value })}
                      required
                    >
                      <option value="User">User</option>
                      <option value="Admin">Admin</option>
                      <option value="Clerk">Clerk</option>
                      <option value="SuperAdmin">SuperAdmin</option>
                    </select>
                </div>
                <div className="modal-footer">
                  <button type="submit" className="btn btn-success">Save</button>
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
