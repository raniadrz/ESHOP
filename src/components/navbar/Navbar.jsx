import ChatIcon from '@mui/icons-material/Chat';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {
  AppBar,
  Avatar,
  Box,
  Button,
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
import logo from '../navbar/logo.png';
import './Navbar.css'; // Custom CSS file

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem('users'));
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart);
  const [drawerOpen, setDrawerOpen] = useState(true);

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
      onClick={isMobile ? toggleDrawer(false) : undefined}
      onKeyDown={isMobile ? toggleDrawer(false) : undefined}
    >
      {/* Profile Section */}
      {user && (
        <Box className="profile-section">
          <Avatar 
            sx={{ 
              bgcolor: '#4CAF50',
              fontSize: '2rem',
              transition: 'transform 0.3s ease',
              '&:hover': {
                transform: 'scale(1.1)'
              }
            }}
          >
            {user.name[0].toUpperCase()}
          </Avatar>
          <Typography variant="h6">
            {user.name}
          </Typography>
          <Typography variant="body2">
            {user.email}
          </Typography>
        </Box>
      )}

      {/* Navigation Links */}
      <List className="nav-list">
        <ListItem button component={Link} to="/" sx={{ mb: 1 }}>
          <ListItemIcon>
            <HomeIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          </ListItemIcon>
          <ListItemText 
            primary="Home" 
            primaryTypographyProps={{
              sx: { color: 'rgba(255, 255, 255, 0.9)' }
            }}
          />
        </ListItem>

        <ListItem button component={Link} to="/cartNav" sx={{ mb: 1 }}>
          <ListItemIcon>
            <ShoppingCartIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
          </ListItemIcon>
          <ListItemText
            primary={`Cart (${cartItems.length})`}
            primaryTypographyProps={{
              sx: { color: 'rgba(255, 255, 255, 0.9)' }
            }}
          />
        </ListItem>

        {!user ? (
          <ListItem button component={Link} to="/login" sx={{ mb: 1 }}>
            <ListItemIcon>
              <LoginIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
            </ListItemIcon>
            <ListItemText 
              primary="Login"
              primaryTypographyProps={{
                sx: { color: 'rgba(255, 255, 255, 0.9)' }
              }}
            />
          </ListItem>
        ) : (
          <>
            {user.role === 'user' && (
              <ListItem button component={Link} to="/user-dashboard" sx={{ mb: 1 }}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="User Dashboard"
                  primaryTypographyProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.9)' }
                  }}
                />
              </ListItem>
            )}
            {user.role === 'admin' && (
              <ListItem button component={Link} to="/admin-dashboard" sx={{ mb: 1 }}>
                <ListItemIcon>
                  <DashboardIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
                </ListItemIcon>
                <ListItemText 
                  primary="Admin Dashboard"
                  primaryTypographyProps={{
                    sx: { color: 'rgba(255, 255, 255, 0.9)' }
                  }}
                />
              </ListItem>
            )}
            <ListItem button onClick={logout} sx={{ mb: 1 }}>
              <ListItemIcon>
                <ExitToAppIcon sx={{ color: 'rgba(255, 255, 255, 0.9)' }} />
              </ListItemIcon>
              <ListItemText 
                primary="Logout"
                primaryTypographyProps={{
                  sx: { color: 'rgba(255, 255, 255, 0.9)' }
                }}
              />
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
        <AppBar position="sticky" sx={{ 
          bgcolor: '#ffffff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
            {/* Logo Section */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <img 
                src={logo} 
                style={{ 
                  height: '4rem',
                }}
                onClick={() => navigate('/')}
              />
             
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button 
                component={Link} 
                to="/" 
                startIcon={<HomeIcon />}
                sx={{ 
                  color: '#666666',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Home
              </Button>
              <Button 
                component={Link} 
                to="/cartNav"
                startIcon={<ShoppingCartIcon />}
                sx={{ 
                  color: '#666666',
                  textTransform: 'none',
                  fontWeight: 500
                }}
              >
                Cart ({cartItems.length})
              </Button>
              {user && (
                user.role === 'admin' ? (
                  <Button 
                    component={Link} 
                    to="/admin-dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{ 
                      color: '#666666',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    Admin Dashboard
                  </Button>
                ) : (
                  <Button 
                    component={Link} 
                    to="/user-dashboard"
                    startIcon={<DashboardIcon />}
                    sx={{ 
                      color: '#666666',
                      textTransform: 'none',
                      fontWeight: 500
                    }}
                  >
                    User Dashboard
                  </Button>
                )
              )}
            </Box>

            {/* Sign In/Logout Button */}
            {!user ? (
              <Button
                variant="contained"
                component={Link}
                to="/login"
                startIcon={<LoginIcon />}
                sx={{
                  bgcolor: '#1B3654',
                  color: '#f294f2',
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': {
                    bgcolor: '#f294f2'
                  }
                }}
              >
                Sign In
              </Button>
            ) : (
              <Button
                variant="contained"
                onClick={logout}
                startIcon={<ExitToAppIcon />}
                sx={{
                  bgcolor: '#1B3654',
                  color: '#ffffff',
                  textTransform: 'none',
                  borderRadius: '20px',
                  px: 3,
                  '&:hover': {
                    bgcolor: '#f294f2',
                    color: '#1B3654'
                  }
                }}
              >
                Logout
              </Button>
            )}
          </Toolbar>
        </AppBar>
      )}

      {/* Mobile AppBar */}
      {isMobile && (
        <>
          <AppBar position="sticky" sx={{ 
            bgcolor: '#ffffff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            marginBottom: '80px'
          }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Logo Section */}
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <img 
                  src={logo} 
                  style={{ 
                    height: '3.5rem',
                  }}
                  onClick={() => navigate('/')}
                />
              </Box>
            </Toolbar>
          </AppBar>

          {/* Mobile Bottom Navigation */}
          <Box
            sx={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              height: '80px',
              backgroundColor: '#ffffff',
              borderTopLeftRadius: '30px',
              borderTopRightRadius: '30px',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '0 20px',
              boxShadow: '0 -2px 10px rgba(0,0,0,0.1)',
              zIndex: 1200
            }}
          >
            <Box sx={{ 
              display: 'flex', 
              width: '100%', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              position: 'relative',
              paddingTop: '20px'
            }}>

               {/* Cart Icon */}
               <IconButton 
                component={Link} 
                to="/cart"
                sx={{ color: '#666666' }}
              >
                <ShoppingCartIcon />
                {cartItems.length > 0 && (
                  <Box
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: '#f294f2',
                      borderRadius: '50%',
                      width: '20px',
                      height: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '12px',
                      color: 'white'
                    }}
                  >
                    {cartItems.length}
                  </Box>
                )}
              </IconButton>


              {/* Home Icon */}
              <IconButton 
                component={Link} 
                to="/"
                sx={{ color: '#666666' }}
              >
                <HomeIcon />
              </IconButton>

              {/* Centered Dashboard/Login Button */}
              {!user ? (
                <IconButton
                  component={Link}
                  to="/login"
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                    top: '-10px',
                    backgroundColor: '#A5B88F',
                    width: '60px',
                    height: '60px',
                    zIndex: 1,
                    '&:hover': {
                      backgroundColor: '#8FA072'
                    }
                  }}
                >
                  <LoginIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
                </IconButton>
              ) : (
                <IconButton
                  component={Link}
                  to={user.role === 'admin' ? '/admin-dashboard' : '/user-dashboard'}
                  sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%) translateY(-50%)',
                    top: '-10px',
                    backgroundColor: '#f294f2',
                    width: '60px',
                    height: '60px',
                    zIndex: 1,
                    '&:hover': {
                      backgroundColor: '#4c50ba'
                    }
                  }}
                >
                  <DashboardIcon sx={{ color: '#ffffff', fontSize: '2rem' }} />
                </IconButton>
              )}

              {/* Profile/Logout Icon */}
              {!user ? (
                <IconButton 
                  component={Link}
                  to="/contact"
                  sx={{ color: '#666666' }}
                >
                  <ChatIcon />
                </IconButton>
              ) : (
                <IconButton 
                  onClick={logout}
                  sx={{ color: '#666666' }}
                >
                  <ExitToAppIcon />
                </IconButton>
              )}
              
            </Box>
          </Box>
        </>
      )}
    </>
  );
};

export default Navbar;
