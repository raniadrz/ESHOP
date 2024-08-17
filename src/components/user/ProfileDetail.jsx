import React, { useContext, useState, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import myContext from "../../context/myContext";
import Loader from "../../components/loader/Loader";
import { getAuth, updateProfile } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore"; 
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { fireDB } from "../../firebase/FirebaseConfig"; // Ensure you import your Firebase config
import {
  Avatar,
  Grid,
  IconButton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import toast from 'react-hot-toast';

const defaultAvatars = [
  'https://cdn-icons-png.flaticon.com/128/2202/2202112.png',
  'https://cdn-icons-png.flaticon.com/128/236/236831.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922510.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922656.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922522.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922561.png',
  'https://cdn-icons-png.flaticon.com/128/2922/2922715.png'
];

const AvatarCollage = styled(Grid)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(2),
  marginTop: theme.spacing(2),
}));

const CollageAvatar = styled(Avatar)(({ theme }) => ({
  width: theme.spacing(7),
  height: theme.spacing(7),
  cursor: 'pointer',
  border: '2px solid transparent',
  '&:hover': {
    border: `2px solid ${theme.palette.primary.main}`,
  },
  '&.selected': {
    border: `2px solid ${theme.palette.secondary.main}`,
  },
}));

const ProfileDetail = () => {
    const auth = getAuth();
    const user = JSON.parse(localStorage.getItem('users'));

    const context = useContext(myContext);
    const { loading, getAllOrder } = context;

    // Group orders by order id
    const groupedOrders = getAllOrder
        .filter((order) => order.userid === user?.uid)
        .reduce((acc, order) => {
            if (!acc[order.id]) {
                acc[order.id] = { ...order, items: [] };
            }
            acc[order.id].items.push(...order.cartItems);
            return acc;
        }, {});

    return (
        <Layout>
            <div className="container mx-auto lg:py-10">
                {/* Top  */}
                <div className="top ">
                    {/* main  */}
                    <div className="bottom mt-8">
                    <div className="mx-auto max-w-6xl">
                        {/* User Info */}
                        <div className="p-4 bg-blue-50 py-5 rounded-xl border border-blue-100">
                            <h1 className="grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                <span className="text-sm font-semibold text-black">Name:</span> {user?.name}
                            </h1>
                            <h1 className="grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                <span className="text-sm font-semibold text-black">Email:</span> {user?.email}
                            </h1>
                            <h1 className="grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                <span className="text-sm font-semibold text-black">Date:</span> {user?.date}
                            </h1>
                            <h1 className="grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                <span className="text-sm font-semibold text-black">Role:</span> {user?.role}
                            </h1>
                        </div>
                    </div>
                    </div>
                </div>
            
                {/* Bottom */}
                <div className="bottom mt-8">
                    <div className="mx-auto max-w-6xl">
                        <h2 className="text-2xl lg:text-3xl font-bold">Order History</h2>
                        <div className="flex justify-center relative top-10">
                            {loading && <Loader />}
                        </div>

                        {/* Order History */}
                        {Object.values(groupedOrders).map((order, index) => (
                            <div key={index} className="mt-4 flex flex-col overflow-hidden rounded-xl border border-blue-100 md:flex-row">
                                {/* Order Summary */}
                                <div className="w-full border-r border-blue-100 bg-blue-50 md:max-w-xs">
                                    <div className="p-10">
                                        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-1">
                                            <div className="mb-5">
                                                <div className="text-sm font-semibold text-black">Order Id</div>
                                                <div className="text-sm font-medium text-gray-900">#{order.id}</div>
                                            </div>

                                            <div className="mb-5 ">
                                                <div className="text-sm font-semibold">Date</div>
                                                <div className="text-sm font-medium text-gray-900">{order.date}</div>
                                            </div>

                                            <div className="mb-5">
                                                <div className="text-sm font-semibold">Total Amount</div>
                                                <div className="text-sm font-medium text-gray-900">
                                                     {order.items.reduce((total, item) => total + item.price * item.quantity, 0)}€
                                                </div>
                                            </div>

                                            <div className="mb-5">
                                                <div className="text-sm font-semibold">Order Status</div>
                                                <div className={`text-sm font-medium ${order.status === 'pending' ? 'text-red-800' : 'text-green-800'} first-letter:uppercase`}>
                                                    {order.status}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* Order Items */}
                                <div className="flex">
                                    <div className="p-5">
                                        <ul className="-my-7 divide-y divide-gray-200">
                                            {order.items.map((item, idx) => (
                                                <li key={idx} className="flex flex-col justify-between space-x-5 py-7 md:flex-row">
                                                    <div className="flex flex-1 items-stretch">
                                                        <div className="flex-shrink-0">
                                                            <img
                                                                className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                                                                src={item.productImageUrl}
                                                                alt={item.title}
                                                            />
                                                        </div>

                                                        <div className="ml-2 flex flex-col justify-between">
                                                            <div className="flex-1">
                                                                <p className="text-sm font-bold text-gray-900">{item.title}</p>
                                                                <p className="mt-1 text-sm font-medium text-gray-500">{item.category} x {item.quantity}</p>
                                                             </div>
                                                        </div>
                                                    </div>

                                                    <div className="ml-auto flex flex-col items-end justify-between">
                                                        <p className="text-right text-sm font-bold text-gray-900"> {item.price}€</p>
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ProfileDetail;
