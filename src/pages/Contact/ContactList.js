import { useState, useEffect } from "react";
import { DataGrid } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import api from "../../api/axios";
import { useNavigate } from "react-router-dom"; // for edit navigation

function ContactList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectionModel, setSelectionModel] = useState([]);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const ans = await api.get("contact/all");
      setData(ans.data?.data || []);
    } catch (err) {
      console.error("Error fetching contacts:", err);
      setError("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };

  const columns = [
    { field: 'id', headerName: 'ID', width: 150 },
    { field: 'display_name', headerName: 'Name', width: 200 },
    { field: 'given_name', headerName: 'First Name', width: 200 },
    { field: 'family_name', headerName: 'Last Name', width: 200 },
    { field: 'job_title', headerName: 'Job Title', width: 200 },
    { field: 'notes', headerName: 'Notes', width: 200 },
    {
      field: 'action',
      headerName: 'Action',
      width: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(`/contacts/edit/${params.row.id}`)}
        >
          Edit
        </Button>
      ),
    },

  ];

  const rows = data.map((item, index) => ({
    id: item.id || index,
    ...item,
  }));

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height={400}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <div style={{ color: "red", textAlign: "center" }}>{error}</div>;
  }

  const handleDeleteSelected = async () => {
    if (!selectionModel || !selectionModel.ids || selectionModel.ids.size === 0) return;

    const idsArray = Array.from(selectionModel.ids);

    try {
      await Promise.all(
        idsArray.map((id) =>
          api.delete(`/contact/${id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
          })
        )
      );

      alert("Record Deleted Successfully");

      setData(prev => prev.filter(contact => !idsArray.includes(contact.id)));
      setSelectionModel({ type: 'include', ids: new Set() });
    } catch (err) {
      console.error("Error deleting contacts:", err);
    }
  };

  return (
    <>
      <Button
        variant="contained"
        color="error"
        size="small"
        onClick={handleDeleteSelected}
        disabled={selectionModel.length === 0}
      >
        Delete
      </Button>
      <br />
      <br />
      <Paper sx={{ height: 500, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
          onRowSelectionModelChange={(newSelection) => {
            setSelectionModel(newSelection);
          }}
        />
      </Paper>
    </>
  );
}

export default ContactList;
