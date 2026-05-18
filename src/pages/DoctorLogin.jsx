import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowLeft, FaHeart } from "react-icons/fa";
import "./DoctorLogin.css";

function DoctorLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Get registered doctors from localStorage
    const doctors = JSON.parse(localStorage.getItem("doctors") || "[]");
    
    // Find doctor by email
    const doctor = doctors.find(d => d.email === email);
    
    if (doctor) {
      // For demo, accept any password (in production, validate hashed password)
      if (password) {
        const doctorData = {
          name: doctor.name,
          specialty: doctor.specialty,
          email: doctor.email,
          phone: doctor.phone,
          loginTime: new Date().toISOString()
        };
        localStorage.setItem("doctorLoggedIn", JSON.stringify(doctorData));
        navigate("/dashboard");
      } else {
        setError("Invalid password");
      }
    } else {
      setError("No account found with this email. Please register first.");
    }
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

        <h2>Login as a Doctor</h2>
        <p className="subtitle">Welcome back 👋</p>

        {error && <div style={{color: 'red', marginBottom: '15px', textAlign: 'center'}}>{error}</div>}

        <form className="form" onSubmit={handleLogin}>
          <input 
            type="email" 
            placeholder="Email Address *" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Password *" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="submit">Login</button>

          <p className="login-text">
            Don't have an account?{" "}
            <span onClick={() => navigate("/doctor-register")}>Register here</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default DoctorLogin;