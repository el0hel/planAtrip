import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Navbar.css';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-brand">planAtrip</div>

      {/* hamburger icon for small screens */}
      <div className="hamburger" onClick={toggleMenu}>
        &#9776;
      </div>

      {/* links */}
      <div className={`navbar-links ${menuOpen ? 'active' : ''}`}>
        <Link to="/my-trips">My Trips</Link>
        <Link to="/user">Profile</Link>
        <Link to="/login">Log Out</Link> {/* navigates to the login page on clicking log out */}
      </div>
    </nav>
  );
};

export default Navbar;
