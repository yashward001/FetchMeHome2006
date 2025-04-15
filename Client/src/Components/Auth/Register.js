import React, { useState } from "react";
import axios from "axios";
import "../../Styles/Register.css"
import avatar from "../../Assets/cat.jpg"
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { name, email, password } = formData;
   const navigate = useNavigate();

  const onChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:4000/api/users/register", formData);
      alert(res.data.msg);
      navigate("/login");
    } catch (err) {
      alert(err.response.data.msg || "Error registering user");
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={onSubmit} className="register-form">
        <img src={avatar} alt="User Avatar" className="register-avatar" />
        <h2 className="register-title">Create an Account</h2>
        <div className="input-group">
          <input type="text" name="name" value={name} onChange={onChange} required />
          <label>Name</label>
        </div>
        <div className="input-group">
          <input type="email" name="email" value={email} onChange={onChange} required />
          <label>Email</label>
        </div>
        <div className="input-group">
          <input type="password" name="password" value={password} onChange={onChange} required />
          <label>Password</label>
        </div>
        <button type="submit" className="register-button">Register</button>
        <button 
          type="button" 
          className="guest-login-button" 
          onClick={() => navigate("/")}
        >
          Return to Guest Page
        </button>
      </form>
    </div>
  );
};

export default Register;
