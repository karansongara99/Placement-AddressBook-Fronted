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
    <Box sx={{ p: 3 }}>
      <Typography
        variant="h4"
        fontWeight={700}
        mb={3}
        sx={{
          background: "linear-gradient(90deg, #6a11cb 0%, #2575fc 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Faculty List
      </Typography>

      {/* Modern Search Bar */}
      <TextField
        placeholder="Search faculty..."
        variant="outlined"
        fullWidth
        onChange={(e) => handleSearch(e.target.value)}
        sx={{
          mb: 3,
          borderRadius: 3,
          "& .MuiOutlinedInput-root": {
            background: "#ffffff",
            borderRadius: "12px",
            boxShadow: "0px 4px 10px rgba(0,0,0,0.08)",
          },
        }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="primary" />
            </InputAdornment>
          ),
        }}
      />

      {/* Loading UI */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 5 }}>
          <CircularProgress sx={{ color: "#6a11cb" }} />
          <Typography mt={2} color="text.secondary">
            Loading faculties...
          </Typography>
        </Box>
      ) : (
        <TableContainer
          component={Paper}
          elevation={4}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "#ffffff",
          }}
        >
          <Table>
            <TableHead>
              <TableRow
                sx={{
                  background: "linear-gradient(90deg, #6a11cb, #2575fc)",
                }}
              >
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Image
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Faculty Name
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Faculty Code
                </TableCell>
                <TableCell sx={{ color: "white", fontWeight: 600 }}>
                  Faculty ID
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered.map((faculty) => (
                <TableRow
                  key={faculty.id}
                  hover
                  sx={{
                    transition: "0.2s",
                    "&:hover": {
                      backgroundColor: "rgba(106, 17, 203, 0.06)",
                      transform: "scale(1.01)",
                    },
                  }}
                >
                  <TableCell>
                    <Avatar
                      src={faculty.facultyImage}
                      alt={faculty.facultyName}
                      sx={{
                        width: 55,
                        height: 55,
                        border: "2px solid #6a11cb",
                      }}
                    />
                  </TableCell>

                  <TableCell sx={{ fontWeight: 500 }}>
                    {faculty.facultyName}
                  </TableCell>

                  <TableCell>{faculty.facultyCode}</TableCell>

                  <TableCell>{faculty.id}</TableCell>
                </TableRow>
              ))}

              {/* No Data */}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} sx={{ textAlign: "center", py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                      No faculty found 😕
                    </Typography>
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
