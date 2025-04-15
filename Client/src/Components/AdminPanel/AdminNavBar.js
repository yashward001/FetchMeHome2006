import React, { useState, useEffect } from 'react';
import {useNavigate, Link} from "react-router-dom";
import logo from "../NavBar/images/logo.png";
import "../../Styles/MyPanelNav.css"

const AdminNavBar = () => {
//   const [currentTime, setCurrentTime] = useState(new Date());
//   const navigate = useNavigate();

//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());
//     }, 1000);

//     return () => {
//       clearInterval(interval);
//     };
//   }, []);

//   return (
//     <nav className="navbar">
//       <div className="navbar-brand">Admin Panel</div>
//       <div className="navbar-time">{currentTime.toLocaleString()}</div>
//       <h3  className="home_b" onClick={() => navigate("/")}>Home</h3> 
//       <h3 className='logout-btn' onClick={() => (window.location.reload())}>Logout</h3>
//     </nav>
//   );
// }
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");

  const [adoptDropdown, setAdoptDropdown] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
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
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/services">Services</Link>
          </li>
          <li>
            <Link to="/find">Find</Link>
          </li>
          <li 
            className="dropdown" 
            onMouseEnter={() => setAdoptDropdown(true)} 
            onMouseLeave={() => setAdoptDropdown(false)}
          >
            <Link to="/pets">
              Adopt <span className="dropdown-arrow">▼</span>
            </Link>
            {adoptDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/personality">Personality</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/faq">FAQ</Link>
          </li>
          <li>
              {!isLoggedIn ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              <Link to="/mypanel" className="my-panel-link">My Panel</Link> 
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default AdminNavBar;


