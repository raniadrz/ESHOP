// AdminDashboard.jsx
import React, { useContext, useState } from 'react';
import Papa from 'papaparse';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import ProductDetail from '../../components/admin/Dashboard/ProductDetail';
import OrderDetail from '../../components/admin/Dashboard/OrderDetail';
import UserDetail from '../../components/admin/Dashboard/UserDetail';
import TestimonialDetail from '../../components/admin/Dashboard/TestimonialDetail'; // Import TestimonialDetail
import Layout from "../../components/layout/Layout";
import updatePassword from "../../components/user/UpdatePassword";
import myContext from '../../context/myContext';
import './AdminDashboard.css'; // Import your custom styles

const AdminDashboard = () => {
    const user = JSON.parse(localStorage.getItem('users'));
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser, addProductsFunction ,getAllTestimonials } = context;
    const [newPassword, setNewPassword] = useState('');
    const [products, setProducts] = useState([]);

    const handlePasswordChange = () => {
        updatePassword(newPassword);
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        Papa.parse(file, {
            header: true,
            skipEmptyLines: true,
            complete: function (results) {
                setProducts(results.data);
            }
        });
    };

    return (
        <Layout>
            <div>
                {/* Top */}
                <div className="top mb-5 px-5 mt-5">
                    <div className="bg-blue-50 py-5 border border-blue-100 rounded-lg">
                        <h1 className="text-center text-2xl font-bold text-blue-500">Admin Dashboard</h1>
                    </div>
                </div>

                <div className="px-6">

                    {/* Bottom */}
                    <div className="">
                        <Tabs>
                            <TabList className="flex justify-center border-b-2 ">
                                <Tab className="p-4 cursor-pointer -mb-px text-blue-500 hover:text-blue-700 focus:outline-none transition duration-300 border-l-2 border-r-2 border-t-2 order-black rounded-t-lg">
                                    <div className="px-4 py-2 bg-white rounded-t-lg">
                                        <h2 className="title-font font-medium text-lg">Total Products ({getAllProduct.length})</h2>
                                    </div>
                                </Tab>

                                <Tab className="p-4 cursor-pointer -mb-px text-blue-500 hover:text-blue-700 focus:outline-none transition duration-300 border-l-2 border-r-2 border-t-2 order-black rounded-t-lg">
                                    <div className="px-4 py-2 bg-white rounded-t-lg">
                                        <h2 className="title-font font-medium text-lg">Total Orders ({getAllOrder.length})</h2>
                                    </div>
                                </Tab>

                                <Tab className="p-4 cursor-pointer -mb-px text-blue-500 hover:text-blue-700 focus:outline-none transition duration-300 border-l-2 border-r-2 border-t-2 order-black rounded-t-lg">
                                    <div className="px-4 py-2 bg-white rounded-t-lg">
                                        <h2 className="title-font font-medium text-lg">Total Users ({getAllUser.length})</h2>
                                    </div>
                                </Tab>

                                <Tab className="p-4 cursor-pointer -mb-px text-blue-500 hover:text-blue-700 focus:outline-none transition duration-300 border-l-2 border-r-2 border-t-2 order-black rounded-t-lg">
                                    <div className="px-4 py-2 bg-white rounded-t-lg">
                                        <h2 className="title-font font-medium text-lg">Total Testimonials ({getAllTestimonials.length})</h2>
                                    </div>
                                </Tab>
                            </TabList>

                            <TabPanel>
                                <ProductDetail />
                            </TabPanel>

                            <TabPanel>
                                <OrderDetail />
                            </TabPanel>

                            <TabPanel>
                                <UserDetail />
                            </TabPanel>

                            <TabPanel>
                                <TestimonialDetail /> {/* Add TestimonialDetail Tab */}
                            </TabPanel>
                        </Tabs>
                    </div>
                    
                </div>
            </div>
        </Layout>
    );
}

export default AdminDashboard;
