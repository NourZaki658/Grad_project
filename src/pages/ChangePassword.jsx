// pages/ChangePassword.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaArrowLeft, 
  FaLock, 
  FaEye, 
  FaEyeSlash,
  FaCheckCircle,
  FaExclamationCircle
} from "react-icons/fa";
import "./ChangePassword.css";

function ChangePassword() {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

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

    // Validate current password (demo - in production, check against backend)
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

    // Update password (demo - in production, send to backend)
    setSuccess("Password changed successfully!");
    
    setTimeout(() => {
      navigate("/dashboard");
    }, 2000);
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

  return (
    <div className="change-password-page">
      {/* Header */}
      <div className="password-header">
        <button className="back-btn" onClick={() => navigate("/dashboard")}>
          <FaArrowLeft /> Back to Dashboard
        </button>
        <div className="password-header-title">
          <FaLock />
          <h1>Change Password</h1>
        </div>
      </div>

      <div className="password-content">
        <div className="password-card">
          <div className="password-icon-section">
            <div className="password-icon-wrapper">
              <FaLock />
            </div>
            <h2>Security Settings</h2>
            <p>Update your password to keep your account secure</p>
          </div>

          {error && (
            <div className="error-message">
              <FaExclamationCircle />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="success-message">
              <FaCheckCircle />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="password-form">
            <div className="form-group">
              <label>Current Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter your current password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                >
                  {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <small>Demo current password: password123</small>
            </div>

            <div className="form-group">
              <label>New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              
              {/* Password Strength Indicator */}
              {newPassword && (
                <div className="password-strength">
                  <div className="strength-bar">
                    <div 
                      className="strength-fill"
                      style={{ width: `${strengthPercent}%`, backgroundColor: strengthColor }}
                    />
                  </div>
                  <span className="strength-text" style={{ color: strengthColor }}>
                    Password strength: {strengthText}
                  </span>
                </div>
              )}
              
              <small className="password-hint">
                Password must contain at least 8 characters, one uppercase letter, 
                one lowercase letter, and one number
              </small>
            </div>

            <div className="form-group">
              <label>Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your new password"
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && (
                <small className="error-hint">Passwords do not match</small>
              )}
            </div>

            <div className="password-buttons">
              <button type="button" className="cancel-password-btn" onClick={() => navigate("/dashboard")}>
                Cancel
              </button>
              <button type="submit" className="update-password-btn">
                Update Password
              </button>
            </div>
          </form>

          <div className="password-tips">
            <h4>Password Security Tips:</h4>
            <ul>
              <li>✓ Use a unique password not used elsewhere</li>
              <li>✓ Avoid using personal information (name, birthdate)</li>
              <li>✓ Consider using a password manager</li>
              <li>✓ Change your password every 3-6 months</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ChangePassword;