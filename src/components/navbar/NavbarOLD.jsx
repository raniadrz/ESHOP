import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css'; // Custom CSS file

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('users'));
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Open/Close Drawer
  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  // Logout Function
  const logout = () => {
    localStorage.clear('users');
    navigate('/login');
  };

  // Responsive Handling
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md')); // Change behavior at medium screen (960px)

  const navList = (
    <Box
      className="drawer-content"
      role="presentation"
      onClick={isMobile ? toggleDrawer(false) : undefined} // Only close drawer on mobile
      onKeyDown={isMobile ? toggleDrawer(false) : undefined}
    >
      {/* Profile Section */}
      {user && (
        <Box className="profile-section" sx={{ padding: 2, textAlign: 'center' }}>
          <Avatar sx={{ bgcolor: '#ff9800', margin: '0 auto' }}>{user.name[0].toUpperCase()}</Avatar>
          <Typography variant="h6" sx={{ color: '#fff', marginTop: 1 }}>
            {user.name}
          </Typography>
          <Typography variant="body2" sx={{ color: '#bbb' }}>
            {user.email}
          </Typography>
        </Box>
      )}
      <Divider sx={{ backgroundColor: '#fff' }} />

      {/* Navigation Links */}
      <List className="nav-list">
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ color: '#fff' }} />
        </ListItem>

        <ListItem button component={Link} to="/cartNav">
          <ListItemIcon>
            <ShoppingCartIcon sx={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary={`Cart (${cartItems.length})`} sx={{ color: '#fff' }} />
        </ListItem>

        {!user ? (
          <ListItem button component={Link} to="/login">
            <ListItemIcon>
              <LoginIcon sx={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Login" sx={{ color: '#fff' }} />
          </ListItem>
        ) : (
          <>
            {user.role === 'user' && (
              <ListItem button component={Link} to="/user-dashboard">
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="User Dashboard" sx={{ color: '#fff' }} />
              </ListItem>
            )}
            {user.role === 'admin' && (
              <ListItem button component={Link} to="/admin-dashboard">
                <ListItemIcon>
                  <DashboardIcon sx={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="Admin Dashboard" sx={{ color: '#fff' }} />
              </ListItem>
            )}
            <ListItem button onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: '#fff' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#fff' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <>
      {/* TopNav for Large Screens */}
      {!isMobile && (
        <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className="navbar-title"
              sx={{ textDecoration: 'none', color: '#fff' }}
            >
              Pet Paradise
            </Typography>
            <Box className="navbar-links">
              <Button component={Link} to="/" sx={{ color: '#fff' }}>
                Home
              </Button>
              <Button component={Link} to="/cartNav" sx={{ color: '#fff' }}>
                Cart ({cartItems.length})
              </Button>
              {!user ? (
                <Button component={Link} to="/login" sx={{ color: '#fff' }}>
                  Login
                </Button>
              ) : (
                <>
                  {user.role === 'user' && (
                    <Button component={Link} to="/user-dashboard" sx={{ color: '#fff' }}>
                      User Dashboard
                    </Button>
                  )}
                  {user.role === 'admin' && (
                    <Button component={Link} to="/admin-dashboard" sx={{ color: '#fff' }}>
                      Admin Dashboard
                    </Button>
                  )}
                  <Button onClick={logout} sx={{ color: '#fff' }}>
                    Logout
                  </Button>
                </>
              )}
            </Box>
          </Toolbar>
        </AppBar>
      )}

      {/* Drawer for Mobile Screens */}
      {isMobile && (
        <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography
              variant="h6"
              component={Link}
              to="/"
              className="navbar-title"
              sx={{ textDecoration: 'none', color: 'inherit' }}
            >
              Pet Paradise
            </Typography>
            <IconButton
              edge="end"
              color="inherit"
              aria-label="menu"
              onClick={toggleDrawer(true)}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
        </AppBar>
      )}
      
      {/* Drawer for Mobile Devices */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: '100%',
            backgroundColor: '#0f3647',
            color: '#ffffff',
          },
        }}
      >
        {navList}
      </Drawer>
    </>
  );
};

export default Navbar;
