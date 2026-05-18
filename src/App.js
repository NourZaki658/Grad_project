import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import DoctorRegister from "./pages/DoctorRegister";
import DoctorDashboard from "./pages/DoctorDashboard" ;
import DoctorLogin from "./pages/DoctorLogin";
import MedicalRecord from './pages/MedicalRecord'; // استيراد باسم MedicalRecords
import LabLogin from "./pages/LabLogin";
import LabDashboard from './pages/LabDashboard';
import DoctorAppointment from './pages/DoctorAppointment';
import PatientLogin from './pages/PatientLogin';
import PatientDashboard from './pages/PatientDashboard';
import DoctorProfile from "./pages/DoctorProfile";
import ChangePassword from "./pages/ChangePassword";
import LabRegister from "./pages/LabRegister";
import LabProfile from './pages/LabProfile';
import LabChangePassword from './pages/LabChangePassword';


function App() {
  return (
    <Router>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/doctor-register" element={<DoctorRegister />} />
      <Route path="/dashboard" element={<DoctorDashboard />} />
      <Route path="/doctor-login" element={<DoctorLogin />} />
      <Route path="/medical-records" element={<MedicalRecord />} />
      <Route path="/lab-login" element={<LabLogin />} />  // Add this line
      <Route path="/lab-dashboard" element={<LabDashboard />} />
      <Route path="/appointments" element={<DoctorAppointment />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/patient/dashboard" element={<PatientDashboard />} />
      <Route path="/doctor/profile" element={<DoctorProfile />} />
      <Route path="/doctor/change-password" element={<ChangePassword />} />
<Route path="/lab-register" element={<LabRegister />} />
<Route path="/lab-profile" element={<LabProfile />} />
<Route path="/lab/change-password" element={<LabChangePassword />} />



      </Routes>
    </Router>
  );
}

export default App;