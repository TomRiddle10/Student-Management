import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import SaveIcon from "@mui/icons-material/Save";

const API_URL = "http://localhost:8080/api";

function Attendance() {
  const [courses, setCourses] = useState([]);
  const [selectedCourse, setSelectedCourse] =
    useState("");

  const [selectedDate, setSelectedDate] =
    useState(
      new Date().toISOString().split("T")[0]
    );

  const [students, setStudents] = useState([]);

  const [loadingCourses, setLoadingCourses] =
    useState(true);

  const [loadingStudents, setLoadingStudents] =
    useState(false);

  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Show message
  const showMessage = (
    message,
    severity = "success"
  ) => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Load courses
  const fetchCourses = async () => {
    try {
      setLoadingCourses(true);

      const response = await fetch(
        `${API_URL}/courses`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load courses"
        );
      }

      const data = await response.json();

      setCourses(data);
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load courses",
        "error"
      );
    } finally {
      setLoadingCourses(false);
    }
  };

  // Load attendance for selected course/date
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
        throw new Error(
          "Failed to load attendance"
        );
      }

      const data = await response.json();

      setStudents(
        data.map((student) => ({
          ...student,
          status:
            student.status || "PRESENT",
        }))
      );
    } catch (error) {
      console.error(error);

      setStudents([]);

      showMessage(
        "Failed to load attendance",
        "error"
      );
    } finally {
      setLoadingStudents(false);
    }
  };

  // Initial course loading
  useEffect(() => {
    fetchCourses();
  }, []);

  // Load attendance when course/date changes
  useEffect(() => {
    fetchAttendance();
  }, [selectedCourse, selectedDate]);

  // Change attendance status
  const handleStatusChange = (
    studentId,
    status
  ) => {
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

  // Save attendance
  const handleSaveAttendance = async () => {
    if (!selectedCourse) {
      showMessage(
        "Please select a course",
        "error"
      );
      return;
    }

    if (!selectedDate) {
      showMessage(
        "Please select a date",
        "error"
      );
      return;
    }

    if (students.length === 0) {
      showMessage(
        "No students found for this course",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const requestBody = {
        date: selectedDate,
        attendance: students.map(
          (student) => ({
            studentId: student.studentId,
            status: student.status,
          })
        ),
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
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to save attendance"
        );
      }

      showMessage(
        "Attendance saved successfully"
      );

      // Reload saved attendance
      await fetchAttendance();
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to save attendance",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box>
      {/* Page Header */}

      <Box mb={3}>
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={1}
        >
          Attendance
        </Typography>

        <Typography color="text.secondary">
          Select a course and date to mark
          student attendance.
        </Typography>
      </Box>

      {/* Selection Card */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Stack
            direction={{
              xs: "column",
              md: "row",
            }}
            spacing={2}
            alignItems={{
              xs: "stretch",
              md: "center",
            }}
          >
            {/* Course */}

            <FormControl
              fullWidth
              sx={{ maxWidth: 400 }}
            >
              <InputLabel>
                Select Course
              </InputLabel>

              <Select
                value={selectedCourse}
                label="Select Course"
                onChange={(event) =>
                  setSelectedCourse(
                    event.target.value
                  )
                }
                disabled={loadingCourses}
              >
                {courses.map((course) => (
                  <MenuItem
                    key={course.id}
                    value={course.id}
                  >
                    {course.courseCode} -{" "}
                    {course.courseName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Date */}

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1,
                px: 2,
                height: 56,
                width: {
                  xs: "100%",
                  md: 230,
                },
              }}
            >
              <CalendarMonthIcon
                color="action"
              />

              <input
                type="date"
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value
                  )
                }
                style={{
                  border: "none",
                  outline: "none",
                  fontSize: "16px",
                  width: "100%",
                  background: "transparent",
                }}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Attendance Table */}

      {selectedCourse && (
        <Card
          sx={{
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography
              variant="h6"
              fontWeight="bold"
              mb={2}
            >
              Student Attendance
            </Typography>

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
                No students are enrolled in
                this course.
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
                  <Typography
                    fontWeight="bold"
                  >
                    Student
                  </Typography>

                  <Typography
                    fontWeight="bold"
                  >
                    Attendance
                  </Typography>
                </Box>

                {/* Students */}

                <Stack spacing={1}>
                  {students.map(
                    (student) => (
                      <Box
                        key={
                          student.studentId
                        }
                        sx={{
                          display: "grid",
                          gridTemplateColumns:
                            "1fr 220px",
                          gap: 2,
                          alignItems:
                            "center",
                          px: 2,
                          py: 1.5,
                          border: "1px solid",
                          borderColor:
                            "divider",
                          borderRadius: 2,
                        }}
                      >
                        <Box>
                          <Typography
                            fontWeight="bold"
                          >
                            {student.studentName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Student ID:{" "}
                            {
                              student.studentId
                            }
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
                            onChange={(
                              event
                            ) =>
                              handleStatusChange(
                                student.studentId,
                                event.target
                                  .value
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
                    )
                  )}
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
                    startIcon={
                      <SaveIcon />
                    }
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