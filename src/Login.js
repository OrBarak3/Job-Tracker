import { useState } from 'react';
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
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
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      alert(error.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await signInAnonymously(auth);
      navigate('/dashboard');
    } catch (error) {
      console.error('Guest login error:', error);
      alert(error.message);
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
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={styles.input}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>Log In</button>

          <button type="button" onClick={handleGuestLogin} style={styles.guestButton}>
            Continue as guest
          </button>
          <p style={styles.guestNote}>(your data won't be saved though)</p>

          <p style={styles.text}>
            Don’t have an account? <Link to="/signup" style={styles.link}>Sign Up</Link>
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
  guestButton: {
    backgroundColor: '#6c757d',
    color: 'white',
    border: 'none',
    padding: '10px',
    borderRadius: '5px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  guestNote: {
    fontSize: '12px',
    color: '#888',
    textAlign: 'center',
    marginTop: '-10px',
    marginBottom: '5px',
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
