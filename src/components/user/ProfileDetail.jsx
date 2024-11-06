import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import FilterListIcon from '@mui/icons-material/FilterList';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import {
    Avatar,
    Button,
    Card,
    Dialog,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography
} from '@mui/material';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import React, { useContext, useState } from "react";
import { CSVLink } from 'react-csv';
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import './ProfileDetail.css';

// Format price function (Define here if not imported)
const formatPrice = (price) => {
    return (Math.round(parseFloat(price) * 100) / 100).toFixed(2);
};

// Styling components
const AvatarSection = styled('div')(({ theme }) => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(2),
}));

const SectionTitle = styled(Typography)(({ theme }) => ({
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
    fontSize: '1.5rem',
    textAlign: 'center',
}));

const UserCard = styled(Card)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    marginBottom: theme.spacing(3),
    padding: theme.spacing(2),
    boxShadow: theme.shadows[2],
}));

const OrderCard = styled(Card)(({ theme }) => ({
    marginBottom: theme.spacing(2),
    boxShadow: theme.shadows[1],
}));

// Add this helper function at the top of the file
const formatTimestamp = (timestamp) => {
    if (!timestamp) return { date: 'N/A', time: 'N/A' };
    
    try {
        let date;
        if (timestamp.seconds) {
            // Handle Firestore timestamp
            date = new Date(timestamp.seconds * 1000);
        } else if (timestamp.toDate) {
            // Handle Firestore Timestamp object
            date = timestamp.toDate();
        } else {
            // Handle regular date string or timestamp
            date = new Date(timestamp);
        }

        return {
            date: date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
            }),
            time: date.toLocaleTimeString('en-GB', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    } catch (error) {
        console.error('Error formatting timestamp:', error);
        return { date: 'N/A', time: 'N/A' };
    }
};

// Helper functions
const getPaymentMethodClass = (method) => {
    const baseClass = 'payment-method';
    switch (method?.toLowerCase()) {
        case 'bank_transfer':
            return `${baseClass} bank-transfer`;
        case 'cash':
            return `${baseClass} cash`;
        default:
            return `${baseClass} unknown`;
    }
};

const calculateTotalAmount = (items) => {
    if (!Array.isArray(items)) return 0;
    return items.reduce((total, item) => {
        const price = parseFloat(item.price) || 0;
        const quantity = parseInt(item.quantity) || 0;
        return total + (price * quantity);
    }, 0);
};

