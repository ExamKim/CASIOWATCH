import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import cartApi from "../api/cartApi";
import { normalizeApiError } from "../utils/apiError";

export const fetchCartThunk = createAsyncThunk(
    "cart/fetchCart",
    async (_, { rejectWithValue }) => {
        try {
            const response = await cartApi.getCart();
            return response.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Fetch cart failed") });
        }
    }
);

export const addToCartThunk = createAsyncThunk(
    "cart/addToCart",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartApi.addToCart(productId, quantity);
            return response.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Add to cart failed") });
        }
    }
);

export const updateCartItemThunk = createAsyncThunk(
    "cart/updateCartItem",
    async ({ productId, quantity }, { rejectWithValue }) => {
        try {
            const response = await cartApi.updateCartItem(productId, quantity);
            return response.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Update cart item failed") });
        }
    }
);

export const removeFromCartThunk = createAsyncThunk(
    "cart/removeFromCart",
    async (productId, { rejectWithValue }) => {
        try {
            const response = await cartApi.removeFromCart(productId);
            return response.data;
        } catch (err) {
            return rejectWithValue({ message: normalizeApiError(err, "Remove item failed") });
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
        clearCart(state) {
            state.items = [];
        },
        setCartItems(state, action) {
            state.items = Array.isArray(action.payload) ? action.payload : [];
        },
    },
    extraReducers: (builder) => {
        // fetchCartThunk
        builder
            .addCase(fetchCartThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(fetchCartThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload || [];
            })
            .addCase(fetchCartThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || action.error.message;
            });

        // addToCartThunk
        builder
            .addCase(addToCartThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(addToCartThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload || [];
            })
            .addCase(addToCartThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Add to cart failed";
            });

        // updateCartItemThunk
        builder
            .addCase(updateCartItemThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(updateCartItemThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload || [];
            })
            .addCase(updateCartItemThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Update cart item failed";
            });

        // removeFromCartThunk
        builder
            .addCase(removeFromCartThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(removeFromCartThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.items = action.payload || [];
            })
            .addCase(removeFromCartThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload?.message || "Remove from cart failed";
            });
    },
});

export const { clearCart, setCartItems } = cartSlice.actions;
export default cartSlice.reducer;