import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div>
        <Link className="logo-container" to="/">
          <img className="navbar-logo" src={logo} alt="FetchMeHome Logo" />
          <p>FetchMeHome</p>
        </Link>
      </div>
      <div className="below-footer">
        <p>
          You can reach us at{" "}
          <a className="mail-links" href="google.com">
            support@fetchmehome.com
          </a>
        </p>
        <p>
          <a
            className="contact-links"
            href="https://www.google.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-linkedin-square"></i> Linkedin
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://github.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-github"></i> GitHub
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://www.instagram.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-instagram"></i> Instagram
          </a>
          &nbsp;&nbsp;|&nbsp;&nbsp;
          <a
            className="contact-links"
            href="https://api.whatsapp.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <i className="fa fa-whatsapp"></i> WhatsApp
          </a>
        </p>
        <p>&copy; 2025 FetchMeHome</p>
      </div>
    </footer>
  );
};

export default Footer;