const OrderItem = ({ order, onMenuClick, isMobile }) => {
    if (isMobile) {
        return (
            <div className="mobile-order-card">
                <div className="order-header">
                    <span className="order-id">#{order.id || 'N/A'}</span>
                    <div className="order-total">
                        {Number(order.totalAmount || calculateTotalAmount(order.items)).toFixed(2)}€
                    </div>
                    <IconButton 
                        size="small"
                        onClick={(e) => onMenuClick(e, order)}
                    >
                        <MoreVertIcon />
                    </IconButton>
                </div>
                
                <div className="order-details">
                    <div className="detail-row">
                        <span className="label">Payment:</span>
                        <span className={getPaymentMethodClass(order.addressInfo?.paymentMethod)}>
                            {order.addressInfo?.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 
                            order.addressInfo?.paymentMethod === 'cash' ? 'Cash' : 'N/A'}
                        </span>
                    </div>
                    
                    <div className="detail-row">
                        <span className="label">Date & Time:</span>
                        <div className="datetime-info">
                            <Typography variant="body2">
                                {formatTimestamp(order.date).date}
                            </Typography>
                            <Typography variant="caption" className="time-label">
                                {formatTimestamp(order.date).time}
                            </Typography>
                        </div>
                    </div>
                    
                    <div className="detail-row">
                        <span className="label">Status:</span>
                        <span className={`status-badge ${(order.status || 'unknown')?.toLowerCase().replace(/\s+/g, '-')}`}>
                            {order.status || 'Unknown'}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-8 gap-4 px-4 py-3 border-b hover:bg-gray-50">
            <div>
                <span className="px-2 py-1 bg-green-50 text-green-600 rounded text-sm">
                    {order.id}
                </span>
            </div>
            <Typography variant="body2">{order.addressInfo?.paymentMethod}</Typography>
            <Typography variant="body2">Immediately</Typography>
            <div>
                <Typography variant="body2" color="textSecondary">
                    {formatTimestamp(order.date).date}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                    {formatTimestamp(order.date).time}
                </Typography>
            </div>
            <div>
                <span className={`px-2 py-1 rounded text-sm
                    ${order.status === 'New Order' ? 'bg-green-50 text-green-600' : 
                    order.status === 'Prepared' ? 'bg-orange-50 text-orange-600' :
                    order.status === 'Accepted by Eshop' ? 'bg-blue-50 text-blue-600' :
                    'bg-red-50 text-red-600'}`}>
                    {order.status}
                </span>
            </div>
            
            <Typography variant="body2" className="text-right">
                {Number(order.totalAmount || calculateTotalAmount(order.items)).toFixed(2)}€
            </Typography>

            <div className="flex justify-end">
                <IconButton 
                    size="small"
                    onClick={(e) => onMenuClick(e, order)}
                >
                    <MoreVertIcon />
                </IconButton>
            </div>

        </div>
    );
};

// Update the Payment Summary section in your Dialog
const PaymentSummary = ({ selectedOrder }) => {
    const totalAmount = selectedOrder?.totalAmount || calculateTotalAmount(selectedOrder?.items);
    
    return (
        <div>
            <Typography variant="h6" className="mb-3">Payment Summary</Typography>
            <div className="p-4 bg-gray-50 rounded">
                <div className="flex justify-between items-center">
                    <Typography variant="h6">Total Amount</Typography>
                    <Typography variant="h6">
                        {Number(totalAmount).toFixed(2)}€
                    </Typography>
                </div>
                {selectedOrder?.addressInfo?.paymentMethod === 'bank_transfer' && (
                    <div className="mt-2 pt-2 border-t">
                        <Typography variant="subtitle2" color="textSecondary">
                            Bank Transfer Details
                        </Typography>
                        <Typography>
                            IBAN: GR1234567890123456789012345
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            Please include your Order ID ({selectedOrder.id}) in the transfer description
                        </Typography>
                    </div>
                )}
            </div>
        </div>
    );
};

const ProfileDetail = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { loading, getAllOrder } = context;
    const [expandedOrders, setExpandedOrders] = useState({});
    const [openModal, setOpenModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        timeRange: 'all'
    });
    const [openOrderDetails, setOpenOrderDetails] = useState(false);
    const isMobile = useMediaQuery('(max-width:768px)');

    const handleToggleOrder = (orderId) => {
        setExpandedOrders((prevState) => ({
            ...prevState,
            [orderId]: !prevState[orderId],
        }));
    };

    const handleOpenModal = (product) => {
        setSelectedProduct(product);
        setOpenModal(true);
    };

    const handleCloseModal = () => {
        setOpenModal(false);
        setSelectedProduct(null);
    };

    const groupedOrders = getAllOrder
        .filter((order) => order.userid === user?.uid)
        .reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = { ...order, items: [] };
            }
            acc[order.id].items.push(...order.cartItems);
            return acc;
        }, {});

    // Handle Menu Open/Close
    const handleMenuClick = (event, order) => {
        setAnchorEl(event.currentTarget);
        setSelectedOrder(order);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    // Handle Filter Menu
    const handleFilterClick = (event) => {
        setFilterAnchorEl(event.currentTarget);
    };

    const handleFilterClose = () => {
        setFilterAnchorEl(null);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
        handleFilterClose();
    };

    // Order Details Dialog
    const handleOpenOrderDetails = () => {
        setOpenOrderDetails(true);
        handleMenuClose();
    };

    const handleCloseOrderDetails = () => {
        setOpenOrderDetails(false);
        setSelectedOrder(null);
    };

    // Export Data Preparation
    const prepareExportData = () => {
        return Object.values(groupedOrders).map(order => ({
            'Order ID': order.id,
            'Method': order.method,
            'Time Slot': 'Immediately',
            'Date': formatTimestamp(order.date).date,
            'Time': formatTimestamp(order.addressInfo?.time).time,
            'Status': order.status,
            'Total Items': order.items.length,
            'Total Amount': formatPrice(order.totalAmount)
        }));
    };

    // Filter Orders
    const filteredOrders = Object.values(groupedOrders).filter(order => {
        if (filters.status !== 'all' && order.status !== filters.status) return false;
        
        if (filters.timeRange !== 'all') {
            const orderDate = new Date(order.date.seconds * 1000);
            const now = new Date();
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            
            if (filters.timeRange === 'week' && orderDate < weekAgo) return false;
        }
        
        return true;
    });

    // Helper function to format payment method
    const formatPaymentMethod = (method) => {
        switch (method) {
            case 'bank_transfer':
                return 'Bank Transfer (IBAN)';
            case 'cash':
                return 'Cash on Delivery';
            default:
                return method;
        }
    };

    return (
        <Layout>
            <div className="container mx-auto p-6">
                {/* User Profile Section */}
                <UserCard>
                    <AvatarSection>
                        <Avatar src={user?.avatarUrl} sx={{ width: 80, height: 80 }} />
                        <Typography variant="h5" className="mt-4 font-semibold">
                            {user?.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                            {user?.email}
                        </Typography>
                    </AvatarSection>
                </UserCard>

                {/* Orders Section */}
                <div className="mt-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                        <Typography variant="h5" component="h1">Orders</Typography>
                        <div className="flex flex-wrap gap-2">
                            <CSVLink 
                                data={prepareExportData()}
                                filename={"orders.csv"}
                                className="mobile-button"
                            >
                                <Button 
                                    variant="outlined" 
                                    startIcon={<DownloadIcon />}
                                    size="small"
                                >
                                    Export
                                </Button>
                            </CSVLink>
                            <Button 
                                variant="outlined" 
                                startIcon={<FilterListIcon />}
                                size="small"
                                onClick={handleFilterClick}
                            >
                                Filter
                            </Button>
                            <Button 
                                variant="outlined" 
                                startIcon={<CalendarTodayIcon />}
                                size="small"
                                onClick={() => handleFilterChange('timeRange', 'week')}
                            >
                                Weekly
                            </Button>
                        </div>
                    </div>

                    {/* Desktop Headers - Only show on non-mobile */}
                    {!isMobile && (
                        <div className="grid grid-cols-8 gap-4 px-4 py-3 bg-gray-50 font-medium border-b">
                            <div className="text-gray-600">Order ID</div>
                            <div className="text-gray-600">Payment Method</div>
                            <div className="text-gray-600">Delivery</div>
                            <div className="text-gray-600">Date/Time</div>
                            <div className="text-gray-600">Status</div>
                            <div className="text-gray-600 text-right">Total Amount</div>
                            <div></div> {/* Empty for menu button alignment */}
                            <div></div> {/* Empty for spacing */}
                        </div>
                    )}

                    {/* Orders List */}
                    <div className="orders-container">
                        {filteredOrders.map((order) => (
                            <OrderItem 
                                key={order.id} 
                                order={order} 
                                onMenuClick={handleMenuClick}
                                isMobile={isMobile}
                            />
                        ))}
                    </div>

                    {/* Filter Menu */}
                    <Menu
                        anchorEl={filterAnchorEl}
                        open={Boolean(filterAnchorEl)}
                        onClose={handleFilterClose}
                    >
                        <MenuItem onClick={() => handleFilterChange('status', 'all')}>All Status</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('status', 'confirmed')}>Confirmed</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('status', 'preparing')}>Prepared</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('status', 'shipped')}>Shipped</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('status', 'delivered')}>Delivered</MenuItem>
                        <MenuItem onClick={() => handleFilterChange('status', 'canceled')}>Canceled</MenuItem>
                    </Menu>

                    {/* Order Details Menu */}
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={handleOpenOrderDetails}>View Details</MenuItem>
                    </Menu>

                    {/* Order Details Dialog */}
                    <Dialog
                        open={openOrderDetails}
                        onClose={handleCloseOrderDetails}
                        maxWidth="md"
                        fullWidth
                    >
                        <DialogTitle>
                            Order Details
                            <IconButton
                                onClick={handleCloseOrderDetails}
                                sx={{ position: 'absolute', right: 8, top: 8 }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent dividers>
                            {selectedOrder && (
                                <div className="space-y-6">
                                    {/* Order Information */}
                                    <div>
                                        <Typography variant="h6" className="mb-3">Order Information</Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Typography variant="subtitle2">Order ID</Typography>
                                                <Typography>{selectedOrder.id}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2">Status</Typography>
                                                <Typography>{selectedOrder.status}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2">Date & Time</Typography>
                                                <Typography>
                                                    {formatTimestamp(selectedOrder.addressInfo?.date).date} {formatTimestamp(selectedOrder.addressInfo?.time).time}
                                                </Typography>
                                            </div>
                                            <div>
                                            <Typography variant="subtitle2">Payment Method</Typography>
                                            <Typography>{formatPaymentMethod(selectedOrder.addressInfo?.paymentMethod)}</Typography>
                                        </div>

                                        </div>
                                    </div>

                                    {/* Customer Information */}
                                    <div>
                                        <Typography variant="h6" className="mb-3">Customer Information</Typography>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <Typography variant="subtitle2">Name</Typography>
                                                <Typography>{selectedOrder.addressInfo?.name}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2">Email</Typography>
                                                <Typography>{selectedOrder.email}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2">Mobile Number</Typography>
                                                <Typography>{selectedOrder.addressInfo?.mobileNumber}</Typography>
                                            </div>
                                            <div>
                                                <Typography variant="subtitle2">Pincode</Typography>
                                                <Typography>{selectedOrder.addressInfo?.pincode}</Typography>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delivery Address */}
                                    <div>
                                        <Typography variant="h6" className="mb-3">Delivery Address</Typography>
                                        <Typography>{selectedOrder.addressInfo?.address}</Typography>
                                    </div>

                                    {/* Order Items */}
                                    <div>
                                        <Typography variant="h6" className="mb-3">Order Items</Typography>
                                        <div className="space-y-2">
                                            {selectedOrder.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                                    <div>
                                                        <Typography>{item.title}</Typography>
                                                        <Typography variant="body2" color="textSecondary">
                                                            Quantity: {item.quantity}
                                                        </Typography>
                                                    </div>
                                                    <Typography>{formatPrice(item.price)}€</Typography>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    
                                    {/* Payment Summary */}
                                    <PaymentSummary selectedOrder={selectedOrder} />
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileDetail;
