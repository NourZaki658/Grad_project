// pages/LabChangePassword.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle,
  FaFlask
} from "react-icons/fa";
import "./LabChangePassword.css";

function LabChangePassword() {
  const navigate = useNavigate();
  const [labData, setLabData] = useState(null);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Check if lab is logged in
    const labLoggedIn = localStorage.getItem("labLoggedIn");
    if (!labLoggedIn) {
      navigate("/lab-login");
      return;
    }
    setLabData(JSON.parse(labLoggedIn));
  }, [navigate]);

  const validatePassword = (password) => {
    const errors = [];
    if (password.length < 8) errors.push("At least 8 characters");
    if (!/[A-Z]/.test(password)) errors.push("One uppercase letter");
    if (!/[a-z]/.test(password)) errors.push("One lowercase letter");
    if (!/[0-9]/.test(password)) errors.push("One number");
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Demo password check - in production, validate against stored password
    if (currentPassword !== "password123") {
      setError("Current password is incorrect");
      return;
    }

    // Validate new password
    const validationErrors = validatePassword(newPassword);
    if (validationErrors.length > 0) {
      setError(`Password must contain: ${validationErrors.join(", ")}`);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    // Update lab password in localStorage
    const laboratories = JSON.parse(localStorage.getItem("laboratories") || "[]");
    const labIndex = laboratories.findIndex(l => l.email === labData.email);
    
    if (labIndex !== -1) {
      laboratories[labIndex].password = newPassword;
      localStorage.setItem("laboratories", JSON.stringify(laboratories));
      
      // Update logged in session
      const updatedLab = { 
        ...labData, 
        password: newPassword 
      };
      localStorage.setItem("labLoggedIn", JSON.stringify(updatedLab));
      
      setSuccess("Password changed successfully!");
      
      setTimeout(() => {
        navigate("/lab-dashboard");
      }, 2000);
    } else {
      setError("Unable to update password. Please try again.");
    }
  };

  const getPasswordStrength = () => {
    if (!newPassword) return 0;
    let strength = 0;
    if (newPassword.length >= 8) strength++;
    if (/[A-Z]/.test(newPassword)) strength++;
    if (/[a-z]/.test(newPassword)) strength++;
    if (/[0-9]/.test(newPassword)) strength++;
    return strength;
  };

  const strength = getPasswordStrength();
  const strengthPercent = (strength / 4) * 100;
  const strengthColor = 
    strength === 0 ? "#e2e8f0" :
    strength <= 2 ? "#ef4444" :
    strength === 3 ? "#f59e0b" : "#10b981";
  const strengthText = 
    strength === 0 ? "Not entered" :
    strength <= 2 ? "Weak" :
    strength === 3 ? "Medium" : "Strong";

  if (!labData) {
    return <div className="lab-loading">Loading...</div>;
  }

  return (
    <div className="lab-change-password-page">
      {/* Header */}
      <div className="lab-password-header">
        <button className="lab-back-btn" onClick={() => navigate("/lab-dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="lab-password-header-title">
          <FaFlask />
          <h1>Change Password</h1>
        </div>
      </div>

      <div className="lab-password-content">
        <div className="lab-password-card">
          <div className="lab-password-icon-section">
            <div className="lab-password-icon-wrapper">
              <FaLock />
            </div>
            <h2>Security Settings</h2>
            <p>Update your password to keep your laboratory account secure</p>
            <div className="lab-account-info">
              <span className="lab-account-badge">Laboratory Account</span>
              <span className="lab-account-name">{labData.institutionName || labData.name}</span>
            </div>
          </div>

          {error && (
            <div className="lab-error-message">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="lab-success-message">
              <FaCheckCircle />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="lab-password-form">
            <div className="lab-form-group">
              <label>Current Password</label>
              <div className="lab-password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  className="lab-toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <small>Demo current password: password123</small>
            </div>

            <div className="lab-form-group">
              <label>New Password</label>
              <div className="lab-password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="lab-toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="lab-password-strength">
                  <div className="lab-strength-bar">
                    <div 
                      className="lab-strength-fill"
                      style={{ width: `${strengthPercent}%`, backgroundColor: strengthColor }}
                    />
                  </div>
                  <span className="lab-strength-text" style={{ color: strengthColor }}>
                    Password strength: {strengthText}
                  </span>
                </div>
              )}
              
              <small className="lab-password-hint">
                Password must contain at least 8 characters, one uppercase letter, 
                one lowercase letter, and one number
              </small>
            </div>

            <div className="lab-form-group">
              <label>Confirm New Password</label>
              <div className="lab-password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="lab-toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <small className="lab-error-hint">Passwords do not match</small>
              )}
            </div>

            <div className="lab-password-buttons">
              <button type="button" className="lab-cancel-password-btn" onClick={() => navigate("/lab-dashboard")}>
                Cancel
              </button>
              <button type="submit" className="lab-update-password-btn">
                Update Password
              </button>
            </div>
          </form>

          <div className="lab-password-tips">
            <h4>Password Security Tips:</h4>
            <ul>
              <li>✓ Use a unique password not used elsewhere</li>
              <li>✓ Avoid using personal information (lab name, address)</li>
              <li>✓ Consider using a password manager</li>
              <li>✓ Change your password every 3-6 months</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabChangePassword;