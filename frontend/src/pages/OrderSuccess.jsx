import React, { useEffect, useMemo } from "react";
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

function formatDateTime(value) {
    if (!value) return "N/A";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    return date.toLocaleString("vi-VN");
}

function displayPaymentMethod(value) {
    const method = String(value || "").toLowerCase();
    if (method === "qr") return "QR Code";
    if (method === "momo") return "MoMo";
    if (method === "card") return "Thẻ";
    if (method === "cod") return "COD";
    return value || "N/A";
}

export default function OrderSuccess() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const dispatch = useDispatch();
    const { currentOrder, status } = useSelector((state) => state.orders);

    useEffect(() => {
        if (orderId) dispatch(fetchOrderByIdThunk(orderId));
    }, [orderId, dispatch]);

    const items = useMemo(() => (Array.isArray(currentOrder?.items) ? currentOrder.items : []), [currentOrder]);

    return (
        <div className="orders-page">
            <section className="orders-content order-success-card">
                <p className="orders-kicker">Đặt hàng thành công</p>
                <h1>Hóa đơn đơn hàng #{orderId || currentOrder?.id || "N/A"}</h1>
                <p>Thông tin đơn hàng của bạn đã được ghi nhận.</p>

                {status === "loading" && <p className="orders-note">Đang tải chi tiết hóa đơn...</p>}

                <div className="success-summary" style={{ marginBottom: 20 }}>
                    <p><strong>Mã đơn:</strong> #{orderId || currentOrder?.id || "N/A"}</p>
                    <p><strong>Ngày tạo:</strong> {formatDateTime(currentOrder?.created_at)}</p>
                    <p><strong>Phương thức thanh toán:</strong> {displayPaymentMethod(currentOrder?.payment_method)}</p>
                    <p><strong>Trạng thái thanh toán:</strong> {currentOrder?.payment_status || "pending"}</p>
                    <p><strong>Tổng thanh toán:</strong> {formatPrice(currentOrder?.total_price)}</p>
                </div>

                <div className="order-detail-items" style={{ marginBottom: 20 }}>
                    <h3 style={{ marginBottom: 12 }}>Chi tiết sản phẩm</h3>
                    {items.length === 0 ? (
                        <p className="orders-note">Chưa có dữ liệu sản phẩm trong đơn.</p>
                    ) : (
                        <div className="orders-list">
                            {items.map((item) => {
                                const quantity = Number(item.quantity || 0);
                                const price = Number(item.price || 0);
                                const lineTotal = quantity * price;
                                return (
                                    <article key={item.id || `${item.product_id}-${item.name}`} className="order-card">
                                        <div>
                                            <p className="order-card-label">Sản phẩm</p>
                                            <h3>{item.name}</h3>
                                        </div>
                                        <div>
                                            <p className="order-card-label">Đơn giá</p>
                                            <strong>{formatPrice(price)}</strong>
                                        </div>
                                        <div>
                                            <p className="order-card-label">Số lượng</p>
                                            <strong>{quantity}</strong>
                                        </div>
                                        <div>
                                            <p className="order-card-label">Thành tiền</p>
                                            <strong>{formatPrice(lineTotal)}</strong>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
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
