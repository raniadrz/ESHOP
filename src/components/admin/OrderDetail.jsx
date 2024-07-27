import { useContext, useState } from "react";
import { DataGrid, GridToolbar } from '@mui/x-data-grid';
import { Box, IconButton, Select, MenuItem, Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Grid } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import PrintIcon from '@mui/icons-material/Print';
import CloseIcon from '@mui/icons-material/Close';
import myContext from "../../context/myContext";

const OrderDetail = () => {
    const context = useContext(myContext);
    const { getAllOrder, orderDelete, updateOrderStatus, updatePaymentMethod } = context;
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [open, setOpen] = useState(false);

    const handleStatusChange = (orderId, status) => {
        updateOrderStatus(orderId, status);
    };

    const handleClickOpen = (order) => {
        setSelectedOrder(order);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedOrder(null);
        setOpen(false);
    };

    const handlePrint = () => {
        window.print();
    };

    const handleDelete = () => {
        if (selectedOrder) {
            orderDelete(selectedOrder.id);
            handleClose();
        }
    };

    const formatDate = (date) => {
        if (!date) return "N/A";
        if (date.toDate) return date.toDate().toLocaleString('en-GB');
        return new Date(date).toLocaleString('en-GB');
    };

    const rows = getAllOrder.map((order, orderIndex) => ({
        id: orderIndex,
        orderId: order.id,
        status: order.status,
        name: order.addressInfo?.name || "N/A",
        address: order.addressInfo?.address || "N/A",
        pincode: order.addressInfo?.pincode || "N/A",
        mobileNumber: order.addressInfo?.mobileNumber || "N/A",
        email: order.email || "N/A",
        date: formatDate(order.date),
        totalItems: order.cartItems.length,
        totalPrice: order.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
        paymentMethod: order.paymentMethod || "N/A",
        order,
    }));

    const columns = [
        {
            field: 'orderId', headerName: 'Order Id', width: 150,
            renderCell: (params) => (
                <Button variant="text" onClick={() => handleClickOpen(params.row.order)}>
                    {params.value}
                </Button>
            )
        },
        { field: 'status', headerName: 'Status', width: 150,
            renderCell: (params) => (
                <Select
                    value={params.value}
                    onChange={(e) => handleStatusChange(params.row.order.id, e.target.value)}
                    fullWidth
                >
                    <MenuItem value="confirmed">Confirmed</MenuItem>
                    <MenuItem value="packaging">Packaging</MenuItem>
                    <MenuItem value="shipping">Shipping</MenuItem>
                    <MenuItem value="delivered">Delivered</MenuItem>
                    <MenuItem value="canceled">Canceled</MenuItem>
                </Select>
            )
        },
        { field: 'name', headerName: 'Name', width: 150 },
        { field: 'address', headerName: 'Address', width: 150 },
        { field: 'pincode', headerName: 'Pincode', width: 100 },
        { field: 'mobileNumber', headerName: 'Phone Number', width: 150 },
        { field: 'email', headerName: 'Email', width: 200 },
        { field: 'date', headerName: 'Date', width: 150 },
        { field: 'totalItems', headerName: 'Total Items', width: 150 },
        { field: 'totalPrice', headerName: 'Total Price', width: 150 },
        {
            field: 'actions', headerName: 'Action', width: 100,
            renderCell: (params) => (
                <IconButton onClick={() => orderDelete(params.row.order.id)}>
                    <DeleteIcon style={{ color: 'red' }} />
                </IconButton>
            )
        },
    ];

    return (
        <div style={{ height: '50%', width: '100%' }}>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-blue-300 font-bold">All Orders</h1>
            </div>
            <Box sx={{ height:'50%', width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    components={{ Toolbar: GridToolbar }}
                    sx={{
                        '& .MuiDataGrid-root': {
                            backgroundColor: '#10acbe;',
                        },
                        '& .MuiDataGrid-cell': {
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-columnHeaders': {
                            backgroundColor: '#e0e0e0',
                            textAlign: 'center',
                        },
                        '& .MuiDataGrid-columnHeaderTitle': {
                            fontWeight: 'bold',
                            textAlign: 'center',
                        },
                    }}
                />
            </Box>
            <Dialog 
                open={open} 
                onClose={handleClose} 
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
                                        <strong>Date:</strong> {(selectedOrder.date)}
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
                            <Box sx={{ marginTop: 2, paddingTop: 2, borderTop: '1px solid #ccc', textAlign: 'right' }}>
                                <Typography variant="h6">
                                    Total Price: {selectedOrder.cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)}€
                                </Typography>
                            </Box>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions className="no-print" sx={{ backgroundColor: '#f1f1f1', display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton onClick={handleClose} color="primary" title="Close">
                        <CloseIcon />
                    </IconButton>
                    <IconButton onClick={handlePrint} color="primary" title="Print">
                        <PrintIcon />
                    </IconButton>
                    <IconButton onClick={handleDelete} color="secondary" title="Delete">
                        <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                </DialogActions>
            </Dialog>
            <style jsx global>{`
                @media print {
                    .no-print {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default OrderDetail;
