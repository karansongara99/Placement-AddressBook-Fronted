import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Avatar,
  Box,
  Divider,
} from '@mui/material';

const Profile = () => {
  const [user, setUser] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f5f6fa',
      }}
    >
      <Card
        sx={{
          maxWidth: 400,
          width: '90%',
          boxShadow: 4,
          borderRadius: 3,
          textAlign: 'center',
          p: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mb: 2,
          }}
        >
          <Avatar
            src={user.profilePic || ""}
            sx={{
              bgcolor: user.profilePic ? 'transparent' : '#1976d2',
              width: 80,
              height: 80,
              fontSize: '2rem',
              mb: 2,
            }}
          >
            {!user.profilePic && user.username
              ? user.username.charAt(0).toUpperCase()
              : 'G'}
          </Avatar>
          <Typography variant="h5" gutterBottom>
            {user.displayName || user.username || 'Guest'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.email || 'Email not available'}
          </Typography>
        </Box>

        <Divider sx={{ my: 2 }} />

        <CardContent>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Username: {user.username || 'N/A'}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Email: {user.email || 'N/A'}
          </Typography>
          <Typography variant="body1" color="text.secondary" gutterBottom>
            Display Name: {user.displayName || 'N/A'}
          </Typography>
        </CardContent>

        <CardActions sx={{ justifyContent: 'center', pb: 2 }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleLogout}
            sx={{ textTransform: 'none', px: 4 }}
          >
            Logout
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};

export default Profile;
  