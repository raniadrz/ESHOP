import { useContext, useState } from "react";
import { Box, Button, TextField, Grid, Select, MenuItem, IconButton } from "@mui/material";
import MyContext from "../../context/myContext";
import RefreshIcon from '@mui/icons-material/Refresh';
import Layout from "../../components/layout/Layout";


const CouponContext = () => {
    const { coupons, addCoupon, deleteCoupon, updateCoupon, fetchCoupons } = useContext(MyContext);
    const [newCoupon, setNewCoupon] = useState({ code: "", discount: 10, description: "", type: "percentage" });

    const handleInputChange = (e) => {
        setNewCoupon({ ...newCoupon, [e.target.name]: e.target.value });
    };

    const handleAddCoupon = () => {
        addCoupon(newCoupon);
        setNewCoupon({ code: "", discount: 10, description: "", type: "percentage" });
    };

    const generateCouponCode = () => {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 8; i++) {
            code += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        setNewCoupon({ ...newCoupon, code });
    };

    return (
        <Layout>
        <Box sx={{ padding: 2 }}>
            <h1>Coupons Generator</h1>
            <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Coupon Code"
                        name="code"
                        value={newCoupon.code}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Discount"
                        name="discount"
                        value={newCoupon.discount}
                        onChange={handleInputChange}
                        type="number"
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <TextField
                        fullWidth
                        label="Description"
                        name="description"
                        value={newCoupon.description}
                        onChange={handleInputChange}
                    />
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Select
                        fullWidth
                        label="Type"
                        name="type"
                        value={newCoupon.type}
                        onChange={handleInputChange}
                    >
                        <MenuItem value="percentage">Percentage</MenuItem>
                        <MenuItem value="fixed">Fixed</MenuItem>
                    </Select>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={generateCouponCode}>
                        Generate Code
                    </Button>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Button variant="contained" color="primary" onClick={handleAddCoupon}>
                        Add Coupon
                    </Button>
                </Grid>
            </Grid>
            <Box sx={{ marginTop: 4, display: 'flex', alignItems: 'center' }}>
                <h2>Coupons List</h2>
                <IconButton color="primary" onClick={fetchCoupons}>
                    <RefreshIcon />
                </IconButton>
            </Box>
            {coupons.map((coupon) => (
                <Box key={coupon.id} sx={{ padding: 2, border: "1px solid #ccc", marginBottom: 2 }}>
                    <h3>{coupon.code}</h3>
                    <p>Discount: {coupon.discount} {coupon.type === "percentage" ? "%" : "€"}</p>
                    <p>Description: {coupon.description}</p>
                    <Button variant="contained" color="secondary" onClick={() => deleteCoupon(coupon.id)}>
                        Delete
                    </Button>
                    <Button variant="contained" onClick={() => updateCoupon(coupon.id, { ...coupon, discount: 20 })}>
                        Update to 20%
                    </Button>
                </Box>
            ))}
        </Box>
         </Layout>
    );
}

export default CouponContext;
