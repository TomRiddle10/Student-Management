import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Layout from "./components/Layout";

import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import StudentDetails from "./pages/StudentDetails";
import Attendance from "./pages/Attendance";

// Temporary Courses page
function Courses() {
  return <h1>Courses</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>

          {/* Dashboard */}
          <Route
            path="/"
            element={<Dashboard />}
          />

          {/* Students */}
          <Route
            path="/students"
            element={<Students />}
          />

          {/* Student Details */}
          <Route
            path="/students/:id"
            element={<StudentDetails />}
          />

          {/* Courses */}
          <Route
            path="/courses"
            element={<Courses />}
          />

          {/* Attendance */}
          <Route
            path="/attendance"
            element={<Attendance />}
          />

        </Route>

        {/* Unknown URL */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;