import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import MyContext from "../../../context/myContext";
import UserCreationForm from '../UserCreationForm'; // Import your existing form component

const UserDetail = () => {
    const context = useContext(MyContext);
    const { getAllUser, updateUserRole, deleteUser } = context;

    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // State for create user dialog
    const [selectedUser, setSelectedUser] = useState(null);

    const handleClickOpenRoleDialog = (user) => {
        setSelectedUser(user);
        setOpenRoleDialog(true);
    };

    const handleCloseRoleDialog = () => {
        setOpenRoleDialog(false);
        setSelectedUser(null);
    };

    const handleConfirmRoleChange = () => {
        updateUserRole(selectedUser.uid, selectedUser.role);
        handleCloseRoleDialog();
    };

    const handleDelete = async (user) => {
        await deleteUser(user.uid);
        // Optionally, refresh the data grid or state
    };

    const handleOpenCreateDialog = () => {
        setOpenCreateDialog(true);
    };

    const handleCloseCreateDialog = () => {
        setOpenCreateDialog(false);
    };

    const columns = [
        { field: 'id', headerName: 'S.No.', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: 'Date', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Role', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'dateOfBirth', headerName: 'Date of Birth', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'country', headerName: 'Country', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'profession', headerName: 'Profession', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <div>
                    <IconButton
                        onClick={() => handleClickOpenRoleDialog(params.row)}
                        color="primary"
                    >
                        <AccountCircleIcon />
                    </IconButton>
                    <IconButton
                        onClick={() => handleDelete(params.row)}
                        color="secondary"
                    >
                        <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                </div>
            ),
        },
    ];

    const rows = getAllUser.map((user, index) => ({
        id: index + 1,
        name: user.name,
        email: user.email,
        date: user.date,
        role: user.role,
        dateOfBirth: user.dateOfBirth,
        country: user.country,
        profession: user.profession,
        uid: user.id
    }));

    return (
        <div style={{ height: '70vh', width: '100%' }}>
            <div className="py-5 flex justify-between items-center">
                <h1 className="text-xl text-blue-600 font-bold">All Users</h1>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PersonAddIcon />}
                    onClick={handleOpenCreateDialog}
                    sx={{
                        textTransform: 'none',
                        backgroundColor: '#2196f3',
                        '&:hover': {
                            backgroundColor: '#1e88e5',
                        }
                    }}
                >
                    Add New Account
                </Button>
            </div>
            <div style={{ flexGrow: 1 }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={10}
                    rowsPerPageOptions={[10]}
                    disableSelectionOnClick
                    autoHeight
                    sx={{
                        '& .MuiDataGrid-root': {
                            backgroundColor: '#005689', // Light blue background
                        },
                        '& .MuiDataGrid-cell': {
                            textAlign: 'center',
                            '&:hover': {
                                backgroundColor: '#d5eeff', // Light blue on hover
                            },
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
                open={openRoleDialog}
                onClose={handleCloseRoleDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                PaperProps={{
                    sx: {
                        backgroundColor: '#f9f9f9',
                    }
                }}
            >
                <DialogTitle id="alert-dialog-title" sx={{ backgroundColor: '#f1f1f1' }}>
                    Change User Role
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to change the role of {selectedUser ? selectedUser.name : ''}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#f1f1f1' }}>
                    <Button onClick={handleCloseRoleDialog} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirmRoleChange} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
            {/* User Creation Dialog */}
            <Dialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                fullWidth
                maxWidth="sm"
                PaperProps={{
                    sx: {
                        backgroundColor: '#ffffff',
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#f1f1f1' }}>New Account</DialogTitle>
                <DialogContent>
                    <UserCreationForm /> {/* Render your user creation form component */}
                </DialogContent>
                <DialogActions sx={{ backgroundColor: '#f1f1f1' }}>
                    <Button onClick={handleCloseCreateDialog} color="primary">
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserDetail;
