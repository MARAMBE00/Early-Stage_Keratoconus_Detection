import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileUp, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import '../styles/TopographerDashboard.css';
import { getNextPatientID, uploadPatientImage, savePatientData } from "../database/patientService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

interface PatientData {
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
  prediction: string;
  report: string;
  dateTime: string;
}

interface PredictionResponse {
  predicted_class: string;
  confidence: number;
}

interface TopographerDashboardProps {
  onLogout: () => void;
}

const TopographerDashboard: React.FC<TopographerDashboardProps> = ({ onLogout }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPatientForm, setShowPatientForm] = useState(false);
  const [patientData, setPatientData] = useState<Partial<PatientData>>({});
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [progress, setProgress] = useState<number>(0);
  const [showProgressBar, setShowProgressBar] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setSelectedFile(file);
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
        setPrediction(null);
        setShowPatientForm(false);
        setError(null);
      } else {
        setError('Please select an image file');
      }
    }
  };

  // Drag and Drop functionality 
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
      setShowPatientForm(false);
      setError(null);
    } else {
      setError('Please drop an image file');
    }
  };

  // Image processing and prediction
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

      // Generate the patient ID when the form is about to appear 
      console.log("Fetching next patient ID...");
      const newPatientID = await getNextPatientID();
      console.log("New Patient ID:", newPatientID);

      // Convert current date-time to Sri Lanka time (GMT+5:30)
      const localDateTime = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Asia/Colombo",  
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,  
      }).format(new Date());
      
      // Set ID & formatted date before showing form 
      setPatientData({
        idNumber: newPatientID,
        dateTime: localDateTime, 
      });

      setShowPatientForm(true);
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during prediction');
      setPrediction(null);
    } finally {
      setIsUploading(false);
    }
  };

  // Form validation
  const validateForm = () => {
    if (
      !patientData.firstName ||
      !patientData.lastName ||
      !patientData.age ||
      !patientData.gender
    ) {
      toast.error("Please fill in all required fields before submitting.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return false;
    }
    return true;
  };  

  // Reset the form and state 
  const handleTryAgain = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setShowPatientForm(false);
    setPatientData({});
    setError(null);
  };

  const handleConfirmSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(true); // Show confirmation modal
  };  

  // Submit the patient data to Firestore 
  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmModal(false);
    setIsUploading(true);
    setShowProgressBar(true); // Show progress bar
    setProgress(10); // Initial progress
    setError(null);

    if (!validateForm()) {
      setIsUploading(false);
      setShowProgressBar(false);
      return;
    }      
  
    console.log("Submit button clicked!");

    try {
      if (!selectedFile) {
        console.error("No image uploaded!");
        setShowProgressBar(false);
        setError("No image uploaded!");
        return;
      }

      console.log("Fetching next patient ID...");
      const newPatientID = await getNextPatientID();
      console.log("New Patient ID:", newPatientID);

      // Set the patient ID before uploading the image 
      setPatientData((prev) => ({ ...prev, idNumber: newPatientID })); 
  
      console.log("Uploading image...");
      setProgress(30);
      const imageUrl = await uploadPatientImage(selectedFile, newPatientID);
      console.log("Image uploaded. URL:", imageUrl);
  
      console.log("Saving patient data to Firestore...");
      setProgress(60);
      const currentDateTime = new Date().toISOString();
      const fullPatientData = {
        idNumber: newPatientID,
        firstName: patientData.firstName || "",
        lastName: patientData.lastName || "",
        age: patientData.age || 0,
        gender: patientData.gender || "other",
        prediction: prediction || "",
        dateTime: currentDateTime,
        imageUrl: imageUrl,
      };

      if (!validateForm()) {
        setIsUploading(false);
        setShowProgressBar(false);
        return;
      }
  
      setProgress(80); 
      await savePatientData(fullPatientData);
      console.log("Patient data saved:", fullPatientData);
  
      console.log("Resetting form...");

      setProgress(100); 
      // 🎉 Show success toast notification
      toast.success("Patient data submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        setShowProgressBar(false); // Hide progress bar after success
        handleTryAgain();
      }, 1000);

      handleTryAgain();
    } catch (err) {
      console.error("Error submitting patient data:", err);
      setError(err instanceof Error ? err.message : "Error saving patient data");
      
      // Show error toast notification
      toast.error("Failed to submit patient data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });

      setShowProgressBar(false); 
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="topographer-dashboard">
      <ToastContainer />
      <div className="dashboard-content">
        <div className="upload-section">
          <div className="instructions">
            <h3>Instructions:</h3>
            <ul>
              <li>Upload a clear, high-resolution image</li>
              <li>Supported formats: JPG, PNG, JPEG</li>
              <li>Maximum file size: 10MB</li>
              <li>Ensure proper lighting in the image</li>
              <li>Wait for the prediction results</li>
              <li>Fill in patient details when prompted</li>
            </ul>
          </div>

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
                <p>Click or drag image here</p>
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
            <div className="prediction-result">
              <div className="prediction-header">
                <CheckCircle2 size={24} className="success-icon" />
                <h3>Analysis Complete</h3>
              </div>
              
              {previewUrl && (
                <div className="image-analysis-container">
                  <div className="analyzed-image-container">
                    <img src={previewUrl} alt="Analyzed image" className="analyzed-image" />
                  </div>
                  <pre className="prediction-text">{prediction}</pre>
                </div>
              )}
              
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

          {showPatientForm && (
            <form onSubmit={handlePatientSubmit} className="patient-form">
              <h3>Patient Information</h3>
              
              <div className="form-group">
                <label>ID Number:</label>
                <input
                  type="text"
                  value={patientData.idNumber || ""} 
                  readOnly
                  className="readonly-field"
                />
              </div>

              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={patientData.firstName || ''}
                  onChange={e => setPatientData({ ...patientData, firstName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={patientData.lastName || ''}
                  onChange={e => setPatientData({ ...patientData, lastName: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age:</label>
                <input
                  type="number"
                  value={patientData.age || ''}
                  onChange={e => setPatientData({ ...patientData, age: parseInt(e.target.value) })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Gender:</label>
                <select
                  value={patientData.gender || ''}
                  onChange={e => setPatientData({ ...patientData, gender: e.target.value as PatientData['gender'] })}
                  required
                >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Analysis Result:</label>
                <textarea
                  value={prediction || ''}
                  readOnly
                  className="readonly-field"
                />
              </div>

              <div className="form-group">
                <label>Date & Time:</label>
                <input
                  type="text"
                  value={patientData.dateTime || ""}
                  readOnly
                  className="readonly-field"
                />
              </div>

              <button type="button" className="submit-button" onClick={handleConfirmSubmit}>
                <FileUp size={20} />
                <span>Submit Patient Data</span>
              </button>

              {showProgressBar && (
                <div className="progress-bar-container">
                  <div className="progress-bar" style={{ width: `${progress}%` }}></div>
                </div>
              )}

              {showConfirmModal && (
                <div className="modal-overlay">
                  <div className="modal">
                    <h3>Confirm Submission</h3>
                    <p>Are you sure you want to submit this patient’s data?</p>
                    <div className="modal-buttons">
                      <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                      <button className="confirm-btn" onClick={handlePatientSubmit}>Submit</button>
                    </div>
                  </div>
                </div>
              )}

            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopographerDashboard;