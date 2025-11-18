// src/components/Sidebar.jsx
import React from "react";
import {
  Drawer,
  Toolbar,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Typography,
  Box,
} from "@mui/material";
import { Person, Add,Block } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;

function Sidebar({ mobileOpen, handleDrawerToggle }) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "DashBoard", icon: <Block />, path: "/" },
    { text: "Contact", icon: <Person />, path: "/contactlist" },
    { text: "Add Contact", icon: <Add />, path: "/addcontact" },
    { text: "Faculty", icon: <Person />, path: "/faculties" },
  ];

  const DrawerContent = (
    <Box
      sx={{
        height: "100%",
        background: "linear-gradient(180deg, #0D47A1 0%, #1565C0 100%)",
        color: "white",
      }}
    >
      {/* Header */}
      <Toolbar
        sx={{
          background: "rgba(255,255,255,0.15)",
          borderRadius: "8px",
          mx: 2,
          mt: 2,
          mb: 1,
          padding: "10px 16px",
        }}
      >
        <Typography
          variant="h6"
          noWrap
          sx={{ fontWeight: 600, letterSpacing: 0.5 }}
        >
          My Address Book
        </Typography>
      </Toolbar>

      <Divider
        sx={{
          bgcolor: "rgba(255,255,255,0.2)",
          mx: 2,
          my: 1,
        }}
      />

      {/* Menu Items */}
      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => {
          const selected = location.pathname === item.path;

          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                selected={selected}
                onClick={() => {
                  navigate(item.path);
                  handleDrawerToggle();
                }}
                sx={{
                  mx: 1,
                  borderRadius: "10px",
                  color: "white",
                  bgcolor: selected ? "rgba(255,255,255,0.2)" : "transparent",
                  transition: "0.25s",
                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.25)",
                    transform: "translateX(4px)",
                  },
                }}
              >
                {/* Active route left accent bar */}
                {selected && (
                  <Box
                    sx={{
                      position: "absolute",
                      left: 0,
                      width: "4px",
                      height: "60%",
                      bgcolor: "#FFEB3B",
                      borderRadius: "0 4px 4px 0",
                    }}
                  />
                )}

                <ListItemIcon sx={{ color: "white", minWidth: 40 }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: "15px",
                    fontWeight: selected ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
      }}
    >
      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", sm: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
      >
        {DrawerContent}
      </Drawer>

      {/* Desktop Drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", sm: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            border: "none",
          },
        }}
        open
      >
        {DrawerContent}
      </Drawer>
    </Box>
  );
}

export default Sidebar;
export { drawerWidth };
