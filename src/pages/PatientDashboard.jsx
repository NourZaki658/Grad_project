// pages/PatientDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaUserCircle, 
  FaSignOutAlt, 
  FaFileMedical, 
  FaFlask, 
  FaPills, 
  FaCalendarAlt,
  FaStethoscope,
  FaXRay,
  FaChevronDown,
  FaChevronUp,
  FaEye,
  FaClock,
  FaCheckCircle,
  FaRobot,
  FaTimes,
  FaPaperPlane,
  FaHeartbeat,
  FaSyringe,
  FaNotesMedical,
  FaUserMd,
  FaCalendarCheck,
  FaHospitalUser,
  FaMicroscope,
  FaPrescriptionBottle,
  FaBell,
  FaTrash
} from "react-icons/fa";
import "./PatientDashboard.css";

function PatientDashboard() {
  const navigate = useNavigate();
  const [patient, setPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  const [expandedDoctor, setExpandedDoctor] = useState(null);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showChatbot, setShowChatbot] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    { 
      id: 1, 
      type: 'bot', 
      message: "Hello! I'm your health assistant. How can I help you today? You can ask me about:\n• Your medications\n• Lab results\n• Appointments\n• Health tips" 
    }
  ]);
  const [chatInput, setChatInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Notification states
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Load notifications for patient
  const loadNotifications = (nationalId) => {
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const patientNotifications = allNotifications.filter(n => n.patientId === nationalId);
    patientNotifications.sort((a, b) => new Date(b.date) - new Date(a.date));
    setNotifications(patientNotifications);
  };

  // Mark single notification as read
  const markAsRead = (notificationId) => {
    const updatedNotifications = notifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.map(n => 
      n.id === notificationId ? { ...n, read: true } : n
    );
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  // Mark all notifications as read
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.map(n => ({ ...n, read: true }));
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  // Delete a notification
  const deleteNotification = (notificationId) => {
    const updatedNotifications = notifications.filter(n => n.id !== notificationId);
    setNotifications(updatedNotifications);
    
    const allNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    const updatedAll = allNotifications.filter(n => n.id !== notificationId);
    localStorage.setItem("patientNotifications", JSON.stringify(updatedAll));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const patientData = localStorage.getItem("patientLoggedIn");
    if (patientData) {
      const parsed = JSON.parse(patientData);
      setPatient(parsed);
      loadPatientMedicalData(parsed.nationalId);
      loadPatientAppointments(parsed.nationalId);
      loadNotifications(parsed.nationalId);
    } else {
      navigate("/patient/login");
    }
  }, [navigate]);

  const loadPatientMedicalData = (nationalId) => {
    const savedPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    
    const found = savedPatients.find(p => p.nationalId === nationalId);
    if (found) {
      const sortedVisits = [...found.visits].sort((a, b) => new Date(b.date) - new Date(a.date));
      setPatientData({ ...found, visits: sortedVisits });
    } else {
      setPatientData({
        fullName: patient?.fullName || "Patient",
        nationalId: nationalId,
        age: 0,
        bloodType: "Unknown",
        gender: "Not specified",
        chronicConditions: [],
        allergies: [],
        visits: []
      });
    }
  };

  const loadPatientAppointments = (nationalId) => {
    const savedAppointments = JSON.parse(localStorage.getItem("doctorAppointments") || "[]");
    const patientAppointments = savedAppointments.filter(apt => apt.patientId === nationalId);
    setAppointments(patientAppointments);
  };

  const getVisitsByDoctor = () => {
    if (!patientData?.visits) return [];
    const doctorMap = new Map();
    
    patientData.visits.forEach(visit => {
      if (!doctorMap.has(visit.doctorName)) {
        doctorMap.set(visit.doctorName, {
          doctorName: visit.doctorName,
          specialty: visit.specialty,
          visits: []
        });
      }
      doctorMap.get(visit.doctorName).visits.push(visit);
    });
    
    for (let [_, doctor] of doctorMap) {
      doctor.visits.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    
    return Array.from(doctorMap.values());
  };

  const toggleDoctor = (doctorName) => {
    if (expandedDoctor === doctorName) {
      setExpandedDoctor(null);
    } else {
      setExpandedDoctor(doctorName);
    }
  };

  const toggleVisit = (visitId) => {
    if (expandedVisit === visitId) {
      setExpandedVisit(null);
    } else {
      setExpandedVisit(visitId);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("patientLoggedIn");
    navigate("/");
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="appt-status scheduled"><FaClock /> Scheduled</span>;
      case 'completed':
        return <span className="appt-status completed"><FaCheckCircle /> Completed</span>;
      case 'cancelled':
        return <span className="appt-status cancelled"><FaTimes /> Cancelled</span>;
      default:
        return <span className="appt-status scheduled">{status}</span>;
    }
  };

  const getBotResponse = (userMessage) => {
    const msg = userMessage.toLowerCase();
    
    if (msg.includes("medication") || msg.includes("medicine") || msg.includes("drug")) {
      const meds = patientData?.visits?.flatMap(v => v.medications || []) || [];
      const uniqueMeds = [...new Map(meds.map(m => [m.name, m])).values()];
      if (uniqueMeds.length > 0) {
        return `You are currently taking: ${uniqueMeds.map(m => `${m.name} (${m.dosage})`).join(", ")}. Always take medications as prescribed by your doctor.`;
      } else {
        return "You don't have any active medications prescribed at the moment.";
      }
    }
    
    if (msg.includes("lab") || msg.includes("test") || msg.includes("result")) {
      const labs = patientData?.visits?.flatMap(v => v.labResults || []) || [];
      if (labs.length > 0) {
        return `Your recent lab results include: ${labs.join(", ")}. For detailed interpretation, please consult your doctor.`;
      } else {
        return "No lab results have been recorded yet.";
      }
    }
    
    if (msg.includes("appointment")) {
      const upcoming = appointments.filter(a => a.status === 'scheduled');
      if (upcoming.length > 0) {
        return `You have ${upcoming.length} upcoming appointment(s). Your next appointment is on ${upcoming[0]?.date} at ${upcoming[0]?.time}.`;
      } else {
        return "You don't have any upcoming appointments scheduled.";
      }
    }
    
    if (msg.includes("doctor") || msg.includes("physician")) {
      const doctors = [...new Set(patientData?.visits?.map(v => v.doctorName) || [])];
      if (doctors.length > 0) {
        return `You have visited: ${doctors.join(", ")}. Click on any doctor's name to see your visit details.`;
      } else {
        return "No doctor visits have been recorded yet.";
      }
    }
    
    if (msg.includes("hello") || msg.includes("hi")) {
      return "Hello! I'm here to help you with your health information. You can ask me about your medications, lab results, appointments, or doctors you've seen.";
    }
    
    if (msg.includes("tip") || msg.includes("advice")) {
      return "Here are some health tips:\n• Stay hydrated - drink 8 glasses of water daily\n• Exercise for 30 minutes, 5 days a week\n• Get 7-8 hours of sleep\n• Eat a balanced diet\n• Take medications as prescribed";
    }
    
    return "I understand you're asking about your health. You can ask me about your medications, lab results, appointments, or doctors you've visited.";
  };

  const handleSendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user', message: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    setChatInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const botResponse = getBotResponse(chatInput);
      const botMessage = { id: Date.now() + 1, type: 'bot', message: botResponse };
      setChatMessages(prev => [...prev, botMessage]);
      setIsTyping(false);
    }, 800);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  const doctorsByVisit = getVisitsByDoctor();

  if (!patientData) {
    return <div className="loading">Loading your health records...</div>;
  }

  return (
    <div className="patient-dashboard">
      {/* Header with Notification Bell */}
      <div className="patient-dashboard-header">
        <div className="patient-logo">
          <FaHeartbeat className="logo-icon" />
          <h2>MedTrack Patient Portal</h2>
        </div>
        <div className="header-right">
          <div className="patient-welcome-small">
            <span>Welcome, {patientData.fullName}</span>
          </div>
          
          {/* Notification Bell */}
          <div className="notification-bell-container">
            <button 
              className="notification-bell-btn"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <FaBell />
              {unreadCount > 0 && (
                <span className="notification-badge">{unreadCount}</span>
              )}
            </button>
            
            {showNotifications && (
              <div className="notification-dropdown">
                <div className="notification-header">
                  <h4>Notifications</h4>
                  {unreadCount > 0 && (
                    <button className="mark-all-read-btn" onClick={markAllAsRead}>
                      Mark all as read
                    </button>
                  )}
                </div>
                <div className="notification-list">
                  {notifications.length === 0 ? (
                    <div className="no-notifications">
                      <FaBell />
                      <p>No notifications yet</p>
                    </div>
                  ) : (
                    notifications.map(notif => (
                      <div 
                        key={notif.id} 
                        className={`notification-item ${!notif.read ? 'unread' : ''}`}
                      >
                        <div className="notification-icon">
                          {notif.type === 'appointment' ? <FaCalendarAlt /> : <FaUserMd />}
                        </div>
                        <div className="notification-content">
                          <p>{notif.message}</p>
                          <span>{notif.time}</span>
                          {notif.appointmentDetails && (
                            <div className="notification-appointment-details">
                              <small>📅 {notif.appointmentDetails.date} at {notif.appointmentDetails.time}</small>
                              <small>📍 {notif.appointmentDetails.location}</small>
                            </div>
                          )}
                        </div>
                        <div className="notification-actions">
                          {!notif.read && (
                            <button 
                              className="mark-read-btn"
                              onClick={() => markAsRead(notif.id)}
                              title="Mark as read"
                            >
                              <FaCheckCircle />
                            </button>
                          )}
                          <button 
                            className="delete-notif-btn"
                            onClick={() => deleteNotification(notif.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button onClick={handleLogout} className="patient-logout-btn">
            <FaSignOutAlt /> Logout
          </button>
        </div>
      </div>

      <div className="patient-dashboard-content">
        {/* Patient Info Card */}
        <div className="patient-info-card">
          <div className="patient-avatar">
            <FaUserCircle />
          </div>
          <div className="patient-details">
            <h1>{patientData.fullName}</h1>
            <div className="patient-meta">
              <span>ID: {patientData.nationalId}</span>
              <span>Age: {patientData.age} years</span>
              <span>Blood Type: {patientData.bloodType}</span>
              <span>Gender: {patientData.gender}</span>
            </div>
            <div className="patient-medical-tags">
              {patientData.chronicConditions?.map((c, i) => (
                <span key={i} className="condition-tag">{c}</span>
              ))}
              {patientData.allergies?.map((a, i) => (
                <span key={i} className="allergy-tag">⚠️ {a}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Two Column Layout */}
        <div className="medical-layout">
          {/* Left Column - Doctors History */}
          <div className="doctors-history-section">
            <h2 className="section-title">
              <FaUserMd /> My Doctors & Visit History
            </h2>
            
            {doctorsByVisit.length === 0 ? (
              <div className="empty-state-large">
                <FaHospitalUser className="empty-icon" />
                <p>No doctor visits recorded yet</p>
              </div>
            ) : (
              doctorsByVisit.map((doctor, idx) => (
                <div key={idx} className="doctor-card">
                  <div className="doctor-header" onClick={() => toggleDoctor(doctor.doctorName)}>
                    <div className="doctor-avatar-small">
                      <FaUserMd />
                    </div>
                    <div className="doctor-info-header">
                      <h3>{doctor.doctorName}</h3>
                      <p>{doctor.specialty}</p>
                    </div>
                    <div className="doctor-stats">
                      <span className="visit-count">{doctor.visits.length} visits</span>
                      {expandedDoctor === doctor.doctorName ? <FaChevronUp /> : <FaChevronDown />}
                    </div>
                  </div>
                  
                  {expandedDoctor === doctor.doctorName && (
                    <div className="doctor-visits">
                      {doctor.visits.map((visit) => (
                        <div key={visit.id} className="visit-card-patient">
                          <div className="visit-header-patient" onClick={() => toggleVisit(visit.id)}>
                            <div className="visit-date-badge">
                              <div className="visit-day">{new Date(visit.date).getDate()}</div>
                              <div className="visit-month">{new Date(visit.date).toLocaleString('default', { month: 'short' })}</div>
                              <div className="visit-year">{new Date(visit.date).getFullYear()}</div>
                            </div>
                            <div className="visit-summary">
                              <div className="visit-diagnosis-short">{visit.diagnosis}</div>
                              <div className="visit-meta-short">
                                <span><FaClock /> {visit.time}</span>
                                {visit.bloodPressure && <span><FaHeartbeat /> BP: {visit.bloodPressure}</span>}
                              </div>
                            </div>
                            <div className="visit-expand">
                              {expandedVisit === visit.id ? <FaChevronUp /> : <FaChevronDown />}
                            </div>
                          </div>
                          
                          {expandedVisit === visit.id && (
                            <div className="visit-details-patient">
                              {/* Vital Signs */}
                              <div className="detail-section">
                                <h4>Vital Signs</h4>
                                <div className="vital-grid">
                                  <div className="vital-item">
                                    <span className="vital-label">Blood Pressure:</span>
                                    <span className="vital-value">{visit.bloodPressure || 'Not recorded'}</span>
                                  </div>
                                  <div className="vital-item">
                                    <span className="vital-label">Heart Rate:</span>
                                    <span className="vital-value">{visit.heartRate || 'Not recorded'}</span>
                                  </div>
                                  <div className="vital-item">
                                    <span className="vital-label">Temperature:</span>
                                    <span className="vital-value">{visit.temperature || 'Not recorded'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Medications */}
                              {visit.medications?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaPrescriptionBottle /> Prescribed Medications</h4>
                                  <div className="medications-list">
                                    {visit.medications.map((med, i) => (
                                      <div key={i} className="medication-detail">
                                        <div className="med-name-detail">{med.name}</div>
                                        <div className="med-dose">{med.dosage}</div>
                                        <div className="med-frequency">{med.duration}</div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {/* Lab Results */}
                              {visit.labResults?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaMicroscope /> Lab Results</h4>
                                  <ul className="lab-list">
                                    {visit.labResults.map((lab, i) => (
                                      <li key={i}>{lab}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Radiology */}
                              {visit.radiology?.length > 0 && (
                                <div className="detail-section">
                                  <h4><FaXRay /> Imaging / Radiology</h4>
                                  <ul className="radiology-list">
                                    {visit.radiology.map((scan, i) => (
                                      <li key={i}>{scan}</li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {/* Doctor's Notes */}
                              {visit.notes && (
                                <div className="detail-section">
                                  <h4>Doctor's Notes</h4>
                                  <p className="doctor-notes">{visit.notes}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Right Column - Appointments */}
          <div className="appointments-section">
            <h2 className="section-title">
              <FaCalendarAlt /> My Appointments
            </h2>
            <div className="appointments-list">
              {appointments.length > 0 ? (
                appointments.map((apt) => (
                  <div key={apt.id} className="appointment-card-mini">
                    <div className="appointment-date-large">
                      <div className="day">{new Date(apt.date).getDate()}</div>
                      <div className="month">{new Date(apt.date).toLocaleString('default', { month: 'short' })}</div>
                    </div>
                    <div className="appointment-details-mini">
                      <div className="appointment-time-mini">
                        <FaClock /> {apt.time} ({apt.duration} min)
                      </div>
                      <div className="appointment-type-mini">
                        <FaStethoscope /> {apt.type}
                      </div>
                      <div className="appointment-location-mini">
                        <FaSyringe /> {apt.location}
                      </div>
                      {apt.notes && <div className="appointment-notes-mini">{apt.notes}</div>}
                    </div>
                    <div className="appointment-status-mini">
                      {getStatusBadge(apt.status)}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">No appointments scheduled</div>
              )}
            </div>
          </div>
        </div>

        {/* Chatbot Section */}
        <div className="chatbot-container">
          <div className="chatbot-header" onClick={() => setShowChatbot(!showChatbot)}>
            <div className="chatbot-header-left">
              <FaRobot className="chatbot-icon" />
              <div>
                <h3>Health Assistant AI</h3>
                <p>Ask me about your health records</p>
              </div>
            </div>
            <button className="chatbot-toggle">
              {showChatbot ? <FaChevronDown /> : <FaChevronUp />}
            </button>
          </div>
          
          {showChatbot && (
            <div className="chatbot-body">
              <div className="chat-messages">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`message ${msg.type}`}>
                    <div className="message-avatar">
                      {msg.type === 'bot' ? <FaRobot /> : <FaUserCircle />}
                    </div>
                    <div className="message-content">
                      <div className="message-text">{msg.message}</div>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="message bot typing">
                    <div className="message-avatar">
                      <FaRobot />
                    </div>
                    <div className="message-content">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="chat-input-area">
                <input
                  type="text"
                  placeholder="Ask about your medications, lab results, appointments..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={handleKeyPress}
                />
                <button onClick={handleSendMessage}>
                  <FaPaperPlane />
                </button>
              </div>
              
              <div className="chat-suggestions">
                <button onClick={() => setChatInput("What medications am I taking?")}>
                  💊 My medications
                </button>
                <button onClick={() => setChatInput("Show my lab results")}>
                  🔬 Lab results
                </button>
                <button onClick={() => setChatInput("My upcoming appointments")}>
                  📅 Appointments
                </button>
                <button onClick={() => setChatInput("Which doctors have I seen?")}>
                  👨‍⚕️ My doctors
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PatientDashboard;