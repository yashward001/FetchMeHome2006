import React from "react";
import { Link } from "react-router-dom";
import logo from "./images/logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  const footerLinks = [
    {
      title: "Services",
      links: [
        { name: "Adopt a Pet", url: "/pets" },
        { name: "Find Lost Pets", url: "/find" },
        { name: "Post for Adoption", url: "/services#adopt" },
        { name: "Report Lost Pet", url: "/services#lost" },
        { name: "Pet Personality Test", url: "/personality" },
      ]
    },
    {
      title: "Resources",
      links: [
        { name: "FAQ", url: "/faq" },
        { name: "Pet Care Guides", url: "/faq#care" },
        { name: "Adoption Process", url: "/faq#adoption" },
        { name: "Lost Pet Tips", url: "/faq#lost" },
      ]
    },
    {
      title: "Company",
      links: [
        { name: "About Us", url: "/faq#about" },
        { name: "Terms of Service", url: "/faq#terms" },
        { name: "Privacy Policy", url: "/faq#privacy" },
        { name: "Contact Us", url: "/faq#contact" },
      ]
    },
  ];

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <img src={logo} alt="FetchMeHome Logo" />
            <span>FetchMeHome</span>
          </Link>
          <p className="footer-tagline">
            Connecting pets with loving homes and helping lost pets find their way back.
          </p>
          <div className="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
              </svg>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
              </svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
              </svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          </div>
        </div>
        
        <div className="footer-links">
          {footerLinks.map((section, index) => (
            <div key={index} className="footer-links-section">
              <h3>{section.title}</h3>
              <ul>
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link to={link.url}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p className="copyright">
            &copy; {currentYear} FetchMeHome. All rights reserved.
          </p>
          <p className="contact">
            Contact us at <a href="mailto:support@fetchmehome.com">support@fetchmehome.com</a>
          </p>
        </div>
      </div>
      
      <div className="footer-decoration">
        <div className="paw-print" style={{ left: '5%', top: '20%', animationDelay: '0s' }}>🐾</div>
        <div className="paw-print" style={{ left: '10%', top: '60%', animationDelay: '0.5s' }}>🐾</div>
        <div className="paw-print" style={{ left: '20%', top: '40%', animationDelay: '1s' }}>🐾</div>
        <div className="paw-print" style={{ right: '5%', top: '30%', animationDelay: '1.5s' }}>🐾</div>
        <div className="paw-print" style={{ right: '15%', top: '70%', animationDelay: '2s' }}>🐾</div>
      </div>
      
      <style jsx>{`
        .footer {
          background-color: #2c3e50;
          color: #f8f9fa;
          padding: 60px 0 0;
          position: relative;
          overflow: hidden;
        }
        
        .footer-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
        }
        
        .footer-brand {
          flex: 1;
          min-width: 300px;
          margin-bottom: 30px;
          padding-right: 40px;
        }
        
        .footer-logo {
          display: flex;
          align-items: center;
          text-decoration: none;
          color: #f8f9fa;
          margin-bottom: 20px;
        }
        
        .footer-logo img {
          height: 50px;
          width: auto;
          margin-right: 10px;
        }
        
        .footer-logo span {
          font-size: 1.5rem;
          font-weight: 700;
          color: #ff8c00;
        }
        
        .footer-tagline {
          color: #adb5bd;
          line-height: 1.6;
          margin-bottom: 20px;
        }
        
        .footer-social {
          display: flex;
          gap: 15px;
        }
        
        .footer-social a {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: rgba(255, 255, 255, 0.1);
          color: #f8f9fa;
          transition: all 0.3s ease;
        }
        
        .footer-social a:hover {
          background-color: #ff8c00;
          transform: translateY(-3px);
        }
        
        .footer-links {
          display: flex;
          flex-wrap: wrap;
          gap: 30px;
        }
        
        .footer-links-section {
          min-width: 160px;
          margin-bottom: 30px;
        }
        
        .footer-links-section h3 {
          color: #ff8c00;
          font-size: 1.1rem;
          margin-bottom: 20px;
          position: relative;
          padding-bottom: 10px;
        }
        
        .footer-links-section h3::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 30px;
          height: 3px;
          background-color: #ff8c00;
          border-radius: 3px;
        }
        
        .footer-links-section ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }
        
        .footer-links-section li {
          margin-bottom: 10px;
        }
        
        .footer-links-section a {
          color: #adb5bd;
          text-decoration: none;
          transition: all 0.2s ease;
          position: relative;
        }
        
        .footer-links-section a::before {
          content: '';
          position: absolute;
          width: 0;
          height: 1px;
          bottom: -2px;
          left: 0;
          background-color: #ff8c00;
          transition: width 0.3s ease;
        }
        
        .footer-links-section a:hover {
          color: #ff8c00;
        }
        
        .footer-links-section a:hover::before {
          width: 100%;
        }
        
        .footer-bottom {
          background-color: rgba(0, 0, 0, 0.2);
          padding: 20px 0;
          margin-top: 30px;
        }
        
        .footer-bottom-content {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 20px;
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          align-items: center;
        }
        
        .copyright, .contact {
          margin: 10px 0;
          font-size: 0.9rem;
          color: #adb5bd;
        }
        
        .contact a {
          color: #ff8c00;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        
        .contact a:hover {
          color: #ffab40;
          text-decoration: underline;
        }
        
        .footer-decoration {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
          pointer-events: none;
        }
        
        .paw-print {
          position: absolute;
          font-size: 24px;
          opacity: 0.1;
          animation: float 20s infinite ease-in-out;
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0) rotate(0deg);
          }
          25% {
            transform: translateY(-15px) rotate(5deg);
          }
          50% {
            transform: translateY(0) rotate(0deg);
          }
          75% {
            transform: translateY(15px) rotate(-5deg);
          }
        }
        
        @media (max-width: 768px) {
          .footer-content {
            flex-direction: column;
          }
          
          .footer-brand {
            padding-right: 0;
            margin-bottom: 40px;
          }
          
          .footer-links {
            width: 100%;
            justify-content: space-between;
          }
          
          .footer-links-section {
            min-width: 140px;
          }
          
          .footer-bottom-content {
            flex-direction: column;
            text-align: center;
          }
        }
        
        @media (max-width: 576px) {
          .footer-links {
            flex-direction: column;
            gap: 20px;
          }
          
          .footer-links-section {
            width: 100%;
            margin-bottom: 20px;
          }
          
          .footer-links-section h3 {
            cursor: pointer;
          }
          
          .footer-social {
            justify-content: center;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;