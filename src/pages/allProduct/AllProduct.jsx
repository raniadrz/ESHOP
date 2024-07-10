import { useContext, useEffect } from "react";
import {
  Button,
  CircularProgress,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Box,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import Category from "../../components/category/Category";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import { addToCart } from "../../redux/cartSlice";
import toast from "react-hot-toast";

const AllProduct = () => {
  const navigate = useNavigate();

  const context = useContext(myContext);
  const { loading, getAllProduct } = context;

  const cartItems = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const addCart = (item) => {
    dispatch(addToCart(item));
    toast.success("Added to cart");
  };

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <Layout>
      <Category />
      <Container>
        <Box my={4}>
          <Typography variant="h4" align="center" gutterBottom>
            All Products
          </Typography>
          {loading && (
            <Box display="flex" justifyContent="center" my={2}>
              <CircularProgress />
            </Box>
          )}
          <Grid container spacing={3}>
            {getAllProduct.map((item) => {
              const { id, title, price, productImageUrl } = item;
              return (
                <Grid item key={id} xs={12} sm={6} md={4}>
                  <Card
                    onClick={() => navigate(`/productinfo/${id}`)}
                    sx={{ cursor: 'pointer', '&:hover': { boxShadow: 6 } }}
                  >
                    <CardMedia
                      component="img"
                      sx={{ width: '100%', height: 0, paddingTop: '100%' }} // Aspect ratio 1:1 for square
                      image={productImageUrl}
                      alt={title}
                    />
                    <CardContent sx={{ paddingBottom: 1 }}>
                      <Typography variant="subtitle2" color="textSecondary" gutterBottom>
                        E-ctb
                      </Typography>
                      <Typography variant="h6" component="h2">
                        {title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {price}€
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ paddingTop: 0 }}>
                      <Button
                        size="small"
                        color="primary"
                        onClick={(e) => {
                          e.stopPropagation();
                          addCart(item);
                        }}
                      >
                        Add To Cart
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      </Container>
    </Layout>
  );
};

export default AllProduct;
