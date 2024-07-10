import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Box, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useState } from "react";
import myContext from "../../context/myContext";

const OrderDetail = () => {
    const context = useContext(myContext);
    const { getAllOrder, orderDelete } = context;

    const [expandedOrders, setExpandedOrders] = useState({});

    const toggleExpandOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    const rows = getAllOrder.flatMap((order) => {
        const orderRow = {
            id: order.id,
            isOrder: true,
            orderId: order.id,
            date: order.date,
            status: order.status,
            name: order.addressInfo.name,
            totalItems: order.cartItems.length,
        };

        const productRows = expandedOrders[order.id]
            ? order.cartItems.map((item, itemIndex) => ({
                  id: `${order.id}-${itemIndex}`,
                  orderId: order.id,
                  image: item.productImageUrl,
                  title: item.title,
                  code: item.code,
                  category: item.category,
                  category2: item.category2,
                  subcategory: item.subcategory,
                  price: item.price,
                  quantity: item.quantity,
                  totalPrice: item.price * item.quantity,
                  isOrder: false,
              }))
            : [];

        return [orderRow, ...productRows];
    });

    const columns = [
        {
            field: 'expand',
            headerName: '',
            width: 50,
            sortable: false,
            renderCell: (params) => {
                if (params.row.isOrder) {
                    return (
                        <IconButton
                            onClick={() => toggleExpandOrder(params.row.orderId)}
                            size="small"
                        >
                            {expandedOrders[params.row.orderId] ? (
                                <ExpandLessIcon />
                            ) : (
                                <ExpandMoreIcon />
                            )}
                        </IconButton>
                    );
                }
                return null;
            },
        },
        { field: 'orderId', headerName: 'Order ID', flex: 4, headerAlign: 'center', align: 'center',
            renderCell: (params) => {
                if (params.row.isOrder) {
                    return params.value;
                }
                return null;
            }
        },
        { field: 'date', headerName: 'Date', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'status', headerName: 'Status', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'totalItems', headerName: 'Total Items', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'title', headerName: 'Product Name', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'code', headerName: 'Code', flex: 3, headerAlign: 'center', align: 'center' },
        { field: 'price', headerName: '€', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'quantity', headerName: 'Quantity', flex: 2, headerAlign: 'center', align: 'center' },
        { field: 'totalPrice', headerName: 'Total €', flex: 2, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Action',
            flex: 2,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => {
                if (params.row.isOrder) {
                    return (
                        <IconButton onClick={() => orderDelete(params.row.orderId)}>
                            <DeleteIcon style={{ color: 'red' }} />
                        </IconButton>
                    );
                }
                return null;
            },
        },
    ];

    return (
        <div style={{height: '80vh'}}>
            <div className="py-5">
                <h1 className="text-xl text-red-300 font-bold">All Orders</h1>
            </div>
            <Box sx={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
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
        </div>
    );
}

export default OrderDetail;
