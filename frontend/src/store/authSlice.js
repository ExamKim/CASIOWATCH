import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/authApi";
import { normalizeApiError } from "../utils/apiError";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    status: "idle", // idle | loading | succeeded | failed
    error: null,
};

// REGISTER
export const registerThunk = createAsyncThunk(
    "auth/register",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await authApi.register(payload); // { user, token }
            return data;
        } catch (err) {
            return rejectWithValue(normalizeApiError(err, "Register failed"));
        }
    }
);

// LOGIN
export const loginThunk = createAsyncThunk(
    "auth/login",
    async (payload, { rejectWithValue }) => {
        try {
            const data = await authApi.login(payload); // { user, token }
            return data;
        } catch (err) {
            return rejectWithValue(normalizeApiError(err, "Login failed"));
        }
    }
);

// ME
export const meThunk = createAsyncThunk(
    "auth/me",
    async (_, { rejectWithValue }) => {
        try {
            const data = await authApi.me(); // user object
            return data;
        } catch (err) {
            return rejectWithValue(normalizeApiError(err, "Fetch user failed"));
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.status = "idle";
            state.error = null;
            localStorage.removeItem("token");
        },
        clearAuthError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // register
            .addCase(registerThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(registerThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(registerThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Register failed";
            })

            // login
            .addCase(loginThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(loginThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload.user;
                state.token = action.payload.token;
                localStorage.setItem("token", action.payload.token);
            })
            .addCase(loginThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Login failed";
            })

            // me
            .addCase(meThunk.pending, (state) => {
                state.status = "loading";
                state.error = null;
            })
            .addCase(meThunk.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.user = action.payload;
            })
            .addCase(meThunk.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload || "Fetch user failed";
            });
    },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;