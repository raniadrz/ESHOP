import { doc, getDoc } from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Layout from "../../components/layout/Layout";
import Loader from "../../components/loader/Loader";
import myContext from "../../context/myContext";
import { fireDB } from "../../firebase/FirebaseConfig";
import { addToCart, deleteFromCart } from "../../redux/cartSlice";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const ProductInfo = () => {
    const context = useContext(myContext);
    const { loading, setLoading } = context;

    const [product, setProduct] = useState('');

    const { id } = useParams();

    const getProductData = async () => {
        setLoading(true);
        try {
            const productTemp = await getDoc(doc(fireDB, "products", id));
            setProduct({ ...productTemp.data(), id: productTemp.id });
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();

    const addCart = (item) => {
        dispatch(addToCart(item));
        toast.success("Added to cart");
    };

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        getProductData();
    }, []);

    return (
        <Layout>
            <section className="py-5 lg:py-16 font-poppins dark:bg-gray-800">
                {loading ? (
                    <div className="flex justify-center items-center">
                        <Loader />
                    </div>
                ) : (
                    <div className="max-w-6xl px-4 mx-auto">
                        <div className="flex flex-wrap mb-24 -mx-4">
                            <div className="relative w-full px-4 mb-8 md:w-1/2 md:mb-0">
                                <div className="relative">
                                    <img
                                        className="w-full lg:h-[39em] rounded-lg"
                                        src={product?.productImageUrl}
                                        alt={product?.title}
                                    />
                                    
                                    {/* Conditionally render the badge */}
                                    {product?.productType === "New Product" && (
                                        <div className="absolute top-3.5 left-4 bg-green-500 text-white p-2 rounded-lg shadow-lg text-lg font-bold flex items-center">
                                            <NewReleasesIcon className="mr-2" />
                                            New Product!
                                        </div>
                                    )}
                                    {product?.productType === "Sales" && (
                                        <div className="absolute top-3.5 left-4 bg-red-500 text-white p-2 rounded-lg shadow-lg text-lg font-bold flex items-center">
                                            <LocalOfferIcon className="mr-2" />
                                            Sales!
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="w-full px-4 md:w-1/2">
                                <div className="lg:pl-20">
                                    <div className="mb-6">
                                        <h2 className="max-w-xl mb-6 text-xl font-semibold leading-loose tracking-wide text-gray-700 md:text-2xl dark:text-gray-300">
                                            {product?.title}
                                        </h2>
                                        <div className="mb-6">
                                            <h2 className="mb-2 text-lg text-gray-700 dark:text-gray-400">
                                                Code: {product?.code}
                                            </h2>
                                        </div>
                                    </div>
                                    <div className="mb-6">
                                        <p>{product?.description}</p>
                                    </div>
                                    <div className="mb-6">
                                        <h6 className="mb-2 text-gray-700 dark:text-gray-400">
                                            Race: {product?.category} | Category: {product?.subcategory}
                                        </h6>
                                    </div>
                                    <p className="inline-block text-2xl font-semibold text-gray-700 dark:text-gray-400">
                                        Price: {product?.price}€
                                    </p>
                                    <div className="flex flex-wrap items-center mb-6">
                                        {cartItems.some((p) => p.id === product.id) ? (
                                            <button
                                                onClick={() => deleteCart(product)}
                                                className="w-full px-4 py-3 text-center text-white bg-blue-500 border border-blue-600 hover:bg-blue-600 hover:text-gray-100 rounded-xl"
                                            >
                                                Delete from cart
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => addCart(product)}
                                                className="w-full px-4 py-3 text-center text-blue-600 bg-blue-100 border border-blue-600 hover:bg-blue-600 hover:text-gray-100 rounded-xl"
                                            >
                                                Add to cart
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </section>
        </Layout>
    );
};

export default ProductInfo;
