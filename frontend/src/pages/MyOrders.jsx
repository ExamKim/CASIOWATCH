import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { cancelOrderThunk, fetchMyOrdersThunk } from "../store/ordersSlice";
import { addToast } from "../store/uiSlice";
import SiteFooter from "../components/SiteFooter";
import "../styles/orders.css";

function formatPrice(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

function statusClass(status) {
    return `status-chip status-${String(status || "pending").toLowerCase()}`;
}

export default function MyOrders() {
    const dispatch = useDispatch();
    const { myOrders, status, error } = useSelector((state) => state.orders);
    const [cancellingId, setCancellingId] = useState(null);

    useEffect(() => {
        dispatch(fetchMyOrdersThunk());
    }, [dispatch]);

    const canPay = (order) => ["pending", "failed", "unpaid", "cancelled"].includes(String(order.payment_status || "").toLowerCase())
        && String(order.status || "").toLowerCase() !== "cancelled";

    const canCancel = (order) => {
        const statusValue = String(order.status || "").toLowerCase();
        return !["cancelled", "completed", "delivered"].includes(statusValue);
    };

    const handleCancel = async (orderId) => {
        try {
            setCancellingId(orderId);
            await dispatch(cancelOrderThunk(orderId)).unwrap();
            dispatch(addToast({ type: "success", message: `Đã hủy đơn #${orderId}` }));
        } catch (err) {
            dispatch(addToast({ type: "error", message: err?.message || "Không thể hủy đơn hàng" }));
        } finally {
            setCancellingId(null);
        }
    };

    return (
        <div className="orders-page">
            <section className="orders-hero">
                <p className="orders-kicker">Tài khoản</p>
                <h1>Đơn hàng của bạn</h1>
                <p>Theo dõi trạng thái xử lý và thanh toán của từng đơn hàng.</p>
            </section>

            <section className="orders-content">
                {status === "loading" && <p className="orders-note">Đang tải đơn hàng...</p>}
                {status === "failed" && <p className="orders-error">{error || "Không thể tải đơn hàng"}</p>}

                {status !== "loading" && myOrders.length === 0 && (
                    <div className="orders-empty">
                        <h2>Bạn chưa có đơn hàng nào</h2>
                        <p>Hãy khám phá bộ sưu tập và đặt đơn đầu tiên của bạn.</p>
                        <Link to="/products" className="orders-primary-btn">Mua sắm ngay</Link>
                    </div>
                )}

                {myOrders.length > 0 && (
                    <div className="orders-list">
                        {myOrders.map((order) => (
                            <article key={order.id} className="order-card">
                                <div>
                                    <p className="order-card-label">Mã đơn</p>
                                    <h3>#{order.id}</h3>
                                </div>
                                <div>
                                    <p className="order-card-label">Tổng tiền</p>
                                    <strong>{formatPrice(order.total_price)}</strong>
                                </div>
                                <div>
                                    <p className="order-card-label">Trạng thái</p>
                                    <span className={statusClass(order.status)}>{order.status}</span>
                                </div>
                                <div>
                                    <p className="order-card-label">Thanh toán</p>
                                    <span className={statusClass(order.payment_status || "pending")}>{order.payment_status || "pending"}</span>
                                </div>
                                <div className="order-card-actions">
                                    <Link to={`/orders/${order.id}`} className="orders-outline-btn">Chi tiết</Link>
                                    {canPay(order) && (
                                        <Link to={`/payment?orderId=${order.id}`} className="orders-primary-btn">Thanh toán</Link>
                                    )}
                                    {canCancel(order) && (
                                        <button
                                            type="button"
                                            className="orders-outline-btn"
                                            disabled={cancellingId === order.id}
                                            onClick={() => handleCancel(order.id)}
                                        >
                                            {cancellingId === order.id ? "Đang hủy..." : "Hủy đơn"}
                                        </button>
                                    )}
                                </div>
                            </article>
                        ))}
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}
