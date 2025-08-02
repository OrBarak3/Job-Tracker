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
    const { name, value } = e.target;

    if (name === "url") {
      try {
        const url = new URL(value);
        let companyGuess = "";

        if (url.hostname.includes("greenhouse.io") || url.hostname.includes("lever.co")) {
          const pathParts = url.pathname.split('/').filter(Boolean);
          companyGuess = pathParts[0];
        } else {
          const domainParts = url.hostname.split('.');
          companyGuess = domainParts.length === 2
            ? domainParts[0]
            : domainParts[domainParts.length - 2];
        }

        const capitalized = companyGuess.charAt(0).toUpperCase() + companyGuess.slice(1);

        setForm(prev => ({
          ...prev,
          url: value,
          company: prev.company || capitalized
        }));
      } catch {
        setForm(prev => ({ ...prev, url: value }));
      }
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  };
  console.log("auth.currentUser:", auth.currentUser);
  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = auth.currentUser;
    if (!user) {
      toast.error("You must be logged in to submit an application.");
      return;
    }

    try {
      console.log("Writing to path: users/" + user.uid + "/applications");

      await addDoc(
        collection(db, `users/${user.uid}/applications`),
        {
          company: form.company,
          jobTitle: form.jobTitle,
          companyDescription: form.companyDescription,
          date: Timestamp.fromDate(new Date(form.submissionDate)),
          status: form.status,
          url: form.url,
          createdAt: Timestamp.now()
        }
      );

      toast.success("Application added!");
      setTimeout(() => navigate('/dashboard'), 2000);
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
          <option>Home Assignment</option>
          <option>Technical Interview</option>
          <option>HR Interview</option>
          <option>Rejected After Process</option>
          <option>Rejected Without Response</option>
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
