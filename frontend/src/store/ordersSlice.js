import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ordersApi from "../api/ordersApi";

export const fetchOrdersThunk = createAsyncThunk(
    "orders/fetchOrders",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await ordersApi.getOrders(filters);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message });
        }
    }
);

const initialState = {
    items: [],
    pagination: { page: 1, limit: 12, total: 0, totalPages: 0 },
    filters: { q: "", status: "", page: 1, limit: 12 },
    status: "idle",
    error: null,
};

const ordersSlice = createSlice({
    name: "orders",
    initialState,
    reducers: {
        setOrdersFilters(state, action) {
            state.filters = { ...state.filters, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchOrdersThunk.pending, (state) => { state.status = "loading"; state.error = null; }).addCase(fetchOrdersThunk.fulfilled, (state, action) => { state.status = "succeeded"; state.items = action.payload?.data || []; state.pagination = action.payload?.pagination || initialState.pagination; }).addCase(fetchOrdersThunk.rejected, (state, action) => { state.status = "failed"; state.error = action.payload?.message || "Fetch orders failed"; });
    },
});
export const { setOrdersFilters } = ordersSlice.actions;
export default ordersSlice.reducer;
