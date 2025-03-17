import React, { useState, useRef, useEffect } from 'react';
import { Upload, FileUp, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import '../styles/TopographerDashboard.css';
import { getNextPatientID, uploadPatientImage, savePatientData } from "../database/patientService";

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

      if (!response.ok) {
        throw new Error('Failed to get prediction');
      }

      const data: PredictionResponse = await response.json();
      
      // Format the prediction result with the updated terminology
      const accuracyPercentage = (data.confidence * 100).toFixed(2);
      const predictionText = `Result: ${data.predicted_class}\nAccuracy: ${accuracyPercentage}%`;
      setPrediction(predictionText);
      setShowPatientForm(true);
      
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
    setShowPatientForm(false);
    setPatientData({});
    setError(null);
  };

  const handlePatientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
  
    console.log("Submit button clicked!"); // ✅ Debugging log
  
    if (!selectedFile) {
      console.error("No image uploaded!");
      setError("No image uploaded!");
      return;
    }
  
    setIsUploading(true);
    setError(null);
  
    try {
      console.log("Fetching next patient ID...");
      const newPatientID = await getNextPatientID();
      console.log("New Patient ID:", newPatientID);
  
      console.log("Uploading image...");
      const imageUrl = await uploadPatientImage(selectedFile, newPatientID);
      console.log("Image uploaded. URL:", imageUrl);
  
      console.log("Saving patient data to Firestore...");
      const currentDateTime = new Date().toISOString();
      const fullPatientData = {
        idNumber: newPatientID,
        firstName: patientData.firstName || "",
        lastName: patientData.lastName || "",
        age: patientData.age || 0,
        gender: patientData.gender || "other",
        prediction: prediction || "",
        report: "",
        dateTime: currentDateTime,
        imageUrl: imageUrl,
      };
  
      await savePatientData(fullPatientData);
      console.log("Patient data saved:", fullPatientData);
  
      console.log("Resetting form...");
      handleTryAgain();
    } catch (err) {
      console.error("Error submitting patient data:", err);
      setError(err instanceof Error ? err.message : "Error saving patient data");
    } finally {
      setIsUploading(false);
    }
  };
  

  return (
    <div className="topographer-dashboard">
      <div className="dashboard-content">
        <div className="upload-section">
          <div className="instructions">
            <h3>Instructions:</h3>
            <ol>
              <li>Upload a clear, high-resolution image</li>
              <li>Supported formats: JPG, PNG</li>
              <li>Maximum file size: 10MB</li>
              <li>Ensure proper lighting in the image</li>
              <li>Wait for the prediction results</li>
              <li>Fill in patient details when prompted</li>
            </ol>
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
                <label>ID Number:</label>
                <input
                  type="text"
                  readOnly 
                  className="readonly-field"
                />
              </div>

              <div className="form-group">
                <label>Analysis Result:</label>
                <textarea
                  value={prediction || ''}
                  readOnly
                  className="readonly-field"
                />
              </div>

              <button type="submit" className="submit-button">
                <FileUp size={20} />
                <span>Submit Patient Data</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopographerDashboard;