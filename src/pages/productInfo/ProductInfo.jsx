import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { Icon } from "semantic-ui-react"; // Import Semantic UI components
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import Comments from "../../components/comments/Comments";
import './productInfo.css';

const ProductInfo = () => {
    const { loading, setLoading } = useContext(myContext);
    const [product, setProduct] = useState(null);
    const [userRating, setUserRating] = useState(0); // User's rating for this product
    const [averageRating, setAverageRating] = useState(0); // Average rating
    const { id } = useParams();
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const userId = "user-unique-id"; // Replace with the actual user's ID (from auth context or state)

    useEffect(() => {
        const fetchProductData = async () => {
            setLoading(true);
            try {
                const productDoc = await getDoc(doc(fireDB, "products", id));
                if (productDoc.exists()) {
                    const productData = productDoc.data();
                    setProduct({ ...productData, id: productDoc.id });

                    // Calculate average rating
                    const ratings = productData.ratings || {};
                    const userRating = ratings[userId] || 0;
                    setUserRating(userRating);

                    const totalRating = Object.values(ratings).reduce((acc, curr) => acc + curr, 0);
                    const average = totalRating / Object.keys(ratings).length;
                    setAverageRating(average || 0);
                } else {
                    toast.error("Product not found");
                }
            } catch (error) {
                console.error("Error fetching product:", error);
                toast.error("Failed to load product");
            } finally {
                setLoading(false);
            }
        };

        fetchProductData();
    }, [id, setLoading, userId]);

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const handleAddToCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const handleDeleteFromCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    };

    const handleRating = async (rating) => {
        if (!product) return;

        const newRatings = {
            ...product.ratings,
            [userId]: rating,
        };

        const newTotalRating = Object.values(newRatings).reduce((acc, curr) => acc + curr, 0);
        const newAverageRating = newTotalRating / Object.keys(newRatings).length;

        try {
            await updateDoc(doc(fireDB, "products", id), {
                ratings: newRatings,
            });

            setUserRating(rating);
            setAverageRating(newAverageRating);
            toast.success("Rating updated");
        } catch (error) {
            console.error("Error updating rating:", error);
            toast.error("Failed to update rating");
        }
    };

    return (
        <Layout>
            <section className="product-info-section">
                {loading ? (
                    <div className="loading-container">
                        <Loader />
                    </div>
                ) : (
                    product && (
                        <div className="product-info-container">
                            <div className="product-info-flex">
                                <div className="product-image-container">
                                    <img
                                        className="product-image"
                                        src={product?.productImageUrl}
                                        alt={product?.title}
                                    />
                                    {product?.productType === "New Product" && (
                                        <div className="badge new-product">
                                            <NewReleasesIcon className="badge-icon" />
                                            New Product!
                                        </div>
                                    )}
                                    {product?.productType === "Sales" && (
                                        <div className="badge sales">
                                            <LocalOfferIcon className="badge-icon" />
                                            Sales!
                                        </div>
                                    )}
                                </div>
                                <div className="product-details">
                                    <h2 className="product-title">{product?.title}</h2>
                                    <p className="product-code">Code: {product?.code}</p>
                                    <p className="product-description">{product?.description}</p>
                                    <p className="product-category">
                                        Race: {product?.category} | Category: {product?.subcategory}
                                    </p>
                                    <p className="product-price">Price: {product?.price}€</p>

                                    {/* Rating Section */}
                                    {/* <div className="product-rating">
                                        <p>Rating: {averageRating.toFixed(1)} / 5</p>
                                        <div className="rating-hearts">
                                            {[1, 2, 3, 4, 5].map((value) => (
                                                <Icon
                                                    key={value}
                                                    name="heart"
                                                    size="large"
                                                    color={userRating >= value ? "red" : "grey"}
                                                    onClick={() => handleRating(value)}
                                                    style={{ cursor: "pointer" }}
                                                />
                                            ))}
                                        </div>
                                    </div> */}

                                    <div className="cart-actions">
                                        {cartItems.some((p) => p.id === product.id) ? (
                                            <button
                                                onClick={() => handleDeleteFromCart(product)}
                                                className="cart-button delete"
                                            >
                                                Delete from cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleAddToCart(product)}
                                                className="cart-button add"
                                            >
                                                Add to cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                )}
                {product && <Comments productId={product.id} />}
            </section>
        </Layout>
    );
};

export default ProductInfo;
