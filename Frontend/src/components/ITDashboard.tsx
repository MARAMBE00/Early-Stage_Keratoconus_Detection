import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, Users, UserPlus, Eye, Search, Calendar } from 'lucide-react';
import { UserRole } from '../types/auth';
import '../styles/ITDashboard.css';
import Navbar from './Navbar';

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
  const [activeTab, setActiveTab] = useState<'users' | 'patients'>('users');
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<Partial<User>>({
    role: 'doctor'
  });
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDate, setFilterDate] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Sample users data
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      firstName: 'John',
      lastName: 'Smith',
      username: 'jsmith',
      password: 'password123',
      email: 'john.smith@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '2',
      firstName: 'Sarah',
      lastName: 'Johnson',
      username: 'sjohnson',
      password: 'password123',
      email: 'sarah.johnson@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 234-5678'
    },
    {
      id: '3',
      firstName: 'Michael',
      lastName: 'Brown',
      username: 'mbrown',
      password: 'password123',
      email: 'michael.brown@hospital.com',
      role: 'topographer',
      phone: '+1 (555) 345-6789'
    },
    {
      id: '4',
      firstName: 'Emily',
      lastName: 'Davis',
      username: 'edavis',
      password: 'password123',
      email: 'emily.davis@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 456-7890'
    },
    {
      id: '5',
      firstName: 'David',
      lastName: 'Wilson',
      username: 'dwilson',
      password: 'password123',
      email: 'david.wilson@hospital.com',
      role: 'topographer',
      phone: '+1 (555) 567-8901'
    },
    {
      id: '6',
      firstName: 'Lisa',
      lastName: 'Anderson',
      username: 'landerson',
      password: 'password123',
      email: 'lisa.anderson@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 678-9012'
    },
    {
      id: '7',
      firstName: 'Robert',
      lastName: 'Taylor',
      username: 'rtaylor',
      password: 'password123',
      email: 'robert.taylor@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 789-0123'
    },
    {
      id: '8',
      firstName: 'Jennifer',
      lastName: 'Martinez',
      username: 'jmartinez',
      password: 'password123',
      email: 'jennifer.martinez@hospital.com',
      role: 'topographer',
      phone: '+1 (555) 890-1234'
    },
    {
      id: '9',
      firstName: 'William',
      lastName: 'Thomas',
      username: 'wthomas',
      password: 'password123',
      email: 'william.thomas@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 901-2345'
    },
    {
      id: '10',
      firstName: 'Elizabeth',
      lastName: 'Garcia',
      username: 'egarcia',
      password: 'password123',
      email: 'elizabeth.garcia@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 012-3456'
    },
    {
      id: '11',
      firstName: 'James',
      lastName: 'Moore',
      username: 'jmoore',
      password: 'password123',
      email: 'james.moore@hospital.com',
      role: 'topographer',
      phone: '+1 (555) 123-4567'
    },
    {
      id: '12',
      firstName: 'Patricia',
      lastName: 'Lee',
      username: 'plee',
      password: 'password123',
      email: 'patricia.lee@hospital.com',
      role: 'doctor',
      phone: '+1 (555) 234-5678'
    }
  ]);

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
    },
    {
      id: '2',
      firstName: 'Bob',
      lastName: 'Smith',
      age: 45,
      gender: 'male',
      idNumber: 'P2024002',
      prediction: 'Result: Keratoconus\nAccuracy: 87.65%',
      report: 'Early signs of keratoconus detected. Further monitoring required.',
      dateTime: '2024-03-15T10:15:00Z'
    },
    {
      id: '3',
      firstName: 'Carol',
      lastName: 'Davis',
      age: 35,
      gender: 'female',
      idNumber: 'P2024003',
      prediction: 'Result: Normal\nAccuracy: 92.18%',
      report: 'Follow-up examination shows normal results.',
      dateTime: '2024-03-14T14:30:00Z'
    },
    {
      id: '4',
      firstName: 'David',
      lastName: 'Wilson',
      age: 52,
      gender: 'male',
      idNumber: 'P2024004',
      prediction: 'Result: Suspect\nAccuracy: 78.91%',
      report: 'Additional testing recommended.',
      dateTime: '2024-03-14T15:45:00Z'
    },
    {
      id: '5',
      firstName: 'Emma',
      lastName: 'Brown',
      age: 31,
      gender: 'female',
      idNumber: 'P2024005',
      prediction: 'Result: Normal\nAccuracy: 94.67%',
      report: 'Regular check-up completed successfully.',
      dateTime: '2024-03-13T11:20:00Z'
    },
    {
      id: '6',
      firstName: 'Frank',
      lastName: 'Miller',
      age: 41,
      gender: 'male',
      idNumber: 'P2024006',
      prediction: 'Result: Keratoconus\nAccuracy: 89.23%',
      report: 'Moderate keratoconus detected. Treatment plan initiated.',
      dateTime: '2024-03-13T13:45:00Z'
    },
    {
      id: '7',
      firstName: 'Grace',
      lastName: 'Taylor',
      age: 29,
      gender: 'female',
      idNumber: 'P2024007',
      prediction: 'Result: Normal\nAccuracy: 96.54%',
      report: 'All measurements within normal range.',
      dateTime: '2024-03-12T09:15:00Z'
    },
    {
      id: '8',
      firstName: 'Henry',
      lastName: 'Anderson',
      age: 48,
      gender: 'male',
      idNumber: 'P2024008',
      prediction: 'Result: Suspect\nAccuracy: 82.34%',
      report: 'Follow-up examination scheduled.',
      dateTime: '2024-03-12T10:30:00Z'
    },
    {
      id: '9',
      firstName: 'Isabel',
      lastName: 'Martinez',
      age: 33,
      gender: 'female',
      idNumber: 'P2024009',
      prediction: 'Result: Normal\nAccuracy: 93.87%',
      report: 'Regular monitoring recommended.',
      dateTime: '2024-03-11T14:20:00Z'
    },
    {
      id: '10',
      firstName: 'Jack',
      lastName: 'Thomas',
      age: 39,
      gender: 'male',
      idNumber: 'P2024010',
      prediction: 'Result: Keratoconus\nAccuracy: 88.92%',
      report: 'Early intervention recommended.',
      dateTime: '2024-03-11T15:45:00Z'
    },
    {
      id: '11',
      firstName: 'Karen',
      lastName: 'White',
      age: 36,
      gender: 'female',
      idNumber: 'P2024011',
      prediction: 'Result: Normal\nAccuracy: 95.11%',
      report: 'No significant changes observed.',
      dateTime: '2024-03-10T11:30:00Z'
    },
    {
      id: '12',
      firstName: 'Leo',
      lastName: 'Garcia',
      age: 44,
      gender: 'male',
      idNumber: 'P2024012',
      prediction: 'Result: Suspect\nAccuracy: 76.45%',
      report: 'Additional testing scheduled.',
      dateTime: '2024-03-10T13:15:00Z'
    }
  ]);

  const handleUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingUser) {
      setUsers(users.map(user => 
        user.id === editingUser.id ? { ...user, ...formData } as User : user
      ));
      setEditingUser(null);
    } else {
      const newUser = {
        ...formData,
        id: Date.now().toString(),
      } as User;
      setUsers([...users, newUser]);
    }
    setIsAddingUser(false);
    setFormData({ role: 'doctor' });
  };

  const handleDeleteUser = (id: string) => {
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
    const searchString = searchTerm.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(searchString) ||
      user.lastName.toLowerCase().includes(searchString) ||
      user.email.toLowerCase().includes(searchString) ||
      user.username.toLowerCase().includes(searchString)
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
      <Navbar role="it" onLogout={onLogout} />
      
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
              <UserForm />
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
                            <button onClick={() => handleDeleteUser(user.id)} className="delete-button">
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