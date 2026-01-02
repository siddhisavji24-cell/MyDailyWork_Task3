import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../styles/employerDashboard.css";
import { FaMapMarkerAlt } from "react-icons/fa";

function EmployerDashboard() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/jobs/my-jobs", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-5">
      <div className="dashboard-header">
        <h2>Employer Dashboard</h2>
        <p className="text-muted">
          Manage your posted jobs and view applicants
        </p>
      </div>

      {jobs.length === 0 && (
        <div className="dashboard-empty">
          <h5>You haven’t posted any jobs yet</h5>
          <p>Post a job to start receiving applications.</p>
        </div>
      )}

      <div className="dashboard-grid">
        {jobs.map(job => (
          <div key={job._id} className="dashboard-card">
            <h5>{job.title}</h5>

            <div className="dashboard-meta">
              <FaMapMarkerAlt className="me-1" />
              {job.location}
            </div>

            <div className="dashboard-footer">
              <span className="dashboard-date">
                Posted on{" "}
                {new Date(job.createdAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }
                )}
              </span>

              <Link to={`/employer/job/${job._id}`}>
                <button className="dashboard-btn">
                  View Applicants
                </button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default EmployerDashboard;
