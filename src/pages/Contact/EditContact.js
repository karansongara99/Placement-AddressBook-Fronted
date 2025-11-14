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
  Divider,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import api from "../../api/axios";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(3),
  boxShadow: theme.shadows[6],
  background: "rgba(255, 255, 255, 0.95)",
  backdropFilter: "blur(10px)",
}));

const EditContact = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [data, setData] = useState({
    display_name: "",
    given_name: "",
    family_name: "",
    job_title: "",
    notes: "",
    company: "",
  });

  const [phones, setPhones] = useState([{ phone_number: "", phone_type: "", is_primary: 1 }]);
  const [emails, setEmails] = useState([{ email: "", email_type: "", is_primary: 1 }]);

  // Disable page scrolling
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  // Fetch contact data
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await api.get(`/contact/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        const contactArray = res.data?.data;

        if (contactArray && contactArray.length > 0) {
          const contact = contactArray[0];

          setData({
            display_name: contact.display_name || "",
            given_name: contact.given_name || "",
            family_name: contact.family_name || "",
            job_title: contact.job_title || "",
            notes: contact.notes || "",
            company: contact.company || "",
          });

          setPhones(
            contact.phones?.length
              ? contact.phones.map((p) => ({
                  ...p,
                  is_primary: p.is_primary ? 1 : 0,
                }))
              : [{ phone_number: "", phone_type: "", is_primary: 1 }]
          );

          setEmails(
            contact.emails?.length
              ? contact.emails.map((e) => ({
                  ...e,
                  is_primary: e.is_primary ? 1 : 0,
                }))
              : [{ email: "", email_type: "", is_primary: 1 }]
          );
        } else {
          alert("Contact not found.");
          navigate("/contactlist");
        }
      } catch (error) {
        console.error("Error fetching contact:", error);
        alert("Failed to load contact data.");
      } finally {
        setLoading(false);
      }
    };

    fetchContact();
  }, [id, navigate]);

  // Handlers
  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handlePhoneChange = (index, e) => {
    const updated = [...phones];
    updated[index][e.target.name] =
      e.target.name === "is_primary" ? Number(e.target.value) : e.target.value;
    setPhones(updated);
  };

  const handleEmailChange = (index, e) => {
    const updated = [...emails];
    updated[index][e.target.name] =
      e.target.name === "is_primary" ? Number(e.target.value) : e.target.value;
    setEmails(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...data, phones, emails };

    try {
      await api.put(`/contact/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("✅ Contact updated successfully!");
      navigate("/contactlist");
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("❌ Failed to update contact.");
    }
  };

  if (loading)
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="flex-start"
      height="100vh"
      sx={{
        overflow: "hidden",
        pt: 2, // ⬅️ small padding-top to slightly space below header
      }}
    >
      <Container maxWidth="md" sx={{ mt: 0 }}>
        <FormContainer elevation={4}>
          {/* Header */}
          <Box textAlign="center" mb={3}>
            <EditIcon color="primary" sx={{ fontSize: 50 }} />
            <Typography variant="h4" fontWeight="bold" sx={{ mt: 1 }}>
              Edit Contact
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Update the details below to modify this contact
            </Typography>
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box component="form" onSubmit={handleSubmit}>
            {/* ---------- Basic Info Section ---------- */}
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Basic Information
            </Typography>

            <Grid container spacing={2} mb={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  label="Display Name"
                  name="display_name"
                  fullWidth
                  required
                  value={data.display_name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Given Name"
                  name="given_name"
                  fullWidth
                  required
                  value={data.given_name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Family Name"
                  name="family_name"
                  fullWidth
                  value={data.family_name}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
                <TextField
                  label="Job Title"
                  name="job_title"
                  fullWidth
                  value={data.job_title}
                  onChange={handleChange}
                />
              </Grid>

              <Grid item xs={12} md={6}>
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
                  rows={3}
                  value={data.notes}
                  onChange={handleChange}
                />
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            {/* ---------- Contact Details Section ---------- */}
            <Typography variant="h6" fontWeight="bold" color="primary" gutterBottom>
              Contact Details
            </Typography>

            {/* Email Fields */}
            {emails.map((item, index) => (
              <Grid container spacing={2} key={index} mb={1}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label={`Email ${index + 1}`}
                    name="email"
                    fullWidth
                    value={item.email}
                    onChange={(e) => handleEmailChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Type"
                    name="email_type"
                    fullWidth
                    value={item.email_type}
                    onChange={(e) => handleEmailChange(index, e)}
                  />
                </Grid>
                {index === emails.length - 1 && (
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() =>
                        setEmails([...emails, { email: "", email_type: "", is_primary: 0 }])
                      }
                    >
                      + Add
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            {/* Phone Fields */}
            {phones.map((item, index) => (
              <Grid container spacing={2} key={index} mb={1}>
                <Grid item xs={12} md={5}>
                  <TextField
                    label={`Phone ${index + 1}`}
                    name="phone_number"
                    fullWidth
                    value={item.phone_number}
                    onChange={(e) => handlePhoneChange(index, e)}
                  />
                </Grid>
                <Grid item xs={12} md={5}>
                  <TextField
                    label="Type"
                    name="phone_type"
                    fullWidth
                    value={item.phone_type}
                    onChange={(e) => handlePhoneChange(index, e)}
                  />
                </Grid>
                {index === phones.length - 1 && (
                  <Grid item xs={12} md={2}>
                    <Button
                      variant="outlined"
                      fullWidth
                      onClick={() =>
                        setPhones([...phones, { phone_number: "", phone_type: "", is_primary: 0 }])
                      }
                    >
                      + Add
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            <Box textAlign="center" mt={3}>
              <Button
                type="submit"
                variant="contained"
                size="large"
                sx={{
                  px: 6,
                  py: 1.5,
                  borderRadius: 2,
                  fontWeight: "bold",
                  textTransform: "none",
                }}
              >
                Update Contact
              </Button>
            </Box>
          </Box>
        </FormContainer>
      </Container>
    </Box>
  );
};

export default EditContact;
