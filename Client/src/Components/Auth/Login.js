import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../Styles/Login.css";
// Use the existing cat image
import avatar from "../../Assets/cat.jpg";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsLoading(true);
    
    try {
      const res = await axios.post("http://localhost:4000/api/users/login", formData);

      if (res.data.user && res.data.user._id) {
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", res.data.user._id);
        localStorage.setItem("user", JSON.stringify(res.data.user));
        localStorage.setItem("isAdmin", res.data.user.isAdmin);

        setIsLoading(false);
        // Show success message
        setSuccess(`Welcome, ${res.data.user.name}!`);
        
        // Redirect after showing success message
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        setIsLoading(false);
        setError("Invalid response from server");
      }
    } catch (err) {
      setIsLoading(false);
      console.error("Login error:", err.response?.data?.msg || err.message);
      setError(err.response?.data?.msg || "Error logging in");
    }
  };

  return (
    <div className="login-page">
      <div className="login-form-container">
        <div className="login-header">
          <div className="login-avatar">
            <img src={avatar} alt="User Avatar" />
          </div>
          <h2>Welcome Back</h2>
          <p>Sign in to continue to FetchMeHome</p>
        </div>
        
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={onChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={onChange}
              required
            />
          </div>
          
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? (
              <div className="spinner"></div>
            ) : (
              "Login"
            )}
          </button>
          
          <button 
            type="button" 
            className="admin-login-button" 
            onClick={() => navigate("/admin")}
          >
            Login as Admin
          </button>
        </form>
        
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;