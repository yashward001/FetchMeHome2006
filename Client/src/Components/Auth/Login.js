import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../Styles/Login.css";
import avatar from "../../Assets/cat.jpg";
import pawprintIcon from "../../Assets/catlogin.jpg"; // Add this to your Assets folder

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

  // Check if user is already logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/");
    }
  }, [navigate]);

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
        setSuccess(`Welcome back, ${res.data.user.name}!`);
        
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
      <div className="login-container">
        <div className="login-left">
          <div className="login-welcome">
            <div className="brand-logo">
              <img src={pawprintIcon} alt="PawFinds Logo" className="paw-icon" />
              <h2 className="brand-name">FetchMeHome</h2>
            </div>
            <h1>Welcome Back!</h1>
            <p>Log in to continue your journey in pet adoption and recovery</p>
            <div className="login-features">
              <div className="feature-item">
                <i className="fa fa-paw"></i>
                <span>Find Your Perfect Pet</span>
              </div>
              <div className="feature-item">
                <i className="fa fa-home"></i>
                <span>Adopt a Pet in Need</span>
              </div>
              <div className="feature-item">
                <i className="fa fa-search"></i>
                <span>Help Find Lost Pets</span>
              </div>
            </div>
          </div>
        </div>

        <div className="login-right">
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
                <label htmlFor="email">
                  <i className="fa fa-envelope"></i>
                </label>
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
                <label htmlFor="password">
                  <i className="fa fa-lock"></i>
                </label>
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
              
              <div className="remember-forgot">
                <div className="remember-me">
                  <input type="checkbox" id="remember" />
                  <label htmlFor="remember">Remember me</label>
                </div>
                <div className="forgot-password">
                  <a href="/forgot-password">Forgot Password?</a>
                </div>
              </div>
              
              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="spinner"></div>
                ) : (
                  "Login"
                )}
              </button>
              
              <div className="login-divider">
                <span>OR</span>
              </div>
              
              <button 
                type="button" 
                className="admin-login-button" 
                onClick={() => navigate("/admin")}
              >
                <i className="fa fa-shield"></i> Login as Admin
              </button>
            </form>
            
            <div className="login-footer">
              <p>Don't have an account? <Link to="/register">Register</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;