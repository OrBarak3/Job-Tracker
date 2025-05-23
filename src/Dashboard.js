import { useEffect, useState } from "react";
import { db, auth } from "../firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const fetchApps = async () => {
      const q = query(collection(db, "applications"), where("user", "==", auth.currentUser.email));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setApplications(data);
    };
    fetchApps();
  }, []);

  return (
    <div>
      {["Submitted", "Responded", "Interview", "Offer", "Rejected"].map(status => (
        <div key={status}>
          <h2>{status}</h2>
          {applications.filter(app => app.status === status).map(app => (
            <div key={app.id}>
              <h3>{app.jobTitle} @ {app.company}</h3>
              <p>{app.companyDescription}</p>
              <a href={app.url} target="_blank" rel="noreferrer">Job Link</a>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Dashboard;
