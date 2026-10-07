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
  LinearProgress,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";

const API_URL = "/api";

function TeacherDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [courseAttendance, setCourseAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchDashboard = async (refresh = false) => {
    try {
      refresh ? setRefreshing(true) : setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [dashboardResponse, courseResponse] =
        await Promise.all([
          fetch(`${API_URL}/dashboard`, { headers }),
          fetch(`${API_URL}/dashboard/course-attendance`, {
            headers,
          }),
        ]);

      if (!dashboardResponse.ok || !courseResponse.ok) {
        throw new Error("Failed to load dashboard");
      }

      const dashboardData =
        await dashboardResponse.json();

      const courseData =
        await courseResponse.json();

      setStats(dashboardData);
      setCourseAttendance(courseData);
    } catch (error) {
      console.error(error);
      setError("Unable to load teacher dashboard.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <Box
        minHeight="70vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const attendance =
    stats?.overallAttendancePercentage || 0;

  return (
    <Box sx={{ pb: 5 }}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={4}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
          >
            Teacher Dashboard
          </Typography>

          <Typography color="text.secondary">
            Monitor students, courses and attendance.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          sx={{
            textTransform: "none",
            borderRadius: 2,
          }}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      <Grid container spacing={2.5}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <PeopleAltOutlinedIcon
                color="primary"
                sx={{ fontSize: 35 }}
              />

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Total Students
              </Typography>

              <Typography
                variant="h3"
                fontWeight={800}
              >
                {stats?.totalStudents || 0}
              </Typography>

              <Button
                onClick={() => navigate("/students")}
                sx={{
                  mt: 2,
                  textTransform: "none",
                }}
              >
                View Students
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <SchoolOutlinedIcon
                color="primary"
                sx={{ fontSize: 35 }}
              />

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Total Courses
              </Typography>

              <Typography
                variant="h3"
                fontWeight={800}
              >
                {stats?.totalCourses || 0}
              </Typography>

              <Button
                onClick={() => navigate("/courses")}
                sx={{
                  mt: 2,
                  textTransform: "none",
                }}
              >
                View Courses
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <EventAvailableOutlinedIcon
                color="primary"
                sx={{ fontSize: 35 }}
              />

              <Typography
                color="text.secondary"
                sx={{ mt: 2 }}
              >
                Overall Attendance
              </Typography>

              <Typography
                variant="h3"
                fontWeight={800}
              >
                {attendance.toFixed(1)}%
              </Typography>

              <LinearProgress
                variant="determinate"
                value={Math.min(attendance, 100)}
                sx={{
                  mt: 2,
                  height: 9,
                  borderRadius: 5,
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card
        sx={{
          mt: 3,
          borderRadius: 3,
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={800}
          >
            Course Attendance
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Attendance performance across courses.
          </Typography>

          {courseAttendance.length === 0 ? (
            <Alert severity="info">
              No course attendance data available.
            </Alert>
          ) : (
            <Grid container spacing={2}>
              {courseAttendance.map((course) => {
                const percentage =
                  course.percentage || 0;

                return (
                  <Grid
                    key={course.courseId}
                    size={{ xs: 12, md: 6 }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                      >
                        <Box>
                          <Typography
                            color="primary"
                            fontWeight={700}
                          >
                            {course.courseCode}
                          </Typography>

                          <Typography fontWeight={700}>
                            {course.courseName}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={800}
                        >
                          {percentage.toFixed(1)}%
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          percentage,
                          100
                        )}
                        sx={{
                          mt: 2,
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}

          <Button
            variant="contained"
            startIcon={<FactCheckOutlinedIcon />}
            onClick={() => navigate("/attendance")}
            sx={{
              mt: 3,
              textTransform: "none",
              borderRadius: 2,
            }}
          >
            Take Attendance
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
}

export default TeacherDashboard;