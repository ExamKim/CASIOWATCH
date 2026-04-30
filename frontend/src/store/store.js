import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import orderReducer from "./ordersSlice";
import cartReducer from "./cartSlice";
import paymentReducer from "./paymentSlice";
import uiReducer from "./uiSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        orders: orderReducer,
        cart: cartReducer,
        payment: paymentReducer,
        ui: uiReducer,
    },
});