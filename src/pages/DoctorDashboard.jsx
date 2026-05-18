// DoctorDashboard.jsx - الكود الكامل
import Topbar from "../components/Topbar";
import { useState, useEffect } from "react";
import "./DoctorDashboard.css";
import { useNavigate, useLocation } from 'react-router-dom';
import { FaCopy, FaCheck, FaTimes } from 'react-icons/fa';

// مكون DoctorGroup للتعامل مع حالة التوسيع لكل دكتور
const DoctorGroup = ({ doctorGroup, expandedVisit, setExpandedVisit, isDefaultExpanded }) => {
  const [isExpanded, setIsExpanded] = useState(isDefaultExpanded);
  
  const sortedVisits = [...doctorGroup.visits].sort((a, b) => 
    new Date(b.date) - new Date(a.date)
  );
  
  const latestDate = sortedVisits[0]?.date || '';
  
  return (
    <div className="doctor-visits-group">
      <div 
        className="doctor-group-header"
        onClick={() => setIsExpanded(!isExpanded)}
        style={{ cursor: 'pointer' }}
      >
        <div className="doctor-group-info">
          <div className="doctor-name-row">
            <h3>{doctorGroup.doctorName}</h3>
            <span className="doctor-latest-date">Latest: {latestDate}</span>
          </div>
          <p className="doctor-specialty">{doctorGroup.specialty}</p>
        </div>
        <div className="doctor-visit-count">
          <span className="visit-count-badge">
            {sortedVisits.length} {sortedVisits.length === 1 ? 'Visit' : 'Visits'}
          </span>
          <span className="expand-icon-group">
            {isExpanded ? '▲' : '▼'}
          </span>
        </div>
      </div>

      {isExpanded && (
        <div className="doctor-visits-list">
          {sortedVisits.map((visit, visitIndex) => {
            const totalVisits = sortedVisits.length;
            const visitNumber = totalVisits - visitIndex;
            const isSelected = expandedVisit === visit.id;
            
            return (
              <div key={visit.id} className="visit-button-wrapper">
                <div 
                  className={`visit-button ${isSelected ? 'active' : ''}`}
                  onClick={() => setExpandedVisit(isSelected ? null : visit.id)}
                >
                  <span className="visit-button-icon">📋</span>
                  <span className="visit-button-text">Visit {visitNumber}</span>
                  <span className="visit-button-date">{visit.date}</span>
                  <span className="visit-button-arrow">{isSelected ? '▲' : '▼'}</span>
                </div>

                {isSelected && (
                  <div className="visit-details-inside">
                    <div className="visit-header-inside">
                      <div className="visit-date-time-large">
                        📅 {visit.date} | 🕐 {visit.time}
                      </div>
                      <div className="visit-doctor-info-inside">
                        <span className="doctor-name-inside">👨‍⚕️ {visit.doctorName}</span>
                        <span className="doctor-specialty-inside">{visit.specialty}</span>
                      </div>
                    </div>

                    <div className="details-section-inside">
                      <h4>📋 Diagnosis</h4>
                      <p className="diagnosis-text-inside">{visit.diagnosis}</p>
                    </div>

                    <div className="details-section-inside">
                      <h4>❤️ Vital Signs</h4>
                      <div className="vital-grid-inside">
                        <div className="vital-item-inside">
                          <span className="vital-label-inside">Blood Pressure:</span>
                          <span className="vital-value-inside">{visit.bloodPressure || 'Not recorded'}</span>
                        </div>
                        <div className="vital-item-inside">
                          <span className="vital-label-inside">Heart Rate:</span>
                          <span className="vital-value-inside">{visit.heartRate || 'Not recorded'}</span>
                        </div>
                        <div className="vital-item-inside">
                          <span className="vital-label-inside">Temperature:</span>
                          <span className="vital-value-inside">{visit.temperature || 'Not recorded'}</span>
                        </div>
                      </div>
                    </div>

                    {visit.medications.length > 0 && (
                      <div className="details-section-inside">
                        <h4>💊 Prescribed Medications</h4>
                        <div className="medications-list-inside">
                          {visit.medications.map((med, idx) => (
                            <div key={idx} className="medication-item-detail-inside">
                              <span className="med-name-detail-inside">{med.name}</span>
                              <span className="med-dosage-inside">{med.dosage}</span>
                              <span className="med-duration-inside">{med.duration}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visit.labResults.length > 0 && (
                      <div className="details-section-inside">
                        <h4>🔬 Lab Results</h4>
                        <div className="lab-items-list-inside">
                          {visit.labResults.map((lab, idx) => (
                            <div key={idx} className="lab-item-detail-inside">
                              <span>🧪</span>
                              <span>{lab}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visit.radiology.length > 0 && (
                      <div className="details-section-inside">
                        <h4>🩻 Imaging / Radiology</h4>
                        <div className="radiology-items-list-inside">
                          {visit.radiology.map((scan, idx) => (
                            <div key={idx} className="radiology-item-detail-inside">
                              <span>📷</span>
                              <span>{scan}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {visit.notes && (
                      <div className="details-section-inside">
                        <h4>📝 Doctor's Notes</h4>
                        <p className="doctor-notes-inside">{visit.notes}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

function DoctorDashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const [nationalId, setNationalId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patientNotFound, setPatientNotFound] = useState(false);
  const [expandedVisit, setExpandedVisit] = useState(null);
  const [showAddVisit, setShowAddVisit] = useState(false);
  const [showCreatePatient, setShowCreatePatient] = useState(false);
  
  // State for showing patient credentials modal
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);
  const [newPatientCredentials, setNewPatientCredentials] = useState({
    fullName: "",
    nationalId: "",
    password: "",
    message: ""
  });
  const [copiedField, setCopiedField] = useState(null);

  const [patients, setPatients] = useState([
    {
      id: 1,
      nationalId: "12345678901234",
      fullName: "Elena Rodriguez",
      phone: "+1 (555) 123-4567",
      email: "elena@example.com",
      dateOfBirth: "1982-03-15",
      age: 42,
      gender: "Female",
      emergencyContact: "John Rodriguez",
      emergencyRelation: "Spouse",
      emergencyPhone: "+1 (555) 987-6543",
      bloodType: "O+",
      chronicConditions: ["Hypertension", "Type 2 Diabetes"],
      allergies: ["Penicillin", "Aspirin"],
      visits: [
        {
          id: 1,
          doctorName: "Dr. Ahmed Mahmoud",
          specialty: "Consultant Cardiologist",
          date: "2023-10-12",
          time: "10:30 PM",
          diagnosis: "Severe chest pain with throat inflammation",
          bloodPressure: "145/90",
          heartRate: "88 bpm",
          temperature: "37.2°C",
          medications: [
            { name: "Lisinopril", dosage: "10mg", duration: "Once daily" },
            { name: "Metformin", dosage: "500mg", duration: "Twice daily" }
          ],
          labResults: ["Complete Blood Count (CBC)", "Lipid Profile"],
          radiology: ["Chest X-Ray"],
          notes: "Patient advised to reduce salt intake. Follow up in 2 weeks."
        },
        {
          id: 2,
          doctorName: "Dr. Sarah Jenkins",
          specialty: "Endocrinologist",
          date: "2024-01-15",
          time: "09:00 AM",
          diagnosis: "Diabetes follow-up",
          bloodPressure: "128/82",
          heartRate: "76 bpm",
          temperature: "36.8°C",
          medications: [
            { name: "Atorvastatin", dosage: "20mg", duration: "Once daily" }
          ],
          labResults: ["HbA1c: 6.8%", "Fasting Blood Sugar: 110 mg/dL"],
          radiology: [],
          notes: "Continue current medications. Follow up in 3 months."
        }
      ]
    }
  ]);

  // استقبال المريض من صفحة Medical Record عند العودة
  useEffect(() => {
    if (location.state && location.state.selectedPatient) {
      setSelectedPatient(location.state.selectedPatient);
      setPatientNotFound(false);
      setShowCreatePatient(false);
      setExpandedVisit(null);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Generate random password function
  const generateRandomPassword = () => {
    const length = 8;
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };

  // Copy to clipboard function
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Copy all credentials
  const copyAllCredentials = () => {
    const allCredentials = `Patient: ${newPatientCredentials.fullName}\nUsername (National ID): ${newPatientCredentials.nationalId}\nPassword: ${newPatientCredentials.password}`;
    navigator.clipboard.writeText(allCredentials);
    setCopiedField("all");
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Medication Database
  const medicationsDatabase = [
    "Lisinopril", "Metformin", "Atorvastatin", "Amoxicillin", "Hydrochlorothiazide",
    "Losartan", "Levothyroxine", "Albuterol", "Gabapentin", "Omeprazole",
    "Simvastatin", "Amlodipine", "Metoprolol", "Prednisone", "Tramadol",
    "Citalopram", "Ibuprofen", "Acetaminophen", "Naproxen", "Aspirin",
    "Warfarin", "Clopidogrel", "Furosemide", "Spironolactone", "Carvedilol",
    "Insulin", "Glipizide", "Januvia", "Jardiance", "Farxiga"
  ];

  const dosageOptions = [
    "2.5mg", "5mg", "10mg", "20mg", "50mg", "100mg",
    "250mg", "500mg", "1000mg", "2g",
    "1 spray", "1 drop", "2 drops"
  ];

  const durationOptions = [
    "Once daily", "Twice daily", "Three times daily",
    "Every 4 hours", "Every 6 hours", "Every 8 hours", "Every 12 hours",
    "Every other day",
    "As needed (PRN)", "Before meals", "After meals", "With food",
    "On empty stomach", "At bedtime", "In the morning"
  ];

  const [medicationSearch, setMedicationSearch] = useState("");
  const [showMedicationDropdown, setShowMedicationDropdown] = useState(false);
  const [dosageSearch, setDosageSearch] = useState("");
  const [showDosageDropdown, setShowDosageDropdown] = useState(false);
  const [durationSearch, setDurationSearch] = useState("");
  const [showDurationDropdown, setShowDurationDropdown] = useState(false);

  const filteredMedications = medicationsDatabase.filter(med =>
    med.toLowerCase().includes(medicationSearch.toLowerCase())
  );

  const filteredDosages = dosageOptions.filter(dose =>
    dose.toLowerCase().includes(dosageSearch.toLowerCase())
  );

  const filteredDurations = durationOptions.filter(dur =>
    dur.toLowerCase().includes(durationSearch.toLowerCase())
  );

  const [newPatient, setNewPatient] = useState({
    nationalId: "",
    fullName: "",
    phone: "",
    email: "",
    dateOfBirth: "",
    gender: "Male",
    emergencyContact: "",
    emergencyRelation: "",
    emergencyPhone: "",
    bloodType: "A+",
    chronicConditions: "",
    allergies: ""
  });

  const [newVisit, setNewVisit] = useState({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    diagnosis: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    medications: [],
    labResults: [],
    radiology: [],
    notes: ""
  });

  const [newMedication, setNewMedication] = useState({ name: "", dosage: "", duration: "" });
  const [newLab, setNewLab] = useState("");
  const [newScan, setNewScan] = useState("");

  const getLoggedInDoctor = () => {
    const doctorData = localStorage.getItem("doctorLoggedIn");
    if (doctorData) {
      return JSON.parse(doctorData);
    }
    return { name: "Dr. Ahmed Mahmoud", specialty: "Consultant Cardiologist" };
  };

  const getCurrentDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const getCurrentTime = () => {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  const openAddVisitModal = () => {
    const loggedInDoctor = getLoggedInDoctor();
    setNewVisit({
      ...newVisit,
      doctorName: loggedInDoctor.name,
      specialty: loggedInDoctor.specialty,
      date: getCurrentDate(),
      time: getCurrentTime()
    });
    setShowAddVisit(true);
  };

  const handleSearch = () => {
    const found = patients.find(p => p.nationalId === nationalId);
    if (found) {
      setSelectedPatient(found);
      setPatientNotFound(false);
      setExpandedVisit(null);
      setShowCreatePatient(false);
    } else {
      setSelectedPatient(null);
      setPatientNotFound(true);
      setNewPatient({ ...newPatient, nationalId: nationalId });
    }
  };

  const handleCreatePatient = () => {
    let age = 0;
    if (newPatient.dateOfBirth) {
      const birthDate = new Date(newPatient.dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
    }

    // Generate random password for patient
    const generatedPassword = generateRandomPassword();

    const patientToAdd = {
      id: patients.length + 1,
      nationalId: newPatient.nationalId,
      fullName: newPatient.fullName,
      phone: newPatient.phone,
      email: newPatient.email,
      dateOfBirth: newPatient.dateOfBirth,
      age: age,
      gender: newPatient.gender,
      emergencyContact: newPatient.emergencyContact,
      emergencyRelation: newPatient.emergencyRelation,
      emergencyPhone: newPatient.emergencyPhone,
      bloodType: newPatient.bloodType,
      chronicConditions: newPatient.chronicConditions ? newPatient.chronicConditions.split(',').map(c => c.trim()) : [],
      allergies: newPatient.allergies ? newPatient.allergies.split(',').map(a => a.trim()) : [],
      visits: [],
      password: generatedPassword
    };

    // Save patient to localStorage for patient login
    const existingPatients = JSON.parse(localStorage.getItem("patients") || "[]");
    existingPatients.push(patientToAdd);
    localStorage.setItem("patients", JSON.stringify(existingPatients));

    // Also save to patient logins for authentication
    const patientLogins = JSON.parse(localStorage.getItem("patientLogins") || "[]");
    patientLogins.push({
      nationalId: newPatient.nationalId,
      password: generatedPassword,
      fullName: newPatient.fullName,
      createdAt: new Date().toISOString()
    });
    localStorage.setItem("patientLogins", JSON.stringify(patientLogins));

    setPatients([...patients, patientToAdd]);
    setSelectedPatient(patientToAdd);
    setPatientNotFound(false);
    setShowCreatePatient(false);
    
    // Show credentials modal
    setNewPatientCredentials({
      fullName: newPatient.fullName,
      nationalId: newPatient.nationalId,
      password: generatedPassword,
      message: "Patient account created successfully!"
    });
    setShowCredentialsModal(true);
    
    setNewPatient({
      nationalId: "",
      fullName: "",
      phone: "",
      email: "",
      dateOfBirth: "",
      gender: "Male",
      emergencyContact: "",
      emergencyRelation: "",
      emergencyPhone: "",
      bloodType: "A+",
      chronicConditions: "",
      allergies: ""
    });
  };

  const handleAddMedication = () => {
    if (newMedication.name) {
      setNewVisit({
        ...newVisit,
        medications: [...newVisit.medications, { ...newMedication }]
      });
      setNewMedication({ name: "", dosage: "", duration: "" });
      setMedicationSearch("");
      setDosageSearch("");
      setDurationSearch("");
    }
  };

  const selectMedication = (medName) => {
    setNewMedication({ ...newMedication, name: medName });
    setMedicationSearch(medName);
    setShowMedicationDropdown(false);
  };

  const selectDosage = (dosage) => {
    setNewMedication({ ...newMedication, dosage: dosage });
    setDosageSearch(dosage);
    setShowDosageDropdown(false);
  };

  const selectDuration = (duration) => {
    setNewMedication({ ...newMedication, duration: duration });
    setDurationSearch(duration);
    setShowDurationDropdown(false);
  };

  const handleAddLab = () => {
    if (newLab) {
      setNewVisit({
        ...newVisit,
        labResults: [...newVisit.labResults, newLab]
      });
      setNewLab("");
    }
  };

  const handleAddRadiology = () => {
    if (newScan) {
      setNewVisit({
        ...newVisit,
        radiology: [...newVisit.radiology, newScan]
      });
      setNewScan("");
    }
  };

// في DoctorDashboard.jsx، قم بتعديل دالة handleSaveVisit

// DoctorDashboard.jsx - دالة handleSaveVisit الكاملة المعدلة

const handleSaveVisit = () => {
  const loggedInDoctor = getLoggedInDoctor();
  
  // التأكد من وجود بيانات المريض
  if (!selectedPatient) {
    alert("No patient selected");
    return;
  }
  
  const newVisitWithId = {
    id: Date.now(), // استخدام timestamp لتجنب تكرار المعرفات
    doctorName: newVisit.doctorName || loggedInDoctor.name,
    specialty: newVisit.specialty || loggedInDoctor.specialty,
    date: newVisit.date || getCurrentDate(),
    time: newVisit.time || getCurrentTime(),
    diagnosis: newVisit.diagnosis,
    bloodPressure: newVisit.bloodPressure,
    heartRate: newVisit.heartRate,
    temperature: newVisit.temperature,
    medications: newVisit.medications,
    labResults: newVisit.labResults,
    radiology: newVisit.radiology,
    notes: newVisit.notes
  };
  
  // تحديث المريض في localStorage
  const allPatients = JSON.parse(localStorage.getItem("patients") || "[]");
  const patientIndex = allPatients.findIndex(p => p.nationalId === selectedPatient.nationalId);
  
  let updatedPatient;
  if (patientIndex !== -1) {
    updatedPatient = {
      ...allPatients[patientIndex],
      visits: [newVisitWithId, ...(allPatients[patientIndex].visits || [])]
    };
    allPatients[patientIndex] = updatedPatient;
  } else {
    updatedPatient = {
      ...selectedPatient,
      visits: [newVisitWithId, ...(selectedPatient.visits || [])]
    };
    allPatients.push(updatedPatient);
  }
  
  localStorage.setItem("patients", JSON.stringify(allPatients));
  
  // تحديث الـ state المحلي
  setPatients(allPatients);
  setSelectedPatient(updatedPatient);
  setShowAddVisit(false);
  
  // إرسال إشعار للمريض
  const doctorData = localStorage.getItem("doctorLoggedIn");
  let doctorName = loggedInDoctor.name;
  if (doctorData) {
    const parsed = JSON.parse(doctorData);
    doctorName = parsed.name || doctorName;
  }
  
  const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
  
  const formattedDate = new Date(newVisitWithId.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  const newNotification = {
    id: Date.now(),
    patientId: selectedPatient.nationalId,
    patientName: selectedPatient.fullName,
    type: "new_visit",
    message: `📋 New medical visit added by ${doctorName} on ${formattedDate}`,
    details: `Diagnosis: ${newVisitWithId.diagnosis.substring(0, 100)}${newVisitWithId.diagnosis.length > 100 ? '...' : ''}`,
    date: new Date().toISOString(),
    time: "Just now",
    read: false,
    visitDetails: newVisitWithId
  };
  
  existingNotifications.push(newNotification);
  localStorage.setItem("patientNotifications", JSON.stringify(existingNotifications));
  
  // إعادة تعيين النموذج
  setNewVisit({
    doctorName: "",
    specialty: "",
    date: "",
    time: "",
    diagnosis: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
    medications: [],
    labResults: [],
    radiology: [],
    notes: ""
  });
  
  alert(`✓ Visit added successfully!\n\nPatient ${selectedPatient.fullName} can now see this visit in their portal.\n\nA notification has been sent to the patient.`);
};
// دالة إرسال إشعار للمريض عند إضافة زيارة
const sendNotificationToPatient = (patientId, patientName, visit) => {
  const doctorData = localStorage.getItem("doctorLoggedIn");
  let doctorName = "Dr. Ahmed Mahmoud";
  if (doctorData) {
    const parsed = JSON.parse(doctorData);
    doctorName = parsed.name || doctorName;
  }
  
  const existingNotifications = JSON.parse(localStorage.getItem("patientNotifications") || "[]");
  
  const newNotification = {
    id: Date.now(),
    patientId: patientId,
    patientName: patientName,
    type: "new_visit",
    message: `New medical visit added by ${doctorName} on ${visit.date}. Diagnosis: ${visit.diagnosis.substring(0, 50)}...`,
    date: new Date().toISOString(),
    time: "Just now",
    read: false,
    visitDetails: visit
  };
  
  existingNotifications.push(newNotification);
  localStorage.setItem("patientNotifications", JSON.stringify(existingNotifications));
};

  const handleViewSummary = () => {
    navigate('/medical-records', { state: { patient: selectedPatient } });
  };

  return (
    <div className="dashboard-page">
      <Topbar />

      <div className="dashboard-content">
        <div className="search-card">
          <h2>Search Patient by National ID</h2>
          <div className="search-box">
            <input
              type="text"
              placeholder="Enter 14-digit National ID..."
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <button onClick={handleSearch}>Search</button>
          </div>

          {patientNotFound && (
            <div className="not-found">
              <p>No records found for ID: {nationalId}</p>
              <button className="create-patient-btn" onClick={() => setShowCreatePatient(true)}>
                Create New Patient
              </button>
            </div>
          )}
        </div>

        {selectedPatient && !showCreatePatient && (
          <div className="patient-profile">
            <div className="patient-header">
              <h1>UNIFIED MEDICAL RECORD</h1>
              <div className="patient-info-row">
                <div className="patient-name">{selectedPatient.fullName}</div>
                <div className="patient-meta">
                  <span>ID: {selectedPatient.nationalId}</span>
                  <span>Age: {selectedPatient.age} years</span>
                  <span>Blood Type: {selectedPatient.bloodType}</span>
                  <span>{selectedPatient.gender}</span>
                </div>
              </div>
              
              <div className="medical-history-section">
                <h3>Medical History</h3>
                <div className="conditions-tags">
                  {selectedPatient.chronicConditions.length > 0 ? (
                    selectedPatient.chronicConditions.map((condition, idx) => (
                      <span key={idx} className="condition-tag">{condition}</span>
                    ))
                  ) : (
                    <span className="empty-tag">No chronic conditions</span>
                  )}
                </div>
                <div className="allergies-tags">
                  {selectedPatient.allergies.length > 0 ? (
                    selectedPatient.allergies.map((allergy, idx) => (
                      <span key={idx} className="allergy-tag">{allergy}</span>
                    ))
                  ) : (
                    <span className="empty-tag">No known allergies</span>
                  )}
                </div>
              </div>
            </div>

            <div className="button-group">
              <button className="add-visit-btn" onClick={openAddVisitModal}>
                + Add New Visit
              </button>
              <button className="add-medical-record-btn" onClick={handleViewSummary}>
                View Summary
              </button>
            </div>

            <div className="visit-timeline">
              <h2 className="timeline-title">Visit History Timeline</h2>
              
              {selectedPatient.visits.length === 0 ? (
                <div className="no-visits">
                  <p>No visits yet. Click "Add New Visit" to create the first medical record.</p>
                </div>
              ) : (
                (() => {
                  const visitsByDoctor = {};
                  selectedPatient.visits.forEach(visit => {
                    if (!visitsByDoctor[visit.doctorName]) {
                      visitsByDoctor[visit.doctorName] = {
                        doctorName: visit.doctorName,
                        specialty: visit.specialty,
                        visits: []
                      };
                    }
                    visitsByDoctor[visit.doctorName].visits.push(visit);
                  });

                  const doctorGroups = Object.values(visitsByDoctor);
                  
                  doctorGroups.sort((a, b) => {
                    const aLatest = Math.max(...a.visits.map(v => new Date(v.date).getTime()));
                    const bLatest = Math.max(...b.visits.map(v => new Date(v.date).getTime()));
                    return bLatest - aLatest;
                  });

                  return doctorGroups.map((doctorGroup, groupIndex) => (
                    <DoctorGroup 
                      key={doctorGroup.doctorName}
                      doctorGroup={doctorGroup}
                      expandedVisit={expandedVisit}
                      setExpandedVisit={setExpandedVisit}
                      isDefaultExpanded={groupIndex === 0}
                    />
                  ));
                })()
              )}
            </div>
          </div>
        )}
      </div>

      {/* Create Patient Modal */}
      {showCreatePatient && (
        <div className="modal-overlay" onClick={() => setShowCreatePatient(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Patient</h2>
            <p className="modal-subtitle">Register a new patient into the Unified Medical System.</p>

            <div className="form-section">
              <h3>Patient Identification</h3>
              <div className="form-group">
                <label>National ID (14 Digits)</label>
                <input 
                  type="text" 
                  placeholder="e.g., 29001011234567" 
                  value={newPatient.nationalId}
                  onChange={(e) => setNewPatient({...newPatient, nationalId: e.target.value})}
                  maxLength="14"
                />
                <small>Verify the ID checks if the record already exists to prevent duplication.</small>
              </div>
            </div>

            <div className="form-section">
              <h3>Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    placeholder="As written in official documents" 
                    value={newPatient.fullName}
                    onChange={(e) => setNewPatient({...newPatient, fullName: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input 
                    type="tel" 
                    placeholder="+1 (555) 000-0000" 
                    value={newPatient.phone}
                    onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    placeholder="example@portal.com" 
                    value={newPatient.email}
                    onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input 
                    type="date" 
                    value={newPatient.dateOfBirth}
                    onChange={(e) => setNewPatient({...newPatient, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Gender</label>
                  <select value={newPatient.gender} onChange={(e) => setNewPatient({...newPatient, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Emergency Info</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Contact Name</label>
                  <input 
                    type="text" 
                    placeholder="Full Name" 
                    value={newPatient.emergencyContact}
                    onChange={(e) => setNewPatient({...newPatient, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Relationship</label>
                  <input 
                    type="text" 
                    placeholder="e.g., Spouse, Parent" 
                    value={newPatient.emergencyRelation}
                    onChange={(e) => setNewPatient({...newPatient, emergencyRelation: e.target.value})}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  placeholder="Emergency Phone" 
                  value={newPatient.emergencyPhone}
                  onChange={(e) => setNewPatient({...newPatient, emergencyPhone: e.target.value})}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Medical Fundamentals</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Blood Type</label>
                  <select value={newPatient.bloodType} onChange={(e) => setNewPatient({...newPatient, bloodType: e.target.value})}>
                    <option>A+</option><option>A-</option><option>B+</option><option>B-</option>
                    <option>O+</option><option>O-</option><option>AB+</option><option>AB-</option>
                  </select>
                </div>
              </div>
              <div className="form-group">
                <label>Chronic Conditions</label>
                <input 
                  type="text" 
                  placeholder="e.g., Diabetes, Hypertension (separate with commas)" 
                  value={newPatient.chronicConditions}
                  onChange={(e) => setNewPatient({...newPatient, chronicConditions: e.target.value})}
                />
              </div>
              <div className="form-group">
                <label>Allergies</label>
                <input 
                  type="text" 
                  placeholder="List any known allergies (e.g., Penicillin, Peanuts)" 
                  value={newPatient.allergies}
                  onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                />
              </div>
            </div>

            <div className="data-security">
              <p>🔒 All information entered here is protected under institutional health standards.</p>
            </div>

            <div className="modal-buttons">
              <button className="clear-btn" onClick={() => {
                setNewPatient({
                  nationalId: "",
                  fullName: "",
                  phone: "",
                  email: "",
                  dateOfBirth: "",
                  gender: "Male",
                  emergencyContact: "",
                  emergencyRelation: "",
                  emergencyPhone: "",
                  bloodType: "A+",
                  chronicConditions: "",
                  allergies: ""
                });
              }}>Clear All Fields</button>
              <button className="cancel-btn" onClick={() => setShowCreatePatient(false)}>Cancel</button>
              <button className="create-btn" onClick={handleCreatePatient}>Create Patient Profile</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Credentials Modal */}
      {showCredentialsModal && (
        <div className="modal-overlay" onClick={() => setShowCredentialsModal(false)}>
          <div className="credentials-modal" onClick={(e) => e.stopPropagation()}>
            <div className="credentials-modal-header">
              <h2>
                <span className="success-icon">✓</span> Patient Account Created!
              </h2>
              <button className="close-credentials" onClick={() => setShowCredentialsModal(false)}>
                <FaTimes />
              </button>
            </div>
            
            <div className="credentials-modal-body">
              <div className="patient-info-display">
                <p><strong>Patient:</strong> {newPatientCredentials.fullName}</p>
              </div>
              
              <div className="credential-item">
                <div className="credential-label">Username (National ID):</div>
                <div className="credential-value-wrapper">
                  <code className="credential-value">{newPatientCredentials.nationalId}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(newPatientCredentials.nationalId, 'username')}
                  >
                    {copiedField === 'username' ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              
              <div className="credential-item">
                <div className="credential-label">Password:</div>
                <div className="credential-value-wrapper">
                  <code className="credential-value">{newPatientCredentials.password}</code>
                  <button 
                    className="copy-btn"
                    onClick={() => copyToClipboard(newPatientCredentials.password, 'password')}
                  >
                    {copiedField === 'password' ? <FaCheck /> : <FaCopy />}
                  </button>
                </div>
              </div>
              
              <div className="credentials-warning">
                <span className="warning-icon">⚠️</span>
                <p>Please provide these credentials to the patient. They will use them to login to their account.</p>
              </div>
            </div>
            
            <div className="credentials-modal-footer">
              <button 
                className="copy-all-btn"
                onClick={copyAllCredentials}
              >
                {copiedField === 'all' ? <FaCheck /> : <FaCopy />} Copy Credentials
              </button>
              <button 
                className="close-credentials-btn"
                onClick={() => setShowCredentialsModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Visit Modal */}
      {showAddVisit && (
        <div className="modal-overlay" onClick={() => setShowAddVisit(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h2>Add New Visit</h2>
            
            <div className="form-section">
              <h3>Doctor Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Doctor Name</label>
                  <input 
                    type="text" 
                    placeholder="Doctor Name" 
                    value={newVisit.doctorName}
                    onChange={(e) => setNewVisit({...newVisit, doctorName: e.target.value})}
                  />
                  <small style={{color: '#10b981', fontSize: '10px', marginTop: '4px', display: 'block'}}>
                    ✓ Auto-filled from your profile
                  </small>
                </div>
                <div className="form-group">
                  <label>Specialty</label>
                  <input 
                    type="text" 
                    placeholder="Specialty" 
                    value={newVisit.specialty}
                    onChange={(e) => setNewVisit({...newVisit, specialty: e.target.value})}
                  />
                  <small style={{color: '#10b981', fontSize: '10px', marginTop: '4px', display: 'block'}}>
                    ✓ Auto-filled from your profile
                  </small>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Visit Date & Time</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input 
                    type="date" 
                    value={newVisit.date}
                    onChange={(e) => setNewVisit({...newVisit, date: e.target.value})}
                  />
                  <small style={{color: '#10b981', fontSize: '10px', marginTop: '4px', display: 'block'}}>
                    ✓ Today's date auto-filled
                  </small>
                </div>
                <div className="form-group">
                  <label>Time</label>
                  <input 
                    type="time" 
                    value={newVisit.time}
                    onChange={(e) => setNewVisit({...newVisit, time: e.target.value})}
                  />
                  <small style={{color: '#10b981', fontSize: '10px', marginTop: '4px', display: 'block'}}>
                    ✓ Current time auto-filled
                  </small>
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Diagnosis</h3>
              <textarea 
                placeholder="Enter diagnosis..."
                value={newVisit.diagnosis}
                onChange={(e) => setNewVisit({...newVisit, diagnosis: e.target.value})}
              />
            </div>

            <div className="form-section">
              <h3>Vital Signs</h3>
              <div className="form-row three-col">
                <div className="form-group">
                  <label>Blood Pressure</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 120/80" 
                    value={newVisit.bloodPressure}
                    onChange={(e) => setNewVisit({...newVisit, bloodPressure: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Heart Rate</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 72 bpm" 
                    value={newVisit.heartRate}
                    onChange={(e) => setNewVisit({...newVisit, heartRate: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Temperature</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 36.6°C" 
                    value={newVisit.temperature}
                    onChange={(e) => setNewVisit({...newVisit, temperature: e.target.value})}
                  />
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3>Medications</h3>
              <div className="medication-input-group">
                <div style={{display: 'flex', gap: '10px', alignItems: 'flex-end', flexWrap: 'wrap'}}>
                  <div className="form-group" style={{flex: 2, position: 'relative', marginBottom: '0'}}>
                    <label>Medication Name</label>
                    <input 
                      type="text" 
                      placeholder="Search or type medication name..." 
                      value={medicationSearch}
                      onChange={(e) => {
                        setMedicationSearch(e.target.value);
                        setShowMedicationDropdown(true);
                        setNewMedication({...newMedication, name: e.target.value});
                      }}
                      onFocus={() => setShowMedicationDropdown(true)}
                      onBlur={() => setTimeout(() => setShowMedicationDropdown(false), 200)}
                    />
                    {showMedicationDropdown && filteredMedications.length > 0 && (
                      <div className="search-dropdown">
                        {filteredMedications.slice(0, 10).map((med, idx) => (
                          <div key={idx} className="dropdown-item" onClick={() => selectMedication(med)}>
                            {med}
                          </div>
                        ))}
                        {medicationSearch && !medicationsDatabase.includes(medicationSearch) && (
                          <div className="dropdown-item-custom" onClick={() => selectMedication(medicationSearch)}>
                            + Add "{medicationSearch}" as new medication
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{flex: 1, position: 'relative', marginBottom: '0'}}>
                    <label>Dosage</label>
                    <input 
                      type="text" 
                      placeholder="Dosage..." 
                      value={dosageSearch}
                      onChange={(e) => {
                        setDosageSearch(e.target.value);
                        setShowDosageDropdown(true);
                        setNewMedication({...newMedication, dosage: e.target.value});
                      }}
                      onFocus={() => setShowDosageDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDosageDropdown(false), 200)}
                    />
                    {showDosageDropdown && filteredDosages.length > 0 && (
                      <div className="search-dropdown">
                        {filteredDosages.slice(0, 8).map((dose, idx) => (
                          <div key={idx} className="dropdown-item" onClick={() => selectDosage(dose)}>
                            {dose}
                          </div>
                        ))}
                        {dosageSearch && !dosageOptions.includes(dosageSearch) && (
                          <div className="dropdown-item-custom" onClick={() => selectDosage(dosageSearch)}>
                            + Add "{dosageSearch}" as custom dosage
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="form-group" style={{flex: 1.5, position: 'relative', marginBottom: '0'}}>
                    <label>Duration / Frequency</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Once daily..." 
                      value={durationSearch}
                      onChange={(e) => {
                        setDurationSearch(e.target.value);
                        setShowDurationDropdown(true);
                        setNewMedication({...newMedication, duration: e.target.value});
                      }}
                      onFocus={() => setShowDurationDropdown(true)}
                      onBlur={() => setTimeout(() => setShowDurationDropdown(false), 200)}
                    />
                    {showDurationDropdown && filteredDurations.length > 0 && (
                      <div className="search-dropdown">
                        {filteredDurations.slice(0, 8).map((dur, idx) => (
                          <div key={idx} className="dropdown-item" onClick={() => selectDuration(dur)}>
                            {dur}
                          </div>
                        ))}
                        {durationSearch && !durationOptions.includes(durationSearch) && (
                          <div className="dropdown-item-custom" onClick={() => selectDuration(durationSearch)}>
                            + Add "{durationSearch}" as custom frequency
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <button 
                    type="button" 
                    className="add-medication-btn"
                    onClick={handleAddMedication}
                  >
                    Add
                  </button>
                </div>
              </div>
              <div className="added-items" style={{marginTop: '12px'}}>
                {newVisit.medications.map((med, idx) => (
                  <span key={idx} className="added-tag">
                    {med.name} ({med.dosage}) - {med.duration}
                  </span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Lab Results</h3>
              <div className="add-item-row">
                <input 
                  type="text" 
                  placeholder="Lab test name" 
                  value={newLab}
                  onChange={(e) => setNewLab(e.target.value)}
                />
                <button type="button" onClick={handleAddLab}>Add</button>
              </div>
              <div className="added-items">
                {newVisit.labResults.map((lab, idx) => (
                  <span key={idx} className="added-tag">{lab}</span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Imaging / Radiology</h3>
              <div className="add-item-row">
                <input 
                  type="text" 
                  placeholder="Scan type" 
                  value={newScan}
                  onChange={(e) => setNewScan(e.target.value)}
                />
                <button type="button" onClick={handleAddRadiology}>Add</button>
              </div>
              <div className="added-items">
                {newVisit.radiology.map((scan, idx) => (
                  <span key={idx} className="added-tag">{scan}</span>
                ))}
              </div>
            </div>

            <div className="form-section">
              <h3>Additional Notes</h3>
              <textarea 
                placeholder="Doctor's notes and recommendations..."
                value={newVisit.notes}
                onChange={(e) => setNewVisit({...newVisit, notes: e.target.value})}
              />
            </div>

            <div className="modal-buttons">
              <button onClick={() => setShowAddVisit(false)}>Cancel</button>
              <button onClick={handleSaveVisit}>Save Visit</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DoctorDashboard;