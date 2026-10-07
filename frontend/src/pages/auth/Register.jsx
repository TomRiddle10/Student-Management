import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Alert,
  Box,
  Button,
  Container,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";

import { API_URL } from "../../config";


// =========================================================
// Register
// =========================================================

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


  // =========================================================
  // Handle Input
  // =========================================================

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };


  // =========================================================
  // Handle Register
  // =========================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const username = formData.username.trim();
    const email = formData.email.trim();

    if (!username || !email || !formData.password) {
      setError("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setError(
        "Password must be at least 6 characters long."
      );
      return;
    }

    if (
      formData.password !==
      formData.confirmPassword
    ) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            username,
            email,
            password: formData.password,
          }),
        }
      );

      let data = null;

      try {
        data = await response.json();
      } catch {
        data = null;
      }

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            "Registration failed."
        );
      }

      setSuccess(
        "Registration successful! Redirecting to login..."
      );

      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
      });

      setTimeout(() => {
        navigate("/login", {
          replace: true,
        });
      }, 1200);

    } catch (err) {
      console.error(
        "Registration failed:",
        err
      );

      setError(
        err.message ||
          "Unable to register. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };


  // =========================================================
  // UI
  // =========================================================

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f5f7fb",
        px: 2,
        py: 4,
      }}
    >
      <Container
        maxWidth="sm"
        sx={{
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Paper
          elevation={0}
          sx={{
            width: "100%",
            maxWidth: 450,
            p: {
              xs: 3,
              sm: 5,
            },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
        >

          {/* ================================================= */}
          {/* Header */}
          {/* ================================================= */}

          <Box
            sx={{
              textAlign: "center",
              mb: 4,
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
                mx: "auto",
                mb: 2,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "primary.main",
                color: "white",
              }}
            >
              <SchoolOutlinedIcon fontSize="large" />
            </Box>

            <Typography
              variant="h4"
              fontWeight={700}
            >
              Create Account
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ mt: 1 }}
            >
              Register for Student Management System
            </Typography>
          </Box>


          {/* ================================================= */}
          {/* Alerts */}
          {/* ================================================= */}

          {error && (
            <Alert
              severity="error"
              sx={{ mb: 3 }}
            >
              {error}
            </Alert>
          )}

          {success && (
            <Alert
              severity="success"
              sx={{ mb: 3 }}
            >
              {success}
            </Alert>
          )}


          {/* ================================================= */}
          {/* Registration Form */}
          {/* ================================================= */}

          <Box
            component="form"
            onSubmit={handleSubmit}
          >

            <TextField
              fullWidth
              required
              label="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              autoComplete="username"
              autoFocus
              disabled={loading}
            />

            <TextField
              fullWidth
              required
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              margin="normal"
              autoComplete="email"
              disabled={loading}
            />

            <TextField
              fullWidth
              required
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
              disabled={loading}
            />

            <TextField
              fullWidth
              required
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              margin="normal"
              autoComplete="new-password"
              disabled={loading}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.4,
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
              }}
            >
              {loading
                ? "Creating Account..."
                : "Create Account"}
            </Button>

          </Box>


          {/* ================================================= */}
          {/* Login Link */}
          {/* ================================================= */}

          <Typography
            variant="body2"
            color="text.secondary"
            textAlign="center"
            sx={{ mt: 3 }}
          >
            Already have an account?{" "}

            <Typography
              component={Link}
              to="/login"
              variant="body2"
              sx={{
                color: "primary.main",
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Sign In
            </Typography>
          </Typography>

        </Paper>
      </Container>
    </Box>
  );
}

export default Register;