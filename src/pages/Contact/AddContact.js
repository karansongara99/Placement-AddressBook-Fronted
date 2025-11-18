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
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import * as Yup from "yup";
import api from "../../api/axios";

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

const AddContact = () => {
  const [data, setData] = useState({
    display_name: "",
    given_name: "",
    family_name: "",
    job_title: "",
    notes: "",
    company: "",
  });

  const [phones, setPhones] = useState([
    { phone_number: "", phone_type: "", is_primary: true },
  ]);

  const [emails, setEmails] = useState([
    { email: "", email_type: "", is_primary: true },
  ]);

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

  const addPhone = () => {
    setPhones([...phones, { phone_number: "", phone_type: "", is_primary: false }]);
  };

  const addEmail = () => {
    setEmails([...emails, { email: "", email_type: "", is_primary: false }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...data, phones, emails };

    try {
      await validationSchema.validate(payload, { abortEarly: false });
      setErrors({});

      await api.post("/contact/create", payload);
      alert("🎉 Contact added successfully!");
    } catch (err) {
      const formErrors = {};
      err.inner?.forEach((error) => {
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
          Add New Contact
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the details below to create a new contact
        </Typography>
      </Box>

      <FormCard>
        <Box component="form" onSubmit={handleSubmit}>
          {/* Basic Fields */}
          <SectionTitle title="Basic Information" />

          <Grid container spacing={2} mb={2}>
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
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "12px",
                      },
                    }}
                  />
                </Grid>
              )
            )}
          </Grid>

          {/* Email Section */}
          <SectionTitle title="Email Addresses" />

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

              <Grid item xs={12} md={2} display="flex" alignItems="center">
                {index === emails.length - 1 && (
                  <IconButton
                    color="primary"
                    onClick={addEmail}
                    sx={{
                      background: "#e8e3ff",
                      ":hover": { background: "#d4c9ff" },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {/* Phone Section */}
          <SectionTitle title="Phone Numbers" />

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

              <Grid item xs={12} md={2} display="flex" alignItems="center">
                {index === phones.length - 1 && (
                  <IconButton
                    color="primary"
                    onClick={addPhone}
                    sx={{
                      background: "#e8e3ff",
                      ":hover": { background: "#d4c9ff" },
                    }}
                  >
                    <AddIcon />
                  </IconButton>
                )}
              </Grid>
            </Grid>
          ))}

          {/* Submit Button */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{
                px: 5,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "17px",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              Save Contact
            </Button>
          </Box>
        </Box>
      </FormCard>
    </Container>
  );
};

export default AddContact;
