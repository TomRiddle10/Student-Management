import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import { apiGet } from "../config";

function StudentAttendance() {
  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // LOAD STUDENT + COURSES + ATTENDANCE
  // =========================================================

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      // -------------------------------------------------------
      // 1. Get logged-in student's profile
      // -------------------------------------------------------

      const currentStudent = await apiGet("/students/me");

      if (!currentStudent?.id) {
        throw new Error("Student profile could not be found.");
      }

      setStudent(currentStudent);

      // -------------------------------------------------------
      // 2. Get courses enrolled by this student
      // -------------------------------------------------------

      const courses = await apiGet(
        `/students/${currentStudent.id}/courses`
      );

      const enrolledCourses = Array.isArray(courses)
        ? courses
        : courses?.content || [];

      // -------------------------------------------------------
      // 3. Get attendance for every enrolled course
      // -------------------------------------------------------

      const attendanceResults = await Promise.all(
        enrolledCourses.map(async (course) => {
          try {
            const summary = await apiGet(
              `/students/${currentStudent.id}/attendance?courseId=${course.id}`
            );

            return {
              courseId: course.id,
              courseCode: course.courseCode,
              courseName: course.courseName,
              totalClasses: Number(summary?.totalClasses ?? 0),
              present: Number(summary?.present ?? 0),
              absent: Number(summary?.absent ?? 0),
              percentage: Number(summary?.percentage ?? 0),
            };
          } catch (courseError) {
            console.error(
              `Failed to load attendance for course ${course.id}:`,
              courseError
            );

            return {
              courseId: course.id,
              courseCode: course.courseCode,
              courseName: course.courseName,
              totalClasses: 0,
              present: 0,
              absent: 0,
              percentage: 0,
            };
          }
        })
      );

      setAttendance(attendanceResults);
    } catch (err) {
      console.error(
        "Failed to load student attendance:",
        err
      );

      setError(
        err.message ||
          "Failed to load attendance information."
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================================
  // NORMALIZE ATTENDANCE DATA
  // =========================================================

  const normalizedAttendance = useMemo(() => {
    return attendance.map((item) => ({
      courseId: item.courseId,

      courseCode:
        item.courseCode || "N/A",

      courseName:
        item.courseName || "Unknown Course",

      total: Number(
        item.totalClasses ?? 0
      ),

      present: Number(
        item.present ?? 0
      ),

      absent: Number(
        item.absent ?? 0
      ),

      percentage: Number(
        item.percentage ?? 0
      ),
    }));
  }, [attendance]);

  // =========================================================
  // OVERALL STATISTICS
  // =========================================================

  const overallStats = useMemo(() => {
    const total = normalizedAttendance.reduce(
      (sum, item) => sum + item.total,
      0
    );

    const present = normalizedAttendance.reduce(
      (sum, item) => sum + item.present,
      0
    );

    const absent = normalizedAttendance.reduce(
      (sum, item) => sum + item.absent,
      0
    );

    const percentage =
      total > 0
        ? (present / total) * 100
        : 0;

    return {
      total,
      present,
      absent,
      percentage,
    };
  }, [normalizedAttendance]);

  // =========================================================
  // LOADING
  // =========================================================

  if (loading) {
    return (
      <Container maxWidth="xl">
        <Box
          sx={{
            minHeight: "70vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Stack
            spacing={2}
            alignItems="center"
          >
            <CircularProgress />

            <Typography color="text.secondary">
              Loading attendance...
            </Typography>
          </Stack>
        </Box>
      </Container>
    );
  }

  // =========================================================
  // ERROR
  // =========================================================

  if (error) {
    return (
      <Container maxWidth="xl">
        <Box sx={{ mt: 4 }}>
          <Alert severity="error">
            {error}
          </Alert>
        </Box>
      </Container>
    );
  }

  // =========================================================
  // MAIN UI
  // =========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >
      {/* ================================================= */}
      {/* HEADER */}
      {/* ================================================= */}

      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          fontWeight={700}
          gutterBottom
        >
          My Attendance
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
        >
          Track your attendance and course-wise
          performance.
        </Typography>
      </Box>

      {/* ================================================= */}
      {/* STUDENT INFORMATION */}
      {/* ================================================= */}

      {student && (
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 3,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography
                variant="h6"
                fontWeight={600}
              >
                {student.name}
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                {student.email}
              </Typography>
            </Box>

            <Stack
              direction="row"
              spacing={1}
              flexWrap="wrap"
            >
              {student.department && (
                <Chip
                  label={student.department}
                  variant="outlined"
                />
              )}

              {student.year && (
                <Chip
                  label={`Year ${student.year}`}
                  variant="outlined"
                />
              )}
            </Stack>
          </Stack>
        </Paper>
      )}

      {/* ================================================= */}
      {/* OVERALL STATISTICS */}
      {/* ================================================= */}

      <Grid
        container
        spacing={3}
        sx={{ mb: 4 }}
      >
        {/* Overall Attendance */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
              >
                <Box>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                  >
                    Overall Attendance
                  </Typography>

                  <Typography
                    variant="h4"
                    fontWeight={700}
                    sx={{ mt: 1 }}
                  >
                    {overallStats.percentage.toFixed(1)}%
                  </Typography>
                </Box>

                <TrendingUpIcon />
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        {/* Total Classes */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Total Classes
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {overallStats.total}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Present */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Present
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {overallStats.present}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Absent */}

        <Grid
          size={{
            xs: 12,
            sm: 6,
            md: 3,
          }}
        >
          <Card
            elevation={0}
            sx={{
              height: "100%",
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography
                variant="body2"
                color="text.secondary"
              >
                Absent
              </Typography>

              <Typography
                variant="h4"
                fontWeight={700}
                sx={{ mt: 1 }}
              >
                {overallStats.absent}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* ================================================= */}
      {/* COURSE ATTENDANCE */}
      {/* ================================================= */}

      <Box sx={{ mb: 2 }}>
        <Typography
          variant="h5"
          fontWeight={700}
        >
          Course-wise Attendance
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.5 }}
        >
          Your attendance performance for each
          enrolled course.
        </Typography>
      </Box>

      {normalizedAttendance.length === 0 ? (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
          }}
        >
          <SchoolOutlinedIcon
            sx={{
              fontSize: 50,
              mb: 1,
            }}
          />

          <Typography
            variant="h6"
            fontWeight={600}
          >
            No attendance records found
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Attendance information will appear
            here once records are available.
          </Typography>
        </Paper>
      ) : (
        <Grid
          container
          spacing={3}
        >
          {normalizedAttendance.map((item) => {
            const percentage = Math.min(
              Math.max(item.percentage, 0),
              100
            );

            return (
              <Grid
                size={{
                  xs: 12,
                  md: 6,
                }}
                key={item.courseId}
              >
                <Card
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 3,
                    height: "100%",
                  }}
                >
                  <CardContent sx={{ p: 3 }}>
                    {/* Course Header */}

                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="flex-start"
                      spacing={2}
                    >
                      <Box>
                        <Typography
                          variant="overline"
                          color="text.secondary"
                        >
                          {item.courseCode}
                        </Typography>

                        <Typography
                          variant="h6"
                          fontWeight={600}
                        >
                          {item.courseName}
                        </Typography>
                      </Box>

                      <Chip
                        label={`${percentage.toFixed(1)}%`}
                        color={
                          percentage >= 75
                            ? "success"
                            : percentage >= 60
                              ? "warning"
                              : "error"
                        }
                      />
                    </Stack>

                    <Divider sx={{ my: 2 }} />

                    {/* Progress */}

                    <Box sx={{ mb: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </Box>

                    {/* Attendance Counts */}

                    <Grid
                      container
                      spacing={2}
                    >
                      <Grid size={{ xs: 4 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CheckCircleOutlinedIcon fontSize="small" />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Present
                            </Typography>

                            <Typography fontWeight={600}>
                              {item.present}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                        >
                          <CancelOutlinedIcon fontSize="small" />

                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Absent
                            </Typography>

                            <Typography fontWeight={600}>
                              {item.absent}
                            </Typography>
                          </Box>
                        </Stack>
                      </Grid>

                      <Grid size={{ xs: 4 }}>
                        <Box>
                          <Typography
                            variant="caption"
                            color="text.secondary"
                          >
                            Total
                          </Typography>

                          <Typography fontWeight={600}>
                            {item.total}
                          </Typography>
                        </Box>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}
    </Container>
  );
}

export default StudentAttendance;