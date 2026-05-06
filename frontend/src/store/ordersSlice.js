import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ordersApi from "../api/ordersApi";
import { normalizeApiError } from "../utils/apiError";

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

export const cancelOrderThunk = createAsyncThunk(
    "orders/cancelOrder",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await ordersApi.cancelOrder(orderId);
            return res.data?.order || null;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Cancel order failed") });
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

        builder
            .addCase(cancelOrderThunk.pending, (state) => {
                state.error = null;
            })
            .addCase(cancelOrderThunk.fulfilled, (state, action) => {
                const updated = action.payload;
                if (!updated?.id) return;

                state.myOrders = state.myOrders.map((order) =>
                    Number(order.id) === Number(updated.id) ? { ...order, ...updated } : order
                );

                if (state.currentOrder && Number(state.currentOrder.id) === Number(updated.id)) {
                    state.currentOrder = { ...state.currentOrder, ...updated };
                }
            })
            .addCase(cancelOrderThunk.rejected, (state, action) => {
                state.error = action.payload?.message || "Cancel order failed";
            });
    },
});

export const { setOrdersFilters, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
