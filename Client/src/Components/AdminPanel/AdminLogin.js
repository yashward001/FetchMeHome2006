import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../Styles/AdminLogin.css";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("isAdmin", data.user.isAdmin);
        localStorage.setItem("user", JSON.stringify(data.user));
        setShowErrorMessage(false);
        
        // Redirect to the admin panel route
        navigate("/adminpanel");
      } else {
        setShowErrorMessage(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setShowErrorMessage(true);
    }
  };

  return (
    <div className="login-body">
      <div className="login-container">
        <h2>Admin Login</h2>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {showErrorMessage && (
          <p className="error-message">Incorrect email or password</p>
        )}
        <button className="float-right" onClick={handleLogin}>
          Login
        </button>
      </div>
    </div>
  );
};

export default AdminLogin;
