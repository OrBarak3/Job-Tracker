import React, { useEffect, useState } from 'react';
import { db, auth } from './firebase';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

const statuses = ['Submitted', 'Responded', 'Interview', 'Offer', 'Rejected'];

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const q = query(
          collection(db, 'applications'),
          where('user', '==', auth.currentUser?.email || 'or')
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setApplications(data);
      } catch (err) {
        console.error('Error fetching applications:', err);
      }
    };

    fetchApplications();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Delete this application?")) {
      try {
        await deleteDoc(doc(db, 'applications', id));
        setApplications(prev => prev.filter(app => app.id !== id));
      } catch (err) {
        console.error('Error deleting application:', err);
      }
    }
  };

  return (
    <div style={styles.board}>
      {statuses.map((status) => (
        <div key={status} style={styles.column}>
          <h3 style={styles.header}>{status} ({applications.filter(app => app.status === status).length})</h3>
          {applications
            .filter(app => app.status === status)
            .map((app) => (
              <div key={app.id} style={styles.card}>
                <strong>{app.jobTitle}</strong> @ {app.company}
                <p>{app.companyDescription}</p>
                <a href={app.url} target="_blank" rel="noreferrer">Job Link</a>
                <button onClick={() => handleDelete(app.id)} style={styles.delete}>🗑️ Delete</button>
              </div>
            ))}
        </div>
      ))}
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
  delete: {
    marginTop: '8px',
    background: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '6px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  }
};

export default Dashboard;
