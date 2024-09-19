import React, { useContext, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Grid, Typography, Container, Chip, CircularProgress, Box, IconButton } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete'; // Import delete icon
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import cart icon
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import myContext from "../../context/myContext";
import { addToCart, incrementQuantity, decrementQuantity, deleteFromCart } from '../../redux/cartSlice';
import "./HomePageProductCard.css";

const HomePageProductCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const context = useContext(myContext);
    const { loading, getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);

    const addCart = (item) => {
        const itemWithTime = { ...item, time: new Date().toISOString() };
        dispatch(addToCart(itemWithTime));
        toast.success("Added to cart");
    };

    const increaseQuantity = (id) => {
        dispatch(incrementQuantity(id));
    };

    const decreaseQuantity = (id) => {
        dispatch(decrementQuantity(id));
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item)); // Pass the item instead of just the id
        toast.success("Deleted from cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Helper function to find if an item is in the cart and return its quantity
    const findCartItem = (id) => {
        return cartItems.find(item => item.id === id);
    };

    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
            {/* Updated Typography with orange, bold font and margin-bottom for gap */}
            <Typography 
                variant="h4" 
                gutterBottom 
                sx={{ 
                    color: '#ff9800',  // Orange color
                    fontWeight: 'bold',  // Bold font weight
                    fontFamily: 'Arial, sans-serif',  // Custom font (you can change it to your preferred font)
                    mb: 4  // Adds margin-bottom for a gap between the title and the grid
                }}
            >
                Bestselling Products
            </Typography>
            {loading && <CircularProgress />}
            <Grid 
                container 
                spacing={4} 
                justifyContent="center"
                sx={{ 
                    background: 'linear-gradient(to bottom, #ffffff ,#1976d2, #ffffff )', // Blue and white mix
                    padding: '20px', // Add padding inside the grid
                    borderRadius: '10px', // Adds a slight border-radius to the grid background
                    mt: 4  // Adds margin-top to separate the grid from the title
                }}
            >
                {getAllProduct.slice(0, 12).map((item, index) => {
                    const { id, title, price, productImageUrl, productType } = item;
                    const cartItem = findCartItem(id); // Find the item in the cart

                    return (
                        <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                            <Card 
                                sx={{ 
                                    height: '100%', 
                                    display: 'flex', 
                                    flexDirection: 'column',
                                    justifyContent: 'space-between'
                                }} 
                                onClick={() => navigate(`/productinfo/${id}`)}
                            >
                                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200 }}>
                                    <CardMedia
                                        component="img"
                                        image={productImageUrl}
                                        alt="product"
                                        sx={{ 
                                            width: 'auto',
                                            maxHeight: '100%',
                                            maxWidth: '100%',
                                            objectFit: 'contain',
                                        }}
                                    />
                                </Box>
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="h6" component="div">
                                        {title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        E-ctb
                                    </Typography>
                                    <Typography variant="h6" color="textPrimary">
                                        {price}€
                                    </Typography>
                                    {productType === "New Product" && (
                                        <Chip
                                            label="New"
                                            color="success"
                                            icon={<StarIcon />}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                    {productType === "Sales" && (
                                        <Chip
                                            label="Sale"
                                            color="error"
                                            icon={<LocalOfferIcon />}
                                            sx={{ mt: 1 }}
                                        />
                                    )}
                                </CardContent>

                                <Box sx={{ p: 2 }}>
                                    {cartItem ? (
                                        <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" gap={1}>
                                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); decreaseQuantity(id); }}
                                                    size="small"
                                                    disabled={cartItem.quantity <= 1}
                                                >
                                                    <RemoveIcon />
                                                </IconButton>
                                                <Typography variant="body1" sx={{ mx: 2 }}>
                                                    {cartItem.quantity}
                                                </Typography>
                                                <IconButton
                                                    onClick={(e) => { e.stopPropagation(); increaseQuantity(id); }}
                                                    size="small"
                                                >
                                                    <AddIcon />
                                                </IconButton>
                                            </Box>
                                            <Button
                                            onClick={(e) => { e.stopPropagation(); deleteCart(item); }} // Pass the item object
                                            variant="outlined"
                                            color="error"
                                            startIcon={<DeleteIcon />}
                                            fullWidth
                                        >
                                            Delete From Cart
                                        </Button>

                                        </Box>
                                    ) : (
                                        <Button
                                            onClick={(e) => { e.stopPropagation(); addCart(item); }}
                                            variant="outlined" // Outlined button like the delete button
                                            color="primary"   // Blue color for the Add to Cart button
                                            startIcon={<ShoppingCartIcon />} // Add a cart icon
                                            fullWidth
                                        >
                                            Add To Cart
                                        </Button>
                                    )}
                                </Box>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default HomePageProductCard;
