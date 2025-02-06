import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'

//const BASE_URL = "http://localhost:3000/";
const BASE_URL = "https://hotel-app-bk.onrender.com/"
const LOGIN_API_URL = `${BASE_URL}login`;
const CHECK_HISTORY_URL = `${BASE_URL}check-user-history`;
const RESET_PASSWORD_URL = `${BASE_URL}reset-password`;
const CHECK_USER_URL = `${BASE_URL}check-user`;

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isFirstLogin, setIsFirstLogin] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError(null);
  
    try {
      // Step 1: Check if the username exists
      const userCheckResponse = await fetch(CHECK_USER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
  
      const userCheckData = await userCheckResponse.json();
      if (!userCheckResponse.ok || !userCheckData.exists) {
        //setError("Username not found. Please check your credentials.");
        Swal.fire("User not found","", "error");
        return;
      }
  
      // Step 2: Check login history
      const historyResponse = await fetch(CHECK_HISTORY_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
  
      const historyData = await historyResponse.json();
      if (historyData.isFirstLogin) {
        setIsFirstLogin(true);
        return;
      }
  
      // Step 3: Proceed with login
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        Swal.fire("Welcome!", username, "success");
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("username", data.user.username);
        navigate("/dashboard");
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    }
  };

  const handlePasswordReset = async (event) => {
    event.preventDefault();
    setError(null);

    if (newPassword !== confirmNewPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const resetResponse = await fetch(RESET_PASSWORD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, newPassword }),
      });

      const resetData = await resetResponse.json();
      if (resetResponse.ok) {
        Swal.fire("Password Updated Successfully!");
        //alert("Password updated successfully. Please log in with your new password.");
        setIsFirstLogin(false);
      } else {
        setError(resetData.message || "Password reset failed.");
      }
    } catch (error) {
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          {!isFirstLogin ? (
            <form onSubmit={handleLogin} className="p-4 border rounded shadow">
              <h1 className="h3 mb-3 fw-normal text-center">Sign in</h1>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="mb-3">
                <label htmlFor="username" className="form-label">Username</label>
                <input type="text" className="form-control" id="username" value={username} onChange={(e) => setUsername(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Password</label>
                <input type="password" className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button className="btn btn-primary w-100 py-2" type="submit">Sign in</button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="p-4 border rounded shadow">
              <h1 className="h3 mb-3 fw-normal text-center">Reset Password</h1>
              {error && <p className="text-danger text-center">{error}</p>}
              <div className="mb-3">
                <label htmlFor="newPassword" className="form-label">New Password</label>
                <input type="password" className="form-control" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
              </div>
              <div className="mb-3">
                <label htmlFor="confirmNewPassword" className="form-label">Confirm New Password</label>
                <input type="password" className="form-control" id="confirmNewPassword" value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} required />
              </div>
              <button className="btn btn-success w-100 py-2" type="submit">Update Password</button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
