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
  AccountCircle,
  Person,
} from "@mui/icons-material";

import { useNavigate, Outlet, useLocation } from "react-router-dom";

const drawerWidth = 260;

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

  const menuItems = [
    { text: "Profile", icon: <AccountCircle />, path: "/profile" },
    { text: "Contact", icon: <Person />, path: "/contact" },
  ];

  // Sidebar component
  const DrawerCus = () => (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        background: "linear-gradient(180deg, #ffffff 0%, #f1f4f9 100%)",
        borderRight: "1px solid #e0e4eb",
      }}
    >
      {/* Sidebar Header */}
      <Toolbar sx={{ justifyContent: "center", py: 3 }}>
        <Box textAlign="center">
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mx: "auto",
              mb: 1,
              bgcolor: "#6a11cb",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <Person sx={{ fontSize: 40 }} />
          </Avatar>

          <Typography
            variant="h6"
            sx={{ fontWeight: 700, letterSpacing: 0.5, color: "#333" }}
          >
            My Dashboard
          </Typography>
        </Box>
      </Toolbar>

      <Divider sx={{ mx: 3, borderColor: "#ddd" }} />

      {/* Menu items */}
      <List sx={{ mt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1.2 }}>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  setMobileOpen(false);
                }}
                sx={{
                  borderRadius: "12px",
                  position: "relative",
                  px: 2,
                  py: 1.2,
                  background: isActive
                    ? "linear-gradient(90deg, #6a11cb, #2575fc)"
                    : "#ffffff",
                  color: isActive ? "white" : "#333",
                  boxShadow: isActive
                    ? "0px 4px 12px rgba(106,17,203,0.4)"
                    : "none",
                  transition: "0.25s",
                  "&:hover": {
                    background: isActive
                      ? "linear-gradient(90deg, #6a11cb, #2575fc)"
                      : "#f0f2f5",
                    transform: "translateX(5px)",
                  },
                }}
              >
                {/* Glow bar on the left for active item */}
                {isActive && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      height: "70%",
                      width: "5px",
                      bgcolor: "#ffeb3b",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}

                <ListItemIcon
                  sx={{
                    color: isActive ? "white" : "#4b4b4b",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontWeight: isActive ? 700 : 500,
                    fontSize: "15px",
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ mx: 3, borderColor: "#ddd" }} />

      <Box sx={{ p: 2, textAlign: "center", color: "#666" }}>
        <Typography variant="body2">Logged in as User</Typography>
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
          boxShadow: "0px 4px 14px rgba(0,0,0,0.3)",
          backdropFilter: "blur(12px)",
        }}
      >
        <Toolbar>
          {/* Mobile menu */}
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 0.5 }}
          >
            Dashboard
          </Typography>

          <Button
            color="inherit"
            onClick={handleLogout}
            sx={{
              textTransform: "none",
              fontSize: "16px",
              fontWeight: 500,
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* SIDEBAR FOR MOBILE */}
      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
            },
          }}
        >
          <DrawerCus />
        </Drawer>

        {/* DESKTOP SIDEBAR */}
        <Drawer
          variant="permanent"
          open
          sx={{
            display: { xs: "none", sm: "block" },
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              border: "none",
            },
          }}
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
          background: "#f4f6fa",
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}

export default Dashboard;
