import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  IconButton,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

const API_URL = "http://localhost:8080/api";

function StudentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [attendance, setAttendance] = useState({});

  const [selectedCourse, setSelectedCourse] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const [loading, setLoading] = useState(true);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Show message
  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Load student
  const fetchStudent = async () => {
    try {
      const response = await fetch(
        `${API_URL}/students/${id}`
      );

      if (!response.ok) {
        throw new Error("Failed to load student");
      }

      const data = await response.json();

      setStudent(data);
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load student",
        "error"
      );
    }
  };

  // Load enrolled courses
  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/students/${id}/courses`
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load enrolled courses"
        );
      }

      const data = await response.json();

      setEnrolledCourses(data);

      return data;
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load enrolled courses",
        "error"
      );

      return [];
    }
  };

  // Load all courses
  const fetchAllCourses = async () => {
    try {
      const response = await fetch(
        `${API_URL}/courses`
      );

      if (!response.ok) {
        throw new Error("Failed to load courses");
      }

      const data = await response.json();

      setAllCourses(data);
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load courses",
        "error"
      );
    }
  };

  // Load attendance
  const fetchAttendance = async (courses) => {
    const attendanceData = {};

    for (const course of courses) {
      try {
        const response = await fetch(
          `${API_URL}/students/${id}/attendance?courseId=${course.id}`
        );

        if (response.ok) {
          const data = await response.json();

          attendanceData[course.id] = data;
        }
      } catch (error) {
        console.error(
          `Attendance error for course ${course.id}:`,
          error
        );
      }
    }

    setAttendance(attendanceData);
  };

  // Initial page loading
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);

      await fetchStudent();

      const courses =
        await fetchEnrolledCourses();

      await fetchAllCourses();

      await fetchAttendance(courses);

      setLoading(false);
    };

    loadData();
  }, [id]);

  // Add course
  const handleAddCourse = async () => {
    if (!selectedCourse) {
      showMessage(
        "Please select a course",
        "error"
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}/courses/${selectedCourse}`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText || "Failed to add course"
        );
      }

      const updatedCourses =
        await fetchEnrolledCourses();

      await fetchAttendance(updatedCourses);

      setSelectedCourse("");

      setOpenDialog(false);

      showMessage(
        "Course added successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to add course",
        "error"
      );
    }
  };

  // Remove course
  const handleRemoveCourse = async (
    courseId
  ) => {
    const confirmed = window.confirm(
      "Are you sure you want to remove this course?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}/courses/${courseId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to remove course"
        );
      }

      const updatedCourses =
        await fetchEnrolledCourses();

      await fetchAttendance(updatedCourses);

      showMessage(
        "Course removed successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to remove course",
        "error"
      );
    }
  };

  // Courses that student is not enrolled in
  const availableCourses =
    allCourses.filter(
      (course) =>
        !enrolledCourses.some(
          (enrolledCourse) =>
            enrolledCourse.id ===
            course.id
        )
    );

  // Loading screen
  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  // Student not found
  if (!student) {
    return (
      <Box>
        <Alert severity="error">
          Student could not be found.
        </Alert>
      </Box>
    );
  }

  return (
    <Box>
      {/* Back button */}

      <Button
        startIcon={<ArrowBackIcon />}
        onClick={() => navigate("/students")}
        sx={{ mb: 2 }}
      >
        Back to Students
      </Button>

      {/* Student Information */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h4"
            fontWeight="bold"
            mb={1}
          >
            {student.name}
          </Typography>

          <Typography
            color="text.secondary"
            mb={2}
          >
            Student ID: {student.id}
          </Typography>

          <Stack
            direction={{
              xs: "column",
              sm: "row",
            }}
            spacing={2}
          >
            <Chip
              label={student.email}
            />

            <Chip
              label={student.department}
            />

            <Chip
              label={`Year ${student.year}`}
            />

            {student.phone && (
              <Chip
                label={student.phone}
              />
            )}
          </Stack>
        </CardContent>
      </Card>

      {/* Enrolled Courses */}

      <Card
        sx={{
          borderRadius: 3,
          mb: 3,
        }}
      >
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
                Enrolled Courses
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Courses currently assigned
                to this student
              </Typography>
            </Box>

            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() =>
                setOpenDialog(true)
              }
              disabled={
                availableCourses.length === 0
              }
            >
              Add Course
            </Button>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {enrolledCourses.length === 0 ? (
            <Typography color="text.secondary">
              This student is not enrolled
              in any course.
            </Typography>
          ) : (
            <Stack spacing={2}>
              {enrolledCourses.map(
                (course) => (
                  <Box
                    key={course.id}
                    sx={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      alignItems: "center",
                      p: 2,
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
                        {course.courseCode}
                      </Typography>

                      <Typography
                        color="text.secondary"
                      >
                        {course.courseName}
                      </Typography>

                      <Typography
                        variant="body2"
                        color="text.secondary"
                      >
                        Credits:{" "}
                        {course.credits}
                      </Typography>
                    </Box>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleRemoveCourse(
                          course.id
                        )
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                )
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Attendance Summary */}

      <Card
        sx={{
          borderRadius: 3,
        }}
      >
        <CardContent>
          <Typography
            variant="h6"
            fontWeight="bold"
            mb={1}
          >
            Attendance Summary
          </Typography>

          <Typography
            variant="body2"
            color="text.secondary"
            mb={3}
          >
            Attendance calculated from
            daily attendance records.
          </Typography>

          {enrolledCourses.length === 0 ? (
            <Typography color="text.secondary">
              No attendance available.
            </Typography>
          ) : (
            <Stack spacing={3}>
              {enrolledCourses.map(
                (course) => {
                  const summary =
                    attendance[course.id];

                  const percentage =
                    summary?.percentage ?? 0;

                  return (
                    <Box key={course.id}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        mb={1}
                      >
                        <Box>
                          <Typography
                            fontWeight="bold"
                          >
                            {course.courseCode}{" "}
                            -{" "}
                            {course.courseName}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Present:{" "}
                            {summary?.present ??
                              0}
                            {" | "}
                            Absent:{" "}
                            {summary?.absent ??
                              0}
                            {" | "}
                            Total:{" "}
                            {summary?.totalClasses ??
                              0}
                          </Typography>
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight="bold"
                        >
                          {percentage.toFixed(
                            1
                          )}
                          %
                        </Typography>
                      </Box>

                      <LinearProgress
                        variant="determinate"
                        value={Math.min(
                          percentage,
                          100
                        )}
                        sx={{
                          height: 8,
                          borderRadius: 5,
                        }}
                      />
                    </Box>
                  );
                }
              )}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Add Course Dialog */}

      <Dialog
        open={openDialog}
        onClose={() =>
          setOpenDialog(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          Add Course
        </DialogTitle>

        <DialogContent>
          <FormControl
            fullWidth
            sx={{ mt: 1 }}
          >
            <InputLabel>
              Course
            </InputLabel>

            <Select
              value={selectedCourse}
              label="Course"
              onChange={(event) =>
                setSelectedCourse(
                  event.target.value
                )
              }
            >
              {availableCourses.map(
                (course) => (
                  <MenuItem
                    key={course.id}
                    value={course.id}
                  >
                    {course.courseCode} -{" "}
                    {course.courseName}
                  </MenuItem>
                )
              )}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setOpenDialog(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleAddCourse}
          >
            Add Course
          </Button>
        </DialogActions>
      </Dialog>

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

export default StudentDetails;