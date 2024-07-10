/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { CardElement, Elements, useElements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useState } from "react";
import { useSelector } from 'react-redux';

const stripePromise = loadStripe("pk_test_51P6Feq066R1dyNUyGmP7XnDJ6lntAX6FsDOmy39mkxGPXPRMm4RlN3l83dYyRW5YbB5wtE5sKFBC2mY9WyvOs1Na00ttd93Jt2");

const BuyNowModal = ({ addressInfo, setAddressInfo }) => {
    const [open, setOpen] = useState(false);
    const [payWithCard, setPayWithCard] = useState(false);

    // Get cart items from Redux store
    const cart = useSelector((state) => state.cart);

    const handleOpen = () => setOpen(!open);
    const handlePayWithCard = () => setPayWithCard(!payWithCard);

    // Calculate total amount in cents
    const calculateTotalAmount = () => {
        return cart.reduce((total, item) => total + item.price * item.quantity, 0) * 100; // Amount in cents
    };

    const buyNowFunction = async (paymentMethodId = null) => {
        try {
            const body = {
                amount: calculateTotalAmount(),
                currency: 'usd',
                customerEmail: addressInfo.email,
            };
            
            if (paymentMethodId) {
                body.paymentMethodId = paymentMethodId;
            }

            const response = await fetch('http://localhost:3000/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body),
            });

            const result = await response.json();

            if (result.success) {
                console.log('Payment and invoice created successfully:', result);
                alert('Payment successful! Invoice will be sent to your email.');
            } else {
                console.error('Payment failed:', result.error);
                alert('Payment failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again.');
        }
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-gray-100 bg-blue-600 border border-transparent dark:border-gray-700 hover:border-red-500 hover:text-red-700 hover:bg-blue-100 rounded-xl"
            >
                Buy Now
            </Button>
            <Dialog open={open} handler={handleOpen} className="bg-blue-50">
                <DialogBody className="">
                    <div className="mb-3">
                        <input
                            type="text"
                            name="name"
                            value={addressInfo.name}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    name: e.target.value
                                })
                            }}
                            placeholder='Enter your name'
                            className='bg-blue-50 border border-red-200 px-2 py-2 w-full rounded-md outline-none text-red-600 placeholder-red-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="text"
                            name="address"
                            value={addressInfo.address}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    address: e.target.value
                                })
                            }}
                            placeholder='Enter your address'
                            className='bg-blue-50 border border-red-200 px-2 py-2 w-full rounded-md outline-none text-red-600 placeholder-red-300'
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="number"
                            name="pincode"
                            value={addressInfo.pincode}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    pincode: e.target.value
                                })
                            }}
                            placeholder='Enter your pincode'
                            className='bg-blue-50 border border-red-200 px-2 py-2 w-full rounded-md outline-none text-red-600 text-red-600 placeholder-red-300'
                        />
                    </div>

                    <div className="mb-3">
                        <input
                            type="text"
                            name="mobileNumber"
                            value={addressInfo.mobileNumber}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    mobileNumber: e.target.value
                                })
                            }}
                            placeholder='Enter your mobileNumber'
                            className='bg-blue-50 border border-red-200 px-2 py-2 w-full rounded-md outline-none text-red-600 placeholder-red-300'
                        />
                    </div>
                    <div className="mb-3">
                        <input
                            type="email"
                            name="email"
                            value={addressInfo.email}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    email: e.target.value
                                })
                            }}
                            placeholder='Enter your email'
                            className='bg-blue-50 border border-red-200 px-2 py-2 w-full rounded-md outline-none text-red-600 placeholder-red-300'
                        />
                    </div>
                    {payWithCard ? (
                        <Elements stripe={stripePromise}>
                            <CardPaymentForm handleOpen={handleOpen} buyNowFunction={buyNowFunction} />
                        </Elements>
                    ) : (
                        <div className="">
                            <Button
                                type="button"
                                onClick={() => {
                                    handleOpen();
                                    buyNowFunction(); // Call the function without a payment method
                                }}
                                className="w-full px-4 py-3 text-center text-gray-100 bg-blue-600 border border-transparent dark:border-gray-700 rounded-lg"
                            >
                                Buy now
                            </Button>
                        </div>
                    )}

                    <div className="mt-4">
                        <Button
                            type="button"
                            onClick={handlePayWithCard}
                            className="w-full px-4 py-3 text-center text-gray-100 bg-blue-600 border border-transparent dark:border-gray-700 rounded-lg"
                        >
                            {payWithCard ? "Pay Without Card" : "Pay With Card"}
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
};

const CardPaymentForm = ({ handleOpen, buyNowFunction }) => {
    const stripe = useStripe();
    const elements = useElements();

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            console.error('Stripe or Elements not loaded');
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: cardElement,
        });

        if (error) {
            console.error('[error]', error);
        } else {
            console.log('[PaymentMethod]', paymentMethod);
            handleOpen();
            buyNowFunction(paymentMethod.id);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <CardElement className="mb-4 px-2 py-2 border border-red-200 rounded-md outline-none text-red-600 placeholder-red-300" />
            <Button
                type="submit"
                disabled={!stripe}
                className="w-full px-4 py-3 text-center text-gray-100 bg-blue-600 border border-transparent dark:border-gray-700 rounded-lg"
            >
                Pay with Card
            </Button>
        </form>
    );
};

export default BuyNowModal;
