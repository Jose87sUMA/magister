// Header.js
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import '../styles/Header.css';

const Header = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        // Click occurred outside of the dropdown, so close it
        setShowDropdown(false);
      }
    };

    // Add event listener to detect clicks anywhere on the page
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      // Cleanup: Remove event listener when component unmounts
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleProfileClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleLogout = () => {               
    signOut(auth).then(() => {
      // Sign-out successful.
      navigate("/login");
      console.log("Signed out successfully")
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div className="header">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/search-courses">Search</Link></li>
          <li>
            <div className="profile-dropdown" onClick={handleProfileClick} ref={dropdownRef}>
              <Link>Profile</Link>
              <div className={`dropdown-content ${showDropdown ? 'show' : ''}`}>
                <button onClick={handleLogout}>Log Out</button>
              </div>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Header;
