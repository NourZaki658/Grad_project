// pages/LabProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaFlask, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaMapMarkerAlt,
  FaUserTie,
  FaSave,
  FaEdit,
  FaTimes,
  FaIdCard,
  FaCalendarAlt,
  FaGlobe,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";
import "./LabProfile.css";

function LabProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [labData, setLabData] = useState({
    institutionName: "",
    institutionType: "",
    email: "",
    phone: "",
    registrationNumber: "",
    directorName: "",
    address: "",
    establishedDate: "",
    website: "",
    licenseNumber: ""
  });
  const [originalLabData, setOriginalLabData] = useState({});

  useEffect(() => {
    // Load lab data from localStorage
    const labLoggedIn = localStorage.getItem("labLoggedIn");
    if (!labLoggedIn) {
      navigate("/lab-login");
      return;
    }

    const parsedLab = JSON.parse(labLoggedIn);
    
    // Get full lab data from laboratories array
    const allLabs = JSON.parse(localStorage.getItem("laboratories") || "[]");
    const fullLabData = allLabs.find(lab => lab.email === parsedLab.email);
    
    if (fullLabData) {
      setLabData({
        institutionName: fullLabData.institutionName || "",
        institutionType: fullLabData.institutionType || "Medical Laboratory",
        email: fullLabData.email || "",
        phone: fullLabData.phone || "",
        registrationNumber: fullLabData.registrationNumber || "",
        directorName: fullLabData.directorName || "",
        address: fullLabData.address || "",
        establishedDate: fullLabData.establishedDate || "2024-01-01",
        website: fullLabData.website || "",
        licenseNumber: fullLabData.licenseNumber || ""
      });
      setOriginalLabData({
        institutionName: fullLabData.institutionName || "",
        institutionType: fullLabData.institutionType || "Medical Laboratory",
        email: fullLabData.email || "",
        phone: fullLabData.phone || "",
        registrationNumber: fullLabData.registrationNumber || "",
        directorName: fullLabData.directorName || "",
        address: fullLabData.address || "",
        establishedDate: fullLabData.establishedDate || "2024-01-01",
        website: fullLabData.website || "",
        licenseNumber: fullLabData.licenseNumber || ""
      });
    } else {
      // Fallback to logged in data
      setLabData({
        institutionName: parsedLab.institutionName || parsedLab.name || "Laboratory",
        institutionType: parsedLab.institutionType || parsedLab.type || "Medical Laboratory",
        email: parsedLab.email || "",
        phone: parsedLab.phone || "",
        registrationNumber: "",
        directorName: "",
        address: "",
        establishedDate: "2024-01-01",
        website: "",
        licenseNumber: ""
      });
      setOriginalLabData({
        institutionName: parsedLab.institutionName || parsedLab.name || "Laboratory",
        institutionType: parsedLab.institutionType || parsedLab.type || "Medical Laboratory",
        email: parsedLab.email || "",
        phone: parsedLab.phone || "",
        registrationNumber: "",
        directorName: "",
        address: "",
        establishedDate: "2024-01-01",
        website: "",
        licenseNumber: ""
      });
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setLabData({ ...labData, [name]: value });
  };

  const handleSave = () => {
    // Update localStorage
    const updatedLab = {
      institutionName: labData.institutionName,
      institutionType: labData.institutionType,
      email: labData.email,
      phone: labData.phone,
      registrationNumber: labData.registrationNumber,
      directorName: labData.directorName,
      address: labData.address,
      establishedDate: labData.establishedDate,
      website: labData.website,
      licenseNumber: labData.licenseNumber,
      registeredAt: originalLabData.registeredAt || new Date().toISOString()
    };
    
    // Get existing labs array
    const existingLabs = JSON.parse(localStorage.getItem("laboratories") || "[]");
    const labIndex = existingLabs.findIndex(l => l.email === originalLabData.email);
    
    if (labIndex !== -1) {
      existingLabs[labIndex] = updatedLab;
    } else {
      existingLabs.push(updatedLab);
    }
    
    localStorage.setItem("laboratories", JSON.stringify(existingLabs));
    
    // Update logged in lab data
    localStorage.setItem("labLoggedIn", JSON.stringify({
      institutionName: labData.institutionName,
      institutionType: labData.institutionType,
      email: labData.email,
      phone: labData.phone,
      address: labData.address
    }));
    
    setIsEditing(false);
    setOriginalLabData(labData);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  const handleCancel = () => {
    setLabData(originalLabData);
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = labData.institutionName;
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const getTypeIcon = () => {
    if (labData.institutionType === "Radiology Center") {
      return "🩻";
    } else if (labData.institutionType === "Both (lab & Radiology)") {
      return "🔬🩻";
    }
    return "🔬";
  };

  return (
    <div className="lab-profile-page">
      {/* Header */}
      <div className="lab-profile-header">
        <button className="lab-back-btn" onClick={() => navigate("/lab-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="lab-profile-header-title">
          <FaFlask />
          <h1>Laboratory Profile</h1>
        </div>
      </div>

      <div className="lab-profile-content">
        {/* Success Message */}
        {showSuccess && (
          <div className="lab-success-message">
            <FaCheckCircle /> Profile updated successfully!
          </div>
        )}

        {/* Profile Card */}
        <div className="lab-profile-card">
          {/* Avatar Section */}
          <div className="lab-profile-avatar-section">
            <div className="lab-profile-avatar-large">
              <span>{getInitials()}</span>
            </div>
            <h2>{labData.institutionName}</h2>
            <p className="lab-profile-type">
              {getTypeIcon()} {labData.institutionType}
            </p>
            <div className="lab-profile-actions">
              {!isEditing ? (
                <button className="lab-edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="lab-edit-actions">
                  <button className="lab-save-btn" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                  <button className="lab-cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Info Section */}
          <div className="lab-profile-info-section">
            <h3>Institution Information</h3>
            <div className="lab-info-grid">
              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaBuilding /> Institution Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="institutionName"
                    value={labData.institutionName}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.institutionName}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaFlask /> Institution Type
                </div>
                {isEditing ? (
                  <select
                    name="institutionType"
                    value={labData.institutionType}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  >
                    <option value="Medical Laboratory">🔬 Medical Laboratory</option>
                    <option value="Radiology Center">🩻 Radiology Center</option>
                    <option value="Both (lab & Radiology)">🔬🩻 Both (lab & Radiology)</option>
                  </select>
                ) : (
                  <div className="lab-info-value">{labData.institutionType}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaEnvelope /> Email Address
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={labData.email}
                    onChange={handleInputChange}
                    className="lab-info-input"
                    disabled
                  />
                ) : (
                  <div className="lab-info-value">{labData.email}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaPhone /> Phone Number
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={labData.phone}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.phone || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaIdCard /> Registration Number
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="registrationNumber"
                    value={labData.registrationNumber}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.registrationNumber || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaIdCard /> License Number
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={labData.licenseNumber}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.licenseNumber || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaUserTie /> Director Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="directorName"
                    value={labData.directorName}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.directorName || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item">
                <div className="lab-info-label">
                  <FaCalendarAlt /> Established Date
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    name="establishedDate"
                    value={labData.establishedDate}
                    onChange={handleInputChange}
                    className="lab-info-input"
                  />
                ) : (
                  <div className="lab-info-value">{labData.establishedDate || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item full-width">
                <div className="lab-info-label">
                  <FaMapMarkerAlt /> Address
                </div>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={labData.address}
                    onChange={handleInputChange}
                    className="lab-info-textarea"
                    rows="3"
                  />
                ) : (
                  <div className="lab-info-value">{labData.address || "Not provided"}</div>
                )}
              </div>

              <div className="lab-info-item full-width">
                <div className="lab-info-label">
                  <FaGlobe /> Website
                </div>
                {isEditing ? (
                  <input
                    type="url"
                    name="website"
                    value={labData.website}
                    onChange={handleInputChange}
                    className="lab-info-input"
                    placeholder="https://..."
                  />
                ) : (
                  <div className="lab-info-value">
                    {labData.website ? (
                      <a href={labData.website} target="_blank" rel="noopener noreferrer">
                        {labData.website}
                      </a>
                    ) : (
                      "Not provided"
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="lab-stats-section">
            <h3>Quick Statistics</h3>
            <div className="lab-stats-grid">
              <div className="lab-stat-card">
                <div className="lab-stat-number">-</div>
                <div className="lab-stat-label">Total Tests Processed</div>
              </div>
              <div className="lab-stat-card">
                <div className="lab-stat-number">-</div>
                <div className="lab-stat-label">Active Patients</div>
              </div>
              <div className="lab-stat-card">
                <div className="lab-stat-number">-</div>
                <div className="lab-stat-label">Partner Doctors</div>
              </div>
              <div className="lab-stat-card">
                <div className="lab-stat-number">{new Date().getFullYear()}</div>
                <div className="lab-stat-label">Year Established</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabProfile;