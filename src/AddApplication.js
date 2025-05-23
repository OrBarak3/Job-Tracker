import React, { useState } from 'react';
import { db, auth } from './firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';

const AddApplication = () => {
  const [form, setForm] = useState({
    company: '',
    jobTitle: '',
    companyDescription: '',
    submissionDate: '',
    status: 'Submitted',
    url: ''
  });

  const handleChange = (e) => {
    setForm({...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'applications'), {
        ...form,
        user: auth.currentUser?.email || "or", // fallback for now
        createdAt: Timestamp.now()
      });
      alert("Application added!");
      setForm({
        company: '',
        jobTitle: '',
        companyDescription: '',
        submissionDate: '',
        status: 'Submitted',
        url: ''
      });
    } catch (err) {
      console.error("Error adding application:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '500px' }}>
      <input name="company" placeholder="Company Name" value={form.company} onChange={handleChange} required />
      <input name="jobTitle" placeholder="Job Title" value={form.jobTitle} onChange={handleChange} required />
      <textarea name="companyDescription" placeholder="Company Description" value={form.companyDescription} onChange={handleChange} />
      <input type="datetime-local" name="submissionDate" value={form.submissionDate} onChange={handleChange} required />
      <select name="status" value={form.status} onChange={handleChange}>
        <option>Submitted</option>
        <option>Responded</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input name="url" placeholder="Job Posting URL" value={form.url} onChange={handleChange} />
      <button type="submit">Submit</button>
    </form>
  );
};

export default AddApplication;
