import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

// Authentication
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// Main pages
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Attendance from "./pages/Attendance";
import Courses from "./pages/Courses";
import Teachers from "./pages/Teachers";

// Student pages
import StudentAttendance from "./pages/StudentAttendance";


// =========================================================
// Protected Route
// =========================================================

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}


// =========================================================
// Role Protected Route
// =========================================================

function RoleRoute({ allowedRoles, children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}


// =========================================================
// App
// =========================================================

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================================================= */}
        {/* Authentication Routes */}
        {/* ================================================= */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />


        {/* ================================================= */}
        {/* Protected Application Routes */}
        {/* ================================================= */}

        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >

          {/* ================================================= */}
          {/* Dashboard */}
          {/* ================================================= */}

          <Route
            path="/"
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="/dashboard"
            element={<Dashboard />}
          />


          {/* ================================================= */}
          {/* Students */}
          {/* ADMIN + TEACHER */}
          {/* ================================================= */}

          <Route
            path="/students"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "TEACHER",
                ]}
              >
                <Students />
              </RoleRoute>
            }
          />


          {/* ================================================= */}
          {/* Student Details */}
          {/* ADMIN + TEACHER + STUDENT */}
          {/* ================================================= */}

          <Route
            path="/students/:id"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "TEACHER",
                  "STUDENT",
                ]}
              >
                <StudentDetails />
              </RoleRoute>
            }
          />


          {/* ================================================= */}
          {/* Courses */}
          {/* ADMIN + TEACHER + STUDENT */}
          {/* ================================================= */}

          <Route
            path="/courses"
            element={<Courses />}
          />


          {/* ================================================= */}
          {/* Attendance - Teachers/Admin */}
          {/* ADMIN + TEACHER */}
          {/* ================================================= */}

          <Route
            path="/attendance"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                  "TEACHER",
                ]}
              >
                <Attendance />
              </RoleRoute>
            }
          />


          {/* ================================================= */}
          {/* Student Attendance */}
          {/* STUDENT ONLY */}
          {/* ================================================= */}

          <Route
            path="/student-attendance"
            element={
              <RoleRoute
                allowedRoles={[
                  "STUDENT",
                ]}
              >
                <StudentAttendance />
              </RoleRoute>
            }
          />


          {/* ================================================= */}
          {/* Teachers */}
          {/* ADMIN ONLY */}
          {/* ================================================= */}

          <Route
            path="/teachers"
            element={
              <RoleRoute
                allowedRoles={[
                  "ADMIN",
                ]}
              >
                <Teachers />
              </RoleRoute>
            }
          />

        </Route>


        {/* ================================================= */}
        {/* Unknown URL */}
        {/* ================================================= */}

        <Route
          path="*"
          element={
            <Navigate
              to="/dashboard"
              replace
            />
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;