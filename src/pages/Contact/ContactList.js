import { useState, useEffect } from "react";
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import Paper from '@mui/material/Paper';
import api from "../../api/axios";
function ContactList() {
  const [data, setData] = useState([]);

  const fetchContacts = async () => {
    const token = localStorage.getItem("token");
    const ans = await api.get("contact/all");
    console.log(ans);
    setData(ans.data.data);
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const paginationModel = { page: 0, pageSize: 5 };


  const columns = [
    { field: 'display_name', headerName: 'Name', width: 70 },
    { field: 'given_name', headerName: 'First name', width: 130 },
    { field: 'family_name', headerName: 'Last name', width: 130 },
    { field: 'job_title', headerName: 'Job Title', width: 130 },
    { field: 'notes', headerName: 'Notes', width: 130 }
  ];

  const rows = [
    { id: 1, display_name: 'Snow', given_name: 'Jon', family_name: 'Snow', job_title: 'Jon@jon.com', notes: 'notes', phones: [{ number: '123-456-7890' }] },
    { id: 2, display_name: 'Lannister', given_name: 'Cersei', family_name: 'Lannister', job_title: 'Cersei@lannister.com', notes: 'notes', phones: [{ number: '123-456-7890' }] },
    { id: 3, display_name: 'Lannister', given_name: 'Jaime', family_name: 'Lannister', job_title: 'Jaime@lannister.com', notes: 'notes', phones: [{ number: '123-456-7890' }] },
    { id: 4, display_name: 'Stark', given_name: 'Arya', family_name: 'Stark', job_title: 'Arya@stark.com', notes: 'notes', phones: [{ number: '123-456-7890' }] },
  ];

  return (
    <>
  
      <Paper sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          initialState={{ pagination: { paginationModel } }}
          pageSizeOptions={[5, 10]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}

export default ContactList;
