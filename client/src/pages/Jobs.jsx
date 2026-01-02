import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api";
import "../styles/jobCard.css";
import { FaBuilding, FaMapMarkerAlt, FaSearch } from "react-icons/fa";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    API.get("/jobs")
      .then(res => setJobs(res.data))
      .catch(err => console.log(err));
  }, []);

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(search.toLowerCase()) ||
    job.company.toLowerCase().includes(search.toLowerCase()) ||
    job.location.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="container mt-5">
      <h2 className="fw-bold mb-2">Explore Jobs</h2>
      <p className="text-muted mb-4">
        Find opportunities that match your skills
      </p>

      {/* Search */}
      <div className="job-search">
        <div className="input-group">
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title, company, location"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {filteredJobs.length === 0 && (
        <div className="empty-state">
          <h5>No jobs found</h5>
          <p>Try changing your search keywords.</p>
        </div>
      )}

      {/* GRID */}
      <div className="job-grid">
        {filteredJobs.map(job => (
          <div key={job._id} className="job-card">
            <h4 className="job-title">{job.title}</h4>

            <div className="job-meta">
              <FaBuilding className="me-1" />
              {job.company}
              <br />
              <FaMapMarkerAlt className="me-1 mt-1" />
              {job.location}
            </div>

            <p className="job-desc">
              {job.description.substring(0, 100)}...
            </p>

            <div className="job-footer">
              <span className="text-muted small">
                View details
              </span>

              <Link to={`/jobs/${job._id}`}>
                <button className="job-btn">Open</button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Jobs;
