import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import AddApplication from './AddApplication';
import Dashboard from './Dashboard';

function App() {
  return (
    <Router>
      <div style={styles.navbar}>
        <Link to="/" style={styles.link}>Dashboard</Link>
        <Link to="/add" style={styles.link}>Add Application</Link>
      </div>

      <div style={styles.container}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/add" element={<AddApplication />} />
        </Routes>
      </div>
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
  },
  container: {
    padding: '24px',
  }
};

export default App;
