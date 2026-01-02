import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../api";
import "../styles/applicantList.css";
import "../styles/statusBadge.css";

function ViewApplicants() {
  const { jobId } = useParams();
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    API.get(`/applications/job/${jobId}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => setApplications(res.data))
      .catch(err => console.log(err));
  }, [jobId]);

  const markReviewed = async (appId) => {
    const token = localStorage.getItem("token");

    try {
      await API.patch(
        `/applications/${appId}/status`,
        { status: "Reviewed" },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      // Update UI instantly
      setApplications(prev =>
        prev.map(app =>
          app._id === appId
            ? { ...app, status: "Reviewed" }
            : app
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update status");
    }
  };

  return (
    <div className="container mt-5 applicant-wrapper">
      <Link to="/employer" className="back-link">
        ← Back to dashboard
      </Link>

      <h3 className="fw-bold mb-4">Applicants</h3>

      {applications.length === 0 && (
        <div className="no-applicants">
          <h5>No applications yet</h5>
          <p>Applicants will appear here once they apply.</p>
        </div>
      )}

      {applications.map(app => (
        <div key={app._id} className="applicant-card">
          {/* LEFT: Candidate Info */}
          <div className="applicant-info">
            <h6>{app.userId?.name}</h6>
            <p>{app.userId?.email}</p>

            <div className="applicant-meta">
              Applied on{" "}
              {new Date(app.appliedAt).toLocaleDateString(
                "en-GB",
                {
                  day: "2-digit",
                  month: "short",
                  year: "numeric"
                }
              )}
            </div>
          </div>

          {/* RIGHT: Actions */}
          <div className="applicant-actions">
            {/* STATUS BADGE */}
            <span
              className={`status-badge ${
                app.status === "Reviewed"
                  ? "status-reviewed"
                  : "status-applied"
              }`}
            >
              {app.status}
            </span>

            <div className="mt-2">
              {/* RESUME */}
              {app.resume && (
                <a
                  href={`http://localhost:5000/${app.resume}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <button className="resume-btn mb-2">
                    Download Resume
                  </button>
                </a>
              )}

              {/* MARK REVIEWED */}
              {app.status === "Applied" && (
                <button
                  className="resume-btn"
                  onClick={() => markReviewed(app._id)}
                >
                  Mark as Reviewed
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ViewApplicants;
