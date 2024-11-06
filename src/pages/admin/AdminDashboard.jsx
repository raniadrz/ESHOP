// AdminDashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { Tab, TabList, TabPanel, Tabs } from 'react-tabs';
import Layout from "../../components/layout/Layout";
import myContext from '../../context/myContext';
import { Inventory2, ShoppingCart, People, Comment } from '@mui/icons-material';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    LabelList
} from 'recharts';
import ProductDetail from '../../components/admin/Dashboard/ProductDetail';
import OrderDetail from '../../components/admin/Dashboard/OrderDetail';
import UserDetail from '../../components/admin/Dashboard/UserDetail';
import TestimonialDetail from '../../components/admin/Dashboard/TestimonialDetail';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const context = useContext(myContext);
    const { getAllProduct, getAllOrder, getAllUser, getAllTestimonials } = context;
    const [dailyStats, setDailyStats] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Helper function to parse Firestore timestamps
    const parseDate = (timestamp) => {
        if (!timestamp || !timestamp.toDate) return null;
        return timestamp.toDate();
    };

    useEffect(() => {
        if (!getAllOrder || !getAllProduct) return;

        try {
            const today = new Date();
            const last30Days = {};
            
            // Initialize the last 30 days
            for (let i = 0; i < 30; i++) {
                const date = new Date(today);
                date.setDate(today.getDate() - i);
                const dateStr = date.toISOString().split('T')[0];
                last30Days[dateStr] = {
                    date: dateStr,
                    newProducts: 0,
                    orders: 0,
                    dailyProfits: 0
                };
            }

            // Process orders and calculate Profits
            getAllOrder.forEach(order => {
                const orderDate = parseDate(order.time);
                if (!orderDate) return;

                const dateStr = orderDate.toISOString().split('T')[0];
                if (last30Days[dateStr]) {
                    last30Days[dateStr].orders++;
                    
                    // Calculate total Profits from cart items
                    if (order.cartItems && Array.isArray(order.cartItems)) {
                        const orderTotal = order.cartItems.reduce((sum, item) => {
                            return sum + (Number(item.price) * item.quantity);
                        }, 0);
                        last30Days[dateStr].dailyProfits += orderTotal;
                    }
                }
            });

            // Process products to count new products by date
            getAllProduct.forEach(product => {
                // Check if product is "New Product" type
                if (product.productType === "New Product" && product.date) {
                    const productDate = parseDate(product.date);
                    if (!productDate) return;

                    const dateStr = productDate.toISOString().split('T')[0];
                    if (last30Days[dateStr]) {
                        last30Days[dateStr].newProducts++;
                    }
                }
            });

            // Convert to array and format for chart
            const statsArray = Object.values(last30Days)
                .map(stat => ({
                    date: new Date(stat.date).toLocaleDateString('default', {
                        month: 'short',
                        day: 'numeric'
                    }),
                    newProducts: stat.newProducts,
                    orders: stat.orders,
                    dailyProfits: Number(stat.dailyProfits.toFixed(2))
                }))
                .reverse();
            setDailyStats(statsArray);
            setIsLoading(false);
        } catch (error) {
            console.error('Error processing stats:', error);
            setIsLoading(false);
        }
    }, [getAllOrder, getAllProduct]);

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50">
                {/* Stats Cards */}
                <div className="dashboard-stats">
                    <div className="stat-card">
                        <Inventory2 className="text-3xl mb-2 text-blue-500" />
                        <div className="stat-value">{getAllProduct?.length || 0}</div>
                        <div className="stat-label">Total Products</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{getAllOrder.length}</div>
                        <div className="stat-label">Total Orders</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{getAllUser.length}</div>
                        <div className="stat-label">Total Users</div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-value">{getAllTestimonials.length}</div>
                        <div className="stat-label">Total Testimonials</div>
                    </div>
                </div>

                {/* Chart */}
                <div className="chart-container p-4 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold mb-4">Daily Activity</h3>
                    {isLoading ? (
                        <div>Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={400}>
                            <BarChart 
                                data={dailyStats}
                                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid 
                                    strokeDasharray="3 3" 
                                    vertical={false}
                                />
                                <XAxis 
                                    dataKey="date" 
                                    tick={{ fontSize: 12 }}
                                    axisLine={false}
                                    tickLine={false}
                                />
                                <YAxis 
                                    yAxisId="left"
                                    orientation="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                    tickFormatter={(value) => `${value}€`}
                                />
                                <YAxis 
                                    yAxisId="right" 
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fontSize: 12 }}
                                />
                                <Tooltip 
                                    contentStyle={{
                                        backgroundColor: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}
                                    formatter={(value, name) => {
                                        if (name === "Profits") return [`${value}€`, name];
                                        return [value, name];
                                    }}
                                    labelStyle={{ fontWeight: 'bold' }}
                                />
                                <Legend 
                                    verticalAlign="bottom" 
                                    height={36}
                                    iconType="circle"
                                />
                                <Bar 
                                    yAxisId="left"
                                    dataKey="dailyProfits" 
                                    fill="#4a90e2" 
                                    name="Profits"
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList 
                                        dataKey="dailyProfits"
                                        position="top"
                                        formatter={(value) => value > 0 ? `${value}€` : ''}
                                        style={{ fill: '#666' }}
                                    />
                                </Bar>
                                <Bar 
                                    yAxisId="right"
                                    dataKey="orders" 
                                    fill="#82ca9d" 
                                    name="Orders"
                                    radius={[4, 4, 0, 0]}
                                >
                                    <LabelList 
                                        dataKey="orders" 
                                        position="top"
                                        formatter={(value) => value > 0 ? value : ''}
                                        style={{ fill: '#666' }}
                                    />
                                </Bar>
                                
                            </BarChart>
                        </ResponsiveContainer>
                    )}
                </div>

                {/* Tabs */}
                <div className="px-6">
                    <Tabs>
                        <TabList>
                            <Tab>
                                <div className="flex items-center space-x-2">
                                    <Inventory2 className="text-black" />
                                    <span>Products ({getAllProduct.length})</span>
                                </div>
                            </Tab>

                            <Tab>
                                <div className="flex items-center space-x-2">
                                    <ShoppingCart className="text-black" />
                                    <span>Orders ({getAllOrder.length})</span>
                                </div>
                            </Tab>

                            <Tab>
                                <div className="flex items-center space-x-2">
                                    <People className="text-black" />
                                    <span>Users ({getAllUser.length})</span>
                                </div>
                            </Tab>

                            <Tab>
                                <div className="flex items-center space-x-2">
                                    <Comment className="text-black" />
                                    <span>Testimonials ({getAllTestimonials.length})</span>
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
                            <TestimonialDetail />
                        </TabPanel>
                    </Tabs>
                </div>
            </div>
        </Layout>
    );
};

export default AdminDashboard;
