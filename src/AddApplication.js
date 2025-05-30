import React, { useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const AddApplication = () => {
  const [form, setForm] = useState({
    company: '',
    jobTitle: '',
    companyDescription: '',
    submissionDate: '',
    status: 'Submitted',
    url: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to submit an application.");
      return;
    }

    try {
      await addDoc(
        collection(db, `users/${user.uid}/applications`),
        {
          company: form.company,
          jobTitle: form.jobTitle,
          companyDescription: form.companyDescription,
          date: Timestamp.fromDate(new Date(form.submissionDate)), // 👈 store as Firestore Timestamp
          status: form.status,
          url: form.url,
          createdAt: Timestamp.now()
        }
      );

      toast.success("Application added!");

      setTimeout(() => {
        navigate('/dashboard');
      }, 2000);
    } catch (err) {
      console.error("Error adding application:", err);
      toast.error("Failed to add application. See console.");
    }
  };

  return (
    <div className="auth-container">
      <form onSubmit={handleSubmit} className="auth-box">
        <h2>Add Application</h2>
        <input
          name="company"
          className="auth-input"
          placeholder="Company Name"
          value={form.company}
          onChange={handleChange}
          required
        />
        <input
          name="jobTitle"
          className="auth-input"
          placeholder="Job Title"
          value={form.jobTitle}
          onChange={handleChange}
          required
        />
        <textarea
          name="companyDescription"
          className="auth-input"
          placeholder="Company Description"
          value={form.companyDescription}
          onChange={handleChange}
        />
        <input
          type="datetime-local"
          name="submissionDate"
          className="auth-input"
          value={form.submissionDate}
          onChange={handleChange}
          required
        />
        <select
          name="status"
          className="auth-input"
          value={form.status}
          onChange={handleChange}
        >
          <option>Submitted</option>
          <option>Responded</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
        <input
          name="url"
          className="auth-input"
          placeholder="Job Posting URL"
          value={form.url}
          onChange={handleChange}
        />
        <button type="submit" className="auth-button">Submit</button>
      </form>
    </div>
  );
};

export default AddApplication;
