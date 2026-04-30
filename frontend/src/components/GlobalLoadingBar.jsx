import React from "react";
import { useSelector } from "react-redux";
import "../styles/ui.css";

export default function GlobalLoadingBar() {
    const authStatus = useSelector((state) => state.auth.status);
    const productStatus = useSelector((state) => state.products.status);
    const orderStatus = useSelector((state) => state.orders.status);
    const cartStatus = useSelector((state) => state.cart.status);
    const paymentLoading = useSelector((state) => state.payment?.loading);

    const loading =
        authStatus === "loading" ||
        productStatus === "loading" ||
        orderStatus === "loading" ||
        cartStatus === "loading" ||
        Boolean(paymentLoading);

    if (!loading) return null;

    return (
        <div className="global-loading-wrap" aria-live="polite" aria-label="Loading">
            <div className="global-loading-bar" />
        </div>
    );
}
