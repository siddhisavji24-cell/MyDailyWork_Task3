import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "../styles/navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState(null);

  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      return JSON.parse(atob(token.split(".")[1]));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const user = getUserFromToken();
    if (user) {
      setIsLoggedIn(true);
      setRole(user.role);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav className="navbar navbar-custom">
      <Link to="/" className="navbar-brand-custom">
        JobBoard
      </Link>

      <div className="ms-auto">
        {/* Public */}
        <Link to="/" className="btn nav-btn nav-btn-outline">
          Jobs
        </Link>

        {/* Candidate */}
        {isLoggedIn && role === "candidate" && (
          <Link
            to="/my-applications"
            className="btn nav-btn nav-btn-outline"
          >
            My Applications
          </Link>
        )}

        {/* Employer */}
        {isLoggedIn && role === "employer" && (
          <>
            <Link
              to="/post-job"
              className="btn nav-btn nav-btn-highlight"
            >
              Post Job
            </Link>

            <Link
              to="/employer"
              className="btn nav-btn nav-btn-outline"
            >
              Employer Dashboard
            </Link>
          </>
        )}

        {/* Auth */}
        {!isLoggedIn && (
          <>
            <Link to="/login" className="btn nav-btn nav-btn-outline">
              Login
            </Link>
            <Link to="/register" className="btn nav-btn nav-btn-outline">
              Register
            </Link>
          </>
        )}

        {isLoggedIn && (
          <button
            onClick={logout}
            className="btn nav-btn nav-btn-danger"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
