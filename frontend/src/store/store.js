import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import productReducer from "./productSlice";
import orderReducer from "./ordersSlice";
import cartReducer from "./cartSlice";


export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        orders: orderReducer,
        cart: cartReducer,
    },
});