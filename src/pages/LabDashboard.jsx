// pages/LabDashboard.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { 
  FaFlask, 
  FaSearch, 
  FaUpload, 
  FaCheckCircle, 
  FaTimesCircle,
  FaEye,
  FaUserMd,
  FaCalendarAlt,
  FaXRay,
  FaSignOutAlt,
  FaFilePdf,
  FaClock,
  FaBell,
  FaChevronDown,
  FaUserEdit,
  FaLock,
  FaTachometerAlt,
  FaFileMedical,
  FaDownload
} from "react-icons/fa";
import "./LabDashboard.css";

// Lab Topbar Component (مطابق لـ Topbar الدكتور)
const LabTopbar = ({ labName, labType, onLogout, onViewProfile, onChangePassword }) => {
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getInitials = () => {
    const name = labName;
    if (name === "Loading...") return "LB";
    const parts = name.split(" ");
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const navItems = [
    { path: '/lab-dashboard', name: 'Dashboard', icon: <FaTachometerAlt /> },
    { path: '/lab-requests', name: 'Requests', icon: <FaFileMedical /> },
    { path: '/lab-results', name: 'Results', icon: <FaFlask /> },
  ];

  return (
    <>
      <nav className="lab-top-navbar">
        <div className="lab-nav-container">
          {/* Logo Section */}
          <div className="lab-nav-brand">
            <button className="lab-mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              ☰
            </button>
            <div className="lab-logo">
              <div className="lab-logo-icon-wrapper">
                <FaFlask className="lab-logo-icon" />
              </div>
              <span className="lab-logo-text">MedTrack Labs</span>
            </div>
          </div>

          {/* Desktop Navigation */}
        
          {/* Right Section */}
          <div className="lab-nav-right">
            {/* Welcome Message */}
            <div className="lab-welcome-message">
              <span className="lab-welcome-text">Welcome back,</span>
              <span className="lab-welcome-name">{labName}</span>
            </div>

            {/* Notifications */}
           
            {/* Profile Dropdown */}
            <div className="lab-profile-container">
              <button className="lab-profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                <div className="lab-profile-avatar">
                  <span>{getInitials()}</span>
                </div>
                <div className="lab-profile-info">
                  <p className="lab-profile-name">{labName}</p>
                  <span className="lab-profile-role">{labType}</span>
                </div>
                <FaChevronDown className={`lab-dropdown-icon ${showProfileMenu ? 'rotated' : ''}`} />
              </button>

              {showProfileMenu && (
                <div className="lab-profile-dropdown">
                  <div className="lab-dropdown-header">
                    <div className="lab-dropdown-avatar">
                      <span>{getInitials()}</span>
                    </div>
                    <div className="lab-dropdown-user-info">
                      <h4>{labName}</h4>
                      <p>Lab Administrator</p>
                    </div>
                  </div>
                  <div className="lab-dropdown-menu">
                    <button onClick={onViewProfile} className="lab-dropdown-item">
                      <FaUserEdit /> View Profile
                    </button>
                    <button onClick={onChangePassword} className="lab-dropdown-item">
                      <FaLock /> Change Password
                    </button>
                    <hr />
                    <button onClick={onLogout} className="lab-dropdown-item logout-item">
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lab-mobile-menu">
            {navItems.map((item) => (
              <button
                key={item.path}
                className={`lab-mobile-nav-link`}
                onClick={() => {}}
              >
                {item.icon}
                <span>{item.name}</span>
              </button>
            ))}
            <hr className="lab-mobile-divider" />
            <button onClick={onLogout} className="lab-mobile-nav-link logout">
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </div>
        )}
      </nav>

      {/* Page Header */}
      <div className="lab-page-header">
        <div className="lab-page-header-content">
          <h1 className="lab-page-title">Laboratory Dashboard</h1>
          <p className="lab-page-subtitle">Manage and upload patient test results</p>
        </div>
      </div>
    </>
  );
};

function LabDashboard() {
  const [nationalId, setNationalId] = useState("");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [searchError, setSearchError] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadNotes, setUploadNotes] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [labInstitution, setLabInstitution] = useState({
    name: "Loading...",
    type: ""
  });
  const navigate = useNavigate();

  // Load lab institution data from localStorage
  useEffect(() => {
    const labData = localStorage.getItem("labLoggedIn");
    if (labData) {
      const parsed = JSON.parse(labData);
      setLabInstitution({
        name: parsed.institutionName || parsed.name || "Laboratory",
        type: parsed.institutionType || parsed.type || ""
      });
    } else {
      navigate("/lab-login");
    }
  }, [navigate]);

  const handleChangePassword = () => {
    navigate("/lab/change-password");
  };
  
  const handleViewProfile = () => {
    navigate("/lab-profile");
  };

  const handleLogout = () => {
    localStorage.removeItem("labLoggedIn");
    navigate("/");
  };

  // Load tests from localStorage
  const loadTests = () => {
    const savedTests = localStorage.getItem('labTests');
    if (savedTests) {
      return JSON.parse(savedTests);
    }
    return [
      {
        id: 1,
        patientId: "12345678901234",
        patientName: "Elena Rodriguez",
        testName: "Complete Blood Count (CBC)",
        testType: "lab",
        requestedBy: "Dr. Ahmed Mahmoud",
        requestedDate: "2024-03-15",
        specialty: "Consultant Cardiologist",
        status: "completed",
        fileUrl: "/sample-cbc.pdf",
        fileName: "CBC_Results.pdf",
        uploadedDate: "2026-05-04",
        notes: "All values within normal range"
      },
      {
        id: 2,
        patientId: "12345678901234",
        patientName: "Elena Rodriguez",
        testName: "Lipid Profile",
        testType: "lab",
        requestedBy: "Dr. Ahmed Mahmoud",
        requestedDate: "2024-03-15",
        specialty: "Consultant Cardiologist",
        status: "pending",
        fileUrl: null,
        fileName: null,
        uploadedDate: null,
        notes: null
      },
      {
        id: 3,
        patientId: "12345678901234",
        patientName: "Elena Rodriguez",
        testName: "HbA1c",
        testType: "lab",
        requestedBy: "Dr. Sarah Jenkins",
        requestedDate: "2024-01-15",
        specialty: "Endocrinologist",
        status: "pending",
        fileUrl: null,
        fileName: null,
        uploadedDate: null,
        notes: null
      },
      {
        id: 4,
        patientId: "12345678901234",
        patientName: "Elena Rodriguez",
        testName: "Chest X-Ray",
        testType: "radiology",
        requestedBy: "Dr. Ahmed Mahmoud",
        requestedDate: "2023-10-12",
        specialty: "Consultant Cardiologist",
        status: "pending",
        fileUrl: null,
        fileName: null,
        uploadedDate: null,
        notes: null
      }
    ];
  };

  const [allTests, setAllTests] = useState(loadTests());

  useEffect(() => {
    localStorage.setItem('labTests', JSON.stringify(allTests));
  }, [allTests]);

  const handleSearch = () => {
    setSearchPerformed(true);
    const patientTests = allTests.filter(test => test.patientId === nationalId);
    
    if (patientTests.length > 0) {
      setSelectedPatient({
        id: nationalId,
        name: patientTests[0].patientName,
        pendingTests: patientTests.filter(t => t.status === 'pending'),
        completedTests: patientTests.filter(t => t.status === 'completed')
      });
      setSearchError(false);
    } else {
      setSelectedPatient(null);
      setSearchError(true);
    }
  };

  const handleUploadClick = (test) => {
    setSelectedTest(test);
    setShowUploadModal(true);
    setUploadFile(null);
    setUploadNotes("");
    setUploadSuccess(false);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadFile({
          name: file.name,
          size: file.size,
          type: file.type,
          dataUrl: reader.result
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitResult = () => {
    if (uploadFile) {
      const updatedTests = allTests.map(test => {
        if (test.id === selectedTest.id) {
          return {
            ...test,
            status: "completed",
            fileUrl: uploadFile.dataUrl,
            fileName: uploadFile.name,
            uploadedDate: new Date().toISOString().split('T')[0],
            notes: uploadNotes
          };
        }
        return test;
      });
      
      setAllTests(updatedTests);
      
      if (selectedPatient) {
        const updatedPending = selectedPatient.pendingTests.filter(t => t.id !== selectedTest.id);
        const updatedCompleted = [...selectedPatient.completedTests, {
          ...selectedTest,
          status: "completed",
          fileUrl: uploadFile.dataUrl,
          fileName: uploadFile.name,
          uploadedDate: new Date().toISOString().split('T')[0],
          notes: uploadNotes
        }];
        
        setSelectedPatient({
          ...selectedPatient,
          pendingTests: updatedPending,
          completedTests: updatedCompleted
        });
      }
      
      setUploadSuccess(true);
      setTimeout(() => {
        setShowUploadModal(false);
        setUploadSuccess(false);
      }, 1500);
    }
  };

  const handleViewFile = (fileUrl, fileName) => {
    if (fileUrl) {
      window.open(fileUrl, '_blank');
    }
  };

  const getTestTypeIcon = (type) => {
    return type === 'lab' ? <FaFlask /> : <FaXRay />;
  };

  return (
    <div className="lab-dashboard-page">
      <LabTopbar 
        labName={labInstitution.name}
        labType={labInstitution.type}
        onLogout={handleLogout}
        onViewProfile={handleViewProfile}
        onChangePassword={handleChangePassword}
      />

      <div className="lab-dashboard-content">
        {/* Search Card */}
        <div className="lab-search-card">
          <h3>Search Patient by National ID</h3>
          <div className="lab-search-box">
            <input
              type="text"
              placeholder="Enter 14-digit National ID..."
              value={nationalId}
              onChange={(e) => setNationalId(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              maxLength="14"
            />
            <button onClick={handleSearch}>
              <FaSearch /> Search
            </button>
          </div>
        </div>

        {searchPerformed && searchError && (
          <div className="lab-no-results">
            <FaTimesCircle className="lab-no-results-icon" />
            <h4>No Patient Found</h4>
            <p>No pending or completed tests found for ID: {nationalId}</p>
          </div>
        )}

        {searchPerformed && selectedPatient && (
          <div className="lab-patient-tests-container">
            {/* Patient Info Header */}
            <div className="lab-patient-info-header">
              <div className="lab-patient-avatar">
                <FaUserMd />
              </div>
              <div className="lab-patient-info-details">
                <h2>{selectedPatient.name}</h2>
                <p>National ID: {selectedPatient.id}</p>
              </div>
              <div className="lab-patient-stats">
                <div className="lab-stat-badge pending">
                  <FaClock /> {selectedPatient.pendingTests.length} Pending
                </div>
                <div className="lab-stat-badge completed">
                  <FaCheckCircle /> {selectedPatient.completedTests.length} Completed
                </div>
              </div>
            </div>

            {/* Pending Tests */}
            {selectedPatient.pendingTests.length > 0 && (
              <div className="lab-tests-section">
                <h3 className="lab-section-title pending-title">
                  <FaClock /> Pending Tests ({selectedPatient.pendingTests.length})
                </h3>
                <div className="lab-tests-list">
                  {selectedPatient.pendingTests.map((test) => (
                    <div key={test.id} className="lab-test-card pending-card">
                      <div className="lab-test-type-icon">
                        {getTestTypeIcon(test.testType)}
                      </div>
                      <div className="lab-test-info">
                        <div className="lab-test-name">{test.testName}</div>
                        <div className="lab-test-details">
                          <span><FaUserMd /> {test.requestedBy}</span>
                          <span>{test.specialty}</span>
                          <span><FaCalendarAlt /> {test.requestedDate}</span>
                        </div>
                      </div>
                      <button className="lab-upload-btn" onClick={() => handleUploadClick(test)}>
                        <FaUpload /> Upload Result
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Completed Tests */}
            {selectedPatient.completedTests.length > 0 && (
              <div className="lab-tests-section">
                <h3 className="lab-section-title completed-title">
                  <FaCheckCircle /> Completed Tests ({selectedPatient.completedTests.length})
                </h3>
                <div className="lab-tests-list">
                  {selectedPatient.completedTests.map((test) => (
                    <div key={test.id} className="lab-test-card completed-card">
                      <div className="lab-test-type-icon completed-icon">
                        {getTestTypeIcon(test.testType)}
                      </div>
                      <div className="lab-test-info">
                        <div className="lab-test-name">{test.testName}</div>
                        <div className="lab-test-details">
                          <span><FaUserMd /> {test.requestedBy}</span>
                          <span>{test.specialty}</span>
                          <span><FaCalendarAlt /> Uploaded: {test.uploadedDate}</span>
                        </div>
                        {test.notes && <div className="lab-test-notes">📝 {test.notes}</div>}
                      </div>
                      <div className="lab-completed-actions">
                        <span className="lab-completed-badge">
                          <FaCheckCircle /> Completed
                        </span>
                        <button className="lab-view-file-btn" onClick={() => handleViewFile(test.fileUrl, test.fileName)}>
                          <FaEye /> View File
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upload Modal */}
      {showUploadModal && selectedTest && (
        <div className="lab-modal-overlay" onClick={() => setShowUploadModal(false)}>
          <div className="lab-upload-modal" onClick={(e) => e.stopPropagation()}>
            <h2>Upload Test Result</h2>
            
            <div className="lab-upload-test-info">
              <div className="lab-info-row">
                <span className="lab-info-label">Patient:</span>
                <span className="lab-info-value">{selectedTest.patientName}</span>
              </div>
              <div className="lab-info-row">
                <span className="lab-info-label">Test:</span>
                <span className="lab-info-value">{selectedTest.testName}</span>
              </div>
              <div className="lab-info-row">
                <span className="lab-info-label">Requested by:</span>
                <span className="lab-info-value">{selectedTest.requestedBy} ({selectedTest.specialty})</span>
              </div>
            </div>

            <div className="lab-upload-form-group">
              <label>Upload Result File (PDF/Image)</label>
              <div className="lab-file-drop-zone" onClick={() => document.getElementById('labFileInput').click()}>
                {uploadFile ? (
                  <div className="lab-file-selected">
                    <FaFilePdf />
                    <span>{uploadFile.name}</span>
                    <small>({(uploadFile.size / 1024).toFixed(1)} KB)</small>
                  </div>
                ) : (
                  <div className="lab-file-placeholder">
                    <FaUpload />
                    <span>Click or drag file to upload</span>
                    <small>Supports PDF, JPG, PNG (Max 10MB)</small>
                  </div>
                )}
                <input id="labFileInput" type="file" accept=".pdf,.jpg,.png,.jpeg" onChange={handleFileUpload} style={{ display: 'none' }} />
              </div>
            </div>

            <div className="lab-upload-form-group">
              <label>Additional Notes (Optional)</label>
              <textarea
                placeholder="Add any notes about the results..."
                value={uploadNotes}
                onChange={(e) => setUploadNotes(e.target.value)}
                rows="4"
              />
            </div>

            {uploadSuccess && (
              <div className="lab-upload-success">
                <FaCheckCircle /> File uploaded successfully!
              </div>
            )}

            <div className="lab-upload-modal-buttons">
              <button onClick={() => setShowUploadModal(false)} className="lab-cancel-upload">Cancel</button>
              <button onClick={handleSubmitResult} className="lab-submit-upload" disabled={!uploadFile}>
                <FaCheckCircle /> Submit Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LabDashboard;