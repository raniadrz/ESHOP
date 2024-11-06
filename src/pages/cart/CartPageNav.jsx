import emailjs from 'emailjs-com';
import { getAuth } from 'firebase/auth';
import { Timestamp, addDoc, collection } from "firebase/firestore";
import { Trash } from 'lucide-react';
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from 'react-router-dom';
import BuyNowModal from "../../components/buyNowModal/BuyNowModal";
import Layout from "../../components/layout/Layout";
import { fireDB } from '../../firebase/FirebaseConfig';
import {
    decrementQuantity,
    deleteFromCart,
    incrementQuantity,
    orderSuccessful,
} from "../../redux/cartSlice";

const CartPage = () => {
    const cartItems = useSelector((state) => state.cart);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteCart = (item) => {
        dispatch(deleteFromCart(item));
        toast.success("Deleted from cart");
    };

    const handleIncrement = (id) => {
        dispatch(incrementQuantity(id));
    };

    const handleDecrement = (id) => {
        dispatch(decrementQuantity(id));
    };

    const cartItemTotal = cartItems.reduce((total, item) => total + item.quantity, 0);

    const cartTotal = cartItems.reduce((total, item) => {
        const price = parseFloat(item.price);
        if (isNaN(price)) {
            console.error(`Invalid price for item ${item.title}: ${item.price}`);
            return total;
        }
        return total + price * item.quantity;
    }, 0).toFixed(2);
    
    const shippingCost = cartTotal >= 50 ? 0 : 4;
    const totalAmount = (Math.round((parseFloat(cartTotal) + shippingCost) * 100) / 100).toFixed(2);
    
    console.log(`Cart Total: ${cartTotal}€`);
    console.log(`Shipping Cost: ${shippingCost}€`);
    console.log(`Total Amount: ${totalAmount}€`);
    

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

   

    // Buy Now Function
    const [addressInfo, setAddressInfo] = useState({
        name: "",
        address: "",
        pincode: "",
        mobileNumber: "",
        time: Timestamp.now(),
        date: new Date().toLocaleString(
            "en-US",
            {
                month: "short",
                day: "2-digit",
                year: "numeric",
            }
        )
    });

    const sendOrderConfirmationEmail = (order) => {
        const templateParams = {
            to_email: order.email,
            order_id: order.id,
            order_details: JSON.stringify(order.cartItems, null, 2),
            message: `Thank you for your purchase. Please make the deposit to the following IBANs:
            - Eurobank IBAN: GR12 3456 7891 2345
            - Piraeus IBAN: GR23 4567 8901 2345
            - Alpha IBAN: GR12 3456 7890 1234
            
            Please make the deposit within the next 48 hours so we can process your order.`
        };
    
        emailjs.send('service_4pq7vdd', 'template_1unb31r', templateParams, 'MLiyOAD--CSZFqkQm')
            .then((response) => {
                console.log('Email sent successfully:', response);
            })
            .catch((error) => {
                console.error('Error sending email:', error);
            });
    };

    const buyNowFunction = async () => {
        if (addressInfo.name === "" || addressInfo.address === "" || addressInfo.pincode === "" || addressInfo.mobileNumber === "") {
            return toast.error("All Fields are required");
        }
    
        const user = getAuth().currentUser;
        if (!user) {
            return toast.error("User not authenticated");
        }
    
        const formattedCartItems = cartItems.map(item => ({
            ...item,
            price: (Math.round(parseFloat(item.price) * 100) / 100).toFixed(2) // Ensure price is formatted
        }));
    
        const orderInfo = {
            cartItems: formattedCartItems,
            addressInfo,
            email: user.email, // Logged-in user's email
            userid: user.uid,
            status: "confirmed",
            time: Timestamp.now(),
            date: new Date().toLocaleString(
                "en-US",
                {
                    month: "short",
                    day: "2-digit",
                    year: "numeric",
                }
            )
        };
    
        try {
            const orderRef = collection(fireDB, 'order');
            await addDoc(orderRef, orderInfo);
    
            // Send the order confirmation email to the logged-in user's email
            sendOrderConfirmationEmail(orderInfo);
    
            setAddressInfo({
                name: "",
                address: "",
                pincode: "",
                mobileNumber: "",
            });
            dispatch(orderSuccessful()); // Clear the cart after placing the order
            toast.success("Order Placed Successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to place order. Please try again.");
        }
    };


    return (
       <Layout>
            <div className="container mx-auto px-4 max-w-7xl lg:px-0">
                <div className="mx-auto max-w-2xl py-8 lg:max-w-7xl">
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                        Shopping Cart...
                    </h1>
                    <form className="mt-12 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
                        <section aria-labelledby="cart-heading" className="rounded-lg bg-white lg:col-span-8">
                            <h2 id="cart-heading" className="sr-only">
                                Items in your shopping cart
                            </h2>
                            <ul role="list" className="divide-y divide-gray-200">
                                {cartItems.length > 0 ?
                                    <>
                                        {cartItems.map((item, index) => {
                                            const { id, title, price, productImageUrl, quantity, category } = item;
                                            return (
                                                <div key={index} className="">
                                                    <li className="flex py-6 sm:py-6 ">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                src={productImageUrl}
                                                                alt="img"
                                                                className="sm:h-38 sm:w-38 h-24 w-24 rounded-md object-contain object-center"
                                                            />
                                                        </div>

                                                        <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                                                            <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                                                                <div>
                                                                    <div className="flex justify-between">
                                                                        <h3 className="text-sm">
                                                                            <div className="font-semibold text-black">
                                                                                {title}
                                                                            </div>
                                                                        </h3>
                                                                    </div>
                                                                    <div className="mt-1 flex text-sm">
                                                                        <p className="text-sm text-gray-500">{category}</p>
                                                                    </div>
                                                                    <div className="mt-1 flex items-end">
                                                                        <p className="text-sm font-medium text-gray-900">
                                                                            {parseFloat(price).toFixed(2)}€
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </li>
                                                    <div className="mb-2 flex">
                                                        <div className="min-w-24 flex">
                                                            <button onClick={() => handleDecrement(id)} type="button" className="h-7 w-7">
                                                                -
                                                            </button>
                                                            <input
                                                                type="text"
                                                                className="mx-1 h-7 w-9 rounded-md border text-center"
                                                                value={quantity}
                                                                onChange={() => {}}
                                                            />
                                                            <button onClick={() => handleIncrement(id)} type="button" className="flex h-7 w-7 items-center justify-center">
                                                                +
                                                            </button>
                                                        </div>
                                                        <div className="ml-6 flex text-sm">
                                                            <button onClick={() => deleteCart(item)} type="button" className="flex items-center space-x-1 px-2 py-1 pl-0">
                                                                <Trash size={12} className="text-red-500" />
                                                                <span className="text-xs font-medium text-red-500">Remove</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </>
                                    :
                                    <h1>Not Found</h1>}
                            </ul>
                        </section>
                        {/* Order summary */}
                        <section
                            aria-labelledby="summary-heading"
                            className="mt-16 rounded-md bg-white lg:col-span-4 lg:mt-0 lg:p-0"
                        >
                            <h2
                                id="summary-heading"
                                className=" border-b border-gray-200 px-4 py-3 text-lg font-medium text-gray-900 sm:p-4"
                            >
                                Price Details
                            </h2>
                            <div>
                                <dl className=" space-y-1 px-2 py-4">
                                    <div className="flex items-center justify-between">
                                        <dt className="text-sm text-gray-800">Price ({cartItemTotal} item{cartItemTotal > 1 ? 's' : ''})</dt>
                                        <dd className="text-sm font-medium text-gray-900">{cartTotal}€</dd>
                                    </div>
                                    <div className="flex items-center justify-between py-4">
                                        <dt className="flex text-sm text-gray-800">
                                            <span>Delivery Charges</span>
                                        </dt>
                                        <dd className="text-sm font-medium text-green-700">
                                            {shippingCost === 0 ? 'Free' : `${shippingCost}€`}
                                        </dd>
                                    </div>
                                    <div className="flex items-center justify-between border-y border-dashed py-4 ">
                                        <dt className="text-base font-medium text-gray-900">Total Amount</dt>
                                        <dd className="text-base font-medium text-gray-900">{totalAmount}€</dd>
                                    </div>
                                </dl>
                                <div className="px-2 pb-4 font-medium text-green-700">
                                    <div className="flex gap-4 mb-6">
                                        {getAuth().currentUser ? (
                                            <BuyNowModal
                                                addressInfo={addressInfo}
                                                setAddressInfo={setAddressInfo}
                                                buyNowFunction={buyNowFunction}
                                            />
                                        ) : (
                                            <button
                                                onClick={() => navigate('/login')}
                                                className="w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                                            >
                                                Login to Checkout
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </section>
                    </form>
                </div>
            </div>
        </Layout>
    );
}

export default CartPage;
