// pages/DoctorProfile.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaUserMd, 
  FaEnvelope, 
  FaPhone, 
  FaCalendarAlt,
  FaStethoscope,
  FaIdCard,
  FaSave,
  FaEdit,
  FaTimes
} from "react-icons/fa";
import "./DoctorProfile.css";

function DoctorProfile() {
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [doctor, setDoctor] = useState({
    name: "",
    specialty: "",
    email: "",
    phone: "",
    licenseNumber: "",
    dateOfBirth: "",
    gender: "Male",
    address: ""
  });
  const [originalDoctor, setOriginalDoctor] = useState({});

  useEffect(() => {
    const doctorData = localStorage.getItem("doctorLoggedIn");
    if (doctorData) {
      const parsed = JSON.parse(doctorData);
      setDoctor({
        name: parsed.name || "Dr. Ahmed Mahmoud",
        specialty: parsed.specialty || "Consultant Cardiologist",
        email: parsed.email || "doctor@medtrack.com",
        phone: parsed.phone || "+20 123 456 7890",
        licenseNumber: parsed.licenseNumber || "MD-12345",
        dateOfBirth: parsed.dateOfBirth || "1980-01-01",
        gender: parsed.gender || "Male",
        address: parsed.address || "123 Healthcare Street, Medical District, Cairo"
      });
      setOriginalDoctor({
        name: parsed.name || "Dr. Ahmed Mahmoud",
        specialty: parsed.specialty || "Consultant Cardiologist",
        email: parsed.email || "doctor@medtrack.com",
        phone: parsed.phone || "+20 123 456 7890",
        licenseNumber: parsed.licenseNumber || "MD-12345",
        dateOfBirth: parsed.dateOfBirth || "1980-01-01",
        gender: parsed.gender || "Male",
        address: parsed.address || "123 Healthcare Street, Medical District, Cairo"
      });
    } else {
      navigate("/doctor-login");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDoctor({ ...doctor, [name]: value });
  };

  const handleSave = () => {
    // Update localStorage
    const updatedDoctor = {
      name: doctor.name,
      specialty: doctor.specialty,
      email: doctor.email,
      phone: doctor.phone,
      licenseNumber: doctor.licenseNumber,
      dateOfBirth: doctor.dateOfBirth,
      gender: doctor.gender,
      address: doctor.address
    };
    
    // Get existing doctors array or create new
    const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    const doctorIndex = existingDoctors.findIndex(d => d.email === originalDoctor.email);
    
    if (doctorIndex !== -1) {
      existingDoctors[doctorIndex] = updatedDoctor;
    } else {
      existingDoctors.push(updatedDoctor);
    }
    
    localStorage.setItem("doctors", JSON.stringify(existingDoctors));
    localStorage.setItem("doctorLoggedIn", JSON.stringify(updatedDoctor));
    
    setIsEditing(false);
    setOriginalDoctor(doctor);
    alert("Profile updated successfully!");
  };

  const handleCancel = () => {
    setDoctor(originalDoctor);
    setIsEditing(false);
  };

  const getInitials = () => {
    const name = doctor.name;
    const cleanName = name.replace(/^Dr\.\s*/, "");
    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <div className="doctor-profile-page">
      {/* Header */}
      <div className="profile-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="profile-header-title">
          <FaUserMd />
          <h1>Doctor Profile</h1>
        </div>
      </div>

      <div className="profile-content">
        {/* Profile Card */}
        <div className="profile-card">
          <div className="profile-avatar-section">
            <div className="profile-avatar-large">
              <span>{getInitials()}</span>
            </div>
            <h2>{doctor.name}</h2>
            <p className="profile-specialty">{doctor.specialty}</p>
            <div className="profile-actions">
              {!isEditing ? (
                <button className="edit-btn" onClick={() => setIsEditing(true)}>
                  <FaEdit /> Edit Profile
                </button>
              ) : (
                <div className="edit-actions">
                  <button className="save-btn" onClick={handleSave}>
                    <FaSave /> Save Changes
                  </button>
                  <button className="cancel-btn" onClick={handleCancel}>
                    <FaTimes /> Cancel
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="profile-info-section">
            <h3>Personal Information</h3>
            <div className="info-grid">
              <div className="info-item">
                <div className="info-label">
                  <FaUserMd /> Full Name
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="name"
                    value={doctor.name}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.name}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaStethoscope /> Specialty
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="specialty"
                    value={doctor.specialty}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.specialty}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaEnvelope /> Email Address
                </div>
                {isEditing ? (
                  <input
                    type="email"
                    name="email"
                    value={doctor.email}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.email}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaPhone /> Phone Number
                </div>
                {isEditing ? (
                  <input
                    type="tel"
                    name="phone"
                    value={doctor.phone}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.phone}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaIdCard /> License Number
                </div>
                {isEditing ? (
                  <input
                    type="text"
                    name="licenseNumber"
                    value={doctor.licenseNumber}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.licenseNumber}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">
                  <FaCalendarAlt /> Date of Birth
                </div>
                {isEditing ? (
                  <input
                    type="date"
                    name="dateOfBirth"
                    value={doctor.dateOfBirth}
                    onChange={handleInputChange}
                    className="info-input"
                  />
                ) : (
                  <div className="info-value">{doctor.dateOfBirth}</div>
                )}
              </div>

              <div className="info-item">
                <div className="info-label">Gender</div>
                {isEditing ? (
                  <select
                    name="gender"
                    value={doctor.gender}
                    onChange={handleInputChange}
                    className="info-input"
                  >
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                ) : (
                  <div className="info-value">{doctor.gender}</div>
                )}
              </div>

              <div className="info-item full-width">
                <div className="info-label">Address</div>
                {isEditing ? (
                  <textarea
                    name="address"
                    value={doctor.address}
                    onChange={handleInputChange}
                    className="info-textarea"
                    rows="3"
                  />
                ) : (
                  <div className="info-value">{doctor.address}</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DoctorProfile;