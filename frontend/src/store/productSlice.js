import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productsApi from "../api/productsApi";

export const fetchProductsThunk = createAsyncThunk(
    "products/fetchProducts",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await productsApi.getProducts(filters);
            // BE trả: { data, pagination }
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message });
        }
    }
);

const initialState = {
    items: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    filters: { q: "", brand: "", minPrice: "", maxPrice: "", sort: "", page: 1, limit: 12 },
    status: "idle",
    error: null,
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setProductsFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        },
        setProductsPage(state, action) {
            state.filters.page = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductsThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload?.data || [];
                state.pagination = action.payload?.pagination || initialState.pagination;
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Fetch products failed";
            });
    },
});

export const { setProductsFilters, setProductsPage } = productsSlice.actions;
export default productsSlice.reducer;