/* eslint-disable react/prop-types */
import {
    Button,
    Dialog,
    DialogBody,
} from "@material-tailwind/react";
import { useState } from "react";
import { useNavigate } from 'react-router-dom';

const BuyNowModal = ({ addressInfo, setAddressInfo, buyNowFunction }) => {
    const [open, setOpen] = useState(false);
    const [loginPopupOpen, setLoginPopupOpen] = useState(false); // State for login popup
    const navigate = useNavigate();

    // Check if user is logged in by fetching the user data from localStorage
    const user = JSON.parse(localStorage.getItem('users'));

    const handleOpen = () => {
        if (!user) {
            // If user is not logged in, open the login popup
            setLoginPopupOpen(true);
            return;
        }
        setOpen(!open); // Toggle modal open/close
    };

    // Handle login popup button clicks
    const goToLogin = () => {
        navigate('/login');
        setLoginPopupOpen(false); // Close the popup
    };

    const goToCreateAccount = () => {
        navigate('/signup');
        setLoginPopupOpen(false); // Close the popup
    };

    return (
        <>
            <Button
                type="button"
                onClick={handleOpen}
                className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 hover:border-pink-500 hover:text-pink-700 hover:bg-pink-100 rounded-xl"
            >
                Buy now
            </Button>

            {/* Main Buy Now Modal */}
            <Dialog open={open} handler={handleOpen} className=" bg-pink-50">
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
                            className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
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
                            className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
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
                            className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
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
                            placeholder='Enter your mobile number'
                            className='bg-pink-50 border border-pink-200 px-2 py-2 w-full rounded-md outline-none text-pink-600 placeholder-pink-300'
                        />
                    </div>

                    <div className="mb-3">
                        <select
                            name="paymentMethod"
                            value={addressInfo.paymentMethod}
                            onChange={(e) => {
                                setAddressInfo({
                                    ...addressInfo,
                                    paymentMethod: e.target.value
                                })
                            }}
                            className="bg-blue-50 border border-blue-200 px-2 py-2 w-full rounded-md outline-none text-blue-600"
                        >
                            <option value="po">Pay Options</option>
                            <option value="cash">Cash</option>
                            <option value="bank_transfer">Bank Transfer</option>
                        </select>
                    </div>

                    <div className="">
                        <Button
                            type="button"
                            onClick={() => {
                                handleOpen();
                                buyNowFunction();
                            }}
                            className="w-full px-4 py-3 text-center text-gray-100 bg-pink-600 border border-transparent dark:border-gray-700 rounded-lg"
                        >
                            Buy now
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>

            {/* Login Popup Modal */}
            <Dialog open={loginPopupOpen} handler={() => setLoginPopupOpen(false)} className="bg-white">
                <DialogBody className="p-6">
                    <h3 className="text-xl text-center text-pink-600 mb-4">You need to be logged in to place an order</h3>
                    <div className="flex justify-center space-x-4">
                        <Button
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                            onClick={goToLogin}
                        >
                            Login
                        </Button>
                        <Button
                            className="w-full bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
                            onClick={goToCreateAccount}
                        >
                            Create Account
                        </Button>
                    </div>
                </DialogBody>
            </Dialog>
        </>
    );
}

export default BuyNowModal;
