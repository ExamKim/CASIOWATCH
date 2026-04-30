import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import ordersApi from "../api/ordersApi";
import { normalizeApiError } from "../utils/apiError";

// Admin - Get all orders
export const fetchOrdersThunk = createAsyncThunk(
    "orders/fetchOrders",
    async (filters, { rejectWithValue }) => {
        try {
            const res = await ordersApi.getOrders(filters);
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Fetch orders failed") });
        }
    }
);

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
    async (_, { rejectWithValue }) => {
        try {
            const res = await ordersApi.createOrder();
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Create order failed") });
        }
    }
);

// Admin - Update order status
export const updateOrderStatusThunk = createAsyncThunk(
    "orders/updateOrderStatus",
    async ({ orderId, status }, { rejectWithValue }) => {
        try {
            const res = await ordersApi.updateOrderStatus(orderId, status);
            return res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Update order status failed") });
        }
    }
);

export const confirmOrderPaymentThunk = createAsyncThunk(
    "orders/confirmOrderPayment",
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await ordersApi.confirmOrderPayment(orderId);
            return res.data?.order || res.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Confirm payment failed") });
        }
    }
);

const initialState = {
    allOrders: [],
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
        // fetchOrdersThunk (admin)
        builder
            .addCase(fetchOrdersThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchOrdersThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.allOrders = action.payload || [];
            })
            .addCase(fetchOrdersThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Fetch orders failed";
            });

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

        // updateOrderStatusThunk
        builder
            .addCase(updateOrderStatusThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedOrder = action.payload;
                // Update in allOrders
                const allIndex = state.allOrders.findIndex(o => o.id === updatedOrder.id);
                if (allIndex !== -1) {
                    state.allOrders[allIndex] = updatedOrder;
                }
                // Update current order if viewing
                if (state.currentOrder?.id === updatedOrder.id) {
                    state.currentOrder = updatedOrder;
                }
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Update order status failed";
            })

            .addCase(confirmOrderPaymentThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(confirmOrderPaymentThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                const updatedOrder = action.payload;
                const allIndex = state.allOrders.findIndex((o) => o.id === updatedOrder.id);
                if (allIndex !== -1) state.allOrders[allIndex] = updatedOrder;
                const myIndex = state.myOrders.findIndex((o) => o.id === updatedOrder.id);
                if (myIndex !== -1) state.myOrders[myIndex] = updatedOrder;
                if (state.currentOrder?.id === updatedOrder.id) state.currentOrder = updatedOrder;
            })
            .addCase(confirmOrderPaymentThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Confirm payment failed";
            });
    },
});

export const { setOrdersFilters, clearCurrentOrder } = ordersSlice.actions;
export default ordersSlice.reducer;
