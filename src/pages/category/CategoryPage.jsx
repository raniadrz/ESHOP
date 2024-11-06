import React, { useContext, useEffect, useState } from "react";
import {
    Button, Card, CardContent, CardMedia, Grid, Typography, Container, Chip, CircularProgress, Box, IconButton, Dialog, DialogContent, DialogTitle, Slider, TextField, MenuItem, Pagination
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router";
import FilterListIcon from '@mui/icons-material/FilterList';
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

// Create Hero Section Component
const CategoryPage = () => {
    const { categoryname } = useParams();
    const context = useContext(myContext);
    const { getAllProduct, loading } = context;

    const navigate = useNavigate();
    const dispatch = useDispatch();
    const cartItems = useSelector((state) => state.cart);

    // Filter state
    const [priceRange, setPriceRange] = useState([0, 1000]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedCategory2, setSelectedCategory2] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [availableCategories, setAvailableCategories] = useState([]);
    const [availableCategory2, setAvailableCategory2] = useState([]);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false); // State to manage filter popup visibility

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 12;

    useEffect(() => {
        // Populate filter options based on the available products
        const categories = Array.from(new Set(getAllProduct.map(product => product.category)));
        const categories2 = Array.from(new Set(getAllProduct.map(product => product.category2)));
        const subcategories = Array.from(new Set(getAllProduct.map(product => product.subcategory)));

        setAvailableCategories(categories);
        setAvailableCategory2(categories2);
        setAvailableSubcategories(subcategories);
    }, [getAllProduct]);

    // Filter products based on selected filters
    useEffect(() => {
        const filtered = getAllProduct.filter((product) => {
            return (
                product.category.includes(categoryname) &&
                product.price >= priceRange[0] &&
                product.price <= priceRange[1] &&
                (!selectedCategory || product.category === selectedCategory) &&
                (!selectedCategory2 || product.category2 === selectedCategory2) &&
                (!selectedSubcategory || product.subcategory === selectedSubcategory)
            );
        });
        setFilteredProducts(filtered);
        setCurrentPage(1);  // Reset to first page after applying a new filter
    }, [getAllProduct, categoryname, priceRange, selectedCategory, selectedCategory2, selectedSubcategory]);

    const [filteredProducts, setFilteredProducts] = useState([]);

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

    // Helper function to find if an item is in the cart and return its quantity
    const findCartItem = (id) => {
        return cartItems.find((item) => item.id === id);
    };

    const handleFilterOpen = () => {
        setIsFilterOpen(true); // Open filter modal
    };

    const handleFilterClose = () => {
        setIsFilterOpen(false); // Close filter modal
    };

    // Handle changes in the price range slider
    const handlePriceChange = (event, newValue) => {
        setPriceRange(newValue);
    };

    // Calculate products to display for the current page
    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Handle pagination
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handlePageChange = (event, page) => {
        setCurrentPage(page);
    };

    const handleDirectPageInput = (event) => {
        const pageNumber = parseInt(event.target.value, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    return (
        <Layout>
            <Container maxWidth="lg" sx={{ textAlign: "center", mt: 4 }}>
               
                {/* Categories Section */}
                <Category />

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
                    {categoryname} Products
                </Typography>

                {/* Cloud-style Filter Button */}
                <Button
                    onClick={handleFilterOpen}
                    sx={{
                        backgroundColor: '#f0f8ff',
                        borderRadius: '50px',
                        padding: '10px 30px',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        '&:hover': {
                            backgroundColor: '#e6f0ff',
                        },
                        display: 'flex',
                        alignItems: 'center',
                        mb: 4
                    }}
                >
                    <FilterListIcon sx={{ mr: 1 }} />
                    <Typography variant="button" sx={{ fontWeight: 'bold' }}>
                        Open Filters
                    </Typography>
                </Button>

                {/* Filter Dialog (Popup) */}
                <Dialog open={isFilterOpen} onClose={handleFilterClose} maxWidth="sm" fullWidth>
                    <DialogTitle>Filter</DialogTitle>
                    <DialogContent>
                        <Box display="flex" flexDirection="column" gap={2} mb={4}>
                            {/* Price Range */}
                            <Box>
                                <Typography variant="h6">Price Range: {`${priceRange[0]}€ - ${priceRange[1]}€`}</Typography>
                                <Slider
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={1000}
                                    sx={{ width: '100%' }}
                                />
                            </Box>

                            {/* Category2 */}
                            <Box>
                                <Typography variant="h6">Category </Typography>
                                <TextField
                                    select
                                    label="Select Category 2"
                                    value={selectedCategory2}
                                    onChange={(e) => setSelectedCategory2(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {availableCategory2.map((category2) => (
                                        <MenuItem key={category2} value={category2}>
                                            {category2}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>

                            {/* Subcategory */}
                            <Box>
                                <Typography variant="h6">Sub Category</Typography>
                                <TextField
                                    select
                                    label="Select Subcategory"
                                    value={selectedSubcategory}
                                    onChange={(e) => setSelectedSubcategory(e.target.value)}
                                    fullWidth
                                >
                                    <MenuItem value="">All</MenuItem>
                                    {availableSubcategories.map((subcategory) => (
                                        <MenuItem key={subcategory} value={subcategory}>
                                            {subcategory}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            </Box>
                        </Box>

                        {/* Close and Apply Buttons */}
                        <Box display="flex" justifyContent="space-between" mt={2}>
                            <Button onClick={handleFilterClose} variant="outlined">
                                Close
                            </Button>
                            <Button onClick={handleFilterClose} variant="contained" color="primary">
                                Apply Filters
                            </Button>
                        </Box>
                    </DialogContent>
                </Dialog>

                {loading && <CircularProgress />}

                <Grid 
                    container 
                    spacing={4} 
                    justifyContent="center"
                    sx={{ 
                        background: 'linear-gradient(to bottom, #ffffff, #1976d2, #ffffff)', // Blue and white mix
                        padding: '20px', // Add padding inside the grid
                        borderRadius: '10px', // Adds a slight border-radius to the grid background
                        mt: 4  // Adds margin-top to separate the grid from the title
                    }}
                >
                    {currentProducts.map((item, index) => {
                        const { id, title, price, productImageUrl, productType, category, category2, subcategory } = item;
                        const cartItem = findCartItem(id);

                        return (
                            <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                                <Card
                                    sx={{
                                        height: "100%",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                    }}
                                    onClick={() => navigate(`/productinfo/${id}`)}
                                >
                                    <Box
                                        sx={{
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            height: 200,
                                        }}
                                    >
                                        <CardMedia
                                            component="img"
                                            image={productImageUrl}
                                            alt="product"
                                            sx={{
                                                width: "auto",
                                                maxHeight: "100%",
                                                maxWidth: "100%",
                                                objectFit: "contain",
                                            }}
                                        />
                                    </Box>
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography variant="h6" component="div">
                                            {title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {category}, {category2}, {subcategory}
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
                                            <Box
                                                display="flex"
                                                flexDirection="column"
                                                justifyContent="center"
                                                alignItems="center"
                                                gap={1}
                                            >
                                                <Box
                                                    display="flex"
                                                    justifyContent="space-between"
                                                    alignItems="center"
                                                >
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            decreaseQuantity(id);
                                                        }}
                                                        size="small"
                                                        disabled={cartItem.quantity <= 1}
                                                    >
                                                        <RemoveIcon />
                                                    </IconButton>
                                                    <Typography
                                                        variant="body1"
                                                        sx={{ mx: 2 }}
                                                    >
                                                        {cartItem.quantity}
                                                    </Typography>
                                                    <IconButton
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            increaseQuantity(id);
                                                        }}
                                                        size="small"
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
                                                >
                                                    Delete From Cart
                                                </Button>
                                            </Box>
                                        ) : (
                                            <Button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    addCart(item);
                                                }}
                                                variant="outlined"
                                                color="primary"
                                                startIcon={<ShoppingCartIcon />}
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

                {/* Jump to Specific Page */}
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
