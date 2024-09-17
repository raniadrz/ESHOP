import React, { useState, useEffect } from "react";
import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import SearchByTitle from "../../components/searchBar/SearchBar";
import Testimonial from "../../components/testimonial/Testimonial";
import AllTestimonialsDialog from "../../components/testimonial/AllTestimonialsDialog"; // Import the dialog
import { IconButton, Snackbar, SnackbarContent } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud"; // Cloud-like icon for popup trigger

const HomePage = () => {
    const [open, setOpen] = useState(false);
    const [popupVisible, setPopupVisible] = useState(true); // For the project message popup

    // Handle open/close for the testimonial dialog
    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    // Automatically hide the popup after 10 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setPopupVisible(false);
        }, 3000); // 3 seconds

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, []);

    return (
        <Layout>
            <HeroSection />
            <Category />
            <SearchByTitle />
            <HomePageProductCard />
            {/* Pass limit={3} to only show the last 3 testimonials */}
            <Testimonial limit={3} />

            {/* Icon button to trigger the popup */}
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
                <CloudIcon sx={{ fontSize: 32 }} />
            </IconButton>

            {/* All Testimonials Dialog */}
            <AllTestimonialsDialog open={open} onClose={handleClose} />

            {/* Customized Snackbar to display project message */}
            <Snackbar
                open={popupVisible}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
                onClose={() => setPopupVisible(false)} // Optional manual close on click
            >
                <SnackbarContent
                    sx={{
                        backgroundColor: "#1976d2", // Blue background color
                        color: "white", // White text color
                        fontSize: "1.25rem", // Larger font size
                        textAlign: "center",
                    }}
                    message="This is not a real store. This website is a project."
                />
            </Snackbar>
        </Layout>
    );
};

export default HomePage;
