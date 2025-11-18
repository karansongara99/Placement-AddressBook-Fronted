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
  IconButton,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { styled } from "@mui/material/styles";
import api from "../../api/axios";

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

  // Fetch Contact Details
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

  const addPhone = () => {
    setPhones([...phones, { phone_number: "", phone_type: "", is_primary: 0 }]);
  };

  const addEmail = () => {
    setEmails([...emails, { email: "", email_type: "", is_primary: 0 }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...data, phones, emails };

    try {
      await api.put(`/contact/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });

      alert("✨ Contact updated successfully!");
      navigate("/contactlist");
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("❌ Failed to update contact.");
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
          Edit Contact
        </Typography>
      </Box>

      {/* FORM CARD */}
      <FormCard>
        <Box component="form" onSubmit={handleSubmit}>
          {/* BASIC INFO */}
          <SectionTitle title="Basic Information" />

          <Grid container spacing={2} mb={2}>
            {[
              "display_name",
              "given_name",
              "family_name",
              "job_title",
              "company",
              "notes",
            ].map((field) => (
              <Grid item xs={12} md={field === "notes" ? 12 : 6} key={field}>
                <TextField
                  label={field.replace("_", " ").toUpperCase()}
                  name={field}
                  multiline={field === "notes"}
                  rows={field === "notes" ? 3 : 1}
                  fullWidth
                  value={data[field]}
                  onChange={handleChange}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "12px",
                    },
                  }}
                />
              </Grid>
            ))}
          </Grid>

          {/* EMAILS */}
          <SectionTitle title="Email Addresses" />

          {emails.map((item, index) => (
            <Grid container spacing={2} key={index} mb={1}>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Email ${index + 1}`}
                  name="email"
                  value={item.email}
                  fullWidth
                  onChange={(e) => handleEmailChange(index, e)}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Type"
                  name="email_type"
                  value={item.email_type}
                  fullWidth
                  onChange={(e) => handleEmailChange(index, e)}
                />
              </Grid>

              <Grid item xs={12} md={2} display="flex" alignItems="center">
                {index === emails.length - 1 && (
                  <IconButton
                    onClick={addEmail}
                    color="primary"
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

          {/* PHONES */}
          <SectionTitle title="Phone Numbers" />

          {phones.map((item, index) => (
            <Grid container spacing={2} key={index} mb={1}>
              <Grid item xs={12} md={5}>
                <TextField
                  label={`Phone ${index + 1}`}
                  name="phone_number"
                  value={item.phone_number}
                  fullWidth
                  onChange={(e) => handlePhoneChange(index, e)}
                />
              </Grid>

              <Grid item xs={12} md={5}>
                <TextField
                  label="Type"
                  name="phone_type"
                  value={item.phone_type}
                  fullWidth
                  onChange={(e) => handlePhoneChange(index, e)}
                />
              </Grid>

              <Grid item xs={12} md={2} display="flex" alignItems="center">
                {index === phones.length - 1 && (
                  <IconButton
                    onClick={addPhone}
                    color="primary"
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

          {/* SUBMIT BUTTON */}
          <Box textAlign="center" mt={4}>
            <Button
              type="submit"
              size="large"
              variant="contained"
              sx={{
                px: 6,
                py: 1.5,
                borderRadius: "12px",
                fontSize: "17px",
                fontWeight: "bold",
                background: "linear-gradient(90deg, #6a11cb, #2575fc)",
              }}
            >
              Update Contact
            </Button>
          </Box>
        </Box>
      </FormCard>
    </Container>
  );
};

export default EditContact;
