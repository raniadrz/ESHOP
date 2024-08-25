import React, { useContext, useState } from "react";
import MyContext from "../../context/myContext";
import { CircularProgress, Typography, Box, Avatar, TextField, Button } from "@mui/material";
import DefaultAvatar from "./avatars/hamster.png"; // Adjust the path to match where you placed the image

const Testimonial = () => {
  const { testimonials, loading, addTestimonial } = useContext(MyContext);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await addTestimonial(name, comment);
    setName("");
    setComment("");
    setSubmitting(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ textAlign: "center", mb: 10 }}>
      <Typography variant="h3" fontWeight="bold" gutterBottom>Testimonial</Typography>
      <Typography variant="h5" color="textSecondary" gutterBottom>
        What our <span style={{ color: "#1976d2" }}>customers</span> are saying
      </Typography>

      {/* Testimonial Submission Form */}
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 5, mx: "auto", width: "50%" }}>
        <Typography variant="h6" gutterBottom>Add Your Testimonial</Typography>
        <TextField
          fullWidth
          label="Your Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Your Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          margin="normal"
          required
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          disabled={submitting || loading}
        >
          {submitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>

      <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
        {testimonials.map((testimonial) => (
          <Box key={testimonial.id} sx={{ width: { xs: "100%", sm: "30%" }, p: 2 }}>
            <Box sx={{ textAlign: "center" }}>
              <Avatar
                alt="testimonial"
                src={DefaultAvatar} // Use the imported image as the source
                sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
              />
              <Typography variant="body1" color="textSecondary" gutterBottom>
                {testimonial.comment}
              </Typography>
              <Box sx={{ height: 4, width: 40, backgroundColor: "#1976d2", mx: "auto", my: 2 }} />
              <Typography variant="h6" fontWeight="medium">{testimonial.name}</Typography>
              <Typography variant="body2" color="textSecondary">{testimonial.role || "Customer"}</Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Testimonial;
