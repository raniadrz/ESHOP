import CategoryIcon from '@mui/icons-material/Category'; // Import the CategoryIcon
import DashboardIcon from '@mui/icons-material/Dashboard';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import MenuIcon from '@mui/icons-material/Menu';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import React, { useState } from 'react';
import { useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import './Navbar.css'; // Import the CSS file

const Navbar = () => {
    // Get user from localStorage 
    const user = JSON.parse(localStorage.getItem('users'));

    // Navigate 
    const navigate = useNavigate();

    // Logout function 
    const logout = () => {
        localStorage.clear('users');
        navigate("/login");
    }

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

    const navList = (
        <div
            className="drawer-list"
            role="presentation"
            onClick={toggleDrawer(false)}
            onKeyDown={toggleDrawer(false)}
        >
            <List>
                <ListItem button component={Link} to="/">
                    <ListItemText primary="Home" />
                    <ListItemIcon>
                        <HomeIcon />
                    </ListItemIcon>
                </ListItem>

                {!user ? (
                    <ListItem button component={Link} to="/login">
                        <ListItemText primary="Login" />
                        <ListItemIcon>
                            <LoginIcon />
                        </ListItemIcon>
                    </ListItem>
                ) : null}

                {user && (
                    <>
                        {user.role === "user" && (
                            <>
                                <ListItem button component={Link} to="/user-dashboard">
                                    <ListItemText primary="User Dashboard" />
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                                </ListItem>

                                <ListItem button component={Link} to="/allproduct">
                                    <ListItemText primary="All Products" />
                                    <ListItemIcon>
                                        <CategoryIcon />
                                    </ListItemIcon>
                                </ListItem>
                                
                                <ListItem button component={Link} to="/user-settings">
                                    <ListItemText primary="Customer Settings" />
                                    <ListItemIcon>
                                        <DashboardIcon />
                                    </ListItemIcon>
                            </ListItem>
                            </>
                        )}
                        {user.role === "admin" && (
                              <>
                            <ListItem button component={Link} to="/admin-dashboard">
                                <ListItemText primary="Admin Dashboard" />
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                            </ListItem>

                            <ListItem button component={Link} to="/user-settings">
                                <ListItemText primary="Admin Settings" />
                                <ListItemIcon>
                                    <DashboardIcon />
                                </ListItemIcon>
                            </ListItem>
                            </>
                            
                        )}
                         
                        <ListItem button onClick={logout}>
                            <ListItemText primary="Logout" />
                            <ListItemIcon>
                                <ExitToAppIcon />
                            </ListItemIcon>
                        </ListItem>
                    </>
                )}

                <ListItem button component={Link} to="/cart">
                    <ListItemText primary={`Cart (${cartItems.length})`} />
                    <ListItemIcon>
                        <ShoppingCartIcon />
                    </ListItemIcon>
                </ListItem>
            </List>
        </div>
    );

    return (
        <header className="relative bg-white">
            <p className="flex h-5 items-center justify-center bg-blue-200 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
                Get free delivery on orders over 50€
            </p>

            <nav className="bg-blue-600 sticky top-0">
                <div className="lg:flex lg:justify-between py-3 lg:px-5">
                    <div className="left py-3 lg:py-0">
                        <Link to={'/'}>
                            <h2 className="font-bold text-white text-2xl text-center">Chic Tails Boutique</h2>
                        </Link>
                    </div>
                    <div className="right flex justify-center mb-4 lg:mb-0">
                        <IconButton
                            edge="end"
                            color="inherit"
                            aria-label="menu"
                            onClick={toggleDrawer(true)}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
                            {navList}
                        </Drawer>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default Navbar;
