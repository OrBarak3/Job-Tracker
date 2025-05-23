import React, { useState } from 'react';
import { db } from '../firebase';
import { addDoc, collection, Timestamp } from 'firebase/firestore';
import { auth } from '../firebase';

const AddApplication = () => {
  const [form, setForm] = useState({
    company: '',
    jobTitle: '',
    companyDescription: '',
    submissionDate: '',
    status: 'Submitted',
    url: ''
  });

  const handleChange = e => {
    setForm({...form, [e.target.name]: e.target.value});
  };

  const handleSubmit = async e => {
    e.preventDefault();
    await addDoc(collection(db, "applications"), {
      ...form,
      user: auth.currentUser.email,
      createdAt: Timestamp.now()
    });
    setForm({ company: '', jobTitle: '', companyDescription: '', submissionDate: '', status: 'Submitted', url: '' });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input name="company" placeholder="Company" onChange={handleChange} value={form.company} required />
      <input name="jobTitle" placeholder="Job Title" onChange={handleChange} value={form.jobTitle} required />
      <textarea name="companyDescription" placeholder="Description" onChange={handleChange} value={form.companyDescription} />
      <input type="datetime-local" name="submissionDate" onChange={handleChange} value={form.submissionDate} required />
      <select name="status" onChange={handleChange} value={form.status}>
        <option>Submitted</option>
        <option>Responded</option>
        <option>Interview</option>
        <option>Offer</option>
        <option>Rejected</option>
      </select>
      <input name="url" placeholder="Job Posting URL" onChange={handleChange} value={form.url} />
      <button type="submit">Add Application</button>
    </form>
  );
};

export default AddApplication;
