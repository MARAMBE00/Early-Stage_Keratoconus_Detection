import React, { useState, useRef } from 'react';
import { Search, Eye, Calendar, ChevronLeft, ChevronRight, Upload, FileUp, AlertCircle, CheckCircle2, RotateCcw, X, Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import '../styles/DoctorDashboard.css';
import Navbar from './Navbar';

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
}

interface DoctorDashboardProps {
  onLogout: () => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onLogout }) => {
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

  // Sample patients data
  const dummyPatients: PatientRecord[] = [
    {
      id: '1',
      firstName: 'John',
      lastName: 'Doe',
      age: 45,
      gender: 'male',
      idNumber: 'ID123456',
      prediction: 'Result: Normal\nAccuracy: 95.32%',
      report: 'Patient shows normal corneal topography.',
      dateTime: '2024-03-15T10:30:00Z'
    },
  ];

  const filteredPatients = dummyPatients.filter(patient => {
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

  const handleViewDetails = (patient: PatientRecord) => {
    setSelectedPatient(patient);
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSelectedPatient(null);
  };

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

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

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

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    setError(null);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      const predictionText = `Result: Keratoconus\nAccuracy: 92.45%`;
      setPrediction(predictionText);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
      setPrediction(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleTryAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
  };

  const generatePDF = async (patient: PatientRecord) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPos = 20;
    const lineHeight = 7;
    const margin = 20;

    // Helper function to add a new page
    const addNewPage = () => {
      doc.addPage();
      yPos = 20;
      // Add header to new page
      doc.setFillColor(30, 58, 138);
      doc.rect(0, 0, pageWidth, 15, 'F');
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(10);
      doc.text('KeratoScan AI - Medical Report', pageWidth / 2, 10, { align: 'center' });
      doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 10, { align: 'right' });
    };

    // Check if we need to add a new page
    const checkAndAddNewPage = (requiredSpace: number) => {
      if (yPos + requiredSpace > pageHeight - margin) {
        addNewPage();
        return true;
      }
      return false;
    };

    // Add header to first page
    doc.setFillColor(30, 58, 138);
    doc.rect(0, 0, pageWidth, 15, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.text('KeratoScan AI - Medical Report', pageWidth / 2, 10, { align: 'center' });
    doc.text(`Generated: ${new Date().toLocaleString()}`, pageWidth - margin, 10, { align: 'right' });

    // Add logo and title
    yPos = 40;
    doc.setTextColor(30, 58, 138);
    doc.setFontSize(24);
    doc.text('Patient Medical Report', pageWidth / 2, yPos, { align: 'center' });
    
    // Add decorative line
    yPos += 5;
    doc.setDrawColor(30, 58, 138);
    doc.setLineWidth(0.5);
    doc.line(margin, yPos, pageWidth - margin, yPos);

    // Patient Information Section
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

    // Create two columns for patient information
    const col1X = margin + 5;
    const col2X = pageWidth / 2;
    
    doc.text(`Name: ${patient.firstName} ${patient.lastName}`, col1X, yPos);
    doc.text(`ID Number: ${patient.idNumber}`, col2X, yPos);
    
    yPos += lineHeight;
    doc.text(`Age: ${patient.age}`, col1X, yPos);
    doc.text(`Gender: ${patient.gender}`, col2X, yPos);
    
    yPos += lineHeight;
    doc.text(`Date: ${formatDateTime(patient.dateTime)}`, col1X, yPos);

    // AI Analysis Results Section
    yPos += 20;
    checkAndAddNewPage(60);
    
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('AI Analysis Results', margin + 5, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    const predictionLines = patient.prediction.split('\n');
    predictionLines.forEach(line => {
      doc.text(line, margin + 5, yPos);
      yPos += lineHeight;
    });

    // Medical Report Section
    yPos += 10;
    checkAndAddNewPage(60);
    
    doc.setFillColor(241, 245, 249);
    doc.rect(margin, yPos, pageWidth - (margin * 2), 40, 'F');
    
    yPos += 10;
    doc.setFontSize(14);
    doc.setTextColor(30, 58, 138);
    doc.text('Medical Report', margin + 5, yPos);
    
    yPos += 10;
    doc.setFontSize(11);
    doc.setTextColor(0, 0, 0);
    doc.text(patient.report, margin + 5, yPos);

    // Add topography images if available
    if (previewUrl) {
      try {
        const img = new Image();
        img.src = previewUrl;
        await new Promise((resolve) => {
          img.onload = resolve;
        });
        
        yPos += 30;
        checkAndAddNewPage(100);
        
        doc.setFillColor(241, 245, 249);
        doc.rect(margin, yPos, pageWidth - (margin * 2), 120, 'F');
        
        yPos += 10;
        doc.setFontSize(14);
        doc.setTextColor(30, 58, 138);
        doc.text('Corneal Topography', margin + 5, yPos);
        
        yPos += 10;
        const imgWidth = 150;
        const imgHeight = (img.height * imgWidth) / img.width;
        
        doc.addImage(
          img,
          'JPEG',
          (pageWidth - imgWidth) / 2,
          yPos,
          imgWidth,
          imgHeight
        );
        
        // Add new analysis results if available
        if (prediction) {
          yPos += imgHeight + 20;
          checkAndAddNewPage(60);
          
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
            doc.text(line, margin + 5, yPos);
            yPos += lineHeight;
          });
        }
      } catch (error) {
        console.error('Error adding image to PDF:', error);
      }
    }

    // Add footer to all pages
    const totalPages = doc.internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.setTextColor(128, 128, 128);
      doc.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'KeratoScan AI © 2024 - Confidential Medical Report',
        pageWidth - margin,
        pageHeight - 10,
        { align: 'right' }
      );
    }

    // Save the PDF
    doc.save(`medical_report_${patient.idNumber}.pdf`);
  };

  return (
    <div className="doctor-dashboard">
      <Navbar role="doctor" onLogout={onLogout} username="Dr. John Smith" />
      
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
            {filteredPatients.length === 0 && (
              <div className="no-results">
                <p>No patients found matching your search criteria.</p>
              </div>
            )}
            {filteredPatients.length > 0 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() => handlePageChange(currentPage + 1)}
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

              <div className="prediction-section">
                <h4>Previous AI Analysis Results</h4>
                <pre className="prediction-text">{selectedPatient.prediction}</pre>
              </div>

              <div className="report-section">
                <h4>Medical Report</h4>
                <p className="report-text">{selectedPatient.report}</p>
              </div>

              <div className="upload-section">
                <h4>New Scan Analysis</h4>
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
                      <p>Click or drag new scan image here</p>
                      <span>Supported formats: JPG, PNG</span>
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
                        Analyze Another Image
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