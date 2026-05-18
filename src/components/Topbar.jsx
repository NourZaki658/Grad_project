// components/Topbar.jsx
import React, { useState, useEffect } from 'react';
import { 
  FaHeartbeat, 
  FaSignOutAlt, 
  FaUserCircle,
  FaChevronDown,
  FaBell,
  FaUserEdit,
  FaLock,
  FaTachometerAlt,
  FaUserInjured,
  FaFileMedical,
  FaCalendarAlt,
  FaFlask,
  FaPills,
  FaEnvelope,
  FaCog
} from 'react-icons/fa';
import './Topbar.css';
import { useNavigate, useLocation } from 'react-router-dom';

const Topbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Add doctor state with default values
  const [doctor, setDoctor] = useState({
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    email: "sarah.johnson@medtrack.com"
  });

  // Load doctor data from localStorage on component mount
  useEffect(() => {
    const doctorData = localStorage.getItem("doctorLoggedIn");
    if (doctorData) {
      const parsed = JSON.parse(doctorData);
      setDoctor({
        name: parsed.name || "Dr. Sarah Johnson",
        specialty: parsed.specialty || "Cardiologist",
        email: parsed.email || "doctor@medtrack.com"
      });
    }
  }, []);

  // Get initials for avatar (e.g., "AM" for Dr. Ahmed Mahmoud)
  const getInitials = () => {
    const name = doctor.name;
    // Remove "Dr." prefix if present
    let cleanName = name.replace(/^Dr\.\s*/, "");
    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Navigation items - REMOVED Medical Records
  const navItems = [
    { path: '/dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/appointments', name: 'Appointments', icon: <FaCalendarAlt /> },
  ];

  const handleNavigation = (path) => {
    navigate(path);
    setIsMobileMenuOpen(false);
  };

  // Handle logo click - Navigate to Home page
  const handleLogoClick = () => {
    navigate('/');
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
    setShowNotifications(false);
  };

  const handleNotificationClick = () => {
    setShowNotifications(!showNotifications);
    setShowProfileMenu(false);
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate('/doctor/profile');
  };

  const handleChangePassword = () => {
    setShowProfileMenu(false);
    navigate('/doctor/change-password');
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorLoggedIn");
    setShowProfileMenu(false);
    navigate('/');
  };

  return (
    <>
      <nav className="top-navbar">
        <div className="nav-container">
          {/* Logo Section */}
          <div className="nav-brand">
            <button className="mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              ☰
            </button>
            <div className="logo" onClick={handleLogoClick}>
              <div className="logo-icon-wrapper">
                <FaHeartbeat className="logo-icon" />
              </div>
              <span className="logo-text">MedTrack</span>
            </div>
          </div>

          {/* Desktop Navigation - Medical Records Removed */}
          <div className="nav-links desktop">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
          </div>

          {/* Right Section - Welcome, Notifications & Profile */}
          <div className="nav-right">
            {/* Welcome Message - Now Dynamic */}
            <div className="welcome-message">
              <span className="welcome-text">Welcome back,</span>
              <span className="welcome-name">{doctor.name}</span>
            </div>

            {/* Notifications */}
            <div className="notification-container">
              <button className="notification-btn" onClick={handleNotificationClick}>
                <FaBell />
                <span className="notification-badge">3</span>
              </button>
              
              {showNotifications && (
                <div className="notification-dropdown">
                  <div className="dropdown-header">
                    <h4>Notifications</h4>
                    <button className="mark-all-read">Mark all as read</button>
                  </div>
                  <div className="notification-list">
                    <div className="notification-item unread">
                      <div className="notification-icon">🔬</div>
                      <div className="notification-content">
                        <p>New lab results for Elena Rodriguez</p>
                        <span>5 minutes ago</span>
                      </div>
                    </div>
                    <div className="notification-item unread">
                      <div className="notification-icon">📅</div>
                      <div className="notification-content">
                        <p>Appointment reminder: John Smith at 2:00 PM</p>
                        <span>1 hour ago</span>
                      </div>
                    </div>
                    <div className="notification-item">
                      <div className="notification-icon">💊</div>
                      <div className="notification-content">
                        <p>Prescription refill requested for Maria Garcia</p>
                        <span>2 hours ago</span>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown-footer">
                    <button className="view-all">View all notifications</button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown - Now Dynamic */}
            <div className="profile-container">
              <button className="profile-btn" onClick={handleProfileClick}>
                <div className="profile-avatar">
                  <span>{getInitials()}</span>
                </div>
                <div className="profile-info">
                  <p className="profile-name">{doctor.name}</p>
                  <span className="profile-role">{doctor.specialty}</span>
                </div>
                <FaChevronDown className={`dropdown-icon ${showProfileMenu ? 'rotated' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="dropdown-header">
                    <div className="dropdown-avatar">
                      <span>{getInitials()}</span>
                    </div>
                    <div className="dropdown-user-info">
                      <h4>{doctor.name}</h4>
                      <p>{doctor.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-menu">
                    <button onClick={handleViewProfile} className="dropdown-item">
                      <FaUserEdit /> View Profile
                    </button>
                    <button onClick={handleChangePassword} className="dropdown-item">
                      <FaLock /> Change Password
                    </button>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-item logout-item">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Medical Records Removed */}
        {isMobileMenuOpen && (
          <div className="mobile-menu">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`mobile-nav-link ${location.pathname === item.path ? 'active' : ''}`}
                onClick={() => handleNavigation(item.path)}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
            <hr className="mobile-divider" />
            <button onClick={handleLogout} className="mobile-nav-link logout">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>
    </>
  );
};

export default Topbar;