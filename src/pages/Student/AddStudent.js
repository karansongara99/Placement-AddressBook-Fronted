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
import { studentsapi } from "../../api/axios";
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

const AddStudent = () => {
    const navigate = useNavigate();
    const [data, setData] = useState({
        name: "",
    });

    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validationSchema = Yup.object().shape({
        name: Yup.string().required("Name is required"),
    });

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
            setLoading(true);

            const payload = {
                name: data.name.trim(),
            };



            await studentsapi.post("student", payload);

            alert("Student added successfully!");

            navigate("/studentlist");
        } catch (err) {
            setLoading(false);
            if (err.inner) {
                const formErrors = {};
                err.inner.forEach((error) => {
                    formErrors[error.path] = error.message;
                });
                setErrors(formErrors);
            } else {
                console.error("Error adding student:", err);
                alert("Failed to add student. Please try again.");
            }
        }
    };




    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
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
                    Add New Student
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Enter the details below to create a new student
                </Typography>
            </Box>

            <FormCard>
                <Box component="form" onSubmit={handleSubmit}>
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
                            {loading ? "Saving..." : "Save Student"}
                        </Button>
                    </Box>
                </Box>
            </FormCard>
        </Container>
    );
};

export default AddStudent;
