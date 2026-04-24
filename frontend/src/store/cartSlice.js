import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "../api/cartApi";

export const fetchCartThunk = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const res = await cartApi.getCart();
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data || { message: err.message });
        }
    }
);

const initialState = {
    items: [],
    status: "idle",
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        clearCartError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload?.items || action.payload || [];
            })
            .addCase(fetchCartThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Fetch cart failed";
            });
    },
});

export const { clearCartError } = cartSlice.actions;
export default cartSlice.reducer;
