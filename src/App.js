import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import AddApplication from './AddApplication';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import { useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PrivateRoute({ element }) {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
}

function App() {
  const { currentUser } = useAuth();

  return (
    <Router>
      {currentUser && (
        <div style={styles.navbar}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/add" style={styles.link}>Add Application</Link>
          <button
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            style={{ ...styles.link, background: 'none', border: 'none' }}
          >
            Log Out
          </button>
        </div>
      )}

      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
          <Route path="/add" element={<PrivateRoute element={<AddApplication />} />} />
        </Routes>
      </div>

      {/* ✅ Global toast notifications */}
      <ToastContainer position="top-center" autoClose={2000} />
    </Router>
  );
}

const styles = {
  navbar: {
    background: '#007bff',
    padding: '12px',
    display: 'flex',
    gap: '16px',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  container: {
    padding: '24px',
  }
};

export default App;
