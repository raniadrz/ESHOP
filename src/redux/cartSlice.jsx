import { createSlice } from '@reduxjs/toolkit';

// Helper function to parse prices
const parsePrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
};

const initialState = JSON.parse(localStorage.getItem('cart'))?.map(item => ({
    ...item,
    price: parsePrice(item.price), // Ensure price is a number
    quantity: item.quantity || 1, // Ensure quantity is a number and not zero
    time: isNaN(new Date(item.time).getTime()) ? null : new Date(item.time).toISOString(),
})) ?? [];

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = {
                ...action.payload,
                price: parsePrice(action.payload.price), // Ensure price is a number
                quantity: action.payload.quantity || 1, // Ensure quantity is a number and not zero
                time: new Date().toISOString(), // Serialize time as ISO string
            };
            const existingItem = state.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
                existingItem.price = newItem.price; // Update price if needed
            } else {
                state.push(newItem);
            }
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id !== action.payload.id);
        },
        incrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem) {
                existingItem.quantity += 1;
            }
        },
        decrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
            }
        },
        clearCart(state) {
            return [];
        },
    },
});

export const { addToCart, deleteFromCart, incrementQuantity, decrementQuantity, clearCart } = cartSlice.actions;

export default cartSlice.reducer;
