import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import {
  IconButton,
  Snackbar,
  SnackbarContent,
  Dialog,
  DialogContent,
  Box,
} from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import CloseIcon from "@mui/icons-material/Close"; // Import CloseIcon for the close button
import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import SearchByTitle from "../../components/searchBar/SearchBar";
import Testimonial from "../../components/testimonial/Testimonial";
import AllTestimonialsDialog from "../../components/testimonial/AllTestimonialsDialog";
import CartPage from "../../pages/cart/CartPage"; // Import the CartPage
import "./HomePage.css";

const HomePage = () => {
  const [open, setOpen] = useState(false); // For testimonials dialog
  const [popupVisible, setPopupVisible] = useState(true); // For the project message popup
  const [cartOpen, setCartOpen] = useState(false); // For the cart dialog
  const navigate = useNavigate(); // To navigate to CartPage

  // Handle open/close for the testimonial dialog
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Handle open/close for the cart dialog
  const handleCartOpen = () => {
    setCartOpen(true);
  };

  const handleCartClose = () => {
    setCartOpen(false);
  };

  // Automatically hide the popup after 3 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setPopupVisible(false);
    }, 3000);

    // Cleanup the timer when the component unmounts
    return () => clearTimeout(timer);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <HeroSection />

      {/* Categories Section */}
      <Category />

      {/* Search Bar */}
      <SearchByTitle />

      {/* Home Page Product Cards */}
      <HomePageProductCard />

      {/* Testimonial Section */}
      <Testimonial limit={3} />

      
      {/* Cloud Icon Button to trigger the testimonials dialog */}
      <IconButton
        aria-label="show-all-testimonials"
        onClick={handleClickOpen}
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          backgroundColor: "#1976d2",
          color: "white",
          borderRadius: "50%",
          padding: 2,
        }}
      >
        <CloudIcon sx={{ fontSize: "21.33px" }} /> {/* Reduced size to 2/3 of the original */}
      </IconButton>

      {/* All Testimonials Dialog */}
      <AllTestimonialsDialog open={open} onClose={handleClose} />

      {/* Cart Icon Button */}
      <IconButton
        aria-label="open-cart"
        onClick={handleCartOpen}
        sx={{
          position: "fixed",
          bottom: 80,
          right: 16,
          backgroundColor: "#ff9800",
          color: "white",
          borderRadius: "50%",
          padding: 2,
        }}
      >
        <ShoppingCartIcon sx={{ fontSize: 32 }} />
      </IconButton>

      {/* Cart Dialog */}
      <Dialog
        open={cartOpen}
        onClose={handleCartClose}
        fullScreen // This makes the dialog full screen
        PaperProps={{
          sx: {
            backgroundColor: "#f7f7f7", // Custom background color (optional)
            padding: 2, // Add some padding to the content
          },
        }}
      >
        <DialogContent>
          {/* Close Button */}
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              aria-label="close"
              onClick={handleCartClose}
              sx={{
                backgroundColor: "transparent", // Default background
                "&:hover": {
                  backgroundColor: "red", // Red background on hover
                },
                color: "black", // Default icon color
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Import the CartPage component and display cart items inside the dialog */}
          <CartPage />
        </DialogContent>
      </Dialog>




      {/* Snackbar to display project message */}
      <Snackbar
        open={popupVisible}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        onClose={() => setPopupVisible(false)}
      >
        <SnackbarContent
          sx={{
            backgroundColor: "#1976d2",
            color: "white",
            fontSize: "1.25rem",
            textAlign: "center",
          }}
          message="This is not a real store."
        />
      </Snackbar>
    </Layout>
  );
};

export default HomePage;
