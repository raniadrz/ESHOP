import React, { useState, useContext } from 'react';
import { 
    Dialog, 
    DialogTitle, 
    DialogContent, 
    DialogActions, 
    Button, 
    TextField, 
    Box, 
    Typography 
} from '@mui/material';
import MyContext from '../../context/myContext';
import { getAuth } from 'firebase/auth';
import toast, { Toaster } from 'react-hot-toast';
import CustomToast from '../../components/CustomToast/CustomToast';

const TestimonialForm = ({ open, onClose }) => {
    const { addTestimonial, loading } = useContext(MyContext);
    const [comment, setComment] = useState('');
    const auth = getAuth();
    const user = auth.currentUser;

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) {
            toast.custom((t) => (
                <CustomToast 
                    t={t}
                    message="Please enter your testimonial"
                    type="error"
                />
            ));
            return;
        }

        try {
            await addTestimonial(user?.displayName, comment);
            toast.custom((t) => (
                <CustomToast 
                    t={t}
                    message="Testimonial added successfully!"
                    type="success"
                />
            ));
            setComment('');
            onClose();
        } catch (error) {
            toast.custom((t) => (
                <CustomToast 
                    t={t}
                    message="Failed to add testimonial"
                    type="error"
                />
            ));
        }
    };

    const handleClose = () => {
        setComment('');
        onClose();
    };

    return (
        <>
            <Toaster position="bottom-center" />
            <Dialog 
                open={open} 
                onClose={handleClose}
                maxWidth="sm"
                fullWidth
                PaperProps={{
                    sx: {
                        borderRadius: '16px',
                        padding: '16px'
                    }
                }}
            >
                <DialogTitle>
                    <Box sx={{ textAlign: 'center', mb: 2 }}>
                        <Box sx={{ 
                            display: 'inline-block', 
                            bgcolor: '#e8ffd1',
                            px: 2,
                            py: 0.5,
                            borderRadius: 1,
                            mb: 1
                        }}>
                            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                SHARE YOUR EXPERIENCE
                            </Typography>
                        </Box>
                        <Typography variant="body1" color="text.secondary">
                            Tell us about your experience with our service
                        </Typography>
                    </Box>
                </DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            autoFocus
                            multiline
                            rows={4}
                            fullWidth
                            variant="outlined"
                            placeholder="Write your testimonial here..."
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            sx={{ 
                                mt: 2,
                                '& .MuiOutlinedInput-root': {
                                    borderRadius: '12px',
                                }
                            }}
                        />
                    </form>
                </DialogContent>
                <DialogActions sx={{ px: 3, pb: 3 }}>
                    <Button 
                        onClick={handleClose}
                        sx={{ 
                            color: 'text.secondary',
                            borderRadius: '8px',
                            px: 3
                        }}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        disabled={loading || !comment.trim()}
                        sx={{ 
                            bgcolor: '#e8ffd1',
                            color: 'text.primary',
                            borderRadius: '8px',
                            px: 3,
                            '&:hover': {
                                bgcolor: '#d1ffb3',
                            },
                            '&:disabled': {
                                bgcolor: '#f5f5f5',
                            }
                        }}
                    >
                        {loading ? 'Submitting...' : 'Submit Testimonial'}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default TestimonialForm;