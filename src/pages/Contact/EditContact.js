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
import PersonAddAlt1Icon from "@mui/icons-material/PersonAddAlt1";
import api from "../../api/axios";

const FormContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[3],
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

  // Fetch contact by ID
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

          setPhones(contact.phones?.length ? contact.phones.map(p => ({...p, is_primary: p.is_primary ? 1 : 0})) : [{ phone_number: "", phone_type: "", is_primary: 1 }]);
          setEmails(contact.emails?.length ? contact.emails.map(e => ({...e, is_primary: e.is_primary ? 1 : 0})) : [{ email: "", email_type: "", is_primary: 1 }]);
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

  const handleChange = (e) => setData({ ...data, [e.target.name]: e.target.value });

  const handlePhoneChange = (index, e) => {
    const updatedPhones = [...phones];
    updatedPhones[index][e.target.name] = e.target.name === "is_primary" ? Number(e.target.value) : e.target.value;
    setPhones(updatedPhones);
  };

  const handleEmailChange = (index, e) => {
    const updatedEmails = [...emails];
    updatedEmails[index][e.target.name] = e.target.name === "is_primary" ? Number(e.target.value) : e.target.value;
    setEmails(updatedEmails);
  };

  // Submit handler for POST /contact/update/:id
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      display_name: data.display_name,
      given_name: data.given_name,
      family_name: data.family_name,
      job_title: data.job_title,
      notes: data.notes,
      company: data.company,
      phones,
      emails,
    };

    try {
      await api.put(`/contact/update/${id}`, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      alert("Contact updated successfully!");
      navigate("/contactlist");
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact.");
    }
  };

  if (loading) return <CircularProgress sx={{ display: "block", mx: "auto", mt: 10 }} />;

  return (
    <Container maxWidth="sm" sx={{ mt: 6 }}>
      <FormContainer elevation={3}>
        <Box textAlign="center" mb={3}>
          <PersonAddAlt1Icon color="primary" sx={{ fontSize: 40, mb: 1 }} />
          <Typography variant="h5" fontWeight="bold">
            Edit Contact
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update the details of the contact below
          </Typography>
        </Box>

        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            {/* Basic Info */}
            {["display_name", "given_name", "family_name", "job_title", "company", "notes"].map((field) => (
              <Grid item xs={12} key={field}>
                <TextField
                  label={field.replace("_", " ").replace(/\b\w/g, (c) => c.toUpperCase())}
                  name={field}
                  fullWidth
                  required={field === "display_name" || field === "given_name"}
                  multiline={field === "notes"}
                  rows={field === "notes" ? 2 : 1}
                  value={data[field]}
                  onChange={handleChange}
                />
              </Grid>
            ))}

            {/* Emails */}
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
                        setEmails([...emails, { email: "", email_type: "", is_primary: 0 }])
                      }
                    >
                      +
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            {/* Phones */}
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
                        setPhones([...phones, { phone_number: "", phone_type: "", is_primary: 0 }])
                      }
                    >
                      +
                    </Button>
                  </Grid>
                )}
              </Grid>
            ))}

            <Grid item xs={12}>
              <Button type="submit" variant="contained" size="large" fullWidth sx={{ mt: 2 }}>
                Update Contact
              </Button>
            </Grid>
          </Grid>
        </Box>
      </FormContainer>
    </Container>
  );
};

export default EditContact;
