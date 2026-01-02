import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/jobDetail.css";
import { FaBuilding, FaMapMarkerAlt } from "react-icons/fa";

function JobDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [status, setStatus] = useState("");

  useEffect(() => {
    API.get(`/jobs/${id}`)
      .then(res => setJob(res.data))
      .catch(err => console.log(err));
  }, [id]);

  const applyJob = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (!resume) {
      setStatus("Please upload your resume (PDF).");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("resume", resume);

      await API.post(
        `/applications/apply/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      setStatus("✅ Application submitted successfully!");
    } catch (err) {
      setStatus(
        err.response?.data?.message || "❌ Application failed"
      );
    }
  };

  if (!job) {
    return (
      <div className="container mt-5 text-center">
        <p>Loading job details...</p>
      </div>
    );
  }

  return (
    <div className="container mt-5 job-detail-wrapper">
      <Link to="/" className="back-link">
        ← Back to jobs
      </Link>

      <div className="job-detail-card">
        {/* Header */}
        <h2 className="job-detail-title">{job.title}</h2>

        <p className="job-detail-meta">
          <FaBuilding className="me-2" />
          {job.company}
          <span className="ms-4">
            <FaMapMarkerAlt className="me-1" />
            {job.location}
          </span>
        </p>

        {/* Description */}
        <h5 className="section-title">Job Description</h5>
        <p className="job-detail-desc">
          {job.description}
        </p>

        {/* Apply Section */}
        <div className="apply-section">
          <div className="apply-card">
            <h6>Apply for this job</h6>
            <p>
              Upload your resume (PDF). The employer will review your
              application.
            </p>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResume(e.target.files[0])}
            />

            <br />

            <button
              className="apply-submit-btn"
              onClick={applyJob}
            >
              Submit Application
            </button>

            {status && (
              <div className="apply-status">{status}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetail;
