import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { studentsapi } from "../../api/axios";
import { useNavigate } from "react-router-dom";

function StudentList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await studentsapi.get("student");

      let normalizedData = [];
      if (Array.isArray(res.data)) {
        normalizedData = res.data;
      } else if (typeof res.data === 'object' && res.data !== null) {
        const keys = Object.keys(res.data);
        const hasNumericKeys = keys.some(key => !isNaN(parseInt(key)));

        if (hasNumericKeys) {
          normalizedData = Object.values(res.data).filter(item =>
            item && typeof item === 'object' && item.id
          );
        } else {
          normalizedData = Object.values(res.data).filter(item =>
            item && typeof item === 'object' && item.id
          );
        }
      }

      normalizedData = normalizedData.filter(item =>
        item && item.id && (item.name || item.avatar)
      );

      setData(normalizedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError("Failed to fetch students");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    try {
      await studentsapi.delete(`student/${id}`);
      alert("Record Deleted Successfully");
      await fetchContacts();
    } catch (err) {
      console.error("Error deleting student:", err);
      alert("Failed to delete record");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "name", headerName: "Name", width: 200 },
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => (
        <Box sx={{ display: "flex", gap: 1 }}>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => navigate(`/student/edit/${params.row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id, params.row.name || params.row.id)}
          >
            Delete
          </Button>
        </Box>
      ),
    },
  ];

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

  return (
    <>

      <Paper sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={data}
          columns={columns}
          pageSizeOptions={[5, 10, 100]}
          checkboxSelection
          sx={{ border: 0 }}
        />
      </Paper>
    </>
  );
}

export default StudentList;
