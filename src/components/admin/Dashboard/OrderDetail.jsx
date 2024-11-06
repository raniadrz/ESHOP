import React, { useContext, useState } from "react";
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import { Box, Dialog, DialogTitle, DialogContent, DialogActions, Typography, Grid, MenuItem, Select } from '@mui/material';
import myContext from "../../../context/myContext";
import Loader from "../../loader/Loader";
import toast from "react-hot-toast";
import CustomToast from '../../../components/CustomToast/CustomToast';
import { Toaster } from 'react-hot-toast';

const OrderDetail = () => {
  const context = useContext(myContext);
  const { loading, setLoading, getAllOrder, orderDelete, updateOrderStatus } = context;

  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [editStatusId, setEditStatusId] = useState(null); // Track which row's status is being edited
  const [tempStatus, setTempStatus] = useState(null); // Store temporary status during editing

  // Possible order statuses
  const orderStatuses = [
    "Confirmed",
    "Waiting",
    "Bank Payment OK",
    "Bank Payment NOT",
    "Shipped",
    "Delivered",
    "Cancelled"
  ];

  // Open the dialog to show order details
  const handleClickOpenDetailDialog = (order) => {
    setSelectedOrder(order);
    setOpenDetailDialog(true);
  };

  // Close the dialog
  const handleCloseDetailDialog = () => {
    setOpenDetailDialog(false);
    setSelectedOrder(null);
  };

  // Show custom toast notifications
  const showCustomToast = (type, message) => {
    toast.custom(
      (t) => (
        <CustomToast
          type={type}
          message={message}
          onClose={() => {
            toast.dismiss(t.id);
          }}
        />
      ),
      {
        duration: 1500,
        position: 'bottom-center',
        id: `${type}-${Date.now()}`,
      }
    );
  };

  // Handle order deletion
  const handleDelete = async (orderId) => {
    setLoading(true);
    try {
      await orderDelete(orderId);
      handleCloseDetailDialog();
      showCustomToast('success', 'Order deleted successfully');
    } catch (error) {
      console.error(error);
      showCustomToast('error', 'Failed to delete order');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Handle status change and update in Firebase
  const handleStatusChange = async (newStatus, orderId) => {
    if (!newStatus || newStatus === '') {
      showCustomToast('error', 'Please select a valid status');
      return;
    }

    setLoading(true);
    try {
      await updateOrderStatus(orderId, newStatus);
      setEditStatusId(null);
      showCustomToast('success', 'Order status updated successfully');
    } catch (error) {
      console.error("Error updating status: ", error);
      showCustomToast('error', 'Failed to update order status');
    } finally {
      setLoading(false);
    }
  };

  // Format the date
  const formatDate = (date) => {
    if (!date) return "N/A";
    if (date.toDate) return date.toDate().toLocaleString('en-GB');
    return new Date(date).toLocaleString('en-GB');
  };

  // Render rows for DataGrid
  const rows = getAllOrder.map((order, index) => ({
    id: order.id,
    status: order.status,
    serial: index + 1,
    name: order.addressInfo?.name || "N/A",
    mobileNumber: order.addressInfo?.mobileNumber || "N/A",
    email: order.email || "N/A",
    date: formatDate(order.date),
    totalItems: order.cartItems.length,
    totalPrice: order.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    paymentMethod: order.paymentMethod || "N/A",
    order, // Pass full order object for dialog
  }));

  // DataGrid columns
  const columns = [
    { field: 'id', headerName: 'Order ID', flex: 1.5, headerAlign: 'center', align: 'center' },
    {
      field: 'status',
      headerName: 'Status',
      flex: 3,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => {
        const isEditing = params.row.id === editStatusId;
        return (
          <Box>
            {isEditing ? (
              // Show dropdown when status is being edited
              <Select
                value={tempStatus || params.row.status}
                onChange={(e) => setTempStatus(e.target.value)} // Temporary save to state
                onBlur={() => handleStatusChange(tempStatus, params.row.id)} // Save to Firebase on blur
                sx={{ width: '100%' }}
                autoFocus // Autofocus when dropdown opens
              >
                {orderStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            ) : (
              // Show status as text and allow click-to-edit
              <Typography
                onClick={() => {
                  setEditStatusId(params.row.id); // Set the row being edited
                  setTempStatus(params.row.status); // Pre-fill the current status
                }}
                sx={{ cursor: 'pointer', color: 'inherit' }} // Remove the underline and color change
              >
                {params.row.status}
              </Typography>
            )}
          </Box>
        );
      }
    },
    { field: 'name', headerName: 'Name', flex: 2.5, headerAlign: 'center', align: 'center' },
    { field: 'mobileNumber', headerName: 'Phone Number', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'email', headerName: 'Email', flex: 2.5, headerAlign: 'center', align: 'center' },
    { field: 'date', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
    { field: 'totalItems', headerName: 'Total Items', flex: 1.5, headerAlign: 'center', align: 'center' },
    { field: 'totalPrice', headerName: 'Total Price', flex: 1.5, headerAlign: 'center', align: 'center' },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1.5,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <div>
          <IconButton onClick={() => handleClickOpenDetailDialog(params.row.order)}>
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
      <Toaster
        position="bottom-center"
        toastOptions={{
          duration: 1500,
        }}
      />

      <div className="py-5 flex justify-between items-center">
        <h1 className="text-xl text-blue-600 font-bold">All Orders</h1>
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

      <Dialog
        open={openDetailDialog}
        onClose={handleCloseDetailDialog}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            padding: 2,
            backgroundColor: '#f9f9f9',
          }
        }}
      >
        <DialogTitle sx={{ backgroundColor: '#f1f1f1' }}>Order Details</DialogTitle>
        <DialogContent id="printable-content">
          {selectedOrder && (
            <Box sx={{ padding: 2 }}>
              <Typography variant="h6" sx={{ marginBottom: 2 }}>
                Order ID/CODE: {selectedOrder.id}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Date:</strong> {formatDate(selectedOrder.date)}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Name:</strong> {selectedOrder.addressInfo?.name}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Address:</strong> {selectedOrder.addressInfo?.address}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Pincode:</strong> {selectedOrder.addressInfo?.pincode}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Mobile Number:</strong> {selectedOrder.addressInfo?.mobileNumber}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Email:</strong> {selectedOrder.email}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Payment Method:</strong> {selectedOrder.addressInfo?.paymentMethod}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body1" gutterBottom>
                    <strong>Cart Items:</strong>
                  </Typography>
                  <Grid container spacing={2}>
                    {selectedOrder.cartItems.map((item, index) => (
                      <Grid item xs={12} key={index} sx={{ display: 'flex', alignItems: 'center' }}>
                        <img src={item.productImageUrl} alt="product" style={{ width: '50px', height: '50px', marginRight: '10px' }} />
                        <Box>
                          <Typography variant="body2" component="div"><strong>Title:</strong> {item.title}</Typography>
                          <Typography variant="body2" component="div"><strong>Category:</strong> {item.category}</Typography>
                          <Typography variant="body2" component="div"><strong>Price:</strong> {item.price}€</Typography>
                          <Typography variant="body2" component="div"><strong>Quantity:</strong> {item.quantity}</Typography>
                          <Typography variant="body2" component="div"><strong>Total:</strong> {item.price * item.quantity}€</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <IconButton onClick={handlePrint}>
            <PrintIcon color="primary" />
          </IconButton>
          <IconButton onClick={handleCloseDetailDialog}>
            <CloseIcon />
          </IconButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default OrderDetail;
