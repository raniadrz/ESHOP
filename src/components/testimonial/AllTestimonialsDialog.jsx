import React, { useContext } from "react";
import { Dialog, DialogTitle, DialogContent, Typography, Box, Avatar, IconButton } from "@mui/material";
import MyContext from "../../context/myContext";
import CloseIcon from "@mui/icons-material/Close";

// Import all avatar images
import Avatar1 from "./avatars/hamster.png"; // Adjust the paths to your actual avatars
import Avatar2 from "./avatars/cat.png";
import Avatar3 from "./avatars/dog.png";
import Avatar4 from "./avatars/rabbit.png";
import Avatar5 from "./avatars/lion.png";

// Create an array of all avatar images
const avatarArray = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];

const AllTestimonialsDialog = ({ open, onClose }) => {
    const { testimonials } = useContext(MyContext);

    // Function to select a random avatar for each testimonial
    const getRandomAvatar = () => {
        const randomIndex = Math.floor(Math.random() * avatarArray.length);
        return avatarArray[randomIndex];
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="md"
            PaperProps={{
                sx: {
                    backgroundColor: "#f0f8ff",
                    borderRadius: "50px",
                    padding: "20px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    border: "2px solid #2196f3",
                }
            }}
        >
            <DialogTitle>
                <Typography variant="h4" sx={{ textAlign: "center", color: "#1976d2" }}>All Testimonials</Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        position: 'absolute',
                        right: 8,
                        top: 8,
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={2}>
                    {testimonials.map((testimonial) => (
                        <Box key={testimonial.id} sx={{ textAlign: "center", mb: 2 }}>
                            <Avatar
                                alt="testimonial"
                                src={getRandomAvatar()} // Use the random avatar function
                                sx={{ width: 80, height: 80, mx: "auto", mb: 2 }}
                            />
                            <Typography variant="body1" color="textSecondary" gutterBottom>
                                {testimonial.comment}
                            </Typography>
                            <Box sx={{ height: 4, width: 40, backgroundColor: "#1976d2", mx: "auto", my: 2 }} />
                            <Typography variant="h6" fontWeight="medium">{testimonial.name}</Typography>
                            <Typography variant="body2" color="textSecondary">{testimonial.role || "Customer"}</Typography>
                        </Box>
                    ))}
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AllTestimonialsDialog;
