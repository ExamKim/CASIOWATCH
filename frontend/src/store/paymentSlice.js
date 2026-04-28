import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import paymentApi from '../api/paymentApi';

export const payCOD = createAsyncThunk(
    'payment/payCOD',
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await paymentApi.payCOD(orderId);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

export const createQR = createAsyncThunk(
    'payment/createQR',
    async (orderId, { rejectWithValue }) => {
        try {
            const res = await paymentApi.createQR(orderId);
            return res;
        } catch (err) {
            return rejectWithValue(err.response?.data || err.message);
        }
    }
);

const paymentSlice = createSlice({
    name: 'payment',
    initialState: {
        loading: false,
        error: null,
        qr: null,
        codResult: null,
    },
    reducers: {
        clearPaymentState(state) {
            state.loading = false;
            state.error = null;
            state.qr = null;
            state.codResult = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(payCOD.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(payCOD.fulfilled, (state, action) => {
                state.loading = false;
                state.codResult = action.payload;
            })
            .addCase(payCOD.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(createQR.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createQR.fulfilled, (state, action) => {
                state.loading = false;
                state.qr = action.payload;
            })
            .addCase(createQR.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { clearPaymentState } = paymentSlice.actions;
export default paymentSlice.reducer;
