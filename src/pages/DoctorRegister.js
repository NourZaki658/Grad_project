import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import "./DoctorRegister.css";

function DoctorRegister() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    profession: "",
    licenseNumber: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Create doctor object
    const doctorData = {
      name: `Dr. ${formData.firstName} ${formData.lastName}`,
      specialty: formData.profession,
      email: formData.email,
      phone: formData.phone,
      licenseNumber: formData.licenseNumber,
      registeredAt: new Date().toISOString()
    };

    // Get existing doctors or initialize empty array
    const existingDoctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    
    // Check if email already exists
    if (existingDoctors.some(d => d.email === formData.email)) {
      setError("Email already registered");
      return;
    }

    // Add new doctor
    existingDoctors.push(doctorData);
    localStorage.setItem("doctors", JSON.stringify(existingDoctors));
    
    // Auto login after registration
    localStorage.setItem("doctorLoggedIn", JSON.stringify(doctorData));
    navigate("/dashboard");
  };

  return (
    <div className="register-container">
      <div className="left">
        <img src="https://images.unsplash.com/photo-1588776814546-1ffcf47267a5" alt="doctor" />
      </div>

      <div className="right">
        <div className="top-bar">
          <Link to="/" className="back">
            <FaArrowLeft /> Homepage
          </Link>
          <div className="logo">
            <FaHeart /> MedTrack
          </div>
        </div>

        <h2>Register as a Doctor</h2>
        <p className="subtitle">Create your account to get started</p>

        {error && <div style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

        <form className="formreg" onSubmit={handleSubmit}>
          <div className="row">
            <input type="text" name="firstName" placeholder="First Name *" value={formData.firstName} onChange={handleChange} required />
            <input type="text" name="lastName" placeholder="Last Name *" value={formData.lastName} onChange={handleChange} required />
          </div>

          <input type="email" name="email" placeholder="Email Address *" value={formData.email} onChange={handleChange} required />

          <div className="row">
            <input type="text" name="phone" placeholder="Phone Number *" value={formData.phone} onChange={handleChange} required />
            <input type="text" name="dateOfBirth" placeholder="Date of Birth *" value={formData.dateOfBirth} onChange={handleChange} required />
          </div>

          <div className="row">
            <input type="text" name="profession" placeholder="Profession / Specialty *" value={formData.profession} onChange={handleChange} required />
            <input type="text" name="licenseNumber" placeholder="Medical License Number *" value={formData.licenseNumber} onChange={handleChange} required />
          </div>

          <div className="row">
            <input type="password" name="password" placeholder="Password *" value={formData.password} onChange={handleChange} required />
            <input type="password" name="confirmPassword" placeholder="Confirm Password *" value={formData.confirmPassword} onChange={handleChange} required />
          </div>

          <button className="submit" type="submit">Create Account</button>

          <p className="login-text">
            Already have an account? <span onClick={() => navigate("/doctor-login")}>Login here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorRegister;