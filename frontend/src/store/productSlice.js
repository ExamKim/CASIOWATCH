import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import productsApi from "../api/productsApi";
import { normalizeApiError } from "../utils/apiError";

export const fetchProductsThunk = createAsyncThunk(
    "products/fetchProducts",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await productsApi.getProducts(filters);
            // BE trả: { data, pagination }
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Fetch products failed") });
        }
    }
);

const initialState = {
    items: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    filters: {
        q: "",
        category: "",
        gender: [],
        brand: "",
        minPrice: "",
        maxPrice: "",
        sort: "",
        page: 1,
        limit: 12,
    },
    status: "idle",
    error: null,
    currentRequestId: null,
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
            .addCase(fetchProductsThunk.pending, (state, action) => {
                state.status = "loading";
                state.error = null;
                state.currentRequestId = action.meta.requestId;
            })
            .addCase(fetchProductsThunk.fulfilled, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.status = "succeeded";
                state.items = action.payload?.data || [];
                state.pagination = action.payload?.pagination || initialState.pagination;
                state.currentRequestId = null;
            })
            .addCase(fetchProductsThunk.rejected, (state, action) => {
                if (state.currentRequestId !== action.meta.requestId) return;
                state.status = "failed";
                state.error = action.payload?.message || "Fetch products failed";
                state.currentRequestId = null;
            });
    },
});

export const { setProductsFilters, setProductsPage } = productsSlice.actions;
export default productsSlice.reducer;