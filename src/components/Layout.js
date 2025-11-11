// src/components/Layout.js
import React, { useState } from "react";
import { Box, CssBaseline, Toolbar } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "./Header";
import Sidebar, { drawerWidth } from "./Sidebar";

function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <Header
        handleDrawerToggle={handleDrawerToggle}
        handleLogout={handleLogout}
        drawerWidth={drawerWidth}
      />
      <Sidebar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: "#f5f5f5",
          minHeight: "100vh",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Layout;
