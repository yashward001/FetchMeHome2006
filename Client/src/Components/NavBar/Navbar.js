import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import logo from "./images/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoggedIn = !!localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.isAdmin;

  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState({
    adopt: false,
    services: false,
    profile: false
  });

  // Handle scroll events for navbar appearance
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  // Close menu when route changes
  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  // Handle dropdown toggle
  const toggleDropdown = (name) => {
    setDropdownOpen(prev => ({
      ...prev,
      [name]: !prev[name]
    }));
  };

  // Determine if a link is active
  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${scrolled ? "navbar-scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-brand">
          <img src={logo} alt="FetchMeHome Logo" className="navbar-logo" />
          <span className="brand-text">FetchMeHome</span>
        </Link>

        <button
          className={`menu-toggle ${menuOpen ? "active" : ""}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <div className={`navbar-collapse ${menuOpen ? "show" : ""}`}>
          <ul className="navbar-nav">
            <li className={`nav-item ${isActive("/") ? "active" : ""}`}>
              <Link to="/" className="nav-link">Home</Link>
            </li>
            
            <li className={`nav-item dropdown ${isActive("/services") ? "active" : ""}`}>
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown("services")}
                aria-expanded={dropdownOpen.services}
              >
                Services
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     className={`dropdown-arrow ${dropdownOpen.services ? "open" : ""}`}>
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              <div className={`dropdown-menu ${dropdownOpen.services ? "show" : ""}`}>
                <Link to="/services#adopt" className="dropdown-item">Post for Adoption</Link>
                <Link to="/services#lost" className="dropdown-item">Report Lost Pet</Link>
              </div>
            </li>
            
            <li className={`nav-item ${isActive("/find") ? "active" : ""}`}>
              <Link to="/find" className="nav-link">Find</Link>
            </li>
            
            <li className={`nav-item dropdown ${isActive("/pets") || isActive("/personality") ? "active" : ""}`}>
              <button 
                className="nav-link dropdown-toggle"
                onClick={() => toggleDropdown("adopt")}
                aria-expanded={dropdownOpen.adopt}
              >
                Adopt
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                     className={`dropdown-arrow ${dropdownOpen.adopt ? "open" : ""}`}>
                  <path d="M6 9l6 6 6-6"></path>
                </svg>
              </button>
              
              <div className={`dropdown-menu ${dropdownOpen.adopt ? "show" : ""}`}>
                <Link to="/pets" className="dropdown-item">Available Pets</Link>
                <Link to="/personality" className="dropdown-item">Personality Test</Link>
                {isLoggedIn && <Link to="/saved" className="dropdown-item">Saved Pets</Link>}
              </div>
            </li>

            <li className={`nav-item ${isActive("/faq") ? "active" : ""}`}>
              <Link to="/faq" className="nav-link">FAQ</Link>
            </li>
          </ul>

          <div className="navbar-auth">
            {!isLoggedIn ? (
              <>
                <Link to="/login" className="auth-btn login-btn">Login</Link>
                <Link to="/register" className="auth-btn register-btn">Register</Link>
              </>
            ) : (
              <>
                {isAdmin && (
                  <Link to="/admin" className="auth-btn admin-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 4.5a2.5 2.5 0 0 0-4.96-.46l-.6 2A2.5 2.5 0 0 1 4.06 8L2 8.94A2.5 2.5 0 0 0 1 11.86V15a2.5 2.5 0 0 0 2.5 2.5H5"></path>
                      <path d="M5.5 17.5l1 2a2.5 2.5 0 0 0 4.96.44l.6-2A2.5 2.5 0 0 1 14.94 16L17 15.06A2.5 2.5 0 0 0 18 13.14V10a2.5 2.5 0 0 0-2.5-2.5H14"></path>
                      <path d="M14.5 7.5l-1-2a2.5 2.5 0 0 0-4.96-.44l-.6 2A2.5 2.5 0 0 1 5.06 9L3 9.94A2.5 2.5 0 0 0 2 11.86V15"></path>
                    </svg>
                    Admin
                  </Link>
                )}
                
                <div className="dropdown user-dropdown">
                  <button 
                    className="user-dropdown-toggle"
                    onClick={() => toggleDropdown("profile")}
                    aria-expanded={dropdownOpen.profile}
                  >
                    <div className="user-avatar">
                      {user?.profileImage ? (
                        <img src={user.profileImage} alt="Profile" />
                      ) : (
                        <span>{user?.name?.charAt(0) || "U"}</span>
                      )}
                    </div>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" 
                         className={`dropdown-arrow ${dropdownOpen.profile ? "open" : ""}`}>
                      <path d="M6 9l6 6 6-6"></path>
                    </svg>
                  </button>
                  
                  <div className={`dropdown-menu ${dropdownOpen.profile ? "show" : ""}`}>
                    <div className="dropdown-header">
                      <strong>{user?.name || "User"}</strong>
                      <small>{user?.email || ""}</small>
                    </div>
                    <Link to="/mypanel" className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      My Panel
                    </Link>
                    <div className="dropdown-divider"></div>
                    <button onClick={handleLogout} className="dropdown-item">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .navbar {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          z-index: 1000;
          background-color: rgba(255, 255, 255, 0.95);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 15px 0;
          transition: all 0.3s ease;
        }
        
        .navbar-scrolled {
          padding: 10px 0;
          background-color: rgba(255, 255, 255, 0.98);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .navbar-container {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        .navbar-brand {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #2c2c2c;
        }
        
        .navbar-logo {
          height: 40px;
          width: auto;
          margin-right: 10px;
        }
        
        .brand-text {
          font-size: 1.4rem;
          font-weight: 700;
          color: #ff8c00;
        }
        
        .menu-toggle {
          display: none;
          flex-direction: column;
          justify-content: space-between;
          width: 30px;
          height: 21px;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
          z-index: 10;
        }
        
        .menu-toggle span {
          display: block;
          width: 100%;
          height: 3px;
          background-color: #2c2c2c;
          border-radius: 3px;
          transition: all 0.3s ease;
        }
        
        .menu-toggle.active span:first-child {
          transform: translateY(9px) rotate(45deg);
        }
        
        .menu-toggle.active span:nth-child(2) {
          opacity: 0;
        }
        
        .menu-toggle.active span:last-child {
          transform: translateY(-9px) rotate(-45deg);
        }
        
        .navbar-collapse {
          display: flex;
          align-items: center;
          flex-grow: 1;
          justify-content: space-between;
        }
        
        .navbar-nav {
          display: flex;
          list-style-type: none;
          margin: 0;
          padding: 0;
        }
        
        .nav-item {
          position: relative;
          margin: 0 5px;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          padding: 10px 15px;
          color: #2c2c2c;
          text-decoration: none;
          font-weight: 500;
          border-radius: 5px;
          transition: all 0.2s ease;
        }
        
        .nav-link:hover {
          color: #ff8c00;
          background-color: rgba(255, 140, 0, 0.05);
        }
        
        .nav-item.active .nav-link {
          color: #ff8c00;
          font-weight: 600;
        }
        
        .nav-item.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 50%;
          transform: translateX(-50%);
          width: 20px;
          height: 3px;
          background-color: #ff8c00;
          border-radius: 3px;
        }
        
        .dropdown-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          font-size: inherit;
          font-weight: inherit;
          font-family: inherit;
          cursor: pointer;
          padding: 10px 15px;
          color: #2c2c2c;
        }
        
        .dropdown-arrow {
          margin-left: 5px;
          transition: transform 0.2s ease;
        }
        
        .dropdown-arrow.open {
          transform: rotate(180deg);
        }
        
        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          z-index: 1000;
          display: none;
          padding: 10px 0;
          margin: 0;
          min-width: 180px;
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
          animation: fadeInUp 0.3s ease;
        }
        
        .dropdown-menu.show {
          display: block;
        }
        
        .dropdown-header {
          display: flex;
          flex-direction: column;
          padding: 10px 15px;
          color: #6c757d;
          border-bottom: 1px solid #e9ecef;
          margin-bottom: 5px;
        }
        
        .dropdown-header strong {
          color: #212529;
        }
        
        .dropdown-item {
          display: flex;
          align-items: center;
          padding: 8px 15px;
          color: #212529;
          text-decoration: none;
          background-color: transparent;
          border: none;
          width: 100%;
          text-align: left;
          font-size: 0.95rem;
          transition: all 0.2s ease;
        }
        
        .dropdown-item:hover {
          background-color: #f8f9fa;
          color: #ff8c00;
        }
        
        .dropdown-item svg {
          margin-right: 8px;
        }
        
        .dropdown-divider {
          height: 0;
          margin: 5px 0;
          overflow: hidden;
          border-top: 1px solid #e9ecef;
        }
        
        .navbar-auth {
          display: flex;
          align-items: center;
        }
        
        .auth-btn {
          display: inline-block;
          padding: 8px 16px;
          font-weight: 600;
          text-align: center;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
          margin-left: 10px;
          display: flex;
          align-items: center;
        }
        
        .auth-btn svg {
          margin-right: 6px;
        }
        
        .login-btn {
          color: #ff8c00;
          border: 1px solid #ff8c00;
          background-color: transparent;
        }
        
        .login-btn:hover {
          background-color: #ff8c00;
          color: white;
        }
        
        .register-btn {
          background-color: #ff8c00;
          color: white;
          border: 1px solid #ff8c00;
        }
        
        .register-btn:hover {
          background-color: #e67e00;
        }
        
        .admin-btn {
          background-color: #4e54c8;
          color: white;
          border: 1px solid #4e54c8;
        }
        
        .admin-btn:hover {
          background-color: #3a3f96;
        }
        
        .user-dropdown {
          position: relative;
        }
        
        .user-dropdown-toggle {
          display: flex;
          align-items: center;
          background: none;
          border: none;
          padding: 5px 10px;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        
        .user-dropdown-toggle:hover {
          background-color: #f8f9fa;
        }
        
        .user-avatar {
          width: 35px;
          height: 35px;
          border-radius: 50%;
          background-color: #ff8c00;
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          overflow: hidden;
          margin-right: 5px;
        }
        
        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        .user-dropdown .dropdown-menu {
          right: 0;
          left: auto;
          min-width: 200px;
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 992px) {
          .menu-toggle {
            display: flex;
          }
          
          .navbar-collapse {
            position: fixed;
            top: 0;
            right: -300px;
            height: 100vh;
            width: 280px;
            background-color: white;
            flex-direction: column;
            align-items: flex-start;
            justify-content: flex-start;
            padding: 80px 20px 20px;
            transition: right 0.3s ease;
            box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
            overflow-y: auto;
          }
          
          .navbar-collapse.show {
            right: 0;
          }
          
          .navbar-nav {
            flex-direction: column;
            width: 100%;
            margin-bottom: 20px;
          }
          
          .nav-item {
            width: 100%;
            margin: 2px 0;
          }
          
          .nav-link {
            width: 100%;
          }
          
          .nav-item.active::after {
            display: none;
          }
          
          .dropdown-menu {
            position: static;
            box-shadow: none;
            width: 100%;
            margin-left: 20px;
            animation: none;
          }
          
          .navbar-auth {
            flex-direction: column;
            width: 100%;
          }
          
          .auth-btn {
            width: 100%;
            margin: 5px 0;
          }
          
          .user-dropdown {
            width: 100%;
          }
          
          .user-dropdown-toggle {
            width: 100%;
            justify-content: space-between;
          }
          
          .user-dropdown .dropdown-menu {
            width: calc(100% - 20px);
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;