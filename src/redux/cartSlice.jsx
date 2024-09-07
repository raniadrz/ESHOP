import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { fireDB } from '../firebase/FirebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Helper function to parse and format prices to two decimal places
const parsePrice = (price) => {
    const parsedPrice = parseFloat(price);
    return isNaN(parsedPrice) ? 0 : parsedPrice;
};

const formatPrice = (price) => {
    return (Math.round(price * 100) / 100).toFixed(2);
};

// Async action to load cart from Firestore
export const loadCartFromFirestore = createAsyncThunk(
    'cart/loadCartFromFirestore',
    async (userId, { rejectWithValue }) => {
        try {
            const cartRef = doc(fireDB, 'carts', userId);
            const cartDoc = await getDoc(cartRef);
            if (cartDoc.exists()) {
                console.log('Cart loaded from Firestore:', cartDoc.data().items);
                return cartDoc.data().items.map(item => ({
                    ...item,
                    price: formatPrice(parsePrice(item.price))
                })) || [];
            }
            console.log('No cart found in Firestore for user:', userId);
            return [];
        } catch (error) {
            console.error('Failed to load cart from Firestore:', error);
            return rejectWithValue('Failed to load cart');
        }
    }
);

// Async action to save cart to Firestore
export const saveCartToFirestore = createAsyncThunk(
    'cart/saveCartToFirestore',
    async ({ userId, cartItems }, { rejectWithValue }) => {
        try {
            const cartRef = doc(fireDB, 'carts', userId);
            await setDoc(cartRef, { items: cartItems }, { merge: true });
            console.log('Cart saved to Firestore:', cartItems);
        } catch (error) {
            console.error('Failed to save cart to Firestore:', error);
            return rejectWithValue('Failed to save cart');
        }
    }
);

const initialState = JSON.parse(localStorage.getItem('cart'))?.map(item => ({
    ...item,
    price: formatPrice(parsePrice(item.price)),
    quantity: item.quantity || 1,
    time: isNaN(new Date(item.time).getTime()) ? null : new Date(item.time).toISOString(),
})) ?? [];

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
        },
        deleteFromCart(state, action) {
            return state.filter(item => item.id !== action.payload.id);
        },
        incrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem) {
                existingItem.quantity += 1;
                existingItem.price = formatPrice(parsePrice(existingItem.price));
            }
        },
        decrementQuantity(state, action) {
            const existingItem = state.find(item => item.id === action.payload);
            if (existingItem && existingItem.quantity > 1) {
                existingItem.quantity -= 1;
                existingItem.price = formatPrice(parsePrice(existingItem.price));
            }
        },
        clearCart() {
            return [];
        },
        orderSuccessful() {
            return [];
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(loadCartFromFirestore.fulfilled, (state, action) => {
                return action.payload;
            })
            .addCase(loadCartFromFirestore.rejected, (state, action) => {
                console.error(action.payload);
            })
            .addCase(saveCartToFirestore.rejected, (state, action) => {
                console.error(action.payload);
            });
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
