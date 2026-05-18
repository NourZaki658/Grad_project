import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaLock, FaUserCircle, FaHeartbeat, FaShieldAlt, FaAmbulance } from "react-icons/fa";
import "./PatientLogin.css";

function PatientLogin() {
  const [nationalId, setNationalId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");
    
    // Demo credentials check
    if (nationalId && password) {
      if (password === "patient123") {
        const patientData = {
          nationalId: nationalId,
          name: "Patient User",
          loginTime: new Date().toISOString()
        };
        localStorage.setItem("patientLoggedIn", JSON.stringify(patientData));
        navigate("/patient/dashboard");
      } else {
        setError("Invalid password. Demo password: patient123");
      }
    } else {
      setError("Please enter National ID and password");
    }
  };

  return (
    <div className="patient-login-page">
      <div className="patient-login-wrapper">
        
        {/* Left Side - Image */}
        <div className="patient-login-left-image">
          <img 
            src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&h=600&fit=crop" 
            alt="Patient care"
            className="patient-image"
          />
          <div className="patient-image-overlay">
            <h2>Patient Portal</h2>
            <p>Access your medical records anytime, anywhere</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="patient-login-right">
          <div className="patient-login-header">
            <div className="patient-logo">
              <FaHeartbeat className="patient-logo-icon" />
              <span>MedTrack</span>
            </div>
            <p className="patient-login-badge">Patient Portal</p>
          </div>

          <div className="patient-login-form-container">
            <h1>Welcome Back</h1>
            <p className="patient-login-subtitle">Login to access your medical records</p>

            {error && <div className="patient-error-message">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="patient-input-group">
                <label>National ID *</label>
                <div className="input-with-icon">
                  <FaUser className="input-icon" />
                  <input
                    type="text"
                    placeholder="Enter your 14-digit National ID"
                    value={nationalId}
                    onChange={(e) => setNationalId(e.target.value)}
                    maxLength="14"
                    required
                  />
                </div>
                <small>Enter the National ID provided by your doctor</small>
              </div>

              <div className="patient-input-group">
                <label>Password *</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type="password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <small>Demo password: patient123</small>
              </div>

              <button type="submit" className="patient-login-button">
                Access Portal
              </button>
            </form>

            <div className="patient-login-footer">
              <p>Don't have an account? <Link to="/">Contact your healthcare provider</Link></p>
              <Link to="/" className="back-home">← Back to Homepage</Link>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PatientLogin;