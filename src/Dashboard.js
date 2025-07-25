import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const statuses = [
  'Submitted',
  'Home Assignment',
  'Technical Interview',
  'HR Interview',
  'Rejected After Process',
  'Rejected Without Response'
];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);
  const [editingApp, setEditingApp] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      if (!auth.currentUser) return;
      const q = collection(db, `users/${auth.currentUser.uid}/applications`);
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    };
    fetchApplications();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (err) {
      toast.error('Failed to logout');
    }
  };

  const handleDelete = (id) => {
    toast.info(
      <div>
        <strong>Delete this application?</strong>
        <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
          <button
            onClick={async () => {
              toast.dismiss();
              try {
                await deleteDoc(doc(db, `users/${auth.currentUser.uid}/applications`, id));
                setApplications(prev => prev.filter(app => app.id !== id));
                toast.success("Application deleted.");
              } catch (err) {
                toast.error("Failed to delete.");
              }
            }}
            style={styles.confirmButton}
          >
            Yes
          </button>
          <button onClick={() => toast.dismiss()} style={styles.cancelButton}>
            No
          </button>
        </div>
      </div>,
      { autoClose: false }
    );
  };

  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const updated = applications.map(app =>
      app.id === draggableId ? { ...app, status: destination.droppableId } : app
    );

    setApplications(updated);
    const docRef = doc(db, `users/${auth.currentUser.uid}/applications`, draggableId);
    await updateDoc(docRef, { status: destination.droppableId });
  };

  const toggleExpanded = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  const handleEditClick = (app) => {
    setEditingApp(app.id);
    setFormData({
      jobTitle: app.jobTitle || '',
      company: app.company || '',
      url: app.url || '',
      status: app.status || 'Submitted',
      companyDescription: app.companyDescription || ''
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateDoc(doc(db, `users/${auth.currentUser.uid}/applications`, editingApp), formData);
      setApplications(prev =>
        prev.map(app => app.id === editingApp ? { ...app, ...formData } : app)
      );
      setEditingApp(null);
      toast.success("Application updated.");
    } catch (err) {
      toast.error("Failed to update application.");
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.headerRow}>
        <div style={styles.logo}>
          Orba <span style={styles.logoAccent}>Job Tracker</span>
        </div>
        <button onClick={handleLogout} style={styles.logout}>Log Out</button>
      </div>

      <h2 style={styles.welcomeText}>Welcome, {auth.currentUser?.email}</h2>

      <DragDropContext onDragEnd={onDragEnd}>
        <div style={styles.board}>
          {statuses.map((status) => (
            <Droppable droppableId={status} key={status}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  style={styles.column}
                >
                  <h3 style={styles.header}>
                    {status} ({applications.filter(app => app.status === status).length})
                  </h3>
                  {applications.filter(app => app.status === status).length === 0 && (
                    <p style={styles.emptyText}>No applications yet</p>
                  )}
                  {applications
                    .filter(app => app.status === status)
                    .map((app, index) => (
                      <Draggable key={app.id} draggableId={app.id} index={index}>
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ ...styles.card, ...provided.draggableProps.style }}
                          >
                            {editingApp === app.id ? (
                              <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="Job Title" />
                                <input name="company" value={formData.company} onChange={handleChange} placeholder="Company" />
                                <input name="url" value={formData.url} onChange={handleChange} placeholder="Job Link" />
                                <select name="status" value={formData.status} onChange={handleChange}>
                                  {statuses.map(s => <option key={s}>{s}</option>)}
                                </select>
                                <textarea
                                  name="companyDescription"
                                  value={formData.companyDescription}
                                  onChange={handleChange}
                                  placeholder="Company Description"
                                />
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                                  <button type="submit">Save</button>
                                  <button type="button" onClick={() => setEditingApp(null)}>Cancel</button>
                                </div>
                              </form>
                            ) : (
                              <>
                                <div onClick={() => toggleExpanded(app.id)} style={{ fontWeight: 'bold', cursor: 'pointer' }}>
                                  {app.jobTitle} @ {app.company}
                                </div>
                                {app.date && (
                                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                    {new Date(app.date.seconds * 1000).toLocaleDateString('he-IL')}
                                  </div>
                                )}
                                {expandedId === app.id && (
                                  <div style={{ marginTop: '8px' }} dangerouslySetInnerHTML={{ __html: app.companyDescription }} />
                                )}
                                <div style={styles.footer}>
                                  <a href={app.url} target="_blank" rel="noreferrer">Job Link</a>
                                  <div>
                                    <button onClick={() => handleEditClick(app)} style={styles.edit}>✏️</button>
                                    <button onClick={() => handleDelete(app.id)} style={styles.delete}>🗑️</button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
};

const styles = {
  wrapper: {
    padding: '1rem',
    minHeight: '100vh',
    backgroundColor: '#eaf6ff',
    overflowX: 'hidden',
  },
  headerRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '12px',
  },
  logo: {
  fontSize: '30px',
  fontWeight: 'bold',
  color: '#333',
},
  logoAccent: {
    color: '#007bff',
  },
  welcomeText: {
  marginBottom: '20px',
  fontSize: '15px',
  },
  logout: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 14px',
    borderRadius: '4px',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px',
  },
board: {
  display: 'flex',
  justifyContent: 'space-evenly', // distribute columns evenly
  flexWrap: 'nowrap',
  overflowX: 'hidden', // hide scrollbar
  width: '100%',
  gap: '8px',
},
column: {
  flex: '1',
  maxWidth: '16.5%', // ~6 columns fit screen without scroll
  backgroundColor: '#f4f4f4',
  padding: '8px',
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '13px',
  overflowY: 'visible', // no scrollbars on column
},
header: {
  textAlign: 'center',
  marginBottom: '12px',
  fontSize: '16px',
  fontWeight: '600',
  color: '#007bff',
},
card: {
  backgroundColor: '#fff',
  border: '1px solid #ccc',
  borderRadius: '6px',
  padding: '12px 14px',
  marginBottom: '12px',
  boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  fontSize: '15px',
  lineHeight: '1.6',
  fontWeight: '500',
  color: '#111',
},
  footer: {
    marginTop: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  edit: {
    background: '#ffc107',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    marginRight: '6px',
  },
  delete: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
  },
emptyText: {
  fontStyle: 'italic',
  color: '#888',
  fontSize: '14px',
},
  confirmButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '13px',
  },
};

export default Dashboard;
