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
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import { apiDelete, apiGet, apiPost } from "../config";

const Teachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openDialog, setOpenDialog] = useState(false);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const loadTeachers = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await apiGet("/admin/teachers");
      setTeachers(data || []);
    } catch (err) {
      console.error("Failed to load teachers:", err);
      setError(err.message || "Failed to load teachers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleOpenDialog = () => {
    setError("");
    setSuccess("");

    setFormData({
      username: "",
      email: "",
      password: "",
    });

    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    if (saving) return;

    setOpenDialog(false);
  };

  const handleCreateTeacher = async () => {
    setError("");
    setSuccess("");

    if (!formData.username.trim()) {
      setError("Username is required");
      return;
    }

    if (!formData.email.trim()) {
      setError("Email is required");
      return;
    }

    if (!formData.password) {
      setError("Password is required");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must contain at least 6 characters");
      return;
    }

    try {
      setSaving(true);

      await apiPost("/admin/teachers", {
        username: formData.username.trim(),
        email: formData.email.trim(),
        password: formData.password,
      });

      setOpenDialog(false);

      setFormData({
        username: "",
        email: "",
        password: "",
      });

      setSuccess("Teacher created successfully");

      await loadTeachers();
    } catch (err) {
      console.error("Failed to create teacher:", err);
      setError(err.message || "Failed to create teacher");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteTeacher = async (teacher) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete teacher "${teacher.username}"?`
    );

    if (!confirmed) return;

    try {
      setError("");
      setSuccess("");

      await apiDelete(`/admin/teachers/${teacher.id}`);

      setSuccess("Teacher deleted successfully");

      await loadTeachers();
    } catch (err) {
      console.error("Failed to delete teacher:", err);
      setError(err.message || "Failed to delete teacher");
    }
  };

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      {/* Header */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        spacing={2}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            Teachers
          </Typography>

          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Manage teacher accounts and access
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleOpenDialog}
        >
          Add Teacher
        </Button>
      </Stack>

      {/* Alerts */}
      {error && (
        <Alert
          severity="error"
          sx={{ mb: 2 }}
          onClose={() => setError("")}
        >
          {error}
        </Alert>
      )}

      {success && (
        <Alert
          severity="success"
          sx={{ mb: 2 }}
          onClose={() => setSuccess("")}
        >
          {success}
        </Alert>
      )}

      {/* Teacher table */}
      <Card elevation={2}>
        <CardContent sx={{ p: 0 }}>
          {loading ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <CircularProgress />
            </Box>
          ) : teachers.length === 0 ? (
            <Box
              sx={{
                minHeight: 300,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                p: 4,
              }}
            >
              <PersonOutlinedIcon
                sx={{
                  fontSize: 60,
                  color: "text.secondary",
                  mb: 1,
                }}
              />

              <Typography variant="h6" fontWeight={600}>
                No teachers found
              </Typography>

              <Typography variant="body2" color="text.secondary">
                Add a teacher to get started.
              </Typography>
            </Box>
          ) : (
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <strong>ID</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Username</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Email</strong>
                    </TableCell>

                    <TableCell>
                      <strong>Role</strong>
                    </TableCell>

                    <TableCell align="right">
                      <strong>Actions</strong>
                    </TableCell>
                  </TableRow>
                </TableHead>

                <TableBody>
                  {teachers.map((teacher) => (
                    <TableRow
                      key={teacher.id}
                      hover
                      sx={{
                        "&:last-child td, &:last-child th": {
                          border: 0,
                        },
                      }}
                    >
                      <TableCell>{teacher.id}</TableCell>

                      <TableCell>
                        <Typography fontWeight={600}>
                          {teacher.username}
                        </Typography>
                      </TableCell>

                      <TableCell>{teacher.email}</TableCell>

                      <TableCell>
                        <Typography
                          component="span"
                          sx={{
                            px: 1.5,
                            py: 0.5,
                            borderRadius: 2,
                            fontSize: "0.8rem",
                            fontWeight: 600,
                            bgcolor: "primary.50",
                            color: "primary.main",
                          }}
                        >
                          {teacher.role}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <IconButton
                          color="error"
                          onClick={() => handleDeleteTeacher(teacher)}
                          title="Delete teacher"
                        >
                          <DeleteOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </CardContent>
      </Card>

      {/* Add Teacher Dialog */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          Add New Teacher
        </DialogTitle>

        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <TextField
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              fullWidth
              required
              autoFocus
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
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              fullWidth
              required
              helperText="Minimum 6 characters"
            />
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleCloseDialog}
            disabled={saving}
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            onClick={handleCreateTeacher}
            disabled={saving}
            startIcon={
              saving ? <CircularProgress size={18} /> : <AddIcon />
            }
          >
            {saving ? "Creating..." : "Create Teacher"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Teachers;