import React, { useContext, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, Avatar } from '@mui/material';
import MyContext from "../../../context/myContext";
import Loader from "../../loader/Loader";

const TestimonialDetail = () => {
  const context = useContext(MyContext);
  const { loading, testimonials, deleteTestimonial } = context;

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);

  const handleClickOpenDetailDialog = (testimonial) => {
    setSelectedTestimonial(testimonial);
    setOpenDetailDialog(true);
  };

  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedTestimonial(null);
  };

  const handleDelete = async (testimonialId) => {
    try {
      await deleteTestimonial(testimonialId);
      handleCloseDetailDialog();
    } catch (error) {
      console.error(error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp.seconds * 1000); // Convert Firestore timestamp to JavaScript Date
    return date.toLocaleString('en-GB');
  };

  const rows = testimonials.map((testimonial, index) => ({
    id: testimonial.id,
    serial: index + 1,
    name: testimonial.name || "N/A",
    comment: testimonial.comment || "N/A",
    time: formatTimestamp(testimonial.time),
    photoURL: testimonial.photoURL || "", // Add this for rendering the avatar
    testimonial, // Pass full testimonial object for dialog
  }));

  const columns = [
    { field: 'id', headerName: 'Testimonial ID', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'name', headerName: 'Name', flex: 2.5, headerAlign: 'center', align: 'center' },
    { field: 'comment', headerName: 'Comment', flex: 3, headerAlign: 'center', align: 'center' },
    { field: 'time', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
    {
      field: 'photoURL',
      headerName: 'Photo',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Avatar src={params.value} alt={params.row.name} />
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleClickOpenDetailDialog(params.row.testimonial)}>
            <PrintIcon style={{ color: 'blue' }} />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)}>
            <DeleteIcon style={{ color: 'red' }} />
          </IconButton>
        </div>
      )
    }
  ];

  return (
    <div style={{ height: '80vh' }}>
      <div className="py-5 flex justify-between items-center">
        <h1 className="text-xl text-blue-600 font-bold">All Testimonials</h1>
      </div>

      <div className="flex justify-center relative top-20">
        {loading && <Loader />}
      </div>

      <div className="w-full mb-5" style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={15}
          rowsPerPageOptions={[15]}
          disableSelectionOnClick
          sx={{
            '& .MuiDataGrid-root': {
              backgroundColor: '#005689', // Light blue background
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#2196f3', // Blue header background
              textAlign: 'center',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              fontWeight: 'bold',
              color: '#ffffff', // White text in headers
              textAlign: 'center',
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#d5eeff', // Alternate row color
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default TestimonialDetail;
