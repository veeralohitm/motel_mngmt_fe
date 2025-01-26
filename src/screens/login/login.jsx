import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    if (username === "admin" && password === "password") { // Simulated login validation
      localStorage.setItem("isAuthenticated", "true"); // Store authentication status in localStorage
      setError(null);
      navigate("/dashboard"); //
      //window.location.href = "/dashboard";
    } else {
      setError("Invalid username or password");
    }
  };

  return (
/*     <div className="flex items-center justify-center h-screen bg-gray-100">
    <div className="bg-white p-8 rounded-xl shadow-md w-80">
      <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

      {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}

      <div className="flex flex-col space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  </div> */
<div class="container">
<div class="row">
<div class="col-md-4"></div>
<div class="col-md-4">
  <form>
  
  
    <img class="mb-4 " src="/docs/5.3/assets/brand/bootstrap-logo.svg" alt="" width="72" height="57"/>
   
    <h1 class="h3 mb-3 fw-normal text-center">Sign in</h1>
  <div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Username</label>
  <input type="email" class="form-control" id="exampleFormControlInput1"  value={username}
      onChange={(e) => setUsername(e.target.value)}/>
</div>

<div class="mb-3">
  <label for="exampleFormControlInput1" class="form-label">Password</label>
  <input type="password" class="form-control" id="exampleFormControlInput1"  onChange={(e) => setPassword(e.target.value)} value={password}/>
</div>

    {/* <div class="form-floating">
        
      <input type="text" class="form-control"
      value={username}
      onChange={(e) => setUsername(e.target.value)}
      />  

    </div>

    <div class="form-floating">
      <input type="password" class="form-control" placeholder="Password"
      onChange={(e) => setPassword(e.target.value)}
      />
    </div> */}
    <button class="btn btn-primary w-100 py-2" type="submit" onClick={handleLogin}>Sign in</button>
  </form>
  </div>
  <div class="col-md-4"></div>
</div>
</div>
  );
};

export default Login;
