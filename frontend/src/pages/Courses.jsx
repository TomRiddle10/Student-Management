import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const API_URL = "http://localhost:8080/api";

function Courses() {
  const [courses, setCourses] = useState([]);

  const [loading, setLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);

  const [editingCourse, setEditingCourse] = useState(null);

  const [formData, setFormData] = useState({
    courseCode: "",
    courseName: "",
    credits: "",
  });

  const [saving, setSaving] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

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

  // -----------------------------
  // Load courses
  // -----------------------------

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/courses`
      );

      if (!response.ok) {
        throw new Error("Failed to load courses");
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
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // -----------------------------
  // Open Add Dialog
  // -----------------------------

  const handleAdd = () => {
    setEditingCourse(null);

    setFormData({
      courseCode: "",
      courseName: "",
      credits: "",
    });

    setDialogOpen(true);
  };

  // -----------------------------
  // Open Edit Dialog
  // -----------------------------

  const handleEdit = (course) => {
    setEditingCourse(course);

    setFormData({
      courseCode: course.courseCode,
      courseName: course.courseName,
      credits: course.credits ?? "",
    });

    setDialogOpen(true);
  };

  // -----------------------------
  // Form change
  // -----------------------------

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------
  // Save Course
  // -----------------------------

  const handleSave = async () => {
    if (!formData.courseCode.trim()) {
      showMessage(
        "Course code is required",
        "error"
      );
      return;
    }

    if (!formData.courseName.trim()) {
      showMessage(
        "Course name is required",
        "error"
      );
      return;
    }

    if (
      formData.credits === "" ||
      Number(formData.credits) <= 0
    ) {
      showMessage(
        "Credits must be greater than 0",
        "error"
      );
      return;
    }

    try {
      setSaving(true);

      const courseData = {
        courseCode:
          formData.courseCode.trim(),

        courseName:
          formData.courseName.trim(),

        credits: Number(formData.credits),
      };

      const url = editingCourse
        ? `${API_URL}/courses/${editingCourse.id}`
        : `${API_URL}/courses`;

      const method = editingCourse
        ? "PUT"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(courseData),
      });

      if (!response.ok) {
        const errorText = await response.text();

        throw new Error(
          errorText ||
            `Failed to ${
              editingCourse
                ? "update"
                : "create"
            } course`
        );
      }

      await fetchCourses();

      setDialogOpen(false);

      showMessage(
        editingCourse
          ? "Course updated successfully"
          : "Course created successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to save course",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  // -----------------------------
  // Delete Course
  // -----------------------------

  const handleDelete = async (course) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${course.courseCode}?`
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/courses/${course.id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const errorText =
          await response.text();

        throw new Error(
          errorText ||
            "Failed to delete course"
        );
      }

      await fetchCourses();

      showMessage(
        "Course deleted successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        error.message ||
          "Failed to delete course",
        "error"
      );
    }
  };

  return (
    <Box>
      {/* Header */}

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography
            variant="h4"
            fontWeight="bold"
          >
            Courses
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage courses available to students.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          Add Course
        </Button>
      </Box>

      {/* Course List */}

      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              py={6}
            >
              <CircularProgress />
            </Box>
          ) : courses.length === 0 ? (
            <Alert severity="info">
              No courses available.
            </Alert>
          ) : (
            <Stack spacing={1}>
              {/* Header */}

              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns:
                    "1fr 2fr 1fr 120px",
                  gap: 2,
                  px: 2,
                  py: 1.5,
                  bgcolor:
                    "background.default",
                  borderRadius: 1,
                }}
              >
                <Typography fontWeight="bold">
                  Code
                </Typography>

                <Typography fontWeight="bold">
                  Course Name
                </Typography>

                <Typography fontWeight="bold">
                  Credits
                </Typography>

                <Typography fontWeight="bold">
                  Actions
                </Typography>
              </Box>

              {/* Rows */}

              {courses.map((course) => (
                <Box
                  key={course.id}
                  sx={{
                    display: "grid",
                    gridTemplateColumns:
                      "1fr 2fr 1fr 120px",
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
                  <Typography fontWeight="bold">
                    {course.courseCode}
                  </Typography>

                  <Typography>
                    {course.courseName}
                  </Typography>

                  <Typography>
                    {course.credits}
                  </Typography>

                  <Box>
                    <IconButton
                      color="primary"
                      onClick={() =>
                        handleEdit(course)
                      }
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      color="error"
                      onClick={() =>
                        handleDelete(course)
                      }
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}

      <Dialog
        open={dialogOpen}
        onClose={() =>
          setDialogOpen(false)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingCourse
            ? "Edit Course"
            : "Add Course"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Course Code"
              name="courseCode"
              value={
                formData.courseCode
              }
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Course Name"
              name="courseName"
              value={
                formData.courseName
              }
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Credits"
              name="credits"
              type="number"
              value={formData.credits}
              onChange={handleChange}
              fullWidth
              slotProps={{
                htmlInput: {
                  min: 1,
                },
              }}
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() =>
              setDialogOpen(false)
            }
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSave}
            disabled={saving}
          >
            {saving
              ? "Saving..."
              : editingCourse
              ? "Update"
              : "Create"}
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

export default Courses;