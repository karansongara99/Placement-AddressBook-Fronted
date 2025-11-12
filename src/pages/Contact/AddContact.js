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
import api from "../../api/axios"; 

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
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

  const [phones, setPhones] = useState([
    { phone_number: "", phone_type: "", is_primary: true },
  ]);

  const [emails, setEmails] = useState([
    { email: "", email_type: "", is_primary: true },
  ]);

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePhoneChange = (index, e) => {
    const updatedPhones = [...phones];
    updatedPhones[index][e.target.name] = e.target.value;
    setPhones(updatedPhones);
  };

  const handleEmailChange = (index, e) => {
    const updatedEmails = [...emails];
    updatedEmails[index][e.target.name] = e.target.value;
    setEmails(updatedEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...data,
      phones,
      emails,
    };

    try {
      const res = await api.post("/contact/create", payload);
      console.log(" Contact Added:", res.data);
      alert("Contact added successfully!");
    } catch (error){
      console.error(" Error adding contact:", error);
      alert("Failed to add contact.");
    }
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
                value={data.display_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Given Name"
                name="given_name"
                fullWidth
                required
                value={data.given_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Family Name"
                name="family_name"
                fullWidth
                value={data.family_name}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Job Title"
                name="job_title"
                fullWidth
                value={data.job_title}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Company"
                name="company"
                fullWidth
                value={data.company}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Notes"
                name="notes"
                fullWidth
                multiline
                rows={2}
                value={data.notes}
                onChange={handleChange}
              />
            </Grid>

            {/* Email Fields */}
            {emails.map((item, index) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={7}>
                  <TextField
                    label={`Email ${index + 1}`}
                    name="email"
                    fullWidth
                    value={item.email}
                    onChange={(e) => handleEmailChange(index, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Type"
                    name="email_type"
                    fullWidth
                    value={item.email_type}
                    onChange={(e) => handleEmailChange(index, e)}
                  />
                </Grid>
                {index === emails.length - 1 && (
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        setEmails([
                          ...emails,
                          { email: "", email_type: "", is_primary: false },
                        ])
                      }
                    >
                      +
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            {/* Phone Fields */}
            {phones.map((item, index) => (
              <Grid container spacing={1} key={index}>
                <Grid item xs={7}>
                  <TextField
                    label={`Phone ${index + 1}`}
                    name="phone_number"
                    fullWidth
                    value={item.phone_number}
                    onChange={(e) => handlePhoneChange(index, e)}
                  />
                </Grid>
                <Grid item xs={4}>
                  <TextField
                    label="Type"
                    name="phone_type"
                    fullWidth
                    value={item.phone_type}
                    onChange={(e) => handlePhoneChange(index, e)}
                  />
                </Grid>
                {index === phones.length - 1 && (
                  <Grid item xs={1}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() =>
                        setPhones([
                          ...phones,
                          { phone_number: "", phone_type: "", is_primary: false },
                        ])
                      }
                    >
                      +
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                sx={{ mt: 2, textTransform: "none" }}
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
