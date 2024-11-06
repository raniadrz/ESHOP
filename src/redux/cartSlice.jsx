// cartSlice.jsx
import { createSlice } from '@reduxjs/toolkit';

// Helper function to parse and format prices
const parsePrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
};

const formatPrice = (price) => {
    return (Math.round(price * 100) / 100).toFixed(2);
};

// Safely parse the JSON from localStorage
const loadCartFromLocalStorage = () => {
    try {
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
            return JSON.parse(storedCart).map(item => ({
                ...item,
                price: formatPrice(parsePrice(item.price)),
                quantity: item.quantity || 1,
                time: new Date(item.time).toISOString(),
            }));
        }
    } catch (error) {
        console.error("Failed to parse cart from localStorage:", error);
    }
    return [];  // Return an empty array if there's no valid cart
};

const initialState = loadCartFromLocalStorage();

export const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        addToCart(state, action) {
            const newItem = {
                ...action.payload,
                price: formatPrice(parsePrice(action.payload.price)),
                quantity: action.payload.quantity || 1,
                time: new Date().toISOString(),
            };
            const existingItem = state.find(item => item.id === newItem.id);
            if (existingItem) {
                existingItem.quantity += newItem.quantity;
                existingItem.price = formatPrice(parsePrice(newItem.price));
            } else {
                state.push(newItem);
            }
            // Save updated state to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        deleteFromCart(state, action) {
            const updatedState = state.filter(item => item.id !== action.payload.id);
            // Save updated state to localStorage
            localStorage.setItem('cart', JSON.stringify(updatedState));
            return updatedState;
        },
        incrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.price = formatPrice(parsePrice(existingItem.price));
            }
            // Save updated state to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        decrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                existingItem.price = formatPrice(parsePrice(existingItem.price));
            }
            // Save updated state to localStorage
            localStorage.setItem('cart', JSON.stringify(state));
        },
        clearCart() {
            // Clear the cart and localStorage
            localStorage.removeItem('cart');
            return [];
        },
        orderSuccessful() {
            // Clear the cart and localStorage upon order completion
            localStorage.removeItem('cart');
            return [];
        },
    },
});

export const {
    addToCart,
    deleteFromCart,
    incrementQuantity,
    decrementQuantity,
    clearCart,
    orderSuccessful,
} = cartSlice.actions;

export default cartSlice.reducer;
