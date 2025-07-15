import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';

const statuses = [
  'Submitted',
  'Home Assignment',
  'Technical Interview',
  'HR Interview',
  'Rejected'
];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

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
                console.error("Error deleting application:", err);
                toast.error("Failed to delete.");
              }
            }}
            style={styles.confirmButton}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss()}
            style={styles.cancelButton}
          >
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

    const updated = applications.map(app => {
      if (app.id === draggableId) {
        return { ...app, status: destination.droppableId };
      }
      return app;
    });

    setApplications(updated);
    const docRef = doc(db, `users/${auth.currentUser.uid}/applications`, draggableId);
    await updateDoc(docRef, { status: destination.droppableId });
  };

  const toggleExpanded = (id) => {
    setExpandedId(prev => (prev === id ? null : id));
  };

  return (
    <div style={{ padding: '1rem' }}>
      <div style={styles.logo}>
        Orba <span style={styles.logoAccent}>Job Tracker</span>
      </div>

      <h2>Welcome, {auth.currentUser?.email}</h2>

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
                            <div
                              onClick={() => toggleExpanded(app.id)}
                              style={{ cursor: 'pointer', fontWeight: 'bold' }}
                            >
                              {app.jobTitle} @ {app.company}
                            </div>

                            {app.date && (
                              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '4px' }}>
                                {new Date(app.date.seconds * 1000).toLocaleDateString('he-IL')}
                              </div>
                            )}

                            {expandedId === app.id && (
                              <div
                                style={{ marginTop: '8px' }}
                                dangerouslySetInnerHTML={{ __html: app.companyDescription }}
                              />
                            )}

                            <div style={styles.footer}>
                              <a href={app.url} target="_blank" rel="noreferrer">Job Link</a>
                              <button onClick={() => handleDelete(app.id)} style={styles.delete}>🗑️</button>
                            </div>
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
  logo: {
    fontSize: '26px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '16px',
  },
  logoAccent: {
    color: '#007bff',
  },
  board: {
    display: 'flex',
    gap: '16px',
    overflowX: 'auto',
  },
  column: {
    minWidth: '240px',
    backgroundColor: '#f4f4f4',
    padding: '12px',
    borderRadius: '8px',
    flex: '1',
  },
  header: {
    textAlign: 'center',
    marginBottom: '12px',
    color: '#007bff',
  },
  card: {
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '6px',
    padding: '8px',
    marginBottom: '8px',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  },
  footer: {
    marginTop: '12px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  delete: {
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 8px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
  },
  confirmButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  },
  cancelButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '4px 10px',
    borderRadius: '4px',
    cursor: 'pointer',
    fontWeight: 'bold'
  }
};

export default Dashboard;
