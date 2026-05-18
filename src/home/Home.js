import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import {
  FaCalendarAlt,
  FaFileMedical,
  FaHeartbeat,
  FaShieldAlt
} from "react-icons/fa";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  return (
    <>
      <Navbar />

      <div className="home">

        {/* HERO */}
        <section className="hero">
          <h1>Modern Healthcare Management Made Simple</h1>

          <p>
            MedTrack connects doctors and patients in a secure platform
            for managing medical records and appointments.
          </p>

          <div className="buttons">
            <button
              onClick={() => navigate("/doctor-register")}
              className="btn primary"
            >
              Get Started as Doctor
            </button>
          </div>
        </section>

        {/* FEATURES */}
        <section className="features">
          <h2>Comprehensive Healthcare Features</h2>
          <p>Everything you need in one place</p>

          <div className="cards">
            <div className="card">
              <FaCalendarAlt className="card-icon" />
              <h3>Appointments</h3>
              <p>Easy scheduling and management.</p>
            </div>

            <div className="card">
              <FaFileMedical className="card-icon" />
              <h3>Medical Records</h3>
              <p>Secure access anytime.</p>
            </div>

            <div className="card">
              <FaHeartbeat className="card-icon" />
              <h3>Patient Tracking</h3>
              <p>Monitor patient progress.</p>
            </div>

            <div className="card">
              <FaShieldAlt className="card-icon" />
              <h3>Secure Data</h3>
              <p>Your data is protected.</p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

export default Home;