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
  Visibility,
  VisibilityOff,
  Lock
} from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMsg, setSnackbarMsg] = useState("");
  const [snackbarType, setSnackbarType] = useState("success");

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!username || !password) {
      setSnackbarMsg("Please fill in all fields!");
      setSnackbarType("error");
      setSnackbarOpen(true);
      return;
    }

    fetch("http://srv1022055.hstgr.cloud:3001/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    })
      .then((res) => res.json())
      .then((data) => {
        const ok = data && (data.token || data.success || data.status === "ok");

        if (ok) {
          setSnackbarMsg("Login successful!");
          setSnackbarType("success");
          setSnackbarOpen(true);

          localStorage.setItem("token", data.token);
          setUsername("");
          setPassword("");
          navigate("/");
        } else {
          setSnackbarMsg("Invalid username or password!");
          setSnackbarType("error");
          setSnackbarOpen(true);
          localStorage.removeItem("token");
        }
      })
      .catch(() => {
        setSnackbarMsg("Login failed! Try again.");
        setSnackbarType("error");
        setSnackbarOpen(true);
      });
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
          p: 4,
          width: 380,
          borderRadius: 3,
          backdropFilter: "blur(10px)",
          textAlign: "center"
        }}
      >
        <Typography variant="h4" fontWeight="600" mb={1}>
          Welcome Address Book
        </Typography>
        <Typography variant="body2" color="text.secondary" mb={3}>
          Login to your account
        </Typography>

        <form onSubmit={handleSubmit}>
          {/* Username */}
          <TextField
            label="Username"
            fullWidth
            margin="normal"
            variant="outlined"
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

          {/* Password */}
          <TextField
            label="Password"
            fullWidth
            margin="normal"
            type={showPassword ? "text" : "password"}
            variant="outlined"
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              py: 1.2,
              fontSize: "16px",
              borderRadius: 2,
            }}
          >
            Login
          </Button>

          <Typography variant="body2" mt={2}>
            Don’t have an account?{" "}
            <Link href="/register" underline="hover">
              Register
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

export default LoginForm;
