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

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";

import {
  apiGet,
  getUser,
} from "../config";


// =========================================================
// Student Attendance
// =========================================================

function StudentAttendance() {
  const user = getUser();

  const [student, setStudent] = useState(null);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // =========================================================
  // Load Student + Attendance
  // =========================================================

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    try {
      setLoading(true);
      setError("");

      if (!user?.id) {
        throw new Error("User information not found.");
      }

      // Get student information using logged-in user's email
      const students = await apiGet(
        `/students?search=${encodeURIComponent(
          user.email || ""
        )}`
      );

      let currentStudent = null;

      if (Array.isArray(students)) {
        currentStudent = students.find(
          (item) =>
            item.email?.toLowerCase() ===
            user.email?.toLowerCase()
        );
      } else if (students?.content) {
        currentStudent = students.content.find(
          (item) =>
            item.email?.toLowerCase() ===
            user.email?.toLowerCase()
        );
      }

      if (!currentStudent) {
        throw new Error(
          "Student profile could not be found."
        );
      }

      setStudent(currentStudent);

      // Get attendance summary
      const data = await apiGet(
        `/students/${currentStudent.id}/attendance/summary`
      );

      const attendanceData =
        Array.isArray(data)
          ? data
          : data?.content ||
            data?.attendance ||
            data?.courses ||
            [];

      setAttendance(attendanceData);
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
  // Normalize Attendance Data
  // =========================================================

  const normalizedAttendance = useMemo(() => {
    return attendance.map((item) => ({
      courseId:
        item.courseId ??
        item.course?.id ??
        item.id,

      courseCode:
        item.courseCode ??
        item.course?.courseCode ??
        "N/A",

      courseName:
        item.courseName ??
        item.course?.courseName ??
        "Unknown Course",

      total:
        Number(
          item.total ??
            item.totalClasses ??
            item.totalAttendance ??
            0
        ),

      present:
        Number(
          item.present ??
            item.presentCount ??
            item.presentClasses ??
            0
        ),

      absent:
        Number(
          item.absent ??
            item.absentCount ??
            item.absentClasses ??
            0
        ),

      percentage:
        Number(
          item.percentage ??
            item.attendancePercentage ??
            item.attendancePercent ??
            0
        ),
    }));
  }, [attendance]);


  // =========================================================
  // Overall Statistics
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
  // Loading
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
  // Error
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
  // Main UI
  // =========================================================

  return (
    <Container
      maxWidth="xl"
      sx={{ py: 4 }}
    >

      {/* ================================================= */}
      {/* Header */}
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
      {/* Student Information */}
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
      {/* Overall Statistics */}
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
                    {overallStats.percentage.toFixed(
                      1
                    )}
                    %
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
      {/* Course Attendance */}
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
          {normalizedAttendance.map(
            (item) => {

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
                    <CardContent
                      sx={{ p: 3 }}
                    >

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
                          label={`${percentage.toFixed(
                            1
                          )}%`}
                          color={
                            percentage >= 75
                              ? "success"
                              : percentage >= 60
                              ? "warning"
                              : "error"
                          }
                        />
                      </Stack>


                      <Divider
                        sx={{ my: 2 }}
                      />


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

                        <Grid
                          size={{ xs: 4 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CheckCircleOutlineIcon
                              fontSize="small"
                            />

                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Present
                              </Typography>

                              <Typography
                                fontWeight={600}
                              >
                                {item.present}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>


                        <Grid
                          size={{ xs: 4 }}
                        >
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                          >
                            <CancelOutlinedIcon
                              fontSize="small"
                            />

                            <Box>
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                Absent
                              </Typography>

                              <Typography
                                fontWeight={600}
                              >
                                {item.absent}
                              </Typography>
                            </Box>
                          </Stack>
                        </Grid>


                        <Grid
                          size={{ xs: 4 }}
                        >
                          <Box>
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Total
                            </Typography>

                            <Typography
                              fontWeight={600}
                            >
                              {item.total}
                            </Typography>
                          </Box>
                        </Grid>

                      </Grid>

                    </CardContent>
                  </Card>
                </Grid>
              );
            }
          )}
        </Grid>
      )}

    </Container>
  );
}

export default StudentAttendance;