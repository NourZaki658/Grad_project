// pages/LabRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  FaFlask, 
  FaArrowLeft, 
  FaBuilding, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaMapMarkerAlt,
  FaUserTie,
  FaEye,
  FaEyeSlash,
  FaCheckCircle
} from "react-icons/fa";
import "./LabRegister.css";

function LabRegister() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    institutionName: "",
    institutionType: "Medical Laboratory",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    address: "",
    registrationNumber: "",
    directorName: ""
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const institutionTypes = [
    "Medical Laboratory",
    "Radiology Center",
    "Both (lab & Radiology)",   
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (!formData.institutionName) {
      setError("Institution name is required");
      return;
    }
    if (!formData.email) {
      setError("Email address is required");
      return;
    }
    if (!formData.phone) {
      setError("Phone number is required");
      return;
    }
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Create lab institution object with password
    const labData = {
      institutionName: formData.institutionName,
      institutionType: formData.institutionType,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      registrationNumber: formData.registrationNumber,
      directorName: formData.directorName,
      password: formData.password,
      registeredAt: new Date().toISOString()
    };

    // Get existing labs or initialize empty array
    const existingLabs = JSON.parse(localStorage.getItem("laboratories") || "[]");
    
    // Check if email already exists
    if (existingLabs.some(lab => lab.email === formData.email)) {
      setError("Email already registered");
      return;
    }

    // Add new lab
    existingLabs.push(labData);
    localStorage.setItem("laboratories", JSON.stringify(existingLabs));
    
    // Auto login after registration
    localStorage.setItem("labLoggedIn", JSON.stringify({
      institutionName: formData.institutionName,
      institutionType: formData.institutionType,
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      registrationNumber: formData.registrationNumber,
      directorName: formData.directorName
    }));
    
    setSuccess("Registration successful! Redirecting to dashboard...");
    
    setTimeout(() => {
      navigate("/lab-dashboard");
    }, 1500);
  };

  return (
    <div className="lab-register-page">
      <div className="lab-register-wrapper">
        
        {/* Left Side - Image */}
        <div className="lab-register-left-image">
          <img 
            src="https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=800&h=600&fit=crop" 
            alt="Laboratory equipment"
            className="lab-register-image"
          />
          <div className="lab-register-image-overlay">
            <h2>Join MedTrack Labs</h2>
            <p>Connect with healthcare providers</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lab-register-right">
          <div className="lab-register-header">
            <Link to="/" className="back-home-link">
              <FaArrowLeft /> Back to Home
            </Link>
            <div className="lab-register-logo">
              <FaFlask className="lab-register-logo-icon" />
              <span>MedTrack</span>
            </div>
            <p className="lab-register-badge">Laboratory Registration</p>
          </div>

          <div className="lab-register-form-container">
            <h1>Register Institution</h1>
            <p className="lab-register-subtitle">Create your lab or radiology center account</p>

            {error && (
              <div className="lab-register-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            {success && (
              <div className="lab-register-success">
                <FaCheckCircle /> {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="lab-register-form">
              <div className="lab-register-row">
                <div className="lab-register-input-group">
                  <label>Institution Name *</label>
                  <div className="input-with-icon">
                    <FaBuilding className="input-icon" />
                    <input
                      type="text"
                      name="institutionName"
                      placeholder="e.g., Central Lab"
                      value={formData.institutionName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <small>Official name of your laboratory or center</small>
                </div>

                <div className="lab-register-input-group">
                  <label>Institution Type *</label>
                  <div className="input-with-icon">
                    <FaFlask className="input-icon" />
                    <select
                      name="institutionType"
                      value={formData.institutionType}
                      onChange={handleChange}
                      required
                    >
                      {institutionTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="lab-register-row">
                <div className="lab-register-input-group">
                  <label>Email *</label>
                  <div className="input-with-icon">
                    <FaEnvelope className="input-icon" />
                    <input
                      type="email"
                      name="email"
                      placeholder="lab@medtrack.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="lab-register-input-group">
                  <label>Phone Number *</label>
                  <div className="input-with-icon">
                    <FaPhone className="input-icon" />
                    <input
                      type="tel"
                      name="phone"
                      placeholder="+20 123 456 7890"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="lab-register-row">
                <div className="lab-register-input-group">
                  <label>Password *</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Create a password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                  <small>Minimum 6 characters</small>
                </div>

                <div className="lab-register-input-group">
                  <label>Confirm Password *</label>
                  <div className="input-with-icon">
                    <FaLock className="input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirm password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>
              </div>

              <div className="lab-register-row">
                <div className="lab-register-input-group">
                  <label>Registration Number (Optional)</label>
                  <div className="input-with-icon">
                    <FaUserTie className="input-icon" />
                    <input
                      type="text"
                      name="registrationNumber"
                      placeholder="e.g., LAB-2024-001"
                      value={formData.registrationNumber}
                      onChange={handleChange}
                    />
                  </div>
                  <small>Government issued registration number</small>
                </div>

                <div className="lab-register-input-group">
                  <label>Director Name (Optional)</label>
                  <div className="input-with-icon">
                    <FaUserTie className="input-icon" />
                    <input
                      type="text"
                      name="directorName"
                      placeholder="Full name of lab director"
                      value={formData.directorName}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="lab-register-input-group full-width">
                <label>Address</label>
                <div className="input-with-icon">
                  <FaMapMarkerAlt className="input-icon" />
                  <textarea
                    name="address"
                    placeholder="Institution address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="2"
                  />
                </div>
              </div>

              <div className="lab-register-terms">
                <input type="checkbox" id="terms" required />
                <label htmlFor="terms">
                  I agree to the <a href="#">Terms of Service</a> and{" "}
                  <a href="#">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" className="lab-register-submit-btn">
                Register Institution
              </button>

              <p className="lab-register-login-text">
                Already have an account?{" "}
                <span onClick={() => navigate("/lab-login")}>Login here</span>
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabRegister;