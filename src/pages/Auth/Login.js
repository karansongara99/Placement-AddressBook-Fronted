import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert,
  Paper
} from "@mui/material";
import { useNavigate } from "react-router-dom";

function LoginForm() {
  // State variables for form inputs
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");
  // router navigate
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic validation
    if (!username || !password) {
      setSnackbarMsg("Please fill in all fields!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }
//username email password , display_name , profile_picture
  console.log("Login Submitted");
  // navigate will be used on successful login

    // API call example (replace URL with your backend endpoint)
    fetch("http://srv1022055.hstgr.cloud:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username:username, password:password })
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        // Basic success detection: check for a token or explicit success flag
        const ok = data && (data.token || data.success || data.status === "ok");
        if (ok) {
          setSnackbarMsg("Login successful!");
          setSnackbarType("success");
          setSnackbarOpen(true);
          // Clear the form only after success
          setUsername("");
          setPassword("");
          localStorage.setItem("token", data.token);
          // Navigate to dashboard
          navigate("/");
        } else {
          setSnackbarMsg("Login failed! Please check credentials.");
          setSnackbarType("error");
          setSnackbarOpen(true);
          localStorage.removeItem("token");
        }
      })
      .catch((err) => {
        console.error("Error:", err);
        setSnackbarMsg("Login failed! Please try again.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      });

    // Note: form fields are cleared after a successful login in the success branch
  };

  // Close snackbar handler
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") return;
    setSnackbarOpen(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        bgcolor: "#f5f5f5"
      }}
    >
      {/* Login card */}
      <Paper elevation={3} sx={{ p: 4, width: 350 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Login
        </Typography>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          {/* Username Field */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password Field */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>

          {/* Register Link */}
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Don’t have an account?{" "}
            <Link href="/register" underline="hover">
              Register
            </Link>
          </Typography>
        </form>
      </Paper>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarType}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default LoginForm;
