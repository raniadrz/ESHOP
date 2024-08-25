import React, { useContext, useEffect } from "react";
import { Button, Card, CardContent, CardMedia, Grid, Typography, Container, Chip, CircularProgress, Box } from "@mui/material";
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import myContext from "../../context/myContext";
import { addToCart } from "../../redux/cartSlice";

const HomePageProductCard = () => {
    const navigate = useNavigate();

    const context = useContext(myContext);
    const { loading, getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item) => {
        const itemWithTime = { ...item, time: new Date().toISOString() };
        dispatch(addToCart(itemWithTime));
        toast.success("Added to cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <Container maxWidth="lg" sx={{ textAlign: 'center', mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Bestselling Products
            </Typography>
            {loading && <CircularProgress />}
            <Grid container spacing={4} justifyContent="center">
                {getAllProduct.slice(0, 12).map((item, index) => {
                    const { id, title, price, productImageUrl, productType } = item;
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
                                    <Button
                                        onClick={(e) => { e.stopPropagation(); addCart(item); }}
                                        variant="contained"
                                        fullWidth
                                    >
                                        Add To Cart
                                    </Button>
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
