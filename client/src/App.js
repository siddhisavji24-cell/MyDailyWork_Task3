import { Link } from "react-router-dom";

import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Jobs from "./pages/Jobs";
import PostJob from "./pages/PostJob";
import Login from "./pages/Login";
import Register from "./pages/Register";
import JobDetail from "./pages/JobDetail";
import MyApplications from "./pages/MyApplications";
import ProtectedRoute from "./components/ProtectedRoute";
import EmployerDashboard from "./pages/EmployerDashboard";
import ViewApplicants from "./pages/ViewApplicants";

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        {/* Home */}
        <Route path="/" element={<Jobs />} />

        {/* Job Detail */}
        <Route path="/jobs/:id" element={<JobDetail />} />

        {/* Protected Routes */}
        <Route
          path="/post-job"
          element={
            <ProtectedRoute>
              <PostJob />
            </ProtectedRoute>
          }
        />
        <Route
  path="/employer"
  element={
    <ProtectedRoute>
      <EmployerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/employer/job/:jobId"
  element={
    <ProtectedRoute>
      <ViewApplicants />
    </ProtectedRoute>
  }
/>


        <Route
          path="/my-applications"
          element={
            <ProtectedRoute>
              <MyApplications />
            </ProtectedRoute>
          }
        />

        {/* Auth */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
