import React, { useState, useEffect } from 'react';
import {useNavigate, Link} from "react-router-dom";
import logo from "../NavBar/images/logo.png";
import "../../Styles/MyPanelNav.css"

const AdminNavBar = () => {
  const navigate = useNavigate();
  const [authChanged, setAuthChanged] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const [isAdmin, setIsAdmin] = useState(localStorage.getItem("isAdmin") === "true");

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("token"));
    setIsAdmin(localStorage.getItem("isAdmin") === "true");
  }, [authChanged]);

  const handleLogout = () => {
    localStorage.clear();
    setAuthChanged(prev => !prev); // force re-evaluation
    navigate("/login");
  };

  return (
    <div className="navbar-container">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="FetchMeHome Logo" />
          <p>FetchMeHome</p>
        </Link>
      </div>
      <div>
        <ul className="navbar-links">
          <li>
            <Link to="/adminhome">Home</Link>
          </li>
          <li>
            <Link to="/adminfind">Find</Link>
          </li>
          <li>
            <Link to="/adminpets">Adopt</Link>
          </li>
          <li>
            <Link to="/adminpanel" className="my-panel-link">Admin Panel</Link>
            <button onClick={handleLogout}>Logout</button>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavBar;


