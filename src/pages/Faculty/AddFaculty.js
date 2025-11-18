import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import { facultiesapi } from "../../api/axios";
import { useNavigate } from "react-router-dom";

const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.12)",
}));

const SectionTitle = ({ title }) => (
  <Box mb={2} mt={3}>
    <Typography
      variant="h6"
      fontWeight={700}
      sx={{
        display: "inline-block",
        borderLeft: "5px solid #6a11cb",
        pl: 1.5,
      }}
    >
      {title}
    </Typography>
  </Box>
);

const AddFaculty = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    facultyName: "",
    facultyCode: "",
    facultyImage: "",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const validationSchema = Yup.object().shape({
    facultyName: Yup.string().required("Faculty Name is required"),
    facultyCode: Yup.string().required("Faculty Code is required"),
    facultyImage: Yup.string().url("Must be a valid URL").notRequired(),
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    // Clear error for this field when user starts typing
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Validate form
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      setLoading(true);

      // Prepare payload (only send fields that have values)
      const payload = {
        facultyName: data.facultyName.trim(),
        facultyCode: data.facultyCode.trim(),
      };
      
      if (data.facultyImage.trim()) {
        payload.facultyImage = data.facultyImage.trim();
      }

      // Submit to API
      await facultiesapi.post("faculties", payload);
      
      alert("Faculty added successfully!");
      
      // Navigate to faculty list
      navigate("/facultylist");
    } catch (err) {
      setLoading(false);
      if (err.inner) {
        // Validation errors
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        // API errors
        console.error("Error adding faculty:", err);
        alert("Failed to add faculty. Please try again.");
      }
    }
  };




  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* HEADER */}
      <Box textAlign="center" mb={4}>
        <Typography
          variant="h3"
          fontWeight={800}
          sx={{
            background: "linear-gradient(90deg, #6a11cb, #2575fc)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Add New Faculty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the details below to create a new faculty
        </Typography>
      </Box>

      <FormCard>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Fields */}
          <SectionTitle title="Basic Information" />

          <Grid container spacing={2} mb={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Faculty Name"
                name="facultyName"
                fullWidth
                value={data.facultyName}
                onChange={handleChange}
                error={!!errors.facultyName}
                helperText={errors.facultyName}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Faculty Code"
                name="facultyCode"
                fullWidth
                value={data.facultyCode}
                onChange={handleChange}
                error={!!errors.facultyCode}
                helperText={errors.facultyCode}
                required
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Faculty Image URL (Optional)"
                name="facultyImage"
                fullWidth
                value={data.facultyImage}
                onChange={handleChange}
                error={!!errors.facultyImage}
                helperText={errors.facultyImage || "Enter a valid image URL"}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "12px",
                  },
                }}
              />
            </Grid>
          </Grid>


          {/* Submit Button */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={loading}
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "17px",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              {loading ? "Saving..." : "Save Faculty"}
            </Button>
          </Box>
        </Box>
      </FormCard>
    </Container>
  );
};

export default AddFaculty;
