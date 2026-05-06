import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ordersApi from "../api/ordersApi";
import { normalizeApiError } from "../utils/apiError";

// User - Get my orders
export const fetchMyOrdersThunk = createAsyncThunk(
    "orders/fetchMyOrders",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await ordersApi.getMyOrders(filters);
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Fetch my orders failed") });
        }
    }
);

// Get order detail by id
export const fetchOrderByIdThunk = createAsyncThunk(
    "orders/fetchOrderById",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await ordersApi.getOrderById(orderId);
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Fetch order detail failed") });
        }
    }
);

// Create order from cart
export const createOrderThunk = createAsyncThunk(
    "orders/createOrder",
    async (payload = {}, { rejectWithValue }) => {
        try {
            const res = await ordersApi.createOrder(payload);
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Create order failed") });
        }
    }
);

const initialState = {
    myOrders: [],
    currentOrder: null,
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
        },
        clearCurrentOrder(state) {
            state.currentOrder = null;
        },
    },
    extraReducers: (builder) => {
        // fetchMyOrdersThunk (user)
        builder
            .addCase(fetchMyOrdersThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchMyOrdersThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.myOrders = action.payload || [];
            })
            .addCase(fetchMyOrdersThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Fetch my orders failed";
            });

        // fetchOrderByIdThunk
        builder
            .addCase(fetchOrderByIdThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchOrderByIdThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentOrder = action.payload;
            })
            .addCase(fetchOrderByIdThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Fetch order detail failed";
            });

        // createOrderThunk
        builder
            .addCase(createOrderThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(createOrderThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.currentOrder = action.payload;
                state.myOrders.unshift(action.payload);
            })
            .addCase(createOrderThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Create order failed";
            });
    },
});

export const { setOrdersFilters, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
