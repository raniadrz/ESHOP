import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Avatar, TextField, InputAdornment, Chip } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { useContext, useState } from 'react';
import MyContext from "../../../context/myContext";
import UserCreationForm from '../UserCreationForm'; // Import your existing form component
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import toast from 'react-hot-toast';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Popover from '@mui/material/Popover';

const UserDetail = () => {
    const context = useContext(MyContext);
    const { getAllUser, updateUserRole, deleteUser } = context;

    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [openCreateDialog, setOpenCreateDialog] = useState(false); // State for create user dialog
    const [selectedUser, setSelectedUser] = useState(null);

    const [searchTerm, setSearchTerm] = useState('');

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [filterAnchorEl, setFilterAnchorEl] = useState(null);
    const [filters, setFilters] = useState({
        role: 'all',
        dateJoined: 'all',
        lastActive: 'all'
    });

    const [page, setPage] = useState(1);
    const usersPerPage = 10;

    const filteredUsers = getAllUser.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch = 
            user.name?.toLowerCase().includes(searchLower) ||
            user.email?.toLowerCase().includes(searchLower) ||
            user.role?.toLowerCase().includes(searchLower);

        // Role filter
        const matchesRole = filters.role === 'all' || user.role === filters.role;

        // Date joined filter
        let matchesDateJoined = true;
        if (filters.dateJoined !== 'all') {
            const userDate = new Date(user.date);
            const today = new Date();
            const diffDays = Math.floor((today - userDate) / (1000 * 60 * 60 * 24));

            switch (filters.dateJoined) {
                case 'last7days':
                    matchesDateJoined = diffDays <= 7;
                    break;
                case 'last30days':
                    matchesDateJoined = diffDays <= 30;
                    break;
                case 'last90days':
                    matchesDateJoined = diffDays <= 90;
                    break;
            }
        }

    

        return matchesSearch && matchesRole && matchesDateJoined ;
    });

    // Calculate pagination
    const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
    const startIndex = (page - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    const currentUsers = filteredUsers.slice(startIndex, endIndex);

    // Handle page change
    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const rows = currentUsers.map((user, index) => ({
        id: startIndex + index + 1, // This keeps the numbering continuous across pages
        name: user.name,
        email: user.email,
        date: user.date,
        role: user.role,
        uid: user.id,
        photoURL: user.photoURL,
        lastActive: user.lastActive
    }));

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

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

    const handleOpenDeleteDialog = (user) => {
        toast.success('Opening delete dialog for user:', user);
        setSelectedUser(user);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        try {
            if (!selectedUser) {
                toast.error('No user selected');
                return;
            }
            await deleteUser(selectedUser.uid);
            handleCloseDeleteDialog();
            toast.success('User deleted successfully');
            
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete user');
        }
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
                        onClick={() => handleOpenDeleteDialog(params.row)}
                        color="secondary"
                        size="small"
                    >
                        <DeleteIcon style={{ color: 'red' }} />
                    </IconButton>
                </div>
            ),
        },
    ];

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
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-semibold mb-1">User management</h1>
                <p className="text-gray-500">Manage your team members and their account permissions here.</p>
            </div>

            {/* Search and Actions Bar */}
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-lg font-medium">All users</h2>
                    <span className="text-gray-500">{filteredUsers.length}</span>
                </div>

                <div className="flex items-center gap-3">
                    <TextField
                        placeholder="Search users..."
                        size="small"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon className="text-gray-400" />
                                </InputAdornment>
                            ),
                        }}
                        sx={{
                            width: '240px',
                            '& .MuiOutlinedInput-root': {
                                backgroundColor: 'white',
                                borderRadius: '8px',
                            }
                        }}
                    />
                    
                    <Button
                        variant="outlined"
                        startIcon={<FilterListIcon />}
                        onClick={handleFilterClick}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            borderColor: '#e0e0e0',
                            color: '#666',
                        }}
                    >
                        Filters
                        {Object.values(filters).some(value => value !== 'all') && (
                            <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                Active
                            </span>
                        )}
                    </Button>

                    <Popover
                        open={Boolean(filterAnchorEl)}
                        anchorEl={filterAnchorEl}
                        onClose={handleFilterClose}
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        PaperProps={{
                            sx: {
                                p: 2,
                                width: 300,
                                borderRadius: '12px',
                            }
                        }}
                    >
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <Select
                                    value={filters.role}
                                    onChange={(e) => handleFilterChange('role', e.target.value)}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="all">All roles</MenuItem>
                                    <MenuItem value="admin">Admin</MenuItem>
                                    <MenuItem value="user">User</MenuItem>
                                </Select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Date joined
                                </label>
                                <Select
                                    value={filters.dateJoined}
                                    onChange={(e) => handleFilterChange('dateJoined', e.target.value)}
                                    fullWidth
                                    size="small"
                                >
                                    <MenuItem value="all">Any time</MenuItem>
                                    <MenuItem value="last7days">Last 7 days</MenuItem>
                                    <MenuItem value="last30days">Last 30 days</MenuItem>
                                    <MenuItem value="last90days">Last 90 days</MenuItem>
                                </Select>
                            </div>

                            

                            <div className="flex justify-end gap-2 pt-2">
                                <Button 
                                    onClick={() => {
                                        setFilters({
                                            role: 'all',
                                            dateJoined: 'all',
                                            lastActive: 'all'
                                        });
                                    }}
                                    sx={{ textTransform: 'none' }}
                                >
                                    Reset filters
                                </Button>
                                <Button 
                                    onClick={handleFilterClose}
                                    variant="contained"
                                    sx={{ 
                                        textTransform: 'none',
                                        backgroundColor: '#1a1a1a',
                                        '&:hover': {
                                            backgroundColor: '#000',
                                        }
                                    }}
                                >
                                    Apply filters
                                </Button>
                            </div>
                        </div>
                    </Popover>

                    <Button
                        variant="contained"
                        startIcon={<PersonAddIcon />}
                        onClick={handleOpenCreateDialog}
                        sx={{
                            borderRadius: '8px',
                            textTransform: 'none',
                            backgroundColor: '#1a1a1a',
                            '&:hover': {
                                backgroundColor: '#000',
                            }
                        }}
                    >
                        Add user
                    </Button>
                </div>
            </div>

            {/* Table */}
            <div className="bg-white rounded-lg shadow">
                <table className="min-w-full">
                    <thead>
                        <tr className="border-b">
                            <th className="w-8 p-4">
                                <input type="checkbox" className="rounded" />
                            </th>
                            <th className="text-left p-4 text-gray-500 font-medium">User name</th>
                            <th className="text-left p-4 text-gray-500 font-medium">Access</th>
                            <th className="text-left p-4 text-gray-500 font-medium">Last active</th>
                            <th className="text-left p-4 text-gray-500 font-medium">Date joined</th>
                            <th className="w-8 p-4"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? (
                            rows.map((user) => (
                                <tr key={user.id} className="border-b hover:bg-gray-50">
                                    <td className="p-4">
                                        <input type="checkbox" className="rounded" />
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <Avatar src={user.photoURL} alt={user.name}>
                                                {user.name?.[0]}
                                            </Avatar>
                                            <div>
                                                <div className="font-medium">{user.name}</div>
                                                <div className="text-gray-500 text-sm">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">
                                        <div className="flex gap-2">
                                            {user.role === 'admin' ? (
                                                // Admin chips
                                                <>
                                                    <Chip 
                                                        label="Admin" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#e8f5e9',
                                                            color: '#2e7d32',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                    <Chip 
                                                        label="Management Products" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                    <Chip 
                                                        label="Management Orders" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#f3e5f5',
                                                            color: '#7b1fa2',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                    <Chip 
                                                        label="Management Users" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#c1dba7',
                                                            color: '#53a303',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                </>
                                            ) : (
                                                // Regular user chips
                                                <>
                                                <Chip 
                                                        label="User" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#edb7df',
                                                            color: '#e000a5',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                    <Chip 
                                                        label="Make Orders" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#e3f2fd',
                                                            color: '#1976d2',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                    <Chip 
                                                        label="View His History" 
                                                        size="small"
                                                        sx={{
                                                            backgroundColor: '#ffb3b6',
                                                            color: '#f20713',
                                                            borderRadius: '4px',
                                                            height: '24px',
                                                        }}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    </td>
                                    <td className="p-4 text-gray-500">{user.lastActive || 'Never'}</td>
                                    <td className="p-4 text-gray-500">{user.date}</td>
                                    <td className="p-4">
                                        <div className="flex">
                                            <IconButton
                                                onClick={() => handleClickOpenRoleDialog(user)}
                                                color="primary"
                                                size="small"
                                            >
                                                <AccountCircleIcon />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => handleOpenDeleteDialog(user)}
                                                color="secondary"
                                                size="small"
                                            >
                                                <DeleteIcon style={{ color: 'red' }} />
                                            </IconButton>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="p-4 text-center text-gray-500">
                                    No users found matching your search.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {filteredUsers.length > 0 && (
                    <div className="flex justify-between items-center p-4 border-t">
                        <div className="text-sm text-gray-500">
                            Showing {startIndex + 1} to {Math.min(endIndex, filteredUsers.length)} of {filteredUsers.length} users
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(page - 1)}
                                disabled={page === 1}
                                className={`px-3 py-1 rounded ${
                                    page === 1 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                Previous
                            </button>
                            {[...Array(totalPages)].map((_, index) => {
                                const pageNumber = index + 1;
                                return (
                                    <button
                                        key={pageNumber}
                                        onClick={() => handlePageChange(pageNumber)}
                                        className={`px-3 py-1 rounded ${
                                            page === pageNumber 
                                                ? 'bg-gray-100 text-gray-700 font-medium' 
                                                : 'hover:bg-gray-50 text-gray-600'
                                        }`}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            })}
                            <button
                                onClick={() => handlePageChange(page + 1)}
                                disabled={page === totalPages}
                                className={`px-3 py-1 rounded ${
                                    page === totalPages 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'hover:bg-gray-50 text-gray-700'
                                }`}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Keep existing dialogs */}
            
            {/* Role Dialog */}
            <Dialog 
                open={openRoleDialog} 
                onClose={handleCloseRoleDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '20px 24px',
                        fontSize: '18px',
                        fontWeight: '600',
                    }}
                >
                    Update user role
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText sx={{ marginBottom: '20px', color: '#6b7280' }}>
                        Select a new role for <span className="font-medium text-gray-900">{selectedUser?.name}</span>
                    </DialogContentText>
                    <div className="flex flex-col gap-3">
                        <Button
                            variant="outlined"
                            startIcon={<AdminPanelSettingsIcon />}
                            onClick={() => handleRoleChange('admin')}
                            className="justify-start"
                            sx={{
                                borderColor: '#e0e0e0',
                                color: '#2e7d32',
                                textTransform: 'none',
                                padding: '12px 16px',
                                '&:hover': {
                                    borderColor: '#2e7d32',
                                    backgroundColor: '#e8f5e9',
                                }
                            }}
                        >
                            Admin
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PersonIcon />}
                            onClick={() => handleRoleChange('user')}
                            className="justify-start"
                            sx={{
                                borderColor: '#e0e0e0',
                                color: '#1976d2',
                                textTransform: 'none',
                                padding: '12px 16px',
                                '&:hover': {
                                    borderColor: '#1976d2',
                                    backgroundColor: '#e3f2fd',
                                }
                            }}
                        >
                            User
                        </Button>
                    </div>
                </DialogContent>
                <DialogActions sx={{ 
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    padding: '16px 24px',
                    gap: '12px'
                }}>
                    <Button 
                        onClick={handleCloseRoleDialog} 
                        sx={{
                            textTransform: 'none',
                            color: '#666',
                            backgroundColor: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                borderColor: '#d5d5d5',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleConfirmRoleChange} 
                        variant="contained"
                        autoFocus
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#1a1a1a',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#000',
                            }
                        }}
                    >
                        Save changes
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Create User Dialog */}
            <Dialog
                open={openCreateDialog}
                onClose={handleCloseCreateDialog}
                fullWidth
                maxWidth="lg"
                PaperProps={{
                    sx: {
                        backgroundColor: '#ffffff',
                        borderRadius: '10px',
                    }
                }}
            >
                <DialogTitle sx={{ backgroundColor: '#f1f1f1', color: '#005689', fontWeight: 'bold', fontSize: '20px' }}>New Account</DialogTitle>
                <DialogContent>
                    <UserCreationForm /> {/* Render your user creation form component */}
                </DialogContent>

                <DialogActions sx={{ backgroundColor: '#f1f1f1' }}>
                    <Button onClick={handleCloseCreateDialog} color="primary">
                        Close
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add this dialog component */}
            <Dialog 
                open={openDeleteDialog} 
                onClose={handleCloseDeleteDialog}
                maxWidth="xs"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '12px',
                    }
                }}
            >
                <DialogTitle 
                    sx={{ 
                        backgroundColor: '#f9fafb',
                        borderBottom: '1px solid #e5e7eb',
                        padding: '20px 24px',
                        fontSize: '18px',
                        fontWeight: '600',
                        color: '#dc2626' // red color for warning
                    }}
                >
                    Delete user
                </DialogTitle>
                <DialogContent sx={{ padding: '24px' }}>
                    <DialogContentText sx={{ color: '#6b7280' }}>
                        Are you sure you want to delete <span className="font-medium text-gray-900">{selectedUser?.name}</span>? 
                        <br />
                        <span className="text-sm mt-2 block text-red-600">
                            This action cannot be undone.
                        </span>
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ 
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    padding: '16px 24px',
                    gap: '12px'
                }}>
                    <Button 
                        onClick={handleCloseDeleteDialog} 
                        sx={{
                            textTransform: 'none',
                            color: '#666',
                            backgroundColor: '#fff',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#f5f5f5',
                                borderColor: '#d5d5d5',
                            }
                        }}
                    >
                        Cancel
                    </Button>
                    <Button 
                        onClick={handleDeleteUser}
                        variant="contained"
                        color="error"
                        autoFocus
                        sx={{
                            textTransform: 'none',
                            backgroundColor: '#dc2626',
                            borderRadius: '8px',
                            padding: '8px 16px',
                            '&:hover': {
                                backgroundColor: '#b91c1c',
                            }
                        }}
                    >
                        Delete user
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default UserDetail;
