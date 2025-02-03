import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//const BASE_URL = "http://localhost:3000/";
const BASE_URL = "https://hotel-app-bk.onrender.com/";
const LOGIN_API_URL = `${BASE_URL}login`;

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent page reload
    setError(null); // Reset error state before making the request

    try {
      const response = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();
      console.log("Login Response:", data); // Debugging

      if (response.ok) {
        localStorage.setItem("isAuthenticated", "true"); // Store authentication status
        localStorage.setItem("username",data.user.username)
        //setIsAuthenticated(true); // Update authentication state
        navigate("/dashboard"); // Redirect to dashboard
      } else {
        setError(data.message || "Login failed. Please try again.");
      }
    } catch (error) {
        console.log(error)
      setError("Network error. Please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="row justify-content-center">
        <div className="col-md-4">
          <form onSubmit={handleLogin} className="p-4 border rounded shadow">
            <div className="text-center">
              <img
                className="mb-4"
                src="/docs/5.3/assets/brand/bootstrap-logo.svg"
                alt="Logo"
                width="72"
                height="57"
              />
              <h1 className="h3 mb-3 fw-normal">Sign in</h1>
            </div>

            {error && <p className="text-danger text-center">{error}</p>}

            <div className="mb-3">
              <label htmlFor="username" className="form-label">Username</label>
              <input
                type="text"
                className="form-control"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                className="form-control"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button className="btn btn-primary w-100 py-2" type="submit">
              Sign in
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
