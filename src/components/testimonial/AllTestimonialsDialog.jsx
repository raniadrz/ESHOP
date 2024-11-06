import React, { useContext, useState } from "react";
import { 
    Dialog, 
    DialogContent, 
    Typography, 
    Box, 
    Avatar, 
    IconButton, 
    Rating, 
    Paper,
    Pagination
} from "@mui/material";
import MyContext from "../../context/myContext";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from '@mui/icons-material/LocationOn';

const AllTestimonialsDialog = ({ open, onClose }) => {
    const { testimonials } = useContext(MyContext);
    const [page, setPage] = useState(1);
    const testimonialsPerPage = 4;

    // Calculate pagination
    const totalPages = Math.ceil(testimonials.length / testimonialsPerPage);
    const startIndex = (page - 1) * testimonialsPerPage;
    const endIndex = startIndex + testimonialsPerPage;
    const currentTestimonials = testimonials.slice(startIndex, endIndex);

    const handlePageChange = (event, value) => {
        setPage(value);
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            fullWidth
            maxWidth="lg"
            PaperProps={{
                sx: {
                    backgroundColor: "#ffffff",
                    borderRadius: "24px",
                    padding: "32px",
                }
            }}
        >
            {/* Close Button */}
            <IconButton
                aria-label="close"
                onClick={onClose}
                sx={{
                    position: 'absolute',
                    right: 16,
                    top: 16,
                    color: 'text.secondary',
                }}
            >
                <CloseIcon />
            </IconButton>

            {/* Header */}
            <Box sx={{ mb: 4, textAlign: 'center' }}>
                <Box sx={{ 
                    display: 'inline-block', 
                    bgcolor: '#e8ffd1',
                    px: 2,
                    py: 0.5,
                    borderRadius: 1,
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'black' }}>
                        WORLD-CLASS CUSTOMER SUPPORT
                    </Typography>
                </Box>
                <Typography variant="h6" sx={{ color: 'text.primary' }}>
                    Don't just take our word for it. Our A-team gets tons of praise.
                </Typography>
            </Box>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: 3,
                    mb: 4
                }}>
                    {currentTestimonials.map((testimonial) => (
                        <Paper
                            key={testimonial.id}
                            elevation={1}
                            sx={{
                                p: 3,
                                borderRadius: 4,
                                bgcolor: 'background.paper',
                                display: 'flex',
                                flexDirection: 'column',
                                height: '100%',
                                border: '1px solid',
                                borderColor: 'divider',
                                transition: 'transform 0.2s ease-in-out',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 2
                                }
                            }}
                        >
                            {/* Testimonial Content */}
                            <Typography 
                                variant="body1" 
                                sx={{ 
                                    mb: 'auto',
                                    color: 'text.primary',
                                    fontSize: '0.95rem',
                                    lineHeight: 1.6
                                }}
                            >
                                {testimonial.comment}
                            </Typography>

                            {/* User Info */}
                            <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1.5,
                                mt: 3 
                            }}>
                                <Avatar
                                    src={testimonial.avatar}
                                    sx={{ width: 40, height: 40 }}
                                />
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="subtitle2" fontWeight="medium">
                                        {testimonial.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                        <LocationOnIcon sx={{ fontSize: 14, color: 'text.secondary' }} />
                                        <Typography variant="caption" color="text.secondary">
                                            {testimonial.location || 'GR'}
                                        </Typography>
                                    </Box>
                                </Box>
                                <Rating 
                                    value={5} 
                                    readOnly 
                                    size="small"
                                />
                            </Box>
                        </Paper>
                    ))}
                </Box>

                {/* Pagination */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'center',
                    mb: 4
                }}>
                    <Pagination 
                        count={totalPages} 
                        page={page} 
                        onChange={handlePageChange}
                        color="primary"
                        size="large"
                        sx={{
                            '& .MuiPaginationItem-root': {
                                fontSize: '1rem'
                            }
                        }}
                    />
                </Box>

                {/* Stats Section */}
                <Box sx={{ 
                    display: 'flex', 
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mt: 4,
                    px: 2,
                    borderTop: '1px solid',
                    borderColor: 'divider',
                    pt: 4
                }}>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">4.6★</Typography>
                        <Typography color="text.secondary">stars out of 5</Typography>
                    </Box>
                    <Box>
                        <Typography variant="h4" fontWeight="bold">3 minutes</Typography>
                        <Typography color="text.secondary">avg. response time</Typography>
                    </Box>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default AllTestimonialsDialog;
