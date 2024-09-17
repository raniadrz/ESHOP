import React, { useState } from "react";
import Category from "../../components/category/Category";
import HeroSection from "../../components/heroSection/HeroSection";
import HomePageProductCard from "../../components/homePageProductCard/HomePageProductCard";
import Layout from "../../components/layout/Layout";
import SearchByTitle from "../../components/searchBar/SearchBar";
import Testimonial from "../../components/testimonial/Testimonial";
import AllTestimonialsDialog from "../../components/testimonial/AllTestimonialsDialog"; // Import the dialog
import { IconButton } from "@mui/material";
import CloudIcon from "@mui/icons-material/Cloud"; // Cloud-like icon for popup trigger

const HomePage = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

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
                sx={{ position: "fixed", bottom: 16, right: 16, backgroundColor: "#1976d2", color: "white", borderRadius: "50%", padding: 2 }}
            >
                <CloudIcon sx={{ fontSize: 32 }} />
            </IconButton>

            {/* All Testimonials Dialog */}
            <AllTestimonialsDialog open={open} onClose={handleClose} />
        </Layout>
    );
};

export default HomePage;
