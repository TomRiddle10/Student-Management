import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Grid,
  Typography,
} from "@mui/material";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import LogoutIcon from "@mui/icons-material/Logout";

function StudentDashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Unable to load user information", error);
    }
  }, []);

  if (!user) {
    return (
      <Box
        minHeight="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    <Box sx={{ pb: 5 }}>
      {/* HEADER */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={800}
        >
          Student Dashboard
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Welcome back, {user.username || "Student"}.
        </Typography>
      </Box>

      {/* PROFILE */}
      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            alignItems="center"
            gap={2}
          >
            <Box
              sx={{
                width: 55,
                height: 55,
                borderRadius: "50%",
                bgcolor: "primary.main",
                color: "white",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PersonOutlinedIcon />
            </Box>

            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                {user.username || "Student"}
              </Typography>

              <Typography color="text.secondary">
                {user.email || "Student account"}
              </Typography>

              <Typography
                variant="body2"
                color="primary"
                sx={{ mt: 0.5 }}
              >
                Student
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* STUDENT FEATURES */}
      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 4,
              },
            }}
            onClick={() => navigate("/courses")}
          >
            <CardContent sx={{ p: 3 }}>
              <SchoolOutlinedIcon
                color="primary"
                sx={{ fontSize: 42 }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mt: 2 }}
              >
                My Courses
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                View available courses and manage your
                enrolled courses.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                View Courses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              cursor: "pointer",
              transition: "0.2s",
              "&:hover": {
                transform: "translateY(-3px)",
                boxShadow: 4,
              },
            }}
            onClick={() => navigate("/attendance")}
          >
            <CardContent sx={{ p: 3 }}>
              <EventAvailableOutlinedIcon
                color="primary"
                sx={{ fontSize: 42 }}
              />

              <Typography
                variant="h6"
                fontWeight={800}
                sx={{ mt: 2 }}
              >
                My Attendance
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 0.5 }}
              >
                View your attendance records and
                attendance performance.
              </Typography>

              <Button
                variant="outlined"
                sx={{
                  mt: 2,
                  textTransform: "none",
                  borderRadius: 2,
                }}
              >
                View Attendance
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Alert
        severity="info"
        sx={{
          mt: 3,
          borderRadius: 2,
        }}
      >
        You are logged in as a Student. Your access is
        limited to student-related information.
      </Alert>

      <Button
        color="error"
        startIcon={<LogoutIcon />}
        onClick={handleLogout}
        sx={{
          mt: 3,
          textTransform: "none",
        }}
      >
        Logout
      </Button>
    </Box>
  );
}

export default StudentDashboard;