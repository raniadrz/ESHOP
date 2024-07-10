import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import MyContext from "../../context/myContext";

const UserDetail = () => {
    const context = useContext(MyContext);
    const { getAllUser, updateUserRole } = context;

    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleClickOpen = (user) => {
        setSelectedUser(user);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    const handleConfirm = () => {
        updateUserRole(selectedUser.uid, selectedUser.role);
        handleClose();
    };

    const columns = [
        { field: 'id', headerName: 'S.No.', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'name', headerName: 'Name', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'email', headerName: 'Email', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'date', headerName: 'Date', flex: 1, headerAlign: 'center', align: 'center' },
        { field: 'role', headerName: 'Role', flex: 1, headerAlign: 'center', align: 'center' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            headerAlign: 'center',
            align: 'center',
            renderCell: (params) => (
                <IconButton
                    onClick={() => handleClickOpen(params.row)}
                    color="primary"
                >
                    <AccountCircleIcon />
                </IconButton>
            ),
        },
    ];

    const rows = getAllUser.map((user, index) => ({
        id: index + 1,
        name: user.name,
        email: user.email,
        date: user.date,
        role: user.role,
        uid: user.id
    }));

    return (
        <div style={{ height: '100%' }}>
            <div className="flex justify-between items-center">
                <h1 className="text-xl text-blue-300 font-bold">All User</h1>
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
            </div>
            <Dialog
                open={open}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{"Change User Role"}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to change the role of {selectedUser ? selectedUser.name : ''}?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary">
                        No
                    </Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Yes
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserDetail;
