import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  deleteDoc
} from 'firebase/firestore';
//import { signOut } from 'firebase/auth';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { toast } from 'react-toastify';


const statuses = ['Submitted', 'Responded', 'Interview', 'Offer', 'Rejected'];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  //const navigate = useNavigate();

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
            toast.dismiss(); // close the toast
            try {
              await deleteDoc(doc(db, `users/${auth.currentUser.uid}/applications`, id));
              setApplications(prev => prev.filter(app => app.id !== id));
              toast.success("Application deleted.");
            } catch (err) {
              console.error("Error deleting application:", err);
              toast.error("Failed to delete.");
            }
          }}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
          Yes
        </button>
        <button
          onClick={() => toast.dismiss()}
          style={{
            backgroundColor: '#6c757d',
            color: 'white',
            border: 'none',
            padding: '4px 10px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
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

    // Update Firestore
    const docRef = doc(db, `users/${auth.currentUser.uid}/applications`, draggableId);
    await updateDoc(docRef, { status: destination.droppableId });
  };

  return (
    <div style={{ padding: '1rem' }}>
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
                            <strong>{app.jobTitle}</strong> @ {app.company}
                            <p>{app.companyDescription}</p>
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
  }
};

export default Dashboard;
