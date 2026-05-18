import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaCalendarAlt, 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaSave, 
  FaTimes,
  FaUserMd,
  FaClock,
  FaStethoscope,
  FaNotesMedical,
  FaChevronLeft,
  FaChevronRight,
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaSearch,
  FaSpinner,
  FaHourglassHalf,
  FaUserCheck,
  FaUserClock,
  FaCheckDouble,
  FaPlay,
  FaPause,
  FaFlagCheckered
} from "react-icons/fa";
import "./DoctorAppointment.css";

function DoctorAppointment() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingAppointment, setEditingAppointment] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [searchTerm, setSearchTerm] = useState("");
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    date: "",
    time: "",
    duration: "30",
    type: "Checkup",
    location: "Clinic Room 204",
    notes: "",
    status: "scheduled"
  });

  // Track progress status for appointments
  const [progressStatus, setProgressStatus] = useState({});

  // Helper function to send notification to patient
  const sendNotificationToPatient = (patientId, patientName, appointment) => {
    const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
    
    const doctorData = localStorage.getItem("doctorLoggedIn");
    let doctorName = "Dr. Ahmed Mahmoud";
    if (doctorData) {
      const parsed = JSON.parse(doctorData);
      doctorName = parsed.name || doctorName;
    }
    
    const formattedDate = new Date(appointment.date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    const message = `New appointment scheduled with ${doctorName} on ${formattedDate} at ${appointment.time} (${appointment.duration} min) - ${appointment.type}`;
    
    const newNotification = {
      id: Date.now(),
      patientId: patientId,
      patientName: patientName,
      type: "appointment",
      message: message,
      date: new Date().toISOString(),
      time: "Just now",
      read: false,
      appointmentDetails: {
        date: appointment.date,
        time: appointment.time,
        duration: appointment.duration,
        type: appointment.type,
        location: appointment.location,
        notes: appointment.notes,
        doctorName: doctorName
      }
    };
    
    existingNotifications.push(newNotification);
    localStorage.setItem("patientNotifications", JSON.stringify(existingNotifications));
  };

  // Load appointments from localStorage
  useEffect(() => {
    const savedAppointments = localStorage.getItem("doctorAppointments");
    if (savedAppointments) {
      setAppointments(JSON.parse(savedAppointments));
      // Load progress status for appointments
      const savedProgress = localStorage.getItem("appointmentProgress");
      if (savedProgress) {
        setProgressStatus(JSON.parse(savedProgress));
      }
    } else {
      const defaultAppointments = [
        {
          id: 1,
          patientName: "Elena Rodriguez",
          patientId: "12345678901234",
          date: new Date().toISOString().split('T')[0],
          time: "09:00",
          duration: "30",
          type: "Follow-up",
          location: "Clinic Room 204",
          notes: "Review blood pressure",
          status: "scheduled"
        },
        {
          id: 2,
          patientName: "John Smith",
          patientId: "98765432109876",
          date: new Date().toISOString().split('T')[0],
          time: "10:30",
          duration: "45",
          type: "Consultation",
          location: "Clinic Room 204",
          notes: "First time consultation",
          status: "scheduled"
        },
        {
          id: 3,
          patientName: "Maria Garcia",
          patientId: "55555555555555",
          date: new Date().toISOString().split('T')[0],
          time: "14:00",
          duration: "30",
          type: "Checkup",
          location: "Clinic Room 204",
          notes: "Routine checkup",
          status: "scheduled"
        }
      ];
      setAppointments(defaultAppointments);
      localStorage.setItem("doctorAppointments", JSON.stringify(defaultAppointments));
    }
  }, []);

  useEffect(() => {
    if (appointments.length > 0) {
      localStorage.setItem("doctorAppointments", JSON.stringify(appointments));
    }
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem("appointmentProgress", JSON.stringify(progressStatus));
  }, [progressStatus]);

  const getAppointmentsForDate = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // Get today's appointments
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    return appointments
      .filter(apt => apt.date === today)
      .sort((a, b) => a.time.localeCompare(b.time));
  };

  const getUpcomingAppointments = () => {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(today.getDate() + 7);
    
    return appointments
      .filter(apt => {
        const aptDate = new Date(apt.date);
        return aptDate >= today && aptDate <= nextWeek;
      })
      .sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  const getFilteredAppointments = () => {
    if (!searchTerm) return getUpcomingAppointments();
    return getUpcomingAppointments().filter(apt => 
      apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      apt.patientId.includes(searchTerm)
    );
  };

  // Update appointment progress status
  const updateProgressStatus = (appointmentId, newProgress) => {
    setProgressStatus(prev => ({
      ...prev,
      [appointmentId]: newProgress
    }));
  };

  // Get progress badge
  const getProgressBadge = (appointmentId) => {
    const status = progressStatus[appointmentId] || "waiting";
    
    switch(status) {
      case 'waiting':
        return { icon: <FaHourglassHalf />, text: 'Waiting', class: 'progress-waiting' };
      case 'in-progress':
        return { icon: <FaSpinner />, text: 'In Progress', class: 'progress-in-progress' };
      case 'completed':
        return { icon: <FaCheckDouble />, text: 'Completed', class: 'progress-completed' };
      case 'cancelled':
        return { icon: <FaTimes />, text: 'Cancelled', class: 'progress-cancelled' };
      default:
        return { icon: <FaHourglassHalf />, text: 'Waiting', class: 'progress-waiting' };
    }
  };

  // Get progress actions for an appointment
  const getProgressActions = (appointmentId, currentStatus) => {
    const actions = [];
    if (currentStatus !== 'in-progress' && currentStatus !== 'completed' && currentStatus !== 'cancelled') {
      actions.push({ value: 'in-progress', label: 'Start', icon: <FaPlay /> });
    }
    if (currentStatus === 'in-progress') {
      actions.push({ value: 'completed', label: 'Complete', icon: <FaFlagCheckered /> });
    }
    if (currentStatus !== 'cancelled' && currentStatus !== 'completed') {
      actions.push({ value: 'cancelled', label: 'Cancel', icon: <FaTimes /> });
    }
    return actions;
  };

  const handleAddAppointment = () => {
    setEditingAppointment(null);
    setFormData({
      patientName: "",
      patientId: "",
      date: selectedDate.toISOString().split('T')[0],
      time: "09:00",
      duration: "30",
      type: "Checkup",
      location: "Clinic Room 204",
      notes: "",
      status: "scheduled"
    });
    setShowModal(true);
  };

  const handleEditAppointment = (appointment) => {
    setEditingAppointment(appointment);
    setFormData(appointment);
    setShowModal(true);
  };

  const handleDeleteAppointment = (id) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
      const deletedAppointment = appointments.find(apt => apt.id === id);
      setAppointments(appointments.filter(apt => apt.id !== id));
      
      if (deletedAppointment) {
        const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
        const doctorData = localStorage.getItem("doctorLoggedIn");
        let doctorName = "Dr. Ahmed Mahmoud";
        if (doctorData) {
          const parsed = JSON.parse(doctorData);
          doctorName = parsed.name || doctorName;
        }
        
        const cancellationNotification = {
          id: Date.now(),
          patientId: deletedAppointment.patientId,
          patientName: deletedAppointment.patientName,
          type: "appointment",
          message: `Appointment with ${doctorName} on ${deletedAppointment.date} at ${deletedAppointment.time} has been CANCELLED.`,
          date: new Date().toISOString(),
          time: "Just now",
          read: false
        };
        existingNotifications.push(cancellationNotification);
        localStorage.setItem("patientNotifications", JSON.stringify(existingNotifications));
      }
    }
  };

  const handleSaveAppointment = () => {
    if (editingAppointment) {
      setAppointments(appointments.map(apt => 
        apt.id === editingAppointment.id ? { ...formData, id: apt.id } : apt
      ));
      
      const doctorData = localStorage.getItem("doctorLoggedIn");
      let doctorName = "Dr. Ahmed Mahmoud";
      if (doctorData) {
        const parsed = JSON.parse(doctorData);
        doctorName = parsed.name || doctorName;
      }
      
      const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
      const formattedDate = new Date(formData.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      
      const updateNotification = {
        id: Date.now(),
        patientId: formData.patientId,
        patientName: formData.patientName,
        type: "appointment",
        message: `Your appointment with ${doctorName} has been UPDATED to ${formattedDate} at ${formData.time} (${formData.duration} min) - ${formData.type}`,
        date: new Date().toISOString(),
        time: "Just now",
        read: false,
        appointmentDetails: formData
      };
      existingNotifications.push(updateNotification);
      localStorage.setItem("patientNotifications", JSON.stringify(existingNotifications));
      
    } else {
      const newId = Math.max(...appointments.map(apt => apt.id), 0) + 1;
      const newAppointment = { ...formData, id: newId };
      setAppointments([...appointments, newAppointment]);
      sendNotificationToPatient(formData.patientId, formData.patientName, formData);
      alert(`Appointment created and notification sent to patient: ${formData.patientName}`);
    }
    setShowModal(false);
    setEditingAppointment(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'scheduled':
        return <span className="status-badge scheduled"><FaClock /> Scheduled</span>;
      case 'completed':
        return <span className="status-badge completed"><FaCheckCircle /> Completed</span>;
      case 'cancelled':
        return <span className="status-badge cancelled"><FaTimes /> Cancelled</span>;
      default:
        return <span className="status-badge scheduled">{status}</span>;
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  const changeMonth = (increment) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + increment);
    setCurrentMonth(newMonth);
  };

  const getDaysInMonth = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(null);
    }
    
    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (date) => {
    if (!date) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  const hasAppointments = (date) => {
    if (!date) return false;
    const dateStr = date.toISOString().split('T')[0];
    return appointments.some(apt => apt.date === dateStr);
  };

  const selectedDateAppointments = getAppointmentsForDate(selectedDate);
  const filteredAppointments = getFilteredAppointments();
  const todaysAppointments = getTodaysAppointments();

  // Calculate counts for today's appointments status
  const waitingCount = todaysAppointments.filter(apt => progressStatus[apt.id] === 'waiting' || !progressStatus[apt.id]).length;
  const inProgressCount = todaysAppointments.filter(apt => progressStatus[apt.id] === 'in-progress').length;
  const completedCount = todaysAppointments.filter(apt => progressStatus[apt.id] === 'completed').length;

  return (
    <div className="appointments-page">
      {/* Header */}
      <div className="appointments-header">
        <div className="header-left">
          <button className="back-btn" onClick={handleBackToDashboard}>
            <FaArrowLeft /> Dashboard
          </button>
          <div className="header-title">
            <FaCalendarAlt />
            <h1>Appointments</h1>
          </div>
        </div>
        <button className="add-appointment-btn" onClick={handleAddAppointment}>
          <FaPlus /> New Appointment
        </button>
      </div>

      <div className="appointments-content">
        {/* Three Column Layout - Added Today's Appointments */}
        <div className="appointments-layout-three">
          
          {/* New Column - Today's Appointments with Progress */}
          <div className="today-column">
            <div className="today-card">
              <div className="today-header">
                <h3><FaBell /> Today's Schedule</h3>
                <div className="today-date">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                </div>
              </div>
              
              {/* Progress Summary */}
              <div className="progress-summary">
                <div className="summary-item waiting">
                  <span className="summary-count">{waitingCount}</span>
                  <span className="summary-label">Waiting</span>
                </div>
                <div className="summary-item in-progress">
                  <span className="summary-count">{inProgressCount}</span>
                  <span className="summary-label">In Progress</span>
                </div>
                <div className="summary-item completed">
                  <span className="summary-count">{completedCount}</span>
                  <span className="summary-label">Completed</span>
                </div>
              </div>

              {/* Today's Appointments List */}
              <div className="today-appointments-list">
                {todaysAppointments.length === 0 ? (
                  <div className="no-today-appointments">
                    <FaCalendarAlt />
                    <p>No appointments scheduled for today</p>
                  </div>
                ) : (
                  todaysAppointments.map(apt => {
                    const progress = getProgressBadge(apt.id);
                    const actions = getProgressActions(apt.id, progressStatus[apt.id]);
                    return (
                      <div key={apt.id} className="today-appointment-card">
                        <div className="today-appointment-time">
                          <FaClock />
                          <span>{apt.time}</span>
                          <span className="duration">({apt.duration} min)</span>
                        </div>
                        <div className="today-appointment-info">
                          <div className="patient-name">{apt.patientName}</div>
                          <div className="appointment-type">{apt.type}</div>
                          <div className="appointment-location">{apt.location}</div>
                        </div>
                        <div className="today-appointment-progress">
                          <div className={`progress-badge ${progress.class}`}>
                            {progress.icon} {progress.text}
                          </div>
                          <div className="progress-actions">
                            {actions.map(action => (
                              <button
                                key={action.value}
                                className={`progress-action-btn ${action.value}`}
                                onClick={() => updateProgressStatus(apt.id, action.value)}
                                title={action.label}
                              >
                                {action.icon} {action.label}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="today-appointment-actions">
                          <button 
                            className="edit-mini-btn"
                            onClick={() => handleEditAppointment(apt)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-mini-btn"
                            onClick={() => handleDeleteAppointment(apt.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Left Column - Calendar */}
          <div className="calendar-column">
            <div className="calendar-card">
              <div className="calendar-nav">
                <button onClick={() => changeMonth(-1)}>
                  <FaChevronLeft />
                </button>
                <h3>
                  {currentMonth.toLocaleString('default', { month: 'long' })} {currentMonth.getFullYear()}
                </h3>
                <button onClick={() => changeMonth(1)}>
                  <FaChevronRight />
                </button>
              </div>

              <div className="calendar-grid">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                  <div key={day} className="calendar-weekday">{day}</div>
                ))}
                {getDaysInMonth().map((date, index) => (
                  <div 
                    key={index}
                    className={`calendar-day ${date ? (isToday(date) ? 'today' : '') : ''} ${date && isSelected(date) ? 'selected' : ''}`}
                    onClick={() => date && setSelectedDate(date)}
                  >
                    {date && (
                      <>
                        <span className="day-number">{date.getDate()}</span>
                        {hasAppointments(date) && <div className="appointment-dot"></div>}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Selected Date Appointments */}
            <div className="selected-date-card">
              <h4>
                {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
              </h4>
              {selectedDateAppointments.length === 0 ? (
                <p className="no-appointments-small">No appointments</p>
              ) : (
                selectedDateAppointments.map(apt => (
                  <div key={apt.id} className="mini-appointment">
                    <div className="mini-time">{apt.time}</div>
                    <div className="mini-info">
                      <strong>{apt.patientName}</strong>
                      <small>{apt.type}</small>
                    </div>
                    <div className="mini-actions">
                      <button onClick={() => handleEditAppointment(apt)}>
                        <FaEdit />
                      </button>
                      <button onClick={() => handleDeleteAppointment(apt.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right Column - Upcoming Appointments List */}
          <div className="list-column">
            <div className="upcoming-header">
              <h3>
                <FaBell /> Upcoming (Next 7 Days)
              </h3>
              <div className="search-box-small">
                <FaSearch />
                <input
                  type="text"
                  placeholder="Search patient..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <div className="appointments-table-container">
              <table className="appointments-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Patient</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAppointments.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="no-data">No upcoming appointments</td>
                    </tr>
                  ) : (
                    filteredAppointments.map(apt => (
                      <tr key={apt.id}>
                        <td>{apt.date}</td>
                        <td>{apt.time}</td>
                        <td>
                          <strong>{apt.patientName}</strong>
                          <small>{apt.patientId}</small>
                        </td>
                        <td>{apt.type}</td>
                        <td>{getStatusBadge(apt.status)}</td>
                        <td className="table-actions">
                          <button 
                            className="edit-btn-small"
                            onClick={() => handleEditAppointment(apt)}
                            title="Edit"
                          >
                            <FaEdit />
                          </button>
                          <button 
                            className="delete-btn-small"
                            onClick={() => handleDeleteAppointment(apt.id)}
                            title="Delete"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="appointment-modal-small" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingAppointment ? 'Edit Appointment' : 'New Appointment'}</h3>
              <button className="close-modal" onClick={() => setShowModal(false)}>
                <FaTimes />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-row">
                <div className="form-group">
                  <label>Patient Name</label>
                  <input
                    type="text"
                    placeholder="Full name"
                    value={formData.patientName}
                    onChange={(e) => setFormData({...formData, patientName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Patient ID (National ID) *</label>
                  <input
                    type="text"
                    placeholder="14-digit National ID"
                    value={formData.patientId}
                    onChange={(e) => setFormData({...formData, patientId: e.target.value})}
                    maxLength="14"
                    required
                  />
                  <small>Patient will receive notification on this ID</small>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({...formData, time: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Duration</label>
                  <select
                    value={formData.duration}
                    onChange={(e) => setFormData({...formData, duration: e.target.value})}
                  >
                    <option value="15">15 min</option>
                    <option value="30">30 min</option>
                    <option value="45">45 min</option>
                    <option value="60">60 min</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="Checkup">Checkup</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Location</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="Additional notes..."
                  rows="2"
                />
              </div>

              <div className="form-group">
                <label>Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="scheduled">Scheduled</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="modal-footer">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="save-btn" onClick={handleSaveAppointment}>
                <FaSave /> {editingAppointment ? 'Update' : 'Save & Notify Patient'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorAppointment;