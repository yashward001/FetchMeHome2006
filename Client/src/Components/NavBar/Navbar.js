import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "./images/logo.png";
import "../../Styles/Navbar.css"

const Navbar = () => {

  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user")); // Get user data
  const isAdmin = user?.isAdmin; // Check if user is an admin


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
            onMouseEnter={() => isLoggedIn && setAdoptDropdown(true)} 
            onMouseLeave={() => isLoggedIn && setAdoptDropdown(false)}
          >
            <Link to="/pets">
              Adopt {isLoggedIn && <span className="dropdown-arrow">▼</span>}
            </Link>
            {isLoggedIn && adoptDropdown && (
              <ul className="dropdown-menu">
                <li><Link to="/personality">Personality</Link></li>
                <hr className="dropdown-divider" />
                <li><Link to="/saved">Saved Pets</Link></li>
              </ul>
            )}
          </li>

          <li>
            <Link to="/faq">FAQ</Link>
          </li>

          {isAdmin && (
          <li>
            <Link to="/adminpanel">Admin Panel</Link>
          </li>
          )}


          <li>
              {!isLoggedIn ? (
            <>
              <Link to="/register">Register</Link>
              <Link to="/login">Login</Link>
            </>
          ) : (
            <>
              {!isAdmin && (
                <Link to="/mypanel" className="my-panel-link">
                  My Panel
                </Link>
              )}
              <button onClick={handleLogout}>Logout</button>
            </>
          )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
