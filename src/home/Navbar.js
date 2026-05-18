import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">

      <div className="logo">
        <FaHeart className="icon" />
        <span>MedTrack</span>
      </div>

      <div className="nav-linkss">

        <Link
          to="/doctor-login"
          className="login doctor"
        >
          Doctor Login
        </Link>

        <Link
          to="/patient/login"
          className="login patient"
        >
          Patient Login
        </Link>

        <Link
          to="lab-login"
          className="login labs"
        >
          Labs Login
        </Link>

      </div>

    </nav>
  );
}

export default Navbar;