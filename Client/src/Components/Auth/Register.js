import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "../../Styles/Register.css";
import avatar from "../../Assets/cat.jpg"; // Using the existing cat avatar

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = formData;

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const validateStep1 = () => {
    if (!name.trim()) {
      setError("Name is required");
      return false;
    }
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!password) {
      setError("Password is required");
      return false;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    return true;
  };

  const nextStep = () => {
    setError("");
    if (validateStep1()) {
      setStep(2);
    }
  };

  const prevStep = () => {
    setError("");
    setStep(1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateStep2()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const registerData = {
        name,
        email,
        password
      };
      
      const res = await axios.post("http://localhost:4000/api/users/register", registerData);
      
      setIsLoading(false);
      
      // Show success animation
      setStep(3);
      
      // After showing success, redirect to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
      
    } catch (err) {
      setIsLoading(false);
      setError(err.response?.data?.msg || "Error registering user");
    }
  };

  const renderForm = () => {
    switch (step) {
      case 1:
        return (
          <>
            <div className="form-group">
              <label htmlFor="name">
                <i className="fa fa-user"></i>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Full Name"
                value={name}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">
                <i className="fa fa-envelope"></i>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email Address"
                value={email}
                onChange={onChange}
                required
              />
            </div>
            
            <button type="button" className="register-button" onClick={nextStep}>
              Continue
            </button>
          </>
        );
        
      case 2:
        return (
          <>
            <div className="form-group">
              <label htmlFor="password">
                <i className="fa fa-lock"></i>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="Password"
                value={password}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <i className="fa fa-check-circle"></i>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={onChange}
                required
              />
            </div>
            
            <div className="button-group">
              <button type="button" className="back-button" onClick={prevStep}>
                Back
              </button>
              <button type="submit" className="register-button" disabled={isLoading}>
                {isLoading ? (
                  <div className="button-loader"></div>
                ) : (
                  "Register"
                )}
              </button>
            </div>
          </>
        );
        
      case 3:
        return (
          <div className="success-container">
            <div className="success-icon">
              <i className="fa fa-check-circle"></i>
            </div>
            <h3>Registration Successful!</h3>
            <p>Redirecting to login page...</p>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-left">
          <div className="register-welcome">
            <h1>Join Our Community</h1>
            <p>Create an account to help pets find their forever homes or reunite with their families.</p>
          </div>
        </div>
        
        <div className="register-right">
          <div className="register-card">
            <div className="register-header">
              <div className="register-avatar">
                <img src={avatar} alt="User Avatar" />
              </div>
              <h2>Create an Account</h2>
              <p className="register-subtitle">Sign up to start using FetchMeHome</p>
            </div>
            
            <form onSubmit={onSubmit} className="register-form">
              {error && <div className="error-message">{error}</div>}
              
              {renderForm()}
            </form>
            
            {step !== 3 && (
              <div className="register-footer">
                <p>Already have an account? <Link to="/login">Login</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;