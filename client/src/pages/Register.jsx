import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api";
import "../styles/register.css";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("candidate");

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: ""
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.post("/auth/register", {
        ...form,
        role
      });

      navigate("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-5 register-wrapper">
      <div className="register-card">
        <div className="register-header">
          <h3>Create Account</h3>
          <p>Join as a candidate or employer</p>
        </div>

        {/* ROLE SELECTION */}
        <div className="role-selector">
          <button
            type="button"
            className={`role-btn ${
              role === "candidate" ? "active" : ""
            }`}
            onClick={() => setRole("candidate")}
          >
            Candidate
          </button>

          <button
            type="button"
            className={`role-btn ${
              role === "employer" ? "active" : ""
            }`}
            onClick={() => setRole("employer")}
          >
            Employer
          </button>
        </div>

        <form onSubmit={submit}>
          {/* Name */}
          <div className="mb-3">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Full name"
              required
              value={form.name}
              onChange={handleChange}
            />
          </div>

          {/* Email */}
          <div className="mb-3">
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email address"
              required
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <input
              type="password"
              name="password"
              className="form-control"
              placeholder="Password"
              required
              value={form.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="register-submit">
            Create Account
          </button>
        </form>

        <div className="register-footer">
          Already have an account?{" "}
          <Link to="/login">Login</Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
