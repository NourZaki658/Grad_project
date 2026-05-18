// MedicalRecord.jsx - الكود الكامل بعد التعديل
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  FaArrowLeft, 
  FaEye, 
  FaFlask,
  FaXRay,
  FaPills,
  FaStethoscope,
  FaChevronDown,
  FaChevronUp,
  FaRegFileAlt,
  FaUserMd,
  FaCalendarAlt,
  FaNotesMedical,
  FaHeartbeat,
  FaChartLine,
  FaFilePdf,
  FaClock,
  FaTimes,
  FaDownload,
  FaPrint,
  FaSignOutAlt,
  FaUserEdit,
  FaLock
} from 'react-icons/fa';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import './MedicalRecord.css';

const MedicalRecord = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showPdfViewer, setShowPdfViewer] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    medications: true,
    labs: true,
    radiology: true,
    diagnoses: true
  });
  const [labFiles, setLabFiles] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [doctor, setDoctor] = useState({
    name: "Dr. Sarah Johnson",
    specialty: "Cardiologist",
    email: "sarah.johnson@medtrack.com"
  });
  
  const [patient, setPatient] = useState(null);

  // Load doctor data from localStorage
  useEffect(() => {
    const doctorData = localStorage.getItem("doctorLoggedIn");
    if (doctorData) {
      const parsed = JSON.parse(doctorData);
      setDoctor({
        name: parsed.name || "Dr. Sarah Johnson",
        specialty: parsed.specialty || "Cardiologist",
        email: parsed.email || "doctor@medtrack.com"
      });
    }
  }, []);

  // Get initials for avatar
  const getInitials = () => {
    const name = doctor.name;
    let cleanName = name.replace(/^Dr\.\s*/, "");
    const parts = cleanName.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // Load lab files from localStorage
  useEffect(() => {
    const savedTests = localStorage.getItem('labTests');
    if (savedTests) {
      setLabFiles(JSON.parse(savedTests));
    }
  }, []);

  useEffect(() => {
    if (location.state && location.state.patient) {
      setPatient(location.state.patient);
    } else {
      navigate('/dashboard');
    }
  }, [location, navigate]);

  // دالة الرجوع إلى Dashboard مع حفظ بيانات المريض
  const handleBackToDashboard = () => {
    navigate('/dashboard', { 
      state: { 
        selectedPatient: patient,
        preservePatient: true 
      } 
    });
  };

  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section]
    });
  };

  const handleProfileClick = () => {
    setShowProfileMenu(!showProfileMenu);
  };

  const handleViewProfile = () => {
    setShowProfileMenu(false);
    navigate('/doctor/profile');
  };

  const handleChangePassword = () => {
    setShowProfileMenu(false);
    navigate('/doctor/change-password');
  };

  const handleLogout = () => {
    localStorage.removeItem("doctorLoggedIn");
    setShowProfileMenu(false);
    navigate('/');
  };

  // Get file status for a specific lab test
  const getFileStatus = (testName, date, doctorName) => {
    const foundFile = labFiles.find(file => 
      file.patientId === patient?.nationalId &&
      file.testName.toLowerCase() === testName.toLowerCase() &&
      file.status === 'completed'
    );
    return foundFile;
  };

  // Extract blood pressure data from visits
  const getBloodPressureData = () => {
    if (!patient || !patient.visits) return [];
    const data = [];
    patient.visits.forEach(visit => {
      if (visit.bloodPressure && visit.date) {
        const bpParts = visit.bloodPressure.split('/');
        const systolic = parseInt(bpParts[0]);
        const diastolic = parseInt(bpParts[1]);
        if (!isNaN(systolic) && !isNaN(diastolic)) {
          data.push({
            date: visit.date,
            systolic: systolic,
            diastolic: diastolic,
            visit: visit.doctorName
          });
        }
      }
    });
    return data.sort((a, b) => new Date(a.date) - new Date(b.date));
  };

  // Extract all unique medications from all visits
  const getAllMedications = () => {
    if (!patient || !patient.visits) return [];
    const medications = [];
    patient.visits.forEach(visit => {
      if (visit.medications && visit.medications.length > 0) {
        visit.medications.forEach(med => {
          medications.push({
            ...med,
            prescribedBy: visit.doctorName,
            prescribedDate: visit.date
          });
        });
      }
    });
    return medications;
  };

  // Extract all lab results with file status
  const getAllLabResults = () => {
    if (!patient || !patient.visits) return [];
    const labs = [];
    patient.visits.forEach(visit => {
      if (visit.labResults && visit.labResults.length > 0) {
        visit.labResults.forEach(lab => {
          const fileStatus = getFileStatus(lab, visit.date, visit.doctorName);
          labs.push({
            name: lab,
            date: visit.date,
            requestedBy: visit.doctorName,
            hasFile: !!fileStatus,
            fileUrl: fileStatus?.fileUrl,
            fileName: fileStatus?.fileName,
            uploadedDate: fileStatus?.uploadedDate,
            notes: fileStatus?.notes,
            status: fileStatus?.status || 'pending'
          });
        });
      }
    });
    return labs;
  };

  // Extract radiology with file status
  const getAllRadiology = () => {
    if (!patient || !patient.visits) return [];
    const radiology = [];
    patient.visits.forEach(visit => {
      if (visit.radiology && visit.radiology.length > 0) {
        visit.radiology.forEach(scan => {
          const fileStatus = getFileStatus(scan, visit.date, visit.doctorName);
          radiology.push({
            name: scan,
            date: visit.date,
            requestedBy: visit.doctorName,
            hasFile: !!fileStatus,
            fileUrl: fileStatus?.fileUrl,
            fileName: fileStatus?.fileName,
            uploadedDate: fileStatus?.uploadedDate,
            notes: fileStatus?.notes,
            status: fileStatus?.status || 'pending'
          });
        });
      }
    });
    return radiology;
  };

  // Extract all diagnoses
  const getAllDiagnoses = () => {
    if (!patient || !patient.visits) return [];
    const diagnoses = [];
    patient.visits.forEach(visit => {
      if (visit.diagnosis) {
        diagnoses.push({
          diagnosis: visit.diagnosis,
          date: visit.date,
          doctor: visit.doctorName,
          status: "Active"
        });
      }
    });
    return diagnoses;
  };

  const medications = getAllMedications();
  const labResults = getAllLabResults();
  const radiology = getAllRadiology();
  const diagnoses = getAllDiagnoses();
  const bloodPressureData = getBloodPressureData();

  const handleViewFile = (fileUrl, fileName, testName, date, requestedBy, notes) => {
    if (fileUrl) {
      setShowPdfViewer({
        url: fileUrl,
        name: fileName || testName,
        testName: testName,
        date: date,
        requestedBy: requestedBy,
        notes: notes
      });
    }
  };

  const closePdfViewer = () => {
    setShowPdfViewer(null);
  };

  const handleDownload = () => {
    if (showPdfViewer && showPdfViewer.url) {
      const link = document.createElement('a');
      link.href = showPdfViewer.url;
      link.download = showPdfViewer.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>${showPdfViewer?.testName || 'Document'} - ${patient?.fullName}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 20px; }
            .header { text-align: center; margin-bottom: 20px; }
            .content { margin-top: 20px; }
            .info { margin-bottom: 10px; }
            .label { font-weight: bold; }
          </style>
        </head>
        <body>
          <div class="header">
            <h2>MedTrack Medical Report</h2>
            <h3>${showPdfViewer?.testName || 'Lab Result'}</h3>
          </div>
          <div class="content">
            <div class="info"><span class="label">Patient:</span> ${patient?.fullName}</div>
            <div class="info"><span class="label">National ID:</span> ${patient?.nationalId}</div>
            <div class="info"><span class="label">Test Date:</span> ${showPdfViewer?.date}</div>
            <div class="info"><span class="label">Requested By:</span> ${showPdfViewer?.requestedBy}</div>
            ${showPdfViewer?.notes ? `<div class="info"><span class="label">Notes:</span> ${showPdfViewer.notes}</div>` : ''}
          </div>
          <div class="content" style="margin-top: 20px;">
            <embed src="${showPdfViewer?.url}" width="100%" height="500" type="application/pdf">
          </div>
          <div style="margin-top: 20px; text-align: center; font-size: 12px; color: #666;">
            Generated by MedTrack System on ${new Date().toLocaleDateString()}
          </div>
        </body>
      </html>
    `);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };

  if (!patient) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="medical-record-page">
      {/* MODIFIED HEADER - Same style as Topbar but simplified */}
      <div className="medical-record-header">
        <div className="medical-record-header-container">
          {/* Left Side - Back Button with patient data preservation */}
          <div className="medical-record-header-left">
            <button className="back-to-dashboard" onClick={handleBackToDashboard}>
              <FaArrowLeft /> Back to Dashboard
            </button>
          </div>

          {/* Right Side - Doctor Profile (Same as Topbar) */}
          <div className="medical-record-header-right">
            <div className="profile-container-medical">
              <button className="profile-btn-medical" onClick={handleProfileClick}>
                <div className="profile-avatar-medical">
                  <span>{getInitials()}</span>
                </div>
                <div className="profile-info-medical">
                  <p className="profile-name-medical">{doctor.name}</p>
                  <span className="profile-role-medical">{doctor.specialty}</span>
                </div>
                <FaChevronDown className={`dropdown-icon-medical ${showProfileMenu ? 'rotated' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="profile-dropdown-medical">
                  <div className="dropdown-header-medical">
                    <div className="dropdown-avatar-medical">
                      <span>{getInitials()}</span>
                    </div>
                    <div className="dropdown-user-info-medical">
                      <h4>{doctor.name}</h4>
                      <p>{doctor.email}</p>
                    </div>
                  </div>
                  <div className="dropdown-menu-medical">
                    <button onClick={handleViewProfile} className="dropdown-item-medical">
                      <FaUserEdit /> View Profile
                    </button>
                    <button onClick={handleChangePassword} className="dropdown-item-medical">
                      <FaLock /> Change Password
                    </button>
                    <hr />
                    <button onClick={handleLogout} className="dropdown-item-medical logout-item-medical">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="medical-record-layout">
        {/* LEFT SIDE - Medical Summary */}
        <div className="medical-summary-left">
          {/* Patient Info */}
          <div className="patient-mini-card">
            <div className="patient-name-large">
              <h2>{patient.fullName}</h2>
              <div className="patient-quick-info">
                <span>{patient.age} yrs</span>
                <span>{patient.bloodType}</span>
                <span>{patient.gender}</span>
              </div>
            </div>
            <div className="patient-id-small">ID: {patient.nationalId}</div>
          </div>

          {/* Conditions */}
          <div className="conditions-mini">
            <div className="condition-row">
              <span className="label-red">Conditions:</span>
              <div className="tags">
                {patient.chronicConditions && patient.chronicConditions.length > 0 ? (
                  patient.chronicConditions.map((c, i) => (
                    <span key={i} className="tag-blue">{c}</span>
                  ))
                ) : (
                  <span className="empty-tag">No chronic conditions</span>
                )}
              </div>
            </div>
            <div className="condition-row">
              <span className="label-orange">Allergies:</span>
              <div className="tags">
                {patient.allergies && patient.allergies.length > 0 ? (
                  patient.allergies.map((a, i) => (
                    <span key={i} className="tag-red">{a}</span>
                  ))
                ) : (
                  <span className="empty-tag">No known allergies</span>
                )}
              </div>
            </div>
          </div>

          {/* Medications */}
          <div className="summary-card">
            <div className="card-header" onClick={() => toggleSection('medications')}>
              <div className="header-left">
                <FaPills className="header-icon green" />
                <h3>Current Medications</h3>
                <span className="count-badge">{medications.length}</span>
              </div>
              {expandedSections.medications ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.medications && (
              <div className="card-content">
                {medications.length > 0 ? (
                  medications.map((med, idx) => (
                    <div key={idx} className="med-item">
                      <div className="med-info">
                        <div className="med-name">{med.name}</div>
                        <div className="med-details">
                          <span>{med.dosage}</span>
                          <span>{med.duration}</span>
                        </div>
                        <div className="med-meta">
                          <small>Prescribed by: {med.prescribedBy}</small>
                          <small>Date: {med.prescribedDate}</small>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FaRegFileAlt className="empty-icon" />
                    <p>No medications prescribed yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Lab Results with File View */}
          <div className="summary-card">
            <div className="card-header" onClick={() => toggleSection('labs')}>
              <div className="header-left">
                <FaFlask className="header-icon blue" />
                <h3>Lab Results</h3>
                <span className="count-badge">{labResults.length}</span>
              </div>
              {expandedSections.labs ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.labs && (
              <div className="card-content">
                {labResults.length > 0 ? (
                  labResults.map((lab, idx) => (
                    <div key={idx} className="lab-item">
                      <div className="lab-info">
                        <div className="lab-name">{lab.name}</div>
                        <div className="lab-date">{lab.date}</div>
                        <div className="lab-requester">
                          <small>Requested by: {lab.requestedBy}</small>
                        </div>
                        {lab.notes && (
                          <div className="lab-notes-small">{lab.notes}</div>
                        )}
                      </div>
                      <div className="lab-actions">
                        {lab.hasFile ? (
                          <button 
                            className="view-file-btn-small"
                            onClick={() => handleViewFile(lab.fileUrl, lab.fileName, lab.name, lab.date, lab.requestedBy, lab.notes)}
                          >
                            <FaEye /> View Result
                          </button>
                        ) : (
                          <span className="pending-badge">
                            <FaClock /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FaFlask className="empty-icon" />
                    <p>No lab results available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Radiology with File View */}
          <div className="summary-card">
            <div className="card-header" onClick={() => toggleSection('radiology')}>
              <div className="header-left">
                <FaXRay className="header-icon purple" />
                <h3>Radiology & Imaging</h3>
                <span className="count-badge">{radiology.length}</span>
              </div>
              {expandedSections.radiology ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.radiology && (
              <div className="card-content">
                {radiology.length > 0 ? (
                  radiology.map((scan, idx) => (
                    <div key={idx} className="scan-item">
                      <div className="scan-info">
                        <div className="scan-name">{scan.name}</div>
                        <div className="scan-date">{scan.date}</div>
                        <div className="scan-requester">
                          <small>Requested by: {scan.requestedBy}</small>
                        </div>
                      </div>
                      <div className="scan-actions">
                        {scan.hasFile ? (
                          <button 
                            className="view-file-btn-small"
                            onClick={() => handleViewFile(scan.fileUrl, scan.fileName, scan.name, scan.date, scan.requestedBy, scan.notes)}
                          >
                            <FaEye /> View Result
                          </button>
                        ) : (
                          <span className="pending-badge">
                            <FaClock /> Pending
                          </span>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FaXRay className="empty-icon" />
                    <p>No radiology records available</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Diagnoses */}
          <div className="summary-card">
            <div className="card-header" onClick={() => toggleSection('diagnoses')}>
              <div className="header-left">
                <FaStethoscope className="header-icon orange" />
                <h3>Diagnoses</h3>
                <span className="count-badge">{diagnoses.length}</span>
              </div>
              {expandedSections.diagnoses ? <FaChevronUp /> : <FaChevronDown />}
            </div>
            {expandedSections.diagnoses && (
              <div className="card-content">
                {diagnoses.length > 0 ? (
                  diagnoses.map((diag, idx) => (
                    <div key={idx} className="diagnosis-item">
                      <div className="diagnosis-info">
                        <div className="diagnosis-name">{diag.diagnosis}</div>
                        <div className="diagnosis-date">{diag.date}</div>
                        <div className="diagnosis-doctor">
                          <small>Doctor: {diag.doctor}</small>
                        </div>
                      </div>
                      <div className="diagnosis-status active">Active</div>
                    </div>
                  ))
                ) : (
                  <div className="empty-state">
                    <FaStethoscope className="empty-icon" />
                    <p>No diagnoses recorded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE - Charts & Visit Summary */}
        <div className="charts-right">
          <div className="charts-header">
            <FaChartLine />
            <h3>Health Trends & Analytics</h3>
          </div>

          {/* Blood Pressure Chart */}
          {bloodPressureData.length > 0 && (
            <div className="chart-card">
              <div className="chart-title">
                <FaHeartbeat className="chart-icon red" />
                <h4>Blood Pressure Trend</h4>
              </div>
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={bloodPressureData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" fontSize={10} />
                  <YAxis domain={[60, 200]} fontSize={10} />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="systolic" stroke="#ef4444" name="Systolic" strokeWidth={2} />
                  <Line type="monotone" dataKey="diastolic" stroke="#3b82f6" name="Diastolic" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}

          {/* Visit History Summary */}
          <div className="charts-header" style={{ marginTop: '20px' }}>
            <FaNotesMedical />
            <h3>Visit History</h3>
          </div>

          {patient.visits && patient.visits.length > 0 ? (
            patient.visits.map((visit, idx) => (
              <div key={idx} className="visit-summary-card">
                <div className="visit-summary-header">
                  <div className="visit-doctor-info">
                    <FaUserMd className="doctor-icon" />
                    <div>
                      <h4>{visit.doctorName}</h4>
                      <p className="visit-specialty">{visit.specialty}</p>
                    </div>
                  </div>
                  <div className="visit-date-info">
                    <FaCalendarAlt />
                    <span>{visit.date}</span>
                  </div>
                </div>
                <div className="visit-summary-diagnosis">
                  <strong>Diagnosis:</strong> {visit.diagnosis}
                </div>
                <div className="visit-summary-stats">
                  <div className="stat-badge">
                    <FaPills /> {visit.medications?.length || 0} Medications
                  </div>
                  <div className="stat-badge">
                    <FaFlask /> {visit.labResults?.length || 0} Labs
                  </div>
                  <div className="stat-badge">
                    <FaXRay /> {visit.radiology?.length || 0} Scans
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state-card">
              <FaRegFileAlt className="empty-icon-large" />
              <h4>No Visit History</h4>
              <p>No medical visits have been recorded for this patient yet.</p>
            </div>
          )}

          {/* Summary Stats */}
          {patient.visits && patient.visits.length > 0 && (
            <div className="summary-stats-card">
              <h4>📊 Summary Statistics</h4>
              <ul>
                <li>✅ Total Medications: {medications.length}</li>
                <li>✅ Total Lab Tests: {labResults.length}</li>
                <li>✅ Total Radiology: {radiology.length}</li>
                <li>✅ Total Diagnoses: {diagnoses.length}</li>
                <li>✅ Total Visits: {patient.visits.length}</li>
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {showPdfViewer && (
        <div className="pdf-viewer-overlay" onClick={closePdfViewer}>
          <div className="pdf-viewer-modal" onClick={(e) => e.stopPropagation()}>
            <div className="pdf-viewer-header">
              <div className="pdf-viewer-title">
                <FaFilePdf className="pdf-icon" />
                <div>
                  <h3>{showPdfViewer.testName}</h3>
                  <p>Patient: {patient.fullName} | Date: {showPdfViewer.date} | Requested by: {showPdfViewer.requestedBy}</p>
                </div>
              </div>
              <div className="pdf-viewer-actions">
                <button onClick={handleDownload} className="pdf-action-btn" title="Download">
                  <FaDownload />
                </button>
                <button onClick={handlePrint} className="pdf-action-btn" title="Print">
                  <FaPrint />
                </button>
                <button onClick={closePdfViewer} className="pdf-close-btn" title="Close">
                  <FaTimes />
                </button>
              </div>
            </div>
            <div className="pdf-viewer-content">
              {showPdfViewer.url && showPdfViewer.url.startsWith('data:') ? (
                <iframe
                  src={showPdfViewer.url}
                  title="PDF Viewer"
                  className="pdf-iframe"
                  frameBorder="0"
                />
              ) : (
                <embed
                  src={showPdfViewer.url}
                  type="application/pdf"
                  className="pdf-embed"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecord;