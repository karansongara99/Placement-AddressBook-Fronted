import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  AccountCircle,
  Person,
} from "@mui/icons-material";

import { useNavigate, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 250;

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Sidebar items list
  const menuItems = [
    { text: "Profile", icon: <AccountCircle />, path: "/profile" },
    { text: "Contact", icon: <Person />, path: "/contact" },
  ];

  // Drawer UI
  const DrawerCus = () => (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <Toolbar sx={{ justifyContent: "center" }}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              mb: 1,
              bgcolor: "#1976d2",
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography variant="h6" fontWeight="600">
            My Dashboard
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* Sidebar menu */}
      <List sx={{ mt: 1 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                selected={isActive}
                sx={{
                  borderRadius: "8px",
                  mx: 1,
                  my: 0.5,
                  background: isActive
                    ? "linear-gradient(90deg, #6a11cb, #2575fc)"
                    : "transparent",
                  color: isActive ? "white" : "inherit",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(90deg, #6a11cb, #2575fc)"
                      : "rgba(0,0,0,0.08)",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "inherit",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      {/* Bottom Section */}
      <Box sx={{ flexGrow: 1 }}></Box>
      <Divider />

      <Box sx={{ p: 2, textAlign: "center" }}>
        <Typography variant="body2" color="text.secondary">
          Logged in as User
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* TOP NAVBAR */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          background: "linear-gradient(90deg, #6a11cb, #2575fc)",
          boxShadow: "0px 3px 10px rgba(0,0,0,0.2)",
        }}
      >
        <Toolbar>
          {/* Mobile menu button */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 600 }}>
            Dashboard
          </Typography>

          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR */}
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              borderRight: "0px",
            },
          }}
        >
          <DrawerCus />
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              borderRight: "0px",
              background: "#ffffff",
            },
          }}
          open
        >
          <DrawerCus />
        </Drawer>
      </Box>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
          background: "#f4f6f9",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
