import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const submit = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/auth/login", form);

      // Save token
      localStorage.setItem("token", res.data.token);

      // Redirect to Jobs page
      window.location.href = "/";

    } catch (err) {
      alert("Invalid email or password");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card shadow">
        <h3 className="fw-bold mb-3 text-center">Welcome Back 👋</h3>
        <p className="text-muted text-center mb-4">
          Login to continue exploring jobs
        </p>

        <form onSubmit={submit}>
          <input
            type="email"
            className="form-control mb-3"
            placeholder="Email address"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            required
          />

          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            required
          />

          <button className="btn btn-primary w-100 mb-3">
            Login
          </button>
        </form>

        <p className="text-center small text-muted">
          Don’t have an account? <a href="/register">Register</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
