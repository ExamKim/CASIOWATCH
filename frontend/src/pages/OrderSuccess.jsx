import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrderByIdThunk } from "../store/ordersSlice";
import SiteFooter from "../components/SiteFooter";
import "../styles/orders.css";

function formatPrice(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

export default function OrderSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const dispatch = useDispatch();
    const { currentOrder } = useSelector((state) => state.orders);

    useEffect(() => {
        if (orderId) dispatch(fetchOrderByIdThunk(orderId));
    }, [orderId, dispatch]);

    return (
        <div className="orders-page">
            <section className="orders-content order-success-card">
                <p className="orders-kicker">Thanh toán thành công</p>
                <h1>Cảm ơn bạn đã đặt hàng</h1>
                <p>Đơn hàng của bạn đã được ghi nhận và đang được xử lý.</p>

                <div className="success-summary">
                    <p><strong>Mã đơn:</strong> #{orderId || currentOrder?.id || "N/A"}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(currentOrder?.total_price)}</p>
                    <p><strong>Thanh toán:</strong> {currentOrder?.payment_status || "paid"}</p>
                </div>

                <div className="order-card-actions">
                    {orderId && <Link to={`/orders/${orderId}`} className="orders-primary-btn">Xem chi tiết đơn</Link>}
                    <Link to="/my-orders" className="orders-outline-btn">Danh sách đơn hàng</Link>
                    <Link to="/products" className="orders-outline-btn">Mua thêm</Link>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
}

