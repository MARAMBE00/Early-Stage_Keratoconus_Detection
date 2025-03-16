import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, UserPlus, Eye, Search, Calendar } from 'lucide-react';
import { UserRole } from '../types/auth';
import '../styles/ITDashboard.css';
import Navbar from './Navbar';
import { createUser, fetchUsers, deleteUser, updateUser } from '../database/userService';

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
}

interface ITDashboardProps {
  onLogout: () => void;
}

const ITDashboard: React.FC<ITDashboardProps> = ({ onLogout }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'doctor',
  });


  const [activeTab, setActiveTab] = useState<'users' | 'patients'>('users');
  // const [isAddingUser, setIsAddingUser] = useState(false);
  // const [editingUser, setEditingUser] = useState<User | null>(null);
  // const [formData, setFormData] = useState<Partial<User>>({
  //   role: 'doctor'
  // });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample patients data
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: '1',
      firstName: 'Alice',
      lastName: 'Johnson',
      age: 28,
      gender: 'female',
      idNumber: 'P2024001',
      prediction: 'Result: Normal\nAccuracy: 95.32%',
      report: 'Regular check-up, no abnormalities detected.',
      dateTime: '2024-03-15T09:30:00Z'
    }
  ]);

  // Fetch users from Firestore on component mount
  useEffect(() => {
    const loadUsers = async () => {
      const usersData = await fetchUsers();
      setUsers(usersData as User[]);
    };
    loadUsers();
  }, []);


  // Handle adding or updating a user
  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      alert("Username and password are required!");
      return;
    }

    try {
      if (editingUser) {
        await updateUser(formData);
        setUsers(users.map(user => user.id === editingUser.id ? { ...user, ...formData } as User : user));
      } else {
        const newUser = {
          ...formData,
          id: Date.now().toString(),
        } as User;
        await createUser(newUser);
        setUsers([...users, newUser]);
      }

      setEditingUser(null);
      setIsAddingUser(false);
      setFormData({ role: 'doctor' });
    } catch (error) {
      console.error("Error saving user:", error);
    }
  };

  // Handle deleting a user
  const handleDeleteUser = async (id: string, username: string) => {
    await deleteUser(username);
    setUsers(users.filter(user => user.id !== id));
  };

  const handleDeletePatient = (id: string) => {
    setPatients(patients.filter(patient => patient.id !== id));
    setSelectedPatient(null);
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setFormData(user);
    setIsAddingUser(true);
  };

  const handleViewPatient = (patient: Patient) => {
    setSelectedPatient(patient);
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString();
  };

  // Filter and pagination logic for users
  const filteredUsers = users.filter(user => {
    const searchString = searchTerm?.toLowerCase() || ""; // Ensure searchTerm is a string
    return (
      (user.firstName?.toLowerCase() || "").includes(searchString) ||
      (user.lastName?.toLowerCase() || "").includes(searchString) ||
      (user.email?.toLowerCase() || "").includes(searchString) ||
      (user.username?.toLowerCase() || "").includes(searchString)
    );
  });  

  const totalUserPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Filter and pagination logic for patients
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
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
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
                            <button onClick={() => handleDeleteUser(user.id, user.username)} className="delete-button">
                              <Trash2 size={16} />
                            </button>
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
                      onClick={() => setCurrentPage(prev => Math.min(totalUserPages, prev + 1))}
                      disabled={currentPage === totalUserPages}
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
                            <button onClick={() => handleDeletePatient(patient.id)} className="delete-button">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
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

                  {selectedPatient.prediction && (
                    <div className="prediction-section">
                      <h4>AI Prediction Results</h4>
                      <pre className="prediction-text">{selectedPatient.prediction}</pre>
                    </div>
                  )}

                  {selectedPatient.report && (
                    <div className="report-section">
                      <h4>Medical Report</h4>
                      <p className="report-text">{selectedPatient.report}</p>
                    </div>
                  )}
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