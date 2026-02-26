import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Async thunk for fetching cart
export const fetchCart = createAsyncThunk(
    'cart/fetchCart',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/cart');
            return response.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch cart');
        }
    }
);

// Async thunk for adding to cart
export const addToCart = createAsyncThunk(
    'cart/addToCart',
    async ({ product_id, quantity = 1 }, { rejectWithValue }) => {
        try {
            await api.post('/cart/items', { product_id, quantity });
            // Fetch updated cart after adding
            const cartResponse = await api.get('/cart');
            return cartResponse.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to add to cart');
        }
    }
);

// Async thunk for updating cart item
export const updateCartItem = createAsyncThunk(
    'cart/updateCartItem',
    async ({ itemId, quantity }, { rejectWithValue }) => {
        try {
            await api.put(`/cart/items/${itemId}`, { quantity });
            const cartResponse = await api.get('/cart');
            return cartResponse.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to update cart');
        }
    }
);

// Async thunk for removing from cart
export const removeFromCart = createAsyncThunk(
    'cart/removeFromCart',
    async (itemId, { rejectWithValue }) => {
        try {
            await api.delete(`/cart/items/${itemId}`);
            const cartResponse = await api.get('/cart');
            return cartResponse.data.cart;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to remove from cart');
        }
    }
);

// Async thunk for clearing cart
export const clearCart = createAsyncThunk(
    'cart/clearCart',
    async (_, { rejectWithValue }) => {
        try {
            await api.delete('/cart');
            return null;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to clear cart');
        }
    }
);

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        items: [],
        totalAmount: 0,
        loading: false,
        error: null,
    },
    reducers: {
        clearCartError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch cart
            .addCase(fetchCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalAmount || 0;
            })
            .addCase(fetchCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add to cart
            .addCase(addToCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addToCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalAmount || 0;
            })
            .addCase(addToCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Update cart item
            .addCase(updateCartItem.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCartItem.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalAmount || 0;
            })
            .addCase(updateCartItem.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Remove from cart
            .addCase(removeFromCart.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeFromCart.fulfilled, (state, action) => {
                state.loading = false;
                state.items = action.payload?.items || [];
                state.totalAmount = action.payload?.totalAmount || 0;
            })
            .addCase(removeFromCart.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Clear cart
            .addCase(clearCart.fulfilled, (state) => {
                state.items = [];
                state.totalAmount = 0;
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
