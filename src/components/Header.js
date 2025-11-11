// src/components/Header.js
import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Button } from "@mui/material";
import { Menu as MenuIcon } from "@mui/icons-material";

function Header({ handleDrawerToggle, handleLogout, drawerWidth }) {
  return (
    <AppBar
      position="fixed"
      sx={{
        width: { sm: `calc(100% - ${drawerWidth}px)` },
        ml: { sm: `${drawerWidth}px` },
        bgcolor: "#1976d2",
      }}
    >
      <Toolbar>
        {/* Hamburger for mobile */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ mr: 2, display: { sm: "none" } }}
        >
          <MenuIcon />
        </IconButton>

        <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
          Dashboard
        </Typography>

        <Button color="inherit" onClick={handleLogout}>
          Logout
        </Button>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
