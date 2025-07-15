import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import AddApplication from './AddApplication';
import Dashboard from './Dashboard';
import Signup from './Signup';
import Login from './Login';
import { useAuth } from './AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <Router>
      <Main />
    </Router>
  );
}

function PrivateRoute({ element }) {
  const { currentUser } = useAuth();
  return currentUser ? element : <Navigate to="/login" />;
}

function Main() {
  const { currentUser } = useAuth();
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <>
      {!isAuthPage && currentUser && (
        <div style={styles.navbar}>
          <Link to="/dashboard" style={styles.link}>Dashboard</Link>
          <Link to="/add" style={styles.link}>Add Application</Link>
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

      <ToastContainer position="top-center" autoClose={2000} />

      <div style={styles.footer}>
        Created by Or Barak – <a href="mailto:orbarak1997@gmail.com" style={styles.email}>orbarak1997@gmail.com</a>
      </div>
    </>
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
    minHeight: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    paddingBottom: '40px',
  },
  footer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    padding: '8px 16px',
    fontSize: '14px',
    color: '#555',
    backgroundColor: 'transparent',
    zIndex: 1000,
  },
  email: {
    color: '#007bff',
    textDecoration: 'none',
    marginLeft: '4px',
  },
};

export default App;
