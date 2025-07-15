import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from './firebase';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/dashboard'); // redirect on success
    } catch (err) {
      console.error("Login error:", err.code, err.message);
      alert(err.message);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.logo}>
          Orba <span style={styles.logoAccent}>Job Tracker</span>
        </div>

        <form onSubmit={handleLogin} style={styles.form}>
          <h2 style={styles.header}>Log In</h2>

          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email"
            required
            style={styles.input}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            required
            style={styles.input}
          />

          <button type="submit" style={styles.button}>Log In</button>

          <p style={styles.text}>
            Don’t have an account?{' '}
            <Link to="/signup" style={styles.link}>Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    backgroundColor: '#e8f4fd',
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inner: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  logo: {
    fontSize: '28px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  logoAccent: {
    color: '#007bff',
  },
  form: {
    backgroundColor: 'white',
    padding: '32px',
    borderRadius: '10px',
    boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    gap: '16px',
    width: '300px',
  },
  header: {
    margin: 0,
    textAlign: 'center',
    color: '#007bff',
  },
  input: {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    fontSize: '16px',
  },
  button: {
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  text: {
    fontSize: '14px',
    textAlign: 'center',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: 'bold',
  }
};
