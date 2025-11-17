import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  TableContainer,
  CircularProgress,
  TextField,
  InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";

const FacultyList = () => {
  const [faculties, setFaculties] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFaculties = async () => {
    try {
      const res = await fetch(
        "http://62d6c51451e6e8f06f12bd5d.mockapi.io/faculties"
      );
      const data = await res.json();
      setFaculties(data);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching faculties", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaculties();
  }, []);

  const handleSearch = (value) => {
    if (!value.trim()) {
      setFiltered(faculties);
      return;
    }

    const search = faculties.filter((f) =>
      f.facultyName.toLowerCase().includes(value.toLowerCase())
    );

    setFiltered(search);
  };

  return (
    <Box
      sx={{
        p: 3,
      }}
    >
      <Typography variant="h4" fontWeight={600} mb={3}>
        Faculty List
      </Typography>

      {/* Search Bar */}
      <TextField
        placeholder="Search faculty..."
        variant="outlined"
        fullWidth
        sx={{ mb: 3 }}
        onChange={(e) => handleSearch(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {/* Loading Spinner */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress />
          <Typography mt={2}>Loading faculties...</Typography>
        </Box>
      ) : (
        <TableContainer component={Paper} elevation={4} sx={{ borderRadius: 3 }}>
          <Table>
            <TableHead sx={{ bgcolor: "#1976d2" }}>
              <TableRow>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Image</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Faculty Name</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Faculty Code</TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>Faculty ID</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((faculty) => (
                <TableRow key={faculty.id} hover>
                  <TableCell>
                    <Avatar
                      src={faculty.facultyImage}
                      alt={faculty.facultyName}
                      sx={{ width: 50, height: 50 }}
                    />
                  </TableCell>

                  <TableCell>{faculty.facultyName}</TableCell>
                  <TableCell>{faculty.facultyCode}</TableCell>
                  <TableCell>{faculty.id}</TableCell>
                </TableRow>
              ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 3 }}>
                    No faculty found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default FacultyList;
