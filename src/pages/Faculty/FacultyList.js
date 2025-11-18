import { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { facultiesapi } from "../../api/axios";
import { useNavigate } from "react-router-dom";

function FacultyList() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await facultiesapi.get("faculties");
      
      // Normalize data - handle both array and object formats
      let normalizedData = [];
      if (Array.isArray(res.data)) {
        normalizedData = res.data;
      } else if (typeof res.data === 'object' && res.data !== null) {
        // If it's an object, check if it has numeric keys (malformed array)
        const keys = Object.keys(res.data);
        const hasNumericKeys = keys.some(key => !isNaN(parseInt(key)));
        
        if (hasNumericKeys) {
          // Convert object with numeric keys to array
          normalizedData = Object.values(res.data).filter(item => 
            item && typeof item === 'object' && item.id
          );
        } else {
          // Single object or object with non-numeric keys
          normalizedData = Object.values(res.data).filter(item => 
            item && typeof item === 'object' && item.id
          );
        }
      }
      
      // Filter out any invalid entries and ensure all have required fields
      normalizedData = normalizedData.filter(item => 
        item && item.id && (item.facultyName || item.facultyCode)
      );
      
      setData(normalizedData);
      setError(null);
    } catch (err) {
      console.error("Error fetching faculties:", err);
      setError("Failed to fetch faculties");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  const handleDelete = async (id, facultyName) => {
    // Confirm deletion
    if (!window.confirm(`Are you sure you want to delete "${facultyName}"?`)) {
      return;
    }

    try {
      await facultiesapi.delete(`faculties/${id}`);
      alert("Record Deleted Successfully");
      // Refresh the data from the server
      await fetchContacts();
    } catch (err) {
      console.error("Error deleting faculty:", err);
      alert("Failed to delete record");
    }
  };

  const columns = [
    { field: "id", headerName: "ID", width: 120 },
    { field: "facultyName", headerName: "Name", width: 200 },
    { field: "facultyCode", headerName: "Code", width: 200 },
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
            onClick={() => navigate(`/faculty/edit/${params.row.id}`)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="error"
            size="small"
            onClick={() => handleDelete(params.row.id, params.row.facultyName || params.row.id)}
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

export default FacultyList;
