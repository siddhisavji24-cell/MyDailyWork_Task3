import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/postJob.css";

function PostJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    description: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");

    try {
      await API.post("/jobs", form, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      navigate("/employer");
    } catch (err) {
      alert("Failed to post job");
    }
  };

  return (
    <div className="container mt-5 postjob-wrapper">
      <div className="postjob-card">
        <div className="postjob-header">
          <h3>Post a New Job</h3>
          <p>
            Fill in the details below to publish your job opening.
          </p>
        </div>

        <form onSubmit={submit}>
          {/* Job Title */}
          <div className="mb-3">
            <label>Job Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              placeholder="e.g. Frontend Developer"
              required
              value={form.title}
              onChange={handleChange}
            />
          </div>

          {/* Company */}
          <div className="mb-3">
            <label>Company Name</label>
            <input
              type="text"
              name="company"
              className="form-control"
              placeholder="e.g. ABC Technologies"
              required
              value={form.company}
              onChange={handleChange}
            />
          </div>

          {/* Location */}
          <div className="mb-3">
            <label>Location</label>
            <input
              type="text"
              name="location"
              className="form-control"
              placeholder="e.g. Bangalore / Remote"
              required
              value={form.location}
              onChange={handleChange}
            />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label>Job Description</label>
            <textarea
              rows="5"
              name="description"
              className="form-control"
              placeholder="Describe responsibilities, requirements, etc."
              required
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="postjob-submit">
            Publish Job
          </button>
        </form>
      </div>
    </div>
  );
}

export default PostJob;
