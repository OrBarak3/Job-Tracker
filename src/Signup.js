// Signup.js
import { useState } from 'react';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Import updateProfile
import { auth, db } from './firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState(''); // State for First Name
  const [lastName, setLastName] = useState('');   // State for Last Name
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      // Create user with email and password
      const userCred = await createUserWithEmailAndPassword(auth, email, password);

      // Update the user's profile displayName (optional, combines first & last)
      // This makes the name readily available on the user object (user.displayName)
      await updateProfile(userCred.user, {
        displayName: `${firstName} ${lastName}`.trim() || null,
      });

      // Save additional user data (first name, last name) to Firestore
      // under the 'users/{uid}' document
      await setDoc(doc(db, "users", userCred.user.uid), {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        // You can add other user-related fields here if needed in the future
        // email: email, // Email is already in the auth object, but you could store it here too
      });

      alert("Account created!");
      navigate('/dashboard');
    } catch (err) {
      console.error("Signup error:", err.code, err.message);
      // Provide user-friendly error messages
      let errorMessage = "Failed to create account.";
      if (err.code === 'auth/email-already-in-use') {
         errorMessage = "This email is already registered.";
      } else if (err.code === 'auth/invalid-email') {
         errorMessage = "Please enter a valid email address.";
      } else if (err.code === 'auth/weak-password') {
         errorMessage = "Password should be at least 6 characters.";
      }
      alert(errorMessage);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.inner}>
        <div style={styles.logo}>
          Orba <span style={styles.logoAccent}>Job Tracker</span>
        </div>

        <form onSubmit={handleSignup} style={styles.form}>
          <h2 style={styles.header}>Sign Up</h2>

          {/* First Name Input */}
          <input
            type="text"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            placeholder="First Name"
            // required // Optional: Make first name required
            style={styles.input}
          />

          {/* Last Name Input */}
          <input
            type="text"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            placeholder="Last Name"
            // required // Optional: Make last name required
            style={styles.input}
          />

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

          <button type="submit" style={styles.button}>Sign Up</button>

          <p style={styles.text}>
            Already have an account?{' '}
            <Link to="/login" style={styles.link}>Log In</Link>
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
