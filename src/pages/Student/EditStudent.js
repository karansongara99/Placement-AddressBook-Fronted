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
import { studentsapi } from "../../api/axios";


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

const EditStudent = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const [data, setData] = useState({
 name:"",
  });

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await studentsapi.get(`student/${id}`);
        const student = res.data;

        if (student && student.id) {
          setData({
            name: student.name || "",
          });
        } else {
          alert("Student not found.");
          navigate("/studentlist");
        }
      } catch (error) {
        console.error("Error fetching student:", error);
        alert("Failed to load student data.");
        navigate("/studentlist");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchStudent();
    }
  }, [id, navigate]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await validationSchema.validate(data, { abortEarly: false });
      setErrors({});
      setSubmitting(true);

      const payload = {
        name: data.name.trim(),
      };
      
      if (data.name.trim()) {
        payload.name = data.name.trim();
      } else {
        payload.name = "";
      }

      await studentsapi.put(`student/${id}`, payload);

      alert("Student updated successfully!");
      navigate("/studentlist");
    } catch (err) {
      setSubmitting(false);
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          formErrors[error.path] = error.message;
        });
        setErrors(formErrors);
      } else {
        console.error("Error updating student:", err);
        alert("Failed to update student. Please try again.");
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
          Edit Student
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Update the student information below
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
                label="Name"
                name="name"
                fullWidth
                value={data.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
                required
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
              {submitting ? "Updating..." : "Update Student"}
            </Button>
          </Box>
        </Box>
      </FormCard>
    </Container>
  );
};

export default EditStudent;
