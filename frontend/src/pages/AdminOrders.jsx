import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    confirmOrderPaymentThunk,
    fetchOrdersThunk,
    updateOrderStatusThunk,
} from "../store/ordersSlice";
import { addToast } from "../store/uiSlice";
import SiteFooter from "../components/SiteFooter";
import "../styles/admin.css";

function formatPrice(value) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(value || 0));
}

const STATUS_OPTIONS = ["pending", "processing", "shipped", "completed", "cancelled"];

export default function AdminOrders() {
    const dispatch = useDispatch();
    const { allOrders, status, error } = useSelector((state) => state.orders);

    useEffect(() => {
        dispatch(fetchOrdersThunk());
    }, [dispatch]);

    const updateStatus = async (orderId, nextStatus) => {
        try {
            await dispatch(updateOrderStatusThunk({ orderId, status: nextStatus })).unwrap();
            dispatch(addToast({ type: "success", message: `Đơn #${orderId} đã cập nhật trạng thái` }));
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Cập nhật thất bại" }));
        }
    };

    const confirmPayment = async (orderId) => {
        try {
            await dispatch(confirmOrderPaymentThunk(orderId)).unwrap();
            dispatch(addToast({ type: "success", message: `Đơn #${orderId} đã xác nhận thanh toán` }));
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Xác nhận thất bại" }));
        }
    };

    return (
        <div className="admin-page">
            <section className="admin-hero">
                <p className="admin-kicker">Admin</p>
                <h1>Quan ly đơn hàng</h1>
                <p>Danh sách đơn hàng hệ thống, cập nhật trạng thái và xác nhận thanh toán.</p>
            </section>

            <section className="admin-content">
                {status === "loading" && <p className="admin-note">Đang tải đơn hàng...</p>}
                {status === "failed" && <p className="admin-error">{error || "Không thể tải đơn hàng"}</p>}

                {allOrders.length === 0 && status !== "loading" && (
                    <div className="admin-empty">Không có đơn hàng nào.</div>
                )}

                {allOrders.length > 0 && (
                    <div className="admin-table-wrap">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Payment</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allOrders.map((order) => (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>{order.user_id}</td>
                                        <td>{formatPrice(order.total_price)}</td>
                                        <td>
                                            <select
                                                value={order.status || "pending"}
                                                onChange={(e) => updateStatus(order.id, e.target.value)}
                                            >
                                                {STATUS_OPTIONS.map((option) => (
                                                    <option key={option} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>{order.payment_status || "pending"}</td>
                                        <td>
                                            <div className="admin-row-actions">
                                                <Link to={`/orders/${order.id}`} className="admin-link-btn">Detail</Link>
                                                {order.payment_status !== "paid" && (
                                                    <button type="button" onClick={() => confirmPayment(order.id)}>
                                                        Confirm payment
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}

