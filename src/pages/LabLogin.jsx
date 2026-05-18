// pages/LabLogin.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaFlask, FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import "./LabLogin.css";

function LabLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Get registered laboratories from localStorage
    const laboratories = JSON.parse(localStorage.getItem("laboratories") || "[]");
    
    // Find lab by email
    const lab = laboratories.find(lab => lab.email === email);
    
    // Check if lab exists and password matches
    if (lab && lab.password === password) {
      // Store logged in lab data
      localStorage.setItem("labLoggedIn", JSON.stringify({
        institutionName: lab.institutionName,
        institutionType: lab.institutionType,
        email: lab.email,
        phone: lab.phone,
        address: lab.address,
        registrationNumber: lab.registrationNumber,
        directorName: lab.directorName
      }));
      navigate("/lab-dashboard");
    } else if (lab && lab.password !== password) {
      setError("Incorrect password. Please try again.");
    } else {
      setError("No account found with this email. Please register first.");
    }
  };

  return (
    <div className="lab-login-page">
      <div className="lab-login-wrapper">
        
        {/* Left Side - Image */}
        <div className="lab-login-left-image">
          <img 
            src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&h=600&fit=crop" 
            alt="Laboratory equipment"
            className="lab-image"
          />
          <div className="lab-image-overlay">
            <h2>Laboratory Portal</h2>
            <p>Secure test result management</p>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="lab-login-right">
          <div className="lab-login-header">
            <div className="lab-logo">
              <FaFlask className="lab-logo-icon" />
              <span>MedTrack</span>
            </div>
            <p className="lab-login-badge">Laboratory Portal</p>
          </div>

          <div className="lab-login-form-container">
            <h1>Welcome Back</h1>
            <p className="lab-login-subtitle">Login to access the laboratory dashboard</p>

            {error && (
              <div className="lab-login-error">
                <span>⚠️ {error}</span>
              </div>
            )}

            <form onSubmit={handleLogin}>
              <div className="lab-input-group">
                <label>Email Address *</label>
                <div className="input-with-icon">
                  <FaEnvelope className="input-icon" />
                  <input
                    type="email"
                    placeholder="lab@medtrack.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="lab-input-group">
                <label>Password *</label>
                <div className="input-with-icon">
                  <FaLock className="input-icon" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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
              </div>

              <button type="submit" className="lab-login-button">
                Login
              </button>
            </form>

            <div className="lab-login-footer">
              <p>Don't have an account? <Link to="/lab-register">Register your institution</Link></p>
              <Link to="/" className="back-home">← Back to Homepage</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabLogin;