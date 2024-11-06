
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'; // Import cart icon
import StarIcon from '@mui/icons-material/Star';
import { Box, Card, CardContent, CardMedia, Container, Grid, IconButton, Typography } from "@mui/material";
import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import CustomToast from '../../components/CustomToast/CustomToast';
import Category from '../../components/category/Category';
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { addToCart, deleteFromCart } from '../../redux/cartSlice';
import "./HomePageProductCard.css";

const HomePageProductCard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const context = useContext(myContext);
    const { loading, getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);

    const showCustomToast = (type, message) => {
        toast.custom(
            (t) => (
                <CustomToast
                    type={type}
                    message={message}
                    onClose={() => {
                        toast.dismiss(t.id);
                    }}
                />
            ),
            {
                duration: 1500,
                position: 'bottom-center',
                id: `${type}-${Date.now()}`,
            }
        );
    };

    const addCart = (item) => {
        const itemWithTime = { ...item, time: new Date().toISOString() };
        dispatch(addToCart(itemWithTime));
        showCustomToast('success', 'Added to cart successfully');
    };

  

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item)); // Pass the item instead of just the id
        showCustomToast('success', 'Removed from cart successfully');
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    // Helper function to find if an item is in the cart and return its quantity
    const findCartItem = (id) => {
        return cartItems.find(item => item.id === id);
    };

    // Filter only active products
    const activeProducts = getAllProduct.filter(product => product.status !== false);

    return (
        <Layout>
        <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
            <Box sx={{ mb: 4, textAlign: 'left' }}>
                <Typography 
                    variant="h3" 
                    sx={{ 
                        fontWeight: 'bold',
                        mb: 2
                    }}
                >
                    OUR BEST SELLING
                    <br />
                    PRODUCT 🐕
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    Looking for our best-selling item? Look no further! Get our
                    top-rated, versatile, and high-quality product today and
                    see for yourself!
                </Typography>
                     {/* Other sections can remain but should be styled accordingly */}
                        <Category />
                
                
            </Box>

            <Grid container spacing={3}>
                {activeProducts.map((item, index) => {
                    const { id, title, price, productImageUrl } = item;
                    const cartItem = findCartItem(id);

                    return (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Card 
                                sx={{ 
                                    height: '100%',
                                    borderRadius: '16px',
                                    position: 'relative',
                                    '&:hover': {
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)'
                                    }
                                }}
                            >
                                {/* Favorite Icon */}
                                <IconButton 
                                    sx={{ 
                                        position: 'absolute', 
                                        right: 8, 
                                        top: 8,
                                        bgcolor: 'white',
                                        '&:hover': { bgcolor: 'white' }
                                    }}
                                >
                                    <FavoriteBorderIcon />
                                </IconButton>

                                <CardMedia
                                    component="img"
                                    image={productImageUrl}
                                    alt={title}
                                    sx={{ 
                                        height: 200,
                                        p: 2,
                                        objectFit: 'contain'
                                    }}
                                />
                                
                                <CardContent sx={{ p: 2 }}>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        {title.split(' ')[0]}
                                    </Typography>
                                    <Typography variant="h6" gutterBottom>
                                        {title}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                        <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                                            {price}€
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                                            <StarIcon sx={{ color: '#FFD700', fontSize: 18 }} />
                                            <Typography variant="body2" color="text.secondary">
                                                5.0 (76 reviews)
                                            </Typography>
                                        </Box>
                                    </Box>

                                    {cartItem ? (
                                        <IconButton 
                                            onClick={(e) => { e.stopPropagation(); deleteCart(item); }}
                                            sx={{ 
                                                bgcolor: 'black',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'grey.800' }
                                            }}
                                        >
                                            <ShoppingCartIcon />
                                        </IconButton>
                                    ) : (
                                        <IconButton 
                                            onClick={(e) => { e.stopPropagation(); addCart(item); }}
                                            sx={{ 
                                                bgcolor: 'black',
                                                color: 'white',
                                                '&:hover': { bgcolor: 'grey.800' }
                                            }}
                                        >
                                            <ShoppingCartIcon />
                                        </IconButton>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
        </Layout>
    );
};

export default HomePageProductCard;
