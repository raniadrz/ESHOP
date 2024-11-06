import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../context/myContext";
import { 
    Typography, 
    Box, 
    Container,
    Rating,
    Button,
    Avatar,
    Paper
} from "@mui/material";
import LocationOnIcon from '@mui/icons-material/LocationOn';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import AllTestimonialsDialog from "./AllTestimonialsDialog";
import TestimonialForm from './TestimonialForm';
import { getAuth } from 'firebase/auth';

const Testimonial = ({ limit = 3 }) => {
    const { testimonials } = useContext(MyContext);
    const [randomTestimonials, setRandomTestimonials] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openTestimonialForm, setOpenTestimonialForm] = useState(false);
    const auth = getAuth();

    useEffect(() => {
        if (testimonials.length > 0) {
            const shuffled = [...testimonials].sort(() => Math.random() - 0.5);
            setRandomTestimonials(shuffled.slice(0, limit));
        }
    }, [testimonials, limit]);

    const handleOpenDialog = () => setOpenDialog(true);
    const handleCloseDialog = () => setOpenDialog(false);

    return (
        <Container maxWidth="lg" sx={{ py: 8 }}>
            {/* Header Section */}
            <Box sx={{ mb: 6, textAlign: 'center' }}>
                <Box sx={{ 
                    display: 'inline-block', 
                    bgcolor: '#e8ffd1', 
                    px: 2, 
                    py: 0.5, 
                    borderRadius: 1,
                    mb: 2
                }}>
                    <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                        WORLD-CLASS CUSTOMER SUPPORT
                    </Typography>
                </Box>
                <Typography variant="h6" color="text.secondary">
                    Don't just take our word for it. Our A-team gets tons of praise.
                </Typography>
            </Box>

            {/* Testimonials Grid */}
            <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
                gap: 3,
                mb: 6
            }}>
                {randomTestimonials.map((testimonial, index) => (
                    <Paper
                        key={index}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            bgcolor: 'background.paper',
                            border: '1px solid',
                            borderColor: 'divider'
                        }}
                    >
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {testimonial.comment}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar src={testimonial.avatar} />
                            <Box>
                                <Typography variant="subtitle2">
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
                                sx={{ ml: 'auto' }}
                            />
                        </Box>
                    </Paper>
                ))}
            </Box>

            {/* Stats Section */}
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 3
            }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">4.6★★★★★</Typography>
                    <Typography color="text.secondary">stars out of 5</Typography>
                </Box>
                <Box>
                    <Typography variant="h4" fontWeight="bold"> Fast</Typography>
                    <Typography color="text.secondary"> Response from Support Time</Typography>
                </Box>
                <Button
                    variant="outlined"
                    endIcon={<ArrowForwardIcon />}
                    onClick={handleOpenDialog}
                    sx={{ 
                        bgcolor: '#e8ffd1',
                        border: 'none',
                        borderRadius: 2,
                        px: 3,
                        '&:hover': {
                            bgcolor: '#d1ffb3',
                            border: 'none'
                        }
                    }}
                >
                    See {testimonials.length}+ reviews
                </Button>
            </Box>

            {/* Add Testimonial Button for logged-in users */}
            {auth.currentUser && (
                <Box sx={{ display: 'flex', justifyContent: 'right', mb: 4 }}>
                    <Button
                        onClick={() => setOpenTestimonialForm(true)}
                        sx={{ 
                            bgcolor: '#d1ffb3',
                            color: 'BLACK',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#9fe86f',
                                
                            }
                        }}
                    >
                        Add Your Testimonial
                    </Button>
                </Box>
            )}

            <TestimonialForm 
                open={openTestimonialForm}
                onClose={() => setOpenTestimonialForm(false)}
            />

            <AllTestimonialsDialog 
                open={openDialog}
                onClose={handleCloseDialog}
            />
        </Container>
    );
};

export default Testimonial;
