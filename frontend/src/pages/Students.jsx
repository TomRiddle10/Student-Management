
import { useEffect, useState } from "react";

import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";

import { useNavigate } from "react-router-dom";

const API_URL = "http://localhost:8080/api";

const emptyStudent = {
  name: "",
  email: "",
  phone: "",
  department: "",
  year: "",
};

function Students() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState(emptyStudent);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Load students
  const fetchStudents = async () => {
    try {
      const response = await fetch(`${API_URL}/students`);

      if (!response.ok) {
        throw new Error("Failed to load students");
      }

      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to load students",
        "error"
      );
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // Show snackbar
  const showMessage = (message, severity = "success") => {
    setSnackbar({
      open: true,
      message,
      severity,
    });
  };

  // Open Add dialog
  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormData(emptyStudent);
    setOpenDialog(true);
  };

  // Open Edit dialog
  const handleEditStudent = (student) => {
    setEditingStudent(student);

    setFormData({
      name: student.name,
      email: student.email,
      phone: student.phone || "",
      department: student.department,
      year: student.year,
    });

    setOpenDialog(true);
  };

  // Form input
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // Save student
  const handleSubmit = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.department ||
      !formData.year
    ) {
      showMessage(
        "Please fill all required fields",
        "error"
      );
      return;
    }

    const studentData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      department: formData.department,
      year: Number(formData.year),
    };

    try {
      let response;

      if (editingStudent) {
        response = await fetch(
          `${API_URL}/students/${editingStudent.id}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );
      } else {
        response = await fetch(
          `${API_URL}/students`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(studentData),
          }
        );
      }

      if (!response.ok) {
        throw new Error("Failed to save student");
      }

      await fetchStudents();

      setOpenDialog(false);

      showMessage(
        editingStudent
          ? "Student updated successfully"
          : "Student added successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to save student",
        "error"
      );
    }
  };

  // Delete student
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/students/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete student");
      }

      await fetchStudents();

      showMessage(
        "Student deleted successfully"
      );
    } catch (error) {
      console.error(error);

      showMessage(
        "Failed to delete student",
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
            Students
          </Typography>

          <Typography
            color="text.secondary"
          >
            Manage student records
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAddStudent}
        >
          Add Student
        </Button>
      </Box>

      {/* Student Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>ID</strong>
                </TableCell>

                <TableCell>
                  <strong>Name</strong>
                </TableCell>

                <TableCell>
                  <strong>Email</strong>
                </TableCell>

                <TableCell>
                  <strong>Phone</strong>
                </TableCell>

                <TableCell>
                  <strong>Department</strong>
                </TableCell>

                <TableCell>
                  <strong>Year</strong>
                </TableCell>

                <TableCell align="center">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {students.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    align="center"
                  >
                    No students found.
                  </TableCell>
                </TableRow>
              ) : (
                students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>
                      {student.id}
                    </TableCell>

                    <TableCell>
                      {student.name}
                    </TableCell>

                    <TableCell>
                      {student.email}
                    </TableCell>

                    <TableCell>
                      {student.phone || "-"}
                    </TableCell>

                    <TableCell>
                      {student.department}
                    </TableCell>

                    <TableCell>
                      Year {student.year}
                    </TableCell>

                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() =>
                          navigate(
                            `/students/${student.id}`
                          )
                        }
                      >
                        <VisibilityIcon />
                      </IconButton>

                      <IconButton
                        color="primary"
                        onClick={() =>
                          handleEditStudent(student)
                        }
                      >
                        <EditIcon />
                      </IconButton>

                      <IconButton
                        color="error"
                        onClick={() =>
                          handleDelete(student.id)
                        }
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {editingStudent
            ? "Edit Student"
            : "Add Student"}
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2} mt={1}>
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              fullWidth
            />

            <TextField
              label="Department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              fullWidth
              required
            />

            <TextField
              label="Year"
              name="year"
              type="number"
              value={formData.year}
              onChange={handleChange}
              inputProps={{
                min: 1,
                max: 4,
              }}
              fullWidth
              required
            />
          </Stack>
        </DialogContent>

        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleSubmit}
          >
            {editingStudent
              ? "Update"
              : "Add Student"}
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

export default Students;