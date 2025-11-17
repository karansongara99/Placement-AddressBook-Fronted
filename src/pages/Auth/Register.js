import React, { useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Link,
  Snackbar,
  Alert,
  Paper,
  IconButton,
  InputAdornment
} from "@mui/material";

import {
  AccountCircle,
  Person,
  Email,
  Lock,
  Visibility,
  VisibilityOff,
  Image
} from "@mui/icons-material";

function RegisterForm() {
  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePic, setProfilePic] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !displayName || !email || !password) {
      setSnackbarMsg("Please fill in all required fields!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    const requestBody = {
      username,
      displayName,
      email,
      password,
      profilePic
    };

    fetch("http://srv1022055.hstgr.cloud:3001/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    })
      .then((res) => res.json())
      .then((data) => {
        setSnackbarMsg("Registration successful!");
        setSnackbarType("success");
        setSnackbarOpen(true);
      })
      .catch(() => {
        setSnackbarMsg("Registration failed! Try again.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      });

    setUsername("");
    setDisplayName("");
    setEmail("");
    setPassword("");
    setProfilePic("");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #6a11cb 0%, #2575fc 100%)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        p: 2
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 420,
          p: 4,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          textAlign: "center"
        }}
      >
        <Typography variant="h4" fontWeight="600" mb={1}>
          Create Account
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Join us by creating an account
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <AccountCircle color="primary" />
                </InputAdornment>
              )
            }}
          />

          {/* Display Name */}
          <TextField
            label="Display Name"
            fullWidth
            margin="normal"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person color="primary" />
                </InputAdornment>
              )
            }}
          />

          {/* Email */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email color="primary" />
                </InputAdornment>
              )
            }}
          />

          {/* Password */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock color="primary" />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Profile Pic */}
          <TextField
            label="Profile Picture URL"
            fullWidth
            margin="normal"
            value={profilePic}
            onChange={(e) => setProfilePic(e.target.value)}
            placeholder="https://example.com/image.jpg"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Image color="primary" />
                </InputAdornment>
              )
            }}
          />

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: "16px",
              borderRadius: 2
            }}
          >
            Register
          </Button>

          <Typography variant="body2" mt={2}>
            Already have an account?{" "}
            <Link href="/" underline="hover">
              Login
            </Link>
          </Typography>
        </form>
      </Paper>

      {/* Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity={snackbarType} variant="filled" sx={{ width: "100%" }}>
          {snackbarMsg}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default RegisterForm;
