import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Login.css"
import avatar from "../../Assets/cat.jpg"
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { email, password } = formData;
  const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

const onSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:4000/api/users/login", formData);

    if (res.data.user && res.data.user._id) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user._id);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAdmin", res.data.user.isAdmin);

      alert(`Welcome, ${res.data.user.name}`);

      if (res.data.user.isAdmin) {
        navigate("/adminhome");
      } else {
        navigate("/");
      }

    } else {
      console.error("ERROR: No userId returned from backend!");
    }

  } catch (err) {
    console.error("Login error:", err.response?.data?.msg || err.message);
    if (err.response?.data?.msg === "Your account has been banned. Contact support.") {
      alert("Your account is banned. Please contact support.");
      return;
    }
    alert(err.response?.data?.msg || "Error logging in");
  }
};


  return (
    <div className="logins-container">
      <form onSubmit={onSubmit} className="login-form">
        <img src={avatar} alt="User Avatar" className="login-avatar" />
        <h2 className="login-title">Login</h2>
        <div className="input-group">
          <input type="email" name="email" value={email} onChange={onChange} required />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input type="password" name="password" value={password} onChange={onChange} required />
          <label>Password</label>
        </div>
        <button type="submit" className="login-button">Login</button>

        <button 
          type="button" 
          className="guest-login-button" 
          onClick={() => navigate("/")}
        >
          Proceed as Guest
        </button>

      </form>
    </div>
  );
};

export default Login;
