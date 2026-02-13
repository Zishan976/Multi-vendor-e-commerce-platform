import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../utils/api';

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async ({ page = 1, search = '', categoryId = '', vendorId = '' }, { rejectWithValue }) => {
        try {
            let url = `/products/public?page=${page}`;
            if (search) url += `&search=${encodeURIComponent(search)}`;
            if (categoryId) url += `&category_id=${categoryId}`;
            if (vendorId) url = `/products/public/vendor/${vendorId}?page=${page}`;
            const response = await api.get(url);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch products');
        }
    }
);

// Async thunk for fetching a single product by ID
export const fetchProductById = createAsyncThunk(
    'products/fetchProductById',
    async (id, { rejectWithValue }) => {
        try {
            const response = await api.get(`/products/public/${id}`);
            return response.data;
        } catch (error) {
            return rejectWithValue(error.response?.data || 'Failed to fetch product');
        }
    }
);

const productsSlice = createSlice({
    name: 'products',
    initialState: {
        products: [],
        product: null,
        pagination: {},
        loading: false,
        error: null,
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.loading = false;
                state.products = action.payload.products;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchProductById.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProductById.fulfilled, (state, action) => {
                state.loading = false;
                state.product = action.payload;
            })
            .addCase(fetchProductById.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export default productsSlice.reducer;
