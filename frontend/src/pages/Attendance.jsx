import { useEffect, useMemo, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = "http://localhost:8080/api";

function Attendance() {
  const today = new Date();

  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    today.toISOString().split("T")[0]
  );

  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );

  const [attendanceHistory, setAttendanceHistory] = useState({});
  const [students, setStudents] = useState([]);

  const [loadingCourses, setLoadingCourses] = useState(true);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // --------------------------------------------------
  // Load courses
  // --------------------------------------------------

  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);

      const response = await fetch(`${API_URL}/courses`);

      if (!response.ok) {
        throw new Error("Failed to load courses");
      }

      const data = await response.json();

      setCourses(data);
    } catch (error) {
      console.error(error);
      showMessage("Failed to load courses", "error");
    } finally {
      setLoadingCourses(false);
    }
  };

  // --------------------------------------------------
  // Load attendance history for month
  // --------------------------------------------------

  const fetchAttendanceHistory = async () => {
    if (!selectedCourse) {
      setAttendanceHistory({});
      return;
    }

    try {
      setLoadingHistory(true);

      const year = currentMonth.getFullYear();

      const month = String(currentMonth.getMonth() + 1).padStart(2, "0");

      const response = await fetch(
        `${API_URL}/courses/${selectedCourse}/attendance/history?month=${year}-${month}`
      );

      if (!response.ok) {
        throw new Error("Failed to load attendance history");
      }

      const data = await response.json();

      setAttendanceHistory(data);
    } catch (error) {
      console.error(error);
      setAttendanceHistory({});
      showMessage("Failed to load attendance history", "error");
    } finally {
      setLoadingHistory(false);
    }
  };

  // --------------------------------------------------
  // Load attendance for selected date
  // --------------------------------------------------

  const fetchAttendance = async () => {
    if (!selectedCourse || !selectedDate) {
      setStudents([]);
      return;
    }

    try {
      setLoadingStudents(true);

      const response = await fetch(
        `${API_URL}/courses/${selectedCourse}/attendance?date=${selectedDate}`
      );

      if (!response.ok) {
        throw new Error("Failed to load attendance");
      }

      const data = await response.json();

      setStudents(
        data.map((student) => ({
          ...student,
          status: student.status || "PRESENT",
        }))
      );
    } catch (error) {
      console.error(error);
      setStudents([]);
      showMessage("Failed to load attendance", "error");
    } finally {
      setLoadingStudents(false);
    }
  };

  // --------------------------------------------------
  // Initial courses
  // --------------------------------------------------

  useEffect(() => {
    fetchCourses();
  }, []);

  // --------------------------------------------------
  // Load history when course/month changes
  // --------------------------------------------------

  useEffect(() => {
    fetchAttendanceHistory();
  }, [selectedCourse, currentMonth]);

  // --------------------------------------------------
  // Load students when course/date changes
  // --------------------------------------------------

  useEffect(() => {
    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  // --------------------------------------------------
  // Calendar helpers
  // --------------------------------------------------

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);

    const lastDay = new Date(year, month + 1, 0);

    const startingDay = firstDay.getDay();

    const totalDays = lastDay.getDate();

    const days = [];

    // Empty cells before first day
    for (let i = 0; i < startingDay; i++) {
      days.push(null);
    }

    // Actual days
    for (let day = 1; day <= totalDays; day++) {
      days.push(new Date(year, month, day));
    }

    return days;
  }, [currentMonth]);

  const formatDate = (date) => {
    const year = date.getFullYear();

    const month = String(date.getMonth() + 1).padStart(2, "0");

    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const isToday = (date) => {
    if (!date) return false;

    return formatDate(date) === today.toISOString().split("T")[0];
  };

  const isSelected = (date) => {
    if (!date) return false;

    return formatDate(date) === selectedDate;
  };

  const hasAttendance = (date) => {
    if (!date) return false;

    const dateString = formatDate(date);

    return attendanceHistory[dateString] !== undefined;
  };

  // --------------------------------------------------
  // Month navigation
  // --------------------------------------------------

  const goToPreviousMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      )
    );
  };

  const goToNextMonth = () => {
    setCurrentMonth(
      new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      )
    );
  };

  // --------------------------------------------------
  // Select date
  // --------------------------------------------------

  const handleDateClick = (date) => {
    if (!date) return;

    setSelectedDate(formatDate(date));
  };

  // --------------------------------------------------
  // Status change
  // --------------------------------------------------

  const handleStatusChange = (studentId, status) => {
    setStudents((previousStudents) =>
      previousStudents.map((student) =>
        student.studentId === studentId
          ? {
              ...student,
              status,
            }
          : student
      )
    );
  };

  // --------------------------------------------------
  // Save attendance
  // --------------------------------------------------

  const handleSaveAttendance = async () => {
    if (!selectedCourse) {
      showMessage("Please select a course", "error");
      return;
    }

    if (!selectedDate) {
      showMessage("Please select a date", "error");
      return;
    }

    if (students.length === 0) {
      showMessage(
        "No students are enrolled in this course",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const requestBody = {
        date: selectedDate,
        attendance: students.map((student) => ({
          studentId: student.studentId,
          status: student.status,
        })),
      };

      const response = await fetch(
        `${API_URL}/courses/${selectedCourse}/attendance`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to save attendance"
        );
      }

      showMessage("Attendance saved successfully");

      await fetchAttendanceHistory();
      await fetchAttendance();
    } catch (error) {
      console.error(error);

      showMessage(
        error.message || "Failed to save attendance",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // --------------------------------------------------
  // Month title
  // --------------------------------------------------

  const monthTitle = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <Box>
      {/* Header */}

      <Box mb={3}>
        <Typography variant="h4" fontWeight="bold" mb={1}>
          Attendance
        </Typography>

        <Typography color="text.secondary">
          Select a course and manage daily student attendance.
        </Typography>
      </Box>

      {/* Course */}

      <Card sx={{ borderRadius: 3, mb: 3 }}>
        <CardContent>
          <FormControl
            fullWidth
            sx={{ maxWidth: 500 }}
          >
            <InputLabel>Select Course</InputLabel>

            <Select
              value={selectedCourse}
              label="Select Course"
              onChange={(event) => {
                setSelectedCourse(event.target.value);
              }}
              disabled={loadingCourses}
            >
              {courses.map((course) => (
                <MenuItem
                  key={course.id}
                  value={course.id}
                >
                  {course.courseCode} - {course.courseName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </CardContent>
      </Card>

      {/* Calendar */}

      {selectedCourse && (
        <Card sx={{ borderRadius: 3, mb: 3 }}>
          <CardContent>
            {/* Calendar header */}

            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={3}
            >
              <IconButton onClick={goToPreviousMonth}>
                <ChevronLeftIcon />
              </IconButton>

              <Box textAlign="center">
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  {monthTitle}
                </Typography>

                {loadingHistory && (
                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Loading history...
                  </Typography>
                )}
              </Box>

              <IconButton onClick={goToNextMonth}>
                <ChevronRightIcon />
              </IconButton>
            </Box>

            {/* Week days */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: 1,
                mb: 1,
              }}
            >
              {[
                "Sun",
                "Mon",
                "Tue",
                "Wed",
                "Thu",
                "Fri",
                "Sat",
              ].map((day) => (
                <Box
                  key={day}
                  textAlign="center"
                  py={1}
                >
                  <Typography
                    variant="body2"
                    fontWeight="bold"
                    color="text.secondary"
                  >
                    {day}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Calendar days */}

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(7, 1fr)",
                gap: 1,
              }}
            >
              {calendarDays.map((date, index) => {
                if (!date) {
                  return (
                    <Box
                      key={`empty-${index}`}
                      sx={{ minHeight: 70 }}
                    />
                  );
                }

                const dateString =
                  formatDate(date);

                const marked =
                  hasAttendance(date);

                const selected =
                  isSelected(date);

                return (
                  <Box
                    key={dateString}
                    onClick={() =>
                      handleDateClick(date)
                    }
                    sx={{
                      minHeight: 70,
                      border: "1px solid",
                      borderColor: selected
                        ? "primary.main"
                        : "divider",
                      borderRadius: 2,
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",

                      bgcolor: selected
                        ? "primary.main"
                        : "background.paper",

                      color: selected
                        ? "primary.contrastText"
                        : "text.primary",

                      "&:hover": {
                        bgcolor: selected
                          ? "primary.dark"
                          : "action.hover",
                      },
                    }}
                  >
                    <Typography
                      fontWeight={
                        isToday(date)
                          ? "bold"
                          : "normal"
                      }
                    >
                      {date.getDate()}
                    </Typography>

                    {marked && (
                      <Box
                        sx={{
                          width: 7,
                          height: 7,
                          borderRadius: "50%",
                          bgcolor: selected
                            ? "white"
                            : "success.main",
                          mt: 0.5,
                        }}
                      />
                    )}

                    {marked && (
                      <Typography
                        variant="caption"
                        sx={{
                          fontSize: 10,
                          opacity: 0.8,
                        }}
                      >
                        {attendanceHistory[
                          dateString
                        ]} records
                      </Typography>
                    )}
                  </Box>
                );
              })}
            </Box>

            {/* Legend */}

            <Box
              display="flex"
              gap={3}
              mt={3}
              justifyContent="center"
            >
              <Box
                display="flex"
                alignItems="center"
                gap={1}
              >
                <Box
                  sx={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    bgcolor: "success.main",
                  }}
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Attendance recorded
                </Typography>
              </Box>

              <Box
                display="flex"
                alignItems="center"
                gap={1}
              >
                <CalendarMonthIcon
                  fontSize="small"
                  color="action"
                />

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Selected date: {selectedDate}
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Students */}

      {selectedCourse && (
        <Card sx={{ borderRadius: 3 }}>
          <CardContent>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Box>
                <Typography
                  variant="h6"
                  fontWeight="bold"
                >
                  Student Attendance
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  {selectedDate}
                </Typography>
              </Box>
            </Box>

            {loadingStudents ? (
              <Box
                display="flex"
                justifyContent="center"
                py={5}
              >
                <CircularProgress />
              </Box>
            ) : students.length === 0 ? (
              <Alert severity="info">
                No students are enrolled in this
                course.
              </Alert>
            ) : (
              <>
                {/* Header */}

                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 220px",
                    gap: 2,
                    px: 2,
                    py: 1.5,
                    bgcolor:
                      "background.default",
                    borderRadius: 1,
                    mb: 1,
                  }}
                >
                  <Typography fontWeight="bold">
                    Student
                  </Typography>

                  <Typography fontWeight="bold">
                    Attendance
                  </Typography>
                </Box>

                {/* Students */}

                <Stack spacing={1}>
                  {students.map((student) => (
                    <Box
                      key={student.studentId}
                      sx={{
                        display: "grid",
                        gridTemplateColumns:
                          "1fr 220px",
                        gap: 2,
                        alignItems: "center",
                        px: 2,
                        py: 1.5,
                        border: "1px solid",
                        borderColor:
                          "divider",
                        borderRadius: 2,
                      }}
                    >
                      <Box>
                        <Typography fontWeight="bold">
                          {student.studentName}
                        </Typography>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                        >
                          Student ID:{" "}
                          {student.studentId}
                        </Typography>
                      </Box>

                      <FormControl
                        fullWidth
                        size="small"
                      >
                        <Select
                          value={
                            student.status ||
                            "PRESENT"
                          }
                          onChange={(event) =>
                            handleStatusChange(
                              student.studentId,
                              event.target.value
                            )
                          }
                        >
                          <MenuItem value="PRESENT">
                            Present
                          </MenuItem>

                          <MenuItem value="ABSENT">
                            Absent
                          </MenuItem>
                        </Select>
                      </FormControl>
                    </Box>
                  ))}
                </Stack>

                {/* Save */}

                <Box
                  display="flex"
                  justifyContent="flex-end"
                  mt={3}
                >
                  <Button
                    variant="contained"
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={
                      handleSaveAttendance
                    }
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : "Save Attendance"}
                  </Button>
                </Box>
              </>
            )}
          </CardContent>
        </Card>
      )}

      {/* Snackbar */}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() =>
          setSnackbar((previous) => ({
            ...previous,
            open: false,
          }))
        }
      >
        <Alert
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default Attendance;