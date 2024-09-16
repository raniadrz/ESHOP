import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('users'));

  // Navigate
  const navigate = useNavigate();

  // Logout function
  const logout = () => {
    localStorage.clear('users');
    navigate('/login');
  };

  // CartItems
  const cartItems = useSelector((state) => state.cart);

  // State for Drawer menu
  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  // Theme and responsive utilities
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Logging to check drawer state and device type
  console.log({ drawerOpen, isMobile });

  const navList = (
    <Box
      className="drawer-list"
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
      sx={{ height: '100vh' }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: 2 }}>
        <IconButton onClick={toggleDrawer(false)} sx={{ color: '#fff' }}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List>
        <ListItem button component={Link} to="/">
          <ListItemIcon>
            <HomeIcon style={{ color: '#fff' }} />
          </ListItemIcon>
          <ListItemText primary="Home" sx={{ color: '#fff' }} />
        </ListItem>

        {!user ? (
          <ListItem button component={Link} to="/login">
            <ListItemIcon>
              <LoginIcon style={{ color: '#fff' }} />
            </ListItemIcon>
            <ListItemText primary="Login" sx={{ color: '#fff' }} />
          </ListItem>
        ) : null}

        {user && (
          <>
            {user.role === 'user' && (
              <ListItem button component={Link} to="/user-dashboard">
                <ListItemIcon>
                  <DashboardIcon style={{ color: '#fff' }} />
                </ListItemIcon>
                <ListItemText primary="User Settings" sx={{ color: '#fff' }} />
              </ListItem>
            )}
            {user.role === 'admin' && (
              <>
                <ListItem button component={Link} to="/admin-dashboard">
                  <ListItemIcon>
                    <DashboardIcon style={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Admin Dashboard" sx={{ color: '#fff' }} />
                </ListItem>

                <ListItem button component={Link} to="/admin-settings">
                  <ListItemIcon>
                    <DashboardIcon style={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary="Profile Setup" sx={{ color: '#fff' }} />
                </ListItem>

                <ListItem button component={Link} to="/cart">
                  <ListItemIcon>
                    <ShoppingCartIcon style={{ color: '#fff' }} />
                  </ListItemIcon>
                  <ListItemText primary={`Cart (${cartItems.length})`} sx={{ color: '#fff' }} />
                </ListItem>
              </>
            )}

            <ListItem button onClick={logout}>
              <ListItemIcon>
                <ExitToAppIcon style={{ color: '#fff' }} />
              </ListItemIcon>
              <ListItemText primary="Logout" sx={{ color: '#fff' }} />
            </ListItem>
          </>
        )}
      </List>
    </Box>
  );

  return (
    <AppBar position="sticky" sx={{ bgcolor: 'primary.main' }}>
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          className="navbar-title"
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          Chic Tails Boutique
        </Typography>
        <Box className="navbar-links" sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center' }}>
          <List sx={{ display: 'flex', padding: 0 }}>
            <ListItem button component={Link} to="/">
              <ListItemText primary="Home" />
            </ListItem>
            {!user ? (
              <ListItem button component={Link} to="/login">
                <ListItemText primary="Login" />
              </ListItem>
            ) : null}
            {user && (
              <>
                {user.role === 'user' && (
                  <ListItem button component={Link} to="/user-dashboard">
                    <ListItemText primary="User Settings" />
                  </ListItem>
                )}
                {user.role === 'admin' && (
                  <>
                    <ListItem button component={Link} to="/admin-dashboard">
                      <ListItemText primary="Admin Dashboard" />
                    </ListItem>
                    <ListItem button component={Link} to="/admin-settings">
                      <ListItemText primary="Profile Setup" />
                    </ListItem>
                  </>
                )}
                <ListItem button component={Link} to="/cart">
                  <ListItemText primary={`Cart (${cartItems.length})`} />
                </ListItem>
                <ListItem button onClick={logout}>
                  <ListItemText primary="Logout" />
                </ListItem>
              </>
            )}
            
          </List>

        </Box>
        <IconButton
          edge="end"
          color="inherit"
          aria-label="menu"
          onClick={toggleDrawer(true)}
          sx={{ display: { xs: 'block', md: 'none' } }} // Only show on mobile
        >
          <MenuIcon />
        </IconButton>
      </Toolbar>
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={toggleDrawer(false)}
        PaperProps={{
          sx: {
            width: isMobile ? '100%' : 250,
            backgroundColor: '#3e6380', // Dark background
            color: '#ffffff', // Light text color
            animation: 'slideIn 0.4s ease-out, fadeIn 1s ease-out', // Drawer animations
          },
        }}
      >
        {navList}
      </Drawer>
    </AppBar>
  );
};

export default Navbar;
