import { useEffect, useState } from "react";
import API from "../api";
import "../styles/statusBadge.css";
import "../styles/myApplications.css";

function MyApplications() {
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get("/applications/my", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setApplications(res.data))
      .catch(err => console.log(err));
  }, []);

  return (
    <div className="container mt-5 myapps-wrapper">
      <h2 className="fw-bold mb-4">My Applications</h2>

      {applications.length === 0 && (
        <div className="myapps-empty">
          <h5>No applications yet</h5>
          <p>Start applying to jobs to see them here.</p>
        </div>
      )}

      <div className="myapps-grid">
        {applications.map(app => (
          <div key={app._id} className="myapp-card">
            <div className="myapp-title">
              {app.jobId?.title}
            </div>

            <div className="myapp-company">
              {app.jobId?.company} • {app.jobId?.location}
            </div>

            {/* STATUS */}
            <span
              className={`status-badge ${
                app.status === "Reviewed"
                  ? "status-reviewed"
                  : "status-applied"
              }`}
            >
              {app.status}
            </span>

            <div className="myapp-footer mt-3">
              <span className="myapp-date">
                Applied on{" "}
                {new Date(app.appliedAt).toLocaleDateString(
                  "en-GB",
                  {
                    day: "2-digit",
                    month: "short",
                    year: "numeric"
                  }
                )}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MyApplications;
