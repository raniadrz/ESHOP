import React, { useContext, useEffect, useState } from "react";
import {
    Button, Card, CardContent, CardMedia, Grid, Typography, Container, Chip, CircularProgress, Box, IconButton, Pagination
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import StarIcon from '@mui/icons-material/Star';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteIcon from '@mui/icons-material/Delete';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import toast from "react-hot-toast";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { addToCart, deleteFromCart, incrementQuantity, decrementQuantity } from "../../redux/cartSlice";
import Category from "../../components/category/Category";
// import Filter from "../../components/filter/filter";

const CategoryPage = () => {
    const { categoryname } = useParams();
    const context = useContext(myContext);
    const { getAllProduct, loading } = context;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    const addCart = (item) => {
        const itemWithTime = { ...item, time: new Date().toISOString() };
        dispatch(addToCart(itemWithTime));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    };

    const increaseQuantity = (id) => {
        dispatch(incrementQuantity(id));
    };

    const decreaseQuantity = (id) => {
        dispatch(decrementQuantity(id));
    };

    useEffect(() => {
        localStorage.setItem("cart", JSON.stringify(cartItems));
    }, [cartItems]);

    const findCartItem = (id) => {
        return cartItems.find((item) => item.id === id);
    };

    // Calculate products to display for the current page
    const categoryProducts = getAllProduct.filter(product => product.category.includes(categoryname));
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = categoryProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(categoryProducts.length / productsPerPage);

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4 }}>
                <Category />

                <Box
                    sx={{
                        position: 'relative',
                        mb: 6,
                        mt: 4,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center'
                    }}
                >
                    <Typography 
                        variant="h3" 
                        sx={{ 
                            color: '#2c3e50',
                            fontWeight: '700',
                            textTransform: 'uppercase',
                            position: 'relative',
                            display: 'inline-block',
                            padding: '0 15px',
                            '&::before': {
                                content: '""',
                                position: 'absolute',
                                left: '-20px',
                                top: '50%',
                                width: '40px',
                                height: '2px',
                                background: '#ff9800',
                                transform: 'translateY(-50%)'
                            },
                            '&::after': {
                                content: '""',
                                position: 'absolute',
                                right: '-20px',
                                top: '50%',
                                width: '40px',
                                height: '2px',
                                background: '#ff9800',
                                transform: 'translateY(-50%)'
                            }
                        }}
                    >
                        {categoryname}
                    </Typography>
                    <Typography 
                        variant="subtitle1" 
                        sx={{ 
                            color: '#7f8c8d',
                            mt: 1,
                            fontStyle: 'italic'
                        }}
                    >
                        Explore our {categoryname.toLowerCase()} collection
                    </Typography>
                    <Box
                        sx={{
                            width: '60px',
                            height: '3px',
                            background: '#ff9800',
                            margin: '15px auto',
                            borderRadius: '2px'
                        }}
                    />
                </Box>

                {loading && <CircularProgress />}
                <Grid 
                    container 
                    spacing={4} 
                    justifyContent="center"
                    sx={{ 
                        padding: '20px',
                        borderRadius: '15px',
                        mt: 4
                    }}
                >
                    {currentProducts.map((item, index) => {
                        const { id, title, price, productImageUrl, productType, category, category2, subcategory } = item;
                        const cartItem = findCartItem(id);

                        return (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: '100%',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        position: 'relative',
                                        transition: 'transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out',
                                        borderRadius: '15px',
                                        overflow: 'hidden',
                                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                                        '&:hover': {
                                            transform: 'translateY(-5px)',
                                            boxShadow: '0 12px 20px rgba(0,0,0,0.15)',
                                        }
                                    }}
                                    onClick={() => navigate(`/productinfo/${id}`)}
                                >
                                    {/* Product Type Badge */}
                                    {productType && (
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                zIndex: 1
                                            }}
                                        >
                                            {productType === "New Product" && (
                                                <Chip
                                                    label="New"
                                                    color="success"
                                                    icon={<StarIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #2ecc71, #27ae60)',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            )}
                                            {productType === "Sales" && (
                                                <Chip
                                                    label="Sale"
                                                    color="error"
                                                    icon={<LocalOfferIcon />}
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #e74c3c, #c0392b)',
                                                        color: 'white',
                                                        fontWeight: 'bold'
                                                    }}
                                                />
                                            )}
                                        </Box>
                                    )}

                                    {/* Image Container */}
                                    <Box
                                        sx={{
                                            position: 'relative',
                                            paddingTop: '75%', // 4:3 Aspect Ratio
                                            background: '#f8f9fa',
                                            overflow: 'hidden'
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={productImageUrl}
                                            alt={title}
                                            sx={{
                                                position: 'absolute',
                                                top: 0,
                                                left: 0,
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'contain',
                                                padding: '10px',
                                                transition: 'transform 0.3s ease-in-out',
                                                '&:hover': {
                                                    transform: 'scale(1.05)'
                                                }
                                            }}
                                        />
                                    </Box>

                                    {/* Content */}
                                    <CardContent 
                                        sx={{
                                            flexGrow: 1,
                                            display: 'flex',
                                            flexDirection: 'column',
                                            gap: 1,
                                            padding: '16px'
                                        }}
                                    >
                                        <Typography 
                                            variant="h6" 
                                            sx={{
                                                fontSize: '1.1rem',
                                                fontWeight: '600',
                                                color: '#2c3e50',
                                                mb: 1,
                                                height: '2.4em',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                display: '-webkit-box',
                                                WebkitLineClamp: 2,
                                                WebkitBoxOrient: 'vertical'
                                            }}
                                        >
                                            {title}
                                        </Typography>

                                        <Typography 
                                            variant="body2" 
                                            sx={{
                                                color: '#7f8c8d',
                                                fontSize: '0.875rem',
                                                mb: 1
                                            }}
                                        >
                                            {category}, {category2}, {subcategory}
                                        </Typography>

                                        <Typography 
                                            variant="h6" 
                                            sx={{
                                                color: '#e67e22',
                                                fontWeight: 'bold',
                                                fontSize: '1.25rem',
                                                mb: 2
                                            }}
                                        >
                                            {price}€
                                        </Typography>

                                        {/* Cart Controls */}
                                        <Box sx={{ mt: 'auto', p: 2 }}>
                                            {cartItem ? (
                                                <Box
                                                    sx={{
                                                        display: 'flex',
                                                        flexDirection: 'column',
                                                        gap: 1
                                                    }}
                                                >
                                                    <Box
                                                        sx={{
                                                            display: 'flex',
                                                            justifyContent: 'center',
                                                            alignItems: 'center',
                                                            gap: 1,
                                                            background: '#f8f9fa',
                                                            borderRadius: '8px',
                                                            padding: '4px'
                                                        }}
                                                    >
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                decreaseQuantity(id);
                                                            }}
                                                            size="small"
                                                            disabled={cartItem.quantity <= 1}
                                                            sx={{
                                                                color: '#e67e22',
                                                                '&:hover': {
                                                                    background: '#fff3e0'
                                                                }
                                                            }}
                                                        >
                                                            <RemoveIcon />
                                                        </IconButton>
                                                        <Typography
                                                            variant="body1"
                                                            sx={{
                                                                fontWeight: 'bold',
                                                                color: '#2c3e50'
                                                            }}
                                                        >
                                                            {cartItem.quantity}
                                                        </Typography>
                                                        <IconButton
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                increaseQuantity(id);
                                                            }}
                                                            size="small"
                                                            sx={{
                                                                color: '#e67e22',
                                                                '&:hover': {
                                                                    background: '#fff3e0'
                                                                }
                                                            }}
                                                        >
                                                            <AddIcon />
                                                        </IconButton>
                                                    </Box>
                                                    <Button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteCart(item);
                                                        }}
                                                        variant="outlined"
                                                        color="error"
                                                        startIcon={<DeleteIcon />}
                                                        fullWidth
                                                        sx={{
                                                            borderRadius: '8px',
                                                            textTransform: 'none',
                                                            fontWeight: '600'
                                                        }}
                                                    >
                                                        Remove
                                                    </Button>
                                                </Box>
                                            ) : (
                                                <Button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        addCart(item);
                                                    }}
                                                    variant="contained"
                                                    startIcon={<ShoppingCartIcon />}
                                                    fullWidth
                                                    sx={{
                                                        background: 'linear-gradient(45deg, #e67e22, #f39c12)',
                                                        borderRadius: '8px',
                                                        textTransform: 'none',
                                                        fontWeight: '600',
                                                        '&:hover': {
                                                            background: 'linear-gradient(45deg, #d35400, #e67e22)'
                                                        }
                                                    }}
                                                >
                                                    Add to Cart
                                                </Button>
                                            )}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                        );
                    })}
                </Grid>

                <Box display="flex" justifyContent="center" alignItems="center" mt={4}>
                    <Pagination
                        count={totalPages}
                        page={currentPage}
                        onChange={handlePageChange}
                        siblingCount={1}
                        boundaryCount={1}
                        sx={{ ml: 2 }}
                    />
                </Box>
            </Container>
        </Layout>
    );
};

export default CategoryPage;
