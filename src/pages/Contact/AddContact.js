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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
}));

const AddContact = () => {
  const [formData, setFormData] = useState({
    display_name: "",
    given_name: "",
    family_name: "",
    job_title: "",
    notes: "",
    company: [],
    email: [],
    phones: [],
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Contact Added:", formData);
    // You can integrate API or state management logic here.
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <FormContainer elevation={3}>
        <Box textAlign="center" mb={3}>
          <PersonAddAlt1Icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Add New Contact
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Fill in the details below to add a new contact
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Display Name"
                name="display_name"
                fullWidth
                required
                value={formData.display_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Given Name"
                name="given_name"
                type="text"
                fullWidth
                required
                value={formData.given_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Family Name"
                name="family_name"
                type="text"
                fullWidth
                value={formData.family_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="job_title"
                type="text"
                value={formData.job_title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                type="text"
                value={formData.notes}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 1, textTransform: "none" }}
              >
                Save Contact
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default AddContact;