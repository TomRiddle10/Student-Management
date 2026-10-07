import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  Typography,
} from "@mui/material";

import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import EventAvailableOutlinedIcon from "@mui/icons-material/EventAvailableOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import AddIcon from "@mui/icons-material/Add";
import FactCheckOutlinedIcon from "@mui/icons-material/FactCheckOutlined";
import RefreshIcon from "@mui/icons-material/Refresh";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import SupervisorAccountOutlinedIcon from "@mui/icons-material/SupervisorAccountOutlined";

import StudentDashboard from "./StudentDashboard";
import TeacherDashboard from "./TeacherDashboard";

const API_URL = "/api";

function AdminDashboard() {
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [courseAttendance, setCourseAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const getHeaders = () => ({
    Authorization: `Bearer ${localStorage.getItem("token")}`,
    "Content-Type": "application/json",
  });

  const fetchDashboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [dashboardResponse, courseAttendanceResponse] =
        await Promise.all([
          fetch(`${API_URL}/dashboard`, {
            headers: getHeaders(),
          }),
          fetch(`${API_URL}/dashboard/course-attendance`, {
            headers: getHeaders(),
          }),
        ]);

      if (!dashboardResponse.ok) {
        throw new Error("Failed to load dashboard data");
      }

      if (!courseAttendanceResponse.ok) {
        throw new Error("Failed to load course attendance data");
      }

      const dashboardData = await dashboardResponse.json();
      const courseAttendanceData =
        await courseAttendanceResponse.json();

      setStats(dashboardData);
      setCourseAttendance(courseAttendanceData);
    } catch (error) {
      console.error(error);
      setError("Unable to load dashboard data.");
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
    return (
      <Box>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!stats) {
    return (
      <Box>
        <Alert severity="info">
          No dashboard information available.
        </Alert>
      </Box>
    );
  }

  const attendancePercentage =
    stats.overallAttendancePercentage || 0;

  const totalAttendanceRecords =
    stats.totalAttendanceRecords || 0;

  const totalPresent = stats.totalPresent || 0;
  const totalAbsent = stats.totalAbsent || 0;

  const presentPercentage =
    totalAttendanceRecords > 0
      ? (totalPresent / totalAttendanceRecords) * 100
      : 0;

  const absentPercentage =
    totalAttendanceRecords > 0
      ? (totalAbsent / totalAttendanceRecords) * 100
      : 0;

  const getAttendanceLabel = () => {
    if (attendancePercentage >= 75) {
      return "Good attendance";
    }

    if (attendancePercentage >= 50) {
      return "Needs attention";
    }

    return "Low attendance";
  };

  const statCards = [
    {
      title: "Total Students",
      value: stats.totalStudents,
      subtitle: "Registered students",
      icon: <PeopleAltOutlinedIcon />,
      action: () => navigate("/students"),
    },
    {
      title: "Total Courses",
      value: stats.totalCourses,
      subtitle: "Available courses",
      icon: <SchoolOutlinedIcon />,
      action: () => navigate("/courses"),
    },
    {
      title: "Enrollments",
      value: stats.totalEnrollments,
      subtitle: "Active enrollments",
      icon: <GroupsOutlinedIcon />,
      action: null,
    },
    {
      title: "Attendance Records",
      value: stats.totalAttendanceRecords,
      subtitle: "Recorded classes",
      icon: <EventAvailableOutlinedIcon />,
      action: () => navigate("/attendance"),
    },
  ];

  return (
    <Box sx={{ pb: 5 }}>

      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: {
            xs: "flex-start",
            sm: "center",
          },
          gap: 2,
          mb: 4,
          flexDirection: {
            xs: "column",
            sm: "row",
          },
        }}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight={800}
            letterSpacing="-0.5px"
          >
            Admin Dashboard
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 0.5 }}
          >
            Overview of your student management system.
          </Typography>
        </Box>

        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={() => fetchDashboard(true)}
          disabled={refreshing}
          sx={{
            borderRadius: 2,
            textTransform: "none",
            px: 2,
          }}
        >
          {refreshing ? "Refreshing..." : "Refresh"}
        </Button>
      </Box>

      {/* STATISTICS */}
      <Grid container spacing={2.5}>
        {statCards.map((card) => (
          <Grid
            key={card.title}
            size={{
              xs: 12,
              sm: 6,
              lg: 3,
            }}
          >
            <Card
              onClick={card.action}
              sx={{
                height: "100%",
                borderRadius: 3,
                cursor: card.action ? "pointer" : "default",
                border: "1px solid",
                borderColor: "divider",
                transition: "all 0.2s ease",
                "&:hover": card.action
                  ? {
                      transform: "translateY(-3px)",
                      boxShadow: 4,
                    }
                  : {},
              }}
            >
              <CardContent sx={{ p: 2.5 }}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="flex-start"
                >
                  <Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      fontWeight={600}
                    >
                      {card.title}
                    </Typography>

                    <Typography
                      variant="h3"
                      fontWeight={800}
                      sx={{ mt: 1 }}
                    >
                      {card.value}
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mt: 0.5 }}
                    >
                      {card.subtitle}
                    </Typography>
                  </Box>

                  <Box
                    sx={{
                      width: 48,
                      height: 48,
                      borderRadius: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: "primary.main",
                      color: "primary.contrastText",
                      "& svg": {
                        fontSize: 26,
                      },
                    }}
                  >
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* ANALYTICS */}
      <Grid
        container
        spacing={2.5}
        sx={{ mt: 0.5 }}
      >
        {/* Attendance Overview */}
        <Grid
          size={{
            xs: 12,
            md: 7,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="flex-start"
                mb={3}
              >
                <Box>
                  <Typography
                    variant="h6"
                    fontWeight={800}
                  >
                    Attendance Overview
                  </Typography>

                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Overall attendance across all records
                  </Typography>
                </Box>

                <TrendingUpIcon
                  color="primary"
                  sx={{ fontSize: 28 }}
                />
              </Box>

              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 4,
                  flexDirection: {
                    xs: "column",
                    sm: "row",
                  },
                }}
              >
                <Box
                  sx={(theme) => ({
                    minWidth: 150,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: `conic-gradient(
                      ${theme.palette.primary.main}
                      ${attendancePercentage}%,
                      ${theme.palette.action.hover}
                      ${attendancePercentage}% 100%
                    )`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  })}
                >
                  <Box
                    sx={{
                      width: 118,
                      height: 118,
                      borderRadius: "50%",
                      bgcolor: "background.paper",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Typography
                      variant="h4"
                      fontWeight={800}
                    >
                      {attendancePercentage.toFixed(1)}%
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      Attendance
                    </Typography>
                  </Box>
                </Box>

                <Box
                  flex={1}
                  width="100%"
                >
                  <Typography
                    fontWeight={700}
                    sx={{ mb: 1 }}
                  >
                    {getAttendanceLabel()}
                  </Typography>

                  <LinearProgress
                    variant="determinate"
                    value={Math.min(
                      attendancePercentage,
                      100
                    )}
                    sx={{
                      height: 10,
                      borderRadius: 5,
                      mb: 3,
                    }}
                  />

                  <Stack spacing={2}>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <CheckIcon
                          fontSize="small"
                          color="success"
                        />
                        <Typography>
                          Present
                        </Typography>
                      </Box>

                      <Typography fontWeight={700}>
                        {totalPresent}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Box
                        display="flex"
                        alignItems="center"
                        gap={1}
                      >
                        <CloseIcon
                          fontSize="small"
                          color="error"
                        />
                        <Typography>
                          Absent
                        </Typography>
                      </Box>

                      <Typography fontWeight={700}>
                        {totalAbsent}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      justifyContent="space-between"
                    >
                      <Typography color="text.secondary">
                        Total records
                      </Typography>

                      <Typography fontWeight={700}>
                        {totalAttendanceRecords}
                      </Typography>
                    </Box>
                  </Stack>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Attendance Breakdown */}
        <Grid
          size={{
            xs: 12,
            md: 5,
          }}
        >
          <Card
            sx={{
              height: "100%",
              borderRadius: 3,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <CardContent sx={{ p: 3 }}>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Attendance Breakdown
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={3}
              >
                Present vs absent records
              </Typography>

              <Stack spacing={3}>
                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Present
                    </Typography>

                    <Typography fontWeight={700}>
                      {totalPresent}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={presentPercentage}
                    color="success"
                    sx={{
                      height: 9,
                      borderRadius: 5,
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {presentPercentage.toFixed(1)}%
                  </Typography>
                </Box>

                <Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    mb={1}
                  >
                    <Typography fontWeight={600}>
                      Absent
                    </Typography>

                    <Typography fontWeight={700}>
                      {totalAbsent}
                    </Typography>
                  </Box>

                  <LinearProgress
                    variant="determinate"
                    value={absentPercentage}
                    color="error"
                    sx={{
                      height: 9,
                      borderRadius: 5,
                    }}
                  />

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {absentPercentage.toFixed(1)}%
                  </Typography>
                </Box>
              </Stack>

              <Divider sx={{ my: 3 }} />

              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "action.hover",
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Total attendance records
                </Typography>

                <Typography
                  variant="h5"
                  fontWeight={800}
                  sx={{ mt: 0.5 }}
                >
                  {totalAttendanceRecords}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* COURSE ATTENDANCE */}
      <Card
        sx={{
          mt: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="flex-start"
            mb={3}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={800}
              >
                Course-wise Attendance
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Attendance performance for each course
              </Typography>
            </Box>

            <SchoolOutlinedIcon
              color="primary"
              sx={{ fontSize: 28 }}
            />
          </Box>

          {courseAttendance.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                bgcolor: "action.hover",
                borderRadius: 2,
              }}
            >
              <Typography
                fontWeight={600}
                color="text.secondary"
              >
                No courses available
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={2}>
              {courseAttendance.map((course) => {
                const percentage = Math.min(
                  course.percentage || 0,
                  100
                );

                return (
                  <Grid
                    key={course.courseId}
                    size={{
                      xs: 12,
                      md: 6,
                    }}
                  >
                    <Box
                      sx={{
                        p: 2.5,
                        borderRadius: 2.5,
                        border: "1px solid",
                        borderColor: "divider",
                      }}
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        mb={2}
                      >
                        <Box>
                          <Typography
                            variant="body2"
                            color="primary"
                            fontWeight={700}
                          >
                            {course.courseCode}
                          </Typography>

                          <Typography
                            variant="h6"
                            fontWeight={700}
                          >
                            {course.courseName}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h5"
                          fontWeight={800}
                        >
                          {course.percentage.toFixed(1)}%
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 9,
                          borderRadius: 5,
                          mb: 2,
                        }}
                      />

                      <Stack
                        direction="row"
                        spacing={3}
                      >
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Total
                          </Typography>

                          <Typography fontWeight={700}>
                            {course.total}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Present
                          </Typography>

                          <Typography
                            fontWeight={700}
                            color="success.main"
                          >
                            {course.present}
                          </Typography>
                        </Box>

                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Absent
                          </Typography>

                          <Typography
                            fontWeight={700}
                            color="error.main"
                          >
                            {course.absent}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </CardContent>
      </Card>

      {/* QUICK ACTIONS */}
      <Card
        sx={{
          mt: 2.5,
          borderRadius: 3,
          border: "1px solid",
          borderColor: "divider",
        }}
      >
        <CardContent sx={{ p: 3 }}>
          <Typography
            variant="h6"
            fontWeight={800}
            mb={0.5}
          >
            Quick Actions
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={2.5}
          >
            Quickly access commonly used features.
          </Typography>

          <Grid container spacing={2}>
            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<PersonAddAlt1OutlinedIcon />}
                onClick={() => navigate("/students")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage Students
              </Button>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={() => navigate("/courses")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage Courses
              </Button>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={
                  <SupervisorAccountOutlinedIcon />
                }
                onClick={() => navigate("/teachers")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Manage Teachers
              </Button>
            </Grid>

            <Grid
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <Button
                fullWidth
                variant="contained"
                startIcon={<FactCheckOutlinedIcon />}
                onClick={() => navigate("/attendance")}
                sx={{
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                }}
              >
                Take Attendance
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}

function Dashboard() {
  const role = localStorage.getItem("role");

  if (role === "STUDENT") {
    return <StudentDashboard />;
  }

  if (role === "TEACHER") {
    return <TeacherDashboard />;
  }

  return <AdminDashboard />;
}

export default Dashboard;