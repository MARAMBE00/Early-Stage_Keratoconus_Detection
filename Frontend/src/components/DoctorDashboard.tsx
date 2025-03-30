import React, { useState, useRef, useEffect } from 'react';
import { Search, Eye, Calendar, ChevronLeft, ChevronRight, Upload, FileUp, AlertCircle, CheckCircle2, RotateCcw, X, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import '../styles/DoctorDashboard.css';
import { collection, getDocs } from "firebase/firestore";
import { db } from "../database/firebaseConfig";

interface PatientRecord {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
  prediction: string;
  report: string;
  dateTime: string;
  imageUrl: string; 
}

interface DoctorDashboardProps {
  onLogout: () => void;
}

interface PredictionResponse {
  predicted_class: string;
  confidence: number;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
  const [patients, setPatients] = useState<PatientRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(null);
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const patientsPerPage = 10;

  // Fetch patient records from Firestore
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const patientsCollection = collection(db, "patients");
        const snapshot = await getDocs(patientsCollection);

        const patientList: PatientRecord[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as PatientRecord[];

        setPatients(patientList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching patient data:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  // Filter and paginate patient records
  const filteredPatients = patients.filter(patient => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = 
      patient.firstName.toLowerCase().includes(searchString) ||
      patient.lastName.toLowerCase().includes(searchString) ||
      patient.idNumber.toLowerCase().includes(searchString);

    const matchesDate = filterDate 
      ? new Date(patient.dateTime).toISOString().split('T')[0] === filterDate
      : true;

    return matchesSearch && matchesDate;
  });

  const totalPages = Math.ceil(filteredPatients.length / patientsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * patientsPerPage,
    currentPage * patientsPerPage
  );

  // Handle view details of a patient record
  const handleViewDetails = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  // Format date and time for display 
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString("en-GB", { timeZone: "Asia/Colombo" });
  };

  // Handle pagination 
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedPatient(null);
  };

  // Handle file selection for image upload 
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPrediction(null);
        setError(null);
      } else {
        setError('Please select an image file');
      }
    }
  };

  // Handle drag and drop image upload
  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  // Handle image drop event 
  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setPrediction(null);
      setError(null);
    } else {
      setError('Please drop an image file');
    }
  };

  // Handle image upload and prediction 
  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        body: formData,
      });

      const data: PredictionResponse = await response.json();

      if (!response.ok) {
        // Handle error from backend
        const errorMessage = (data as { error?: string }).error || "Failed to get prediction";
        throw new Error(errorMessage);
      }  
      
      // Format the prediction result with the updated terminology 
      const accuracyPercentage = (data.confidence * 100).toFixed(2);
      const predictionText = `Result: ${data.predicted_class}\nConfidence: ${accuracyPercentage}%`;
      //const predictionText = `Result: ${data.predicted_class}`;
      setPrediction(predictionText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
      setPrediction(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle try again button click 
  const handleTryAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  // Generate PDF Report 
  const generatePDF = async (patient: PatientRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;

    // Function to safely retrieve text values
    const safeText = (text: any) => (text !== undefined && text !== null ? String(text) : "");

    // Helper function to add a new page with a header
    const addNewPage = () => {
        doc.addPage();
        yPos = 20;

        // Reapply header styling
        doc.setFillColor(30, 58, 138);
        doc.rect(0, 0, pageWidth, 15, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text('KeratoScan AI - Medical Report', pageWidth / 2, 10, { align: 'center' });
        doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 10, { align: 'right' });

        yPos += 20; // Ensure proper spacing after header
    };

    // Add header for first page
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('KeratoScan AI - Medical Report', pageWidth / 2, 10, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 10, { align: 'right' });

    // Title
    yPos += 10;
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.text('Patient Medical Report', pageWidth / 2, yPos, { align: 'center' });

    // Decorative Line
    yPos += 10;
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Patient Information
    yPos += 15;
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');

    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('Patient Information', margin + 5, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const col1X = margin + 5;
    const col2X = pageWidth / 2;
    
    doc.text(`Name: ${safeText(patient.firstName)} ${safeText(patient.lastName)}`, col1X, yPos);
    doc.text(`ID Number: ${safeText(patient.idNumber)}`, col2X, yPos);

    yPos += lineHeight;
    doc.text(`Age: ${safeText(patient.age)}`, col1X, yPos);
    doc.text(`Gender: ${safeText(patient.gender)}`, col2X, yPos);

    yPos += lineHeight;
    doc.text(`Date: ${safeText(formatDateTime(patient.dateTime))}`, col1X, yPos);

    // Corneal Topography Image
    if (patient.imageUrl) {
        try {
            const img = new Image();
            img.crossOrigin = "Anonymous"; // Handle CORS issues
            img.src = patient.imageUrl;

            await new Promise((resolve, reject) => {
                img.onload = resolve;
                img.onerror = reject;
            });

            yPos += 20;
            if (yPos + 80 > pageHeight - margin) addNewPage();

            doc.setFillColor(241, 245, 249);
            doc.rect(margin, yPos, pageWidth - margin * 2, 110, "F");

            yPos += 10;
            doc.setFontSize(14);
            doc.setTextColor(30, 58, 138);
            doc.text("Corneal Topography Image", margin + 5, yPos);

            yPos += 10;

            // Scale image
            const maxWidth = 120;
            const maxHeight = 80;
            let imgWidth = img.width;
            let imgHeight = img.height;
            const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            imgWidth *= ratio;
            imgHeight *= ratio;

            doc.addImage(img, "JPEG", (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 10;

        } catch (error) {
            console.error("Error adding image to PDF:", error);
        }
    }

    // AI Analysis Results
    if (yPos + 55 > pageHeight - margin) addNewPage();
    
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 30, 'F');

    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('Analysis Results', margin + 5, yPos);

    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);

    const predictionLines = safeText(patient.prediction).split('\n');
    predictionLines.forEach(line => {
        if (yPos + lineHeight > pageHeight - margin) addNewPage();
        doc.text(line, margin + 5, yPos);
        yPos += lineHeight;
    });

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(128, 128, 128);
        doc.text(`Page ${i} of ${totalPages}`, pageWidth / 2, pageHeight - 10, { align: "center" });
        doc.text("KeratoScan AI © 2025 - Confidential Medical Report", pageWidth - margin, pageHeight - 10, { align: "right" });
    }

    // If new analysis is available, print image and results
    if (prediction && prediction.trim() !== "" && previewUrl) {
        yPos += 20;
        if (yPos + 80 > pageHeight - margin) addNewPage();

        try {
            const newImg = new Image();
            newImg.crossOrigin = "Anonymous"; 
            newImg.src = previewUrl;

            await new Promise((resolve, reject) => {
                newImg.onload = resolve;
                newImg.onerror = reject;
            });

            doc.setFillColor(241, 245, 249);
            doc.rect(margin, yPos, pageWidth - margin * 2, 110, "F");

            yPos += 10;
            doc.setFontSize(14);
            doc.setTextColor(30, 58, 138);
            doc.text("New Analyzed Image", margin + 5, yPos);

            yPos += 10;
            const ratio = Math.min(120 / newImg.width, 80 / newImg.height);
            const imgWidth = newImg.width * ratio;
            const imgHeight = newImg.height * ratio;

            doc.addImage(newImg, "JPEG", (pageWidth - imgWidth) / 2, yPos, imgWidth, imgHeight);
            yPos += imgHeight + 10;

            if (yPos + 40 > pageHeight - margin) addNewPage();

            doc.setFillColor(241, 245, 249);
            doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');

            yPos += 10;
            doc.setFontSize(14);
            doc.setTextColor(30, 58, 138);
            doc.text('New Analysis Results', margin + 5, yPos);

            yPos += 10;
            doc.setFontSize(11);
            doc.setTextColor(0, 0, 0);

            const newPredictionLines = prediction.split('\n');
            newPredictionLines.forEach(line => {
                if (yPos + lineHeight > pageHeight - margin) addNewPage();
                doc.text(line, margin + 5, yPos);
                yPos += lineHeight;
            });

        } catch (error) {
            console.error("Error adding new analysis image to PDF:", error);
        }
    }

    doc.save(`medical_report_${safeText(patient.idNumber)}.pdf`);
  };


  return (
    <div className="doctor-dashboard">
      <div className="dashboard-content">
        <div className="filters-section">
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search by name or ID..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="date-filter">
            <Calendar size={20} />
            <input
              type="date"
              value={filterDate}
              onChange={(e) => {
                setFilterDate(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="content-section">
          <div className="patients-list">
          {loading ? (
              <div className="loading-message">
                <p>Loading patient records...</p>
              </div>
            ) : filteredPatients.length === 0 ? (
              <div className="no-results">
                <p>No patients found matching your search criteria.</p>
              </div>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>ID Number</th>
                    <th>Age</th>
                    <th>Gender</th>
                    <th>Date & Time</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPatients.map(patient => (
                    <tr key={patient.id}>
                      <td>{`${patient.firstName} ${patient.lastName}`}</td>
                      <td>{patient.idNumber}</td>
                      <td>{patient.age}</td>
                      <td style={{ textTransform: 'capitalize' }}>{patient.gender}</td>
                      <td>{formatDateTime(patient.dateTime)}</td>
                      <td>
                        <button
                          className="view-button"
                          onClick={() => handleViewDetails(patient)}
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            {filteredPatients.length > 0 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}
          </div>

          {selectedPatient && (
            <div className="patient-details">
              <div className="details-header">
                <h3>Patient Details</h3>
                <div className="header-actions">
                  <button 
                    onClick={() => generatePDF(selectedPatient)} 
                    className="download-button"
                  >
                    <Download size={20} />
                    <span>Download Report</span>
                  </button>
                  <button 
                    onClick={() => setSelectedPatient(null)} 
                    className="close-button"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <label>Name:</label>
                  <span>{`${selectedPatient.firstName} ${selectedPatient.lastName}`}</span>
                </div>
                <div className="detail-item">
                  <label>ID Number:</label>
                  <span>{selectedPatient.idNumber}</span>
                </div>
                <div className="detail-item">
                  <label>Age:</label>
                  <span>{selectedPatient.age}</span>
                </div>
                <div className="detail-item">
                  <label>Gender:</label>
                  <span style={{ textTransform: 'capitalize' }}>{selectedPatient.gender}</span>
                </div>
                <div className="detail-item">
                  <label>Date & Time:</label>
                  <span>{formatDateTime(selectedPatient.dateTime)}</span>
                </div>
              </div>

              {/* Display Patient Image */}
              {selectedPatient.imageUrl && (
                <div className="image-section">
                  <h4>Corneal Topography Image</h4>
                  <img src={selectedPatient.imageUrl} alt="Patient Scan" className="patient-image" />
                </div>
              )}

              {/* Highlight Result Based on Diagnosis */}
              <div
                className={selectedPatient.prediction.includes("Keratoconus") ? "prediction-section red-highlight" : "prediction-section green-highlight"}
              >
                <h4>AI Analysis Results</h4>
                <pre className="prediction-text">{selectedPatient.prediction}</pre>
              </div>

              <div className="upload-section">
                <h4>Scan Analysis</h4>
                <div
                  className="upload-area"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept="image/*"
                    style={{ display: 'none' }}
                  />
                  {previewUrl ? (
                    <div className="preview-container">
                      <img src={previewUrl} alt="Preview" className="image-preview" />
                      <div className="preview-overlay">
                        <p>Click or drag to replace</p>
                      </div>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <Upload size={48} />
                      <p>Click or drag scan image here</p>
                      <span>Supported formats: JPG, PNG, JPEG</span>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="error-message">
                    <AlertCircle size={20} />
                    <span>{error}</span>
                  </div>
                )}

                {selectedFile && !prediction && (
                  <div className="action-buttons">
                    <button 
                      className="try-again-button"
                      onClick={handleTryAgain}
                    >
                      <RotateCcw size={20} />
                      Try Again
                    </button>
                    <button 
                      className="process-button"
                      onClick={isUploading ? undefined : handleUpload}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <div className="spinner"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FileUp size={20} />
                          Process Image
                        </>
                      )}
                    </button>
                  </div>
                )}

                {prediction && (
                  <div className="new-prediction-result">
                    <div className="prediction-header">
                      <CheckCircle2 size={24} className="success-icon" />
                      <h4>New Analysis Complete</h4>
                    </div>
                    <div className="image-analysis-container">
                      <div className="analyzed-image-container">
                        <img src={previewUrl!} alt="Analyzed image" className="analyzed-image" />
                      </div>
                      <pre className="prediction-text">{prediction}</pre>
                    </div>
                    <div className="prediction-actions">
                      <button 
                        className="try-again-button"
                        onClick={handleTryAgain}
                      >
                        <RotateCcw size={20} />
                        Try Again
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;