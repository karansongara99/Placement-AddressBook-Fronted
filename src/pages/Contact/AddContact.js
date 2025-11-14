import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import api from "../../api/axios";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[6],
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}));

const AddContact = () => {
  const [data, setData] = useState({
    display_name: "",
    given_name: "",
    family_name: "",
    job_title: "",
    notes: "",
    company: "",
  });

  const [phones, setPhones] = useState([{ phone_number: "", phone_type: "", is_primary: true }]);
  const [emails, setEmails] = useState([{ email: "", email_type: "", is_primary: true }]);
  const [errors, setErrors] = useState({});

  const validationSchema = Yup.object().shape({
    display_name: Yup.string().required("Display Name is required"),
    given_name: Yup.string().required("Given Name is required"),
    family_name: Yup.string().required("Family Name is required"),
    job_title: Yup.string().required("Job Title is required"),
    company: Yup.string().required("Company is required"),
    emails: Yup.array().of(
      Yup.object().shape({
        email: Yup.string().email("Invalid email").required("Email is required"),
        email_type: Yup.string().required("Email type is required"),
      })
    ),
    phones: Yup.array().of(
      Yup.object().shape({
        phone_number: Yup.string().required("Phone number is required"),
        phone_type: Yup.string().required("Phone type is required"),
      })
    ),
  });

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, e) => {
    const updated = [...phones];
    updated[index][e.target.name] = e.target.value;
    setPhones(updated);
  };

  const handleEmailChange = (index, e) => {
    const updated = [...emails];
    updated[index][e.target.name] = e.target.value;
    setEmails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...data, phones, emails };

    try {
      await validationSchema.validate(payload, { abortEarly: false });
      setErrors({}); // clear errors if validation passes

      await api.post("/contact/create", payload);
      alert("✅ Contact added successfully!");
    } catch (err) {
      if (err.inner) {
        const formErrors = {};
        err.inner.forEach((error) => {
          // For arrays (phones and emails)
          if (error.path.includes("emails") || error.path.includes("phones")) {
            const [field, index, key] = error.path.split(".");
            formErrors[field] = formErrors[field] || [];
            formErrors[field][index] = formErrors[field][index] || {};
            formErrors[field][index][key] = error.message;
          } else {
            formErrors[error.path] = error.message;
          }
        });
        setErrors(formErrors);
      }
    }
  };

  const addPhone = () => {
    setPhones([...phones, { phone_number: "", phone_type: "", is_primary: false }]);
  };

  const addEmail = () => {
    setEmails([...emails, { email: "", email_type: "", is_primary: false }]);
  };

  return (
    <Container maxWidth="md">
      <FormContainer elevation={4}>
        <Box textAlign="center" mb={4}>
          <Typography variant="h4" fontWeight="bold">
            Add New Contact
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Fill in the details below
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2} mb={3}>
            {["display_name", "given_name", "family_name", "job_title", "company", "notes"].map(
              (field) => (
                <Grid item xs={12} md={6} key={field}>
                  <TextField
                    label={field.replace("_", " ").toUpperCase()}
                    name={field}
                    fullWidth
                    value={data[field]}
                    onChange={handleChange}
                    error={!!errors[field]}
                    helperText={errors[field]}
                  />
                </Grid>
              )
            )}
          </Grid>

          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" gutterBottom>
            Emails
          </Typography>
          {emails.map((item, index) => (
            <Grid container spacing={2} key={index} mb={1}>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Email ${index + 1}`}
                  name="email"
                  fullWidth
                  value={item.email}
                  onChange={(e) => handleEmailChange(index, e)}
                  error={!!errors.emails?.[index]?.email}
                  helperText={errors.emails?.[index]?.email}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Type"
                  name="email_type"
                  fullWidth
                  value={item.email_type}
                  onChange={(e) => handleEmailChange(index, e)}
                  error={!!errors.emails?.[index]?.email_type}
                  helperText={errors.emails?.[index]?.email_type}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                {index === emails.length - 1 && (
                  <Button variant="outlined" fullWidth onClick={addEmail}>
                    + Add
                  </Button>
                )}
              </Grid>
            </Grid>
          ))}

          <Typography variant="h6" gutterBottom mt={3}>
            Phones
          </Typography>
          {phones.map((item, index) => (
            <Grid container spacing={2} key={index} mb={1}>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Phone ${index + 1}`}
                  name="phone_number"
                  fullWidth
                  value={item.phone_number}
                  onChange={(e) => handlePhoneChange(index, e)}
                  error={!!errors.phones?.[index]?.phone_number}
                  helperText={errors.phones?.[index]?.phone_number}
                />
              </Grid>
              <Grid item xs={12} md={5}>
                <TextField
                  label="Type"
                  name="phone_type"
                  fullWidth
                  value={item.phone_type}
                  onChange={(e) => handlePhoneChange(index, e)}
                  error={!!errors.phones?.[index]?.phone_type}
                  helperText={errors.phones?.[index]?.phone_type}
                />
              </Grid>
              <Grid item xs={12} md={2}>
                {index === phones.length - 1 && (
                  <Button variant="outlined" fullWidth onClick={addPhone}>
                    + Add
                  </Button>
                )}
              </Grid>
            </Grid>
          ))}

          <Box textAlign="center" mt={4}>
            <Button type="submit" variant="contained" size="large">
              Save Contact
            </Button>
          </Box>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default AddContact;
