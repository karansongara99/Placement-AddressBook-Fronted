import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import { facultiesapi } from "../../api/axios";


// Glassmorphism Card
const FormCard = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: "20px",
  background: "rgba(255, 255, 255, 0.85)",
  backdropFilter: "blur(12px)",
  boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.12)",
}));

// Stylish Section Title
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

const EditFaculty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
    facultyName: "",
    facultyCode: "",
    facultyImage: "",
  });

  const validationSchema = Yup.object().shape({
    facultyName: Yup.string().required("Faculty Name is required"),
    facultyCode: Yup.string().required("Faculty Code is required"),
    facultyImage: Yup.string().url("Must be a valid URL").notRequired(),
  });

  // Fetch Faculty Details
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        setLoading(true);
        const res = await facultiesapi.get(`faculties/${id}`);

        // MockAPI returns the faculty object directly
        const faculty = res.data;

        if (faculty && faculty.id) {
          setData({
            facultyName: faculty.facultyName || "",
            facultyCode: faculty.facultyCode || "",
            facultyImage: faculty.facultyImage || "",
          });
        } else {
          alert("Faculty not found.");
          navigate("/facultylist");
        }
      } catch (error) {
        console.error("Error fetching faculty:", error);
        alert("Failed to load faculty data.");
        navigate("/facultylist");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchFaculty();
    }
  }, [id, navigate]);

  // Handlers
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
      setSubmitting(true);

      // Prepare payload
      const payload = {
        facultyName: data.facultyName.trim(),
        facultyCode: data.facultyCode.trim(),
      };
      
      if (data.facultyImage.trim()) {
        payload.facultyImage = data.facultyImage.trim();
      } else {
        payload.facultyImage = "";
      }

      // Update faculty
      await facultiesapi.put(`faculties/${id}`, payload);

      alert("Faculty updated successfully!");
      navigate("/facultylist");
    } catch (err) {
      setSubmitting(false);
      if (err.inner) {
        // Validation errors
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        // API errors
        console.error("Error updating faculty:", err);
        alert("Failed to update faculty. Please try again.");
      }
    }
  };




  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* PAGE HEADER */}
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
          Edit Faculty
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update the faculty information below
        </Typography>
      </Box>

      {/* FORM CARD */}
      <FormCard>
        <Box component="form" onSubmit={handleSubmit}>
          {/* BASIC INFO */}
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

     
        
          {/* SUBMIT BUTTON */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              disabled={submitting}
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              {submitting ? "Updating..." : "Update Faculty"}
            </Button>
          </Box>
        </Box>
      </FormCard>
    </Container>
  );
};

export default EditFaculty;
