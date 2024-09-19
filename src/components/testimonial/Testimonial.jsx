import React, { useContext, useState, useEffect } from "react";
import MyContext from "../../context/myContext";
import { CircularProgress, Typography, Box, Avatar, TextField, Button } from "@mui/material";

import './Testimonial.css'; // Assuming the CSS is in this file
// Import all avatar images
import Avatar1 from "./avatars/hamster.png"; // Adjust the paths to your actual avatars
import Avatar2 from "./avatars/cat.png";
import Avatar3 from "./avatars/dog.png";
import Avatar4 from "./avatars/rabbit.png";
import Avatar5 from "./avatars/lion.png";
const Testimonial = ({ limit = 3 }) => {
  const { testimonials, loading, addTestimonial } = useContext(MyContext);
  const [name, setName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [randomTestimonials, setRandomTestimonials] = useState([]);


// Create an array of all avatar images
const avatarArray = [Avatar1, Avatar2, Avatar3, Avatar4, Avatar5];
  // Function to shuffle the array
  const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
  };

    // Function to select a random avatar for each testimonial
    const getRandomAvatar = () => {
      const randomIndex = Math.floor(Math.random() * avatarArray.length);
      return avatarArray[randomIndex];
  };


  useEffect(() => {
    if (testimonials.length > 0) {
      // Shuffle the testimonials and slice to get `limit` number of random testimonials
      const shuffled = shuffleArray([...testimonials]);
      setRandomTestimonials(shuffled.slice(0, limit));
    }
  }, [testimonials, limit]);

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
<Box className="testimonial-background" sx={{ textAlign: "center", mb: 10 }}>
  <Typography className="handwritten-text" variant="h5" gutterBottom>
    What our <span style={{ color: "#1976d2" }}>customers</span> are saying
  </Typography>

  {/* Testimonial Submission Form */}
  <Box component="form" onSubmit={handleSubmit} className="testimonial-form">
    <Typography className="handwritten-text" variant="h6" gutterBottom>Add Your Testimonial</Typography>
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
      className="custom-button"
      type="submit"
      variant="contained"
      sx={{ mt: 2 }}
      disabled={submitting || loading}
    >
      {submitting ? "Submitting..." : "Submit"}
    </Button>
  </Box>

  {/* Display the random testimonials */}
  <Box display="flex" justifyContent="center" flexWrap="wrap" gap={2}>
    {randomTestimonials.map((testimonial) => (
      <Box key={testimonial.id} sx={{ width: { xs: "100%", sm: "30%" }, p: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Avatar
            alt="testimonial"
            src={getRandomAvatar()} // Use the imported image as the source
            sx={{ width: 80, height: 80, mb: 2, mx: "auto" }}
          />
          <Typography className="handwritten-text" variant="body1" gutterBottom>
            {testimonial.comment}
          </Typography>
          <Box sx={{ height: 4, width: 40, backgroundColor: "#1976d2", mx: "auto", my: 2 }} />
          <Typography className="handwritten-text" variant="h6" fontWeight="medium">{testimonial.name}</Typography>
          <Typography variant="body2" color="textSecondary">{testimonial.role || "Customer"}</Typography>
        </Box>
      </Box>
    ))}
  </Box>
</Box>

  );
};

export default Testimonial;
