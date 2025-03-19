import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, UserPlus, Eye, Search, Calendar } from 'lucide-react';
import { UserRole } from '../types/auth';
import '../styles/ITDashboard.css';
import { createUser, fetchUsers, deleteUser, updateUser } from '../database/userService';
import { fetchPatients, deletePatient } from "../database/patientService";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

interface User {
  id: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  email: string;
  role: Exclude<UserRole, 'it'>;
  phone?: string;
}

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  idNumber: string;
  prediction?: string;
  report?: string;
  dateTime: string;
  imageUrl: string; 
}

interface ITDashboardProps {
  onLogout: () => void;
}

const ITDashboard: React.FC<ITDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'doctor',
  });
  const [activeTab, setActiveTab] = useState<'users' | 'patients'>('users');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState<{ id: string; username: string } | null>(null);
  const [showPatientConfirmModal, setShowPatientConfirmModal] = useState(false);
  const [patientToDelete, setPatientToDelete] = useState<{ 
    id: string; 
    fullName: string; 
    imageUrl?: string; 
  } | null>(null);  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch users from Firestore 
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const usersData = await fetchUsers();
        setUsers(usersData as User[]);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    loadUsers();
  }, []);

  // Fetch patients from Firestore 
  useEffect(() => {
    const loadPatients = async () => {
      try {
        const patientsData = await fetchPatients();
        setPatients(patientsData as Patient[]);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };
    loadPatients();
  }, []);

  // Handle adding or updating a user 
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username || !formData.password) {
      toast.error("Username and password are required!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
      return;
    }

    try {
      // Check if username already exists in Firestore
      const existingUser = users.find(user => user.username === formData.username);

      if (existingUser && !editingUser) {
        // If user exists and we're not in edit mode, prevent duplicate
        toast.error("Username already exists! Please choose a different username.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        return;
      }

      if (editingUser) {
        // Update the existing user in Firestore
        const updatedUser = {
          ...editingUser, // Keep the original ID
          ...formData, // Update fields
        };

        await updateUser(updatedUser);
        setUsers(users.map(user => (user.id === editingUser.id ? updatedUser : user)));

        toast.info("User updated successfully! ✅", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        // Create a new user with a unique ID
        const newUser = {
          ...formData,
          id: Date.now().toString(),
        } as User;
        
        await createUser(newUser);
        setUsers([...users, newUser]);

        // Show success toast
        toast.success("User added successfully! 🎉", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }

      setEditingUser(null);
      setIsAddingUser(false);
      setFormData({ role: 'doctor' });

      // Re-fetch the users list
      const updatedUsers = await fetchUsers();
      setUsers(updatedUsers as User[]);
    } catch (error) {
      console.error("Error saving user:", error);
      toast.error("Failed to add user. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  // Open Confirmation Modal
  const confirmDeleteUser = (id: string, username: string) => {
    setUserToDelete({ id, username });
    setShowConfirmModal(true);
  };

  // Function to show a success toast after deletion
  const showSuccessToast = (message: string) => {
    toast.success(message, {
      position: "top-right",
      autoClose: 3000, // Closes after 3 seconds
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "colored",
    });
  };

  // Handle deleting a user 
  const handleDeleteUser = async () => {
    if (!userToDelete) return;
  
    try {
      await deleteUser(userToDelete.username);
      setUsers(users.filter((user) => user.id !== userToDelete.id));
      setShowConfirmModal(false);
      showSuccessToast("User deleted successfully! 🎉");
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to delete the user. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  }; 

  const confirmDeletePatient = (id: string, fullName: string, imageUrl: string) => {
    setPatientToDelete({ id, fullName, imageUrl });
    setShowPatientConfirmModal(true);
  };  

  // Handle deleting a patient
  const handleDeletePatient = async () => {
    if (!patientToDelete) return;
  
    try {
      await deletePatient(patientToDelete.id, patientToDelete.imageUrl);
      setPatients(patients.filter((patient) => patient.id !== patientToDelete.id));
      setShowPatientConfirmModal(false);
      
      toast.success("Patient record and image deleted successfully! 🎉", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error deleting patient:", error);
      toast.error("Failed to delete patient record. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };  

  // Handle editing a user
  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsAddingUser(true);
  };

  // Handle viewing a patient 
  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  // Format date and time for display 
  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  // Filter users
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm?.toLowerCase() || "";
    return (
      (user.firstName?.toLowerCase() || "").includes(searchString) ||
      (user.lastName?.toLowerCase() || "").includes(searchString) ||
      (user.email?.toLowerCase() || "").includes(searchString) ||
      (user.username?.toLowerCase() || "").includes(searchString)
    );
  });  

  const totalUserPages = Math.max(1, Math.ceil(filteredUsers.length / itemsPerPage));
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    Math.min(currentPage * itemsPerPage, filteredUsers.length)
  );  

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };  

  useEffect(() => {
    setCurrentPage(1);
  }, [users]);  

  // Filter patients 
  const filteredPatients = patients.filter(patient => {
    const searchString = searchTerm.toLowerCase();
    const matchesSearch = (
      patient.firstName.toLowerCase().includes(searchString) ||
      patient.lastName.toLowerCase().includes(searchString) ||
      patient.idNumber.toLowerCase().includes(searchString)
    );

    const matchesDate = filterDate 
      ? new Date(patient.dateTime).toISOString().split('T')[0] === filterDate
      : true;

    return matchesSearch && matchesDate;
  });

  const totalPatientPages = Math.ceil(filteredPatients.length / itemsPerPage);
  const paginatedPatients = filteredPatients.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // User Form Component
  const UserForm = () => (
    <form onSubmit={handleUserSubmit} className="user-form">
      <div className="form-header">
        <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
        <button 
          type="button" 
          onClick={() => {
            setIsAddingUser(false);
            setEditingUser(null);
            setFormData({ role: 'doctor' });
          }}
          className="close-button"
        >
          <X size={20} />
        </button>
      </div>
      <div className="form-group">
        <label>First Name:</label>
        <input
          type="text"
          value={formData.firstName || ''}
          onChange={e => setFormData({ ...formData, firstName: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Last Name:</label>
        <input
          type="text"
          value={formData.lastName || ''}
          onChange={e => setFormData({ ...formData, lastName: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Username:</label>
        <input
          type="text"
          value={formData.username || ''}
          onChange={e => setFormData({ ...formData, username: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Password:</label>
        <input
          type="password"
          value={formData.password || ''}
          onChange={e => setFormData({ ...formData, password: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Email:</label>
        <input
          type="email"
          value={formData.email || ''}
          onChange={e => setFormData({ ...formData, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Role:</label>
        <select
          value={formData.role || 'doctor'}
          onChange={e => setFormData({ ...formData, role: e.target.value as Exclude<UserRole, 'it'> })}
        >
          <option value="doctor">Doctor</option>
          <option value="topographer">Topographer</option>
        </select>
      </div>
      <div className="form-group">
        <label>Phone:</label>
        <input
          type="tel"
          value={formData.phone || ''}
          onChange={e => setFormData({ ...formData, phone: e.target.value })}
        />
      </div>
      <button type="submit" className="submit-button">
        <Save size={20} />
        <span>{editingUser ? 'Update' : 'Save'}</span>
      </button>
    </form>
  );

  return (
    <div className="it-dashboard">
      <ToastContainer />
      <div className="dashboard-content">
        <div className="tab-buttons">
          <button
            className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('users');
              setCurrentPage(1);
              setSearchTerm('');
              setFilterDate('');
            }}
          >
            <Users size={20} />
            <span>Users</span>
          </button>
          <button
            className={`tab-button ${activeTab === 'patients' ? 'active' : ''}`}
            onClick={() => {
              setActiveTab('patients');
              setCurrentPage(1);
              setSearchTerm('');
              setFilterDate('');
            }}
          >
            <UserPlus size={20} />
            <span>Patients</span>
          </button>
        </div>

        {activeTab === 'users' ? (
          <>
            <div className="section-header">
              <h3>User Management</h3>
              <div className="filters-section">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={handleSearch} 
                  />
                </div>
                <button onClick={() => setIsAddingUser(true)} className="add-button">
                  <Plus size={20} />
                  <span>Add User</span>
                </button>
              </div>
            </div>

            {isAddingUser ? (
              <form onSubmit={handleUserSubmit} className="user-form">
              <div className="form-header">
                <h3>{editingUser ? 'Edit User' : 'Add New User'}</h3>
                <button type="button" onClick={() => setIsAddingUser(false)} className="close-button">
                  <X size={20} />
                </button>
              </div>
              <div className="form-group">
                <label>First Name:</label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Last Name:</label>
                <input
                  type="text"
                  value={formData.lastName || ''}
                  onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Username:</label>
                <input
                  type="text"
                  value={formData.username || ''}
                  onChange={e => setFormData({ ...formData, username: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Password:</label>
                <input
                  type="password"
                  value={formData.password || ''}
                  onChange={e => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>Role:</label>
                <select
                  value={formData.role || 'doctor'}
                  onChange={e => setFormData({ ...formData, role: e.target.value as Exclude<UserRole, 'it'> })}
                >
                  <option value="doctor">Doctor</option>
                  <option value="topographer">Topographer</option>
                </select>
              </div>
              <button type="submit" className="submit-button">
                <Save size={20} />
                <span>{editingUser ? 'Update' : 'Save'}</span>
              </button>
            </form>
            ) : (
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Username</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Phone</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedUsers.map(user => (
                      <tr key={user.id}>
                        <td>{`${user.firstName} ${user.lastName}`}</td>
                        <td>{user.username}</td>
                        <td>{user.email}</td>
                        <td style={{ textTransform: 'capitalize' }}>{user.role}</td>
                        <td>{user.phone}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleEditUser(user)} className="edit-button">
                              <Edit2 size={16} />
                            </button>
                            {/* Hide delete button for IT user */}
                            {user.username !== "IT" && ( 
                              <button onClick={() => confirmDeleteUser(user.id, user.username)} className="delete-button">
                                <Trash2 size={16} />
                              </button>
                            )}
                             {showConfirmModal && (
                              <div className="modal-overlay">
                                <div className="modal">
                                  <h3>Confirm Deletion</h3>
                                  <p>Are you sure you want to delete the user: <b>{userToDelete?.username}</b>?</p>
                                  <div className="modal-buttons">
                                    <button className="cancel-btn" onClick={() => setShowConfirmModal(false)}>Cancel</button>
                                    <button className="delete-btn" onClick={handleDeleteUser}>Delete</button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {filteredUsers.length === 0 ? (
                  <div className="no-results">
                    <p>No users found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="pagination">
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>

                    <span className="pagination-info">
                    Page {currentPage} of {totalUserPages}
                    </span>
                    
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => (prev < totalUserPages ? prev + 1 : prev))}
                      disabled={currentPage >= totalUserPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="section-header">
              <h3>Patient Records</h3>
              <div className="filters-section">
                <div className="search-box">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search patients..."
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
            </div>

            <div className="content-section">
              <div className="users-table-container">
                <table className="users-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>ID Number</th>
                      <th>Date & Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedPatients.map(patient => (
                      <tr key={patient.id}>
                        <td>{`${patient.firstName} ${patient.lastName}`}</td>
                        <td>{patient.age}</td>
                        <td style={{ textTransform: 'capitalize' }}>{patient.gender}</td>
                        <td>{patient.idNumber}</td>
                        <td>{formatDateTime(patient.dateTime)}</td>
                        <td>
                          <div className="action-buttons">
                            <button onClick={() => handleViewPatient(patient)} className="view-button">
                              <Eye size={16} />
                            </button>
                            <button onClick={() => confirmDeletePatient(patient.id, `${patient.firstName} ${patient.lastName}`, patient.imageUrl)} className="delete-button">
                              <Trash2 size={16} />
                            </button>

                          </div>
                        </td>
                      </tr>
                    ))}

                    {showPatientConfirmModal && (
                      <div className="modal-overlay">
                        <div className="modal">
                          <h3>Confirm Deletion</h3>
                          <p>Are you sure you want to delete the patient record for <b>{patientToDelete?.fullName}</b>?</p>
                          <div className="modal-buttons">
                            <button className="cancel-btn" onClick={() => setShowPatientConfirmModal(false)}>Cancel</button>
                            <button className="delete-btn" onClick={handleDeletePatient}>Delete</button>
                          </div>
                        </div>
                      </div>
                    )}

                  </tbody>
                </table>
                {filteredPatients.length === 0 ? (
                  <div className="no-results">
                    <p>No patients found matching your search criteria.</p>
                  </div>
                ) : (
                  <div className="pagination">
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    <span className="pagination-info">
                      Page {currentPage} of {totalPatientPages}
                    </span>
                    <button
                      className="pagination-button"
                      onClick={() => setCurrentPage(prev => Math.min(totalPatientPages, prev + 1))}
                      disabled={currentPage === totalPatientPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>

              {selectedPatient && (
                <div className="patient-details">
                  <div className="form-header">
                    <h3>Patient Details</h3>
                    <button 
                      onClick={() => setSelectedPatient(null)} 
                      className="close-button"
                    >
                      <X size={20} />
                    </button>
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
                    className={selectedPatient.prediction && selectedPatient.prediction.includes("Keratoconus") ? "prediction-section red-highlight" : "prediction-section green-highlight"}
                  >
                    <h4>AI Analysis Results</h4>
                    <pre className="prediction-text">{selectedPatient.prediction}</pre>
                  </div>
                    </div>
                  )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ITDashboard;