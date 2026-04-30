import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    toasts: [],
};

const uiSlice = createSlice({
    name: "ui",
    initialState,
    reducers: {
        addToast: {
            reducer(state, action) {
                state.toasts.push(action.payload);
            },
            prepare(payload) {
                return {
                    payload: {
                        id: Date.now() + Math.random(),
                        type: payload?.type || "info",
                        message: payload?.message || "",
                    },
                };
            },
        },
        removeToast(state, action) {
            state.toasts = state.toasts.filter((toast) => toast.id !== action.payload);
        },
        clearToasts(state) {
            state.toasts = [];
        },
    },
});

export const { addToast, removeToast, clearToasts } = uiSlice.actions;
export default uiSlice.reducer;
