import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
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

function statusClass(status) {
    return `status-chip status-${String(status || "pending").toLowerCase()}`;
}

export default function OrderDetail() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const { currentOrder, status, error } = useSelector((state) => state.orders);

    useEffect(() => {
        if (id) dispatch(fetchOrderByIdThunk(id));
    }, [id, dispatch]);

    const canPay =
        currentOrder &&
        currentOrder.payment_status !== "paid" &&
        currentOrder.status !== "cancelled";

    return (
        <div className="orders-page">
            <section className="orders-hero">
                <p className="orders-kicker">Đơn hàng</p>
                <h1>Chi tiết đơn #{id}</h1>
                <p>Xem danh sách sản phẩm, tổng tiền và trạng thái thanh toán hiện tại.</p>
            </section>

            <section className="orders-content">
                {status === "loading" && <p className="orders-note">Đang tải chi tiết đơn hàng...</p>}
                {status === "failed" && <p className="orders-error">{error || "Không thể tải chi tiết đơn hàng"}</p>}

                {currentOrder && status !== "loading" && (
                    <>
                        <div className="order-detail-top">
                            <div>
                                <p className="order-card-label">Trạng thái đơn</p>
                                <span className={statusClass(currentOrder.status)}>{currentOrder.status}</span>
                            </div>
                            <div>
                                <p className="order-card-label">Thanh toán</p>
                                <span className={statusClass(currentOrder.payment_status || "pending")}>{currentOrder.payment_status || "pending"}</span>
                            </div>
                            <div>
                                <p className="order-card-label">Tổng tiền</p>
                                <strong>{formatPrice(currentOrder.total_price)}</strong>
                            </div>
                            <div className="order-card-actions">
                                <Link to="/my-orders" className="orders-outline-btn">Về danh sách</Link>
                                {canPay && <Link to={`/payment?orderId=${currentOrder.id}`} className="orders-primary-btn">Thanh toán ngay</Link>}
                            </div>
                        </div>

                        <div className="order-items-wrap">
                            <h2>Sản phẩm trong đơn</h2>
                            {Array.isArray(currentOrder.items) && currentOrder.items.length > 0 ? (
                                <div className="order-items-table">
                                    <div className="order-items-head">
                                        <span>Sản phẩm</span>
                                        <span>Đơn giá</span>
                                        <span>SL</span>
                                        <span>Thành tiền</span>
                                    </div>
                                    {currentOrder.items.map((item) => (
                                        <div key={item.id} className="order-items-row">
                                            <span>{item.name}</span>
                                            <span>{formatPrice(item.price)}</span>
                                            <span>{item.quantity}</span>
                                            <strong>{formatPrice(Number(item.price) * Number(item.quantity))}</strong>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="orders-note">Không có sản phẩm trong đơn hàng.</p>
                            )}
                        </div>
                    </>
                )}
            </section>

            <SiteFooter />
        </div>
    );
}

