import React, { useContext, useEffect } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import myContext from "../../context/myContext";
import { addToCart } from "../../redux/cartSlice";
import Loader from "../loader/Loader";
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';

const HomePageProductCard = () => {
    const navigate = useNavigate();

    const context = useContext(myContext);
    const { loading, getAllProduct } = context;

    const cartItems = useSelector((state) => state.cart);

    const dispatch = useDispatch();

    const addCart = (item) => {
        const itemWithTime = { ...item, time: new Date().toISOString() }; // Add current time as ISO string
        dispatch(addToCart(itemWithTime));
        toast.success("Added to cart");
    };

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    return (
        <div className="mt-10">
            <div className="">
                <h1 className=" text-center mb-5 text-2xl font-semibold">Bestselling Products</h1>
            </div>
            <section className="text-gray-600 body-font">
                <div className="container px-5 py-5 mx-auto">
                    <div className="flex justify-center">
                        {loading && <Loader />}
                    </div>
                    <div className="flex flex-wrap -m-4">
                        {getAllProduct.slice(0, 12).map((item, index) => {
                            const { id, title, price, productImageUrl, productType } = item;
                            return (
                                <div key={index} className="p-4 w-1/2 md:w-1/6">
                                    <div className="relative h-2/2 border border-blue-100 rounded-xl overflow-hidden shadow-md cursor-pointer">
                                        
                                        {/* Conditionally render product type icons */}
                                        {productType === "New Product" && (
                                            <div className="absolute top-2 left-2">
                                                <NewReleasesIcon style={{ color: 'green' }} />
                                            </div>
                                        )}
                                        {productType === "Sales" && (
                                            <div className="absolute top-2 right-2">
                                                <LocalOfferIcon style={{ color: 'red' }} />
                                            </div>
                                        )}

                                        <img
                                            onClick={() => navigate(`/productinfo/${id}`)}
                                            className="w-48 h-48 object-cover mx-auto"
                                            src={productImageUrl}
                                            alt="product"
                                        />
                                        <div className="p-6">
                                            <h2 className="tracking-widest text-xs title-font font-medium text-gray-400 mb-1">
                                                E-ctb
                                            </h2>
                                            <h1 className="title-font text-sm font-small text-gray-900 mb-3">
                                                {title}
                                            </h1>
                                            <h1 className="title-font text-lg font-medium text-gray-900 mb-3">
                                                {price}€
                                            </h1>
                                            <div>
                                                <button
                                                    onClick={() => addCart(item)}
                                                    className="bg-blue-500 hover:bg-blue-600 w-full text-white py-[4px] rounded-lg font-bold">
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>
        </div>
    );
}

export default HomePageProductCard;
