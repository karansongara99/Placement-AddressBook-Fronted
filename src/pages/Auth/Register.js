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

function RegisterForm() {
  // Form states
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");

  // Snackbar states
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  // Handle Register Submit
  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple validation
    if (!username || !displayName || !email || !password) {
      setSnackbarMsg("Please fill in all required fields!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    console.log("Register Submitted");

    // Prepare request body
    const requestBody = {
      username,
      displayName,
      email,
      password,
      profilePic
    };

    // Example API call
    fetch("http://srv1022055.hstgr.cloud:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Response:", data);
        setSnackbarMsg("Registration successful!");
        setSnackbarType("success");
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Error:", err);
        setSnackbarMsg("Registration failed! Try again.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      });

    // Reset form
    setUsername("");
    setDisplayName("");
    setEmail("");
    setPassword("");
    setProfilePic("");
  };

  // Snackbar close handler
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
      {/* Register Card */}
      <Paper elevation={3} sx={{ p: 4, width: 380 }}>
        <Typography variant="h5" textAlign="center" mb={2}>
          Register
        </Typography>

        {/* Register Form */}
        <form onSubmit={handleSubmit}>
          {/* Username */}
          <TextField
            label="Username"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Display Name */}
          <TextField
            label="Display Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            variant="outlined"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password */}
          <TextField
            label="Password"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Profile Picture (Manual String / URL) */}
          <TextField
            label="Profile Picture URL"
            type="text"
            variant="outlined"
            fullWidth
            margin="normal"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="Enter image URL or string"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Register
          </Button>

          {/* Login Link */}
          <Typography variant="body2" textAlign="center" sx={{ mt: 2 }}>
            Already have an account?{" "}
            <Link href="/" underline="hover">
              Login
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

export default RegisterForm;
