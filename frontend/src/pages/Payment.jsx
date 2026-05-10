import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QRPaymentInfo from "../components/QRPaymentInfo";
import { fetchOrderByIdThunk } from "../store/ordersSlice";
import { clearPaymentState, createQR, payCOD } from "../store/paymentSlice";
import { getPaymentMethodVi } from "../utils/locale";
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

export default function Payment() {
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get("orderId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { currentOrder } = useSelector((state) => state.orders);
    const paymentState = useSelector((state) => state.payment);

    const paymentMethodFromState = useMemo(() => {
        const method = location.state?.paymentMethod;
        if (method && ["qr", "cod"].includes(String(method).toLowerCase())) {
            return String(method).toLowerCase();
        }
        return "qr";
    }, [location.state]);

    const [method, setMethod] = useState(paymentMethodFromState);

    useEffect(() => {
        if (orderId) dispatch(fetchOrderByIdThunk(orderId));
        return () => {
            dispatch(clearPaymentState());
        };
    }, [dispatch, orderId]);

    useEffect(() => {
        setMethod(paymentMethodFromState);
    }, [paymentMethodFromState]);

    const qrData = useMemo(() => {
        if (!paymentState.qr) return null;
        return {
            qrContent: paymentState.qr.qrContent,
            note: paymentState.qr.note,
            qrImageUrl: paymentState.qr.qrImageUrl,
            bankCode: paymentState.qr.bankCode,
            accountNo: paymentState.qr.accountNo,
            accountName: paymentState.qr.accountName,
            amount: paymentState.qr.amount,
        };
    }, [paymentState.qr]);

    useEffect(() => {
        if (!orderId || paymentState.loading) return;

        if (method === "qr" && !paymentState.qr) {
            handleCreateQR();
        } else if (method === "cod" && currentOrder && currentOrder.status === "pending") {
            handleCOD();
        }
    }, [orderId, method, paymentState.qr, paymentState.loading, currentOrder]);

    const handleCreateQR = async () => {
        try {
            await dispatch(createQR(Number(orderId))).unwrap();
            dispatch(fetchOrderByIdThunk(orderId));
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Không tạo được QR" }));
        }
    };

    const handleCOD = async () => {
        try {
            await dispatch(payCOD(Number(orderId))).unwrap();
            dispatch(addToast({ type: "success", message: "Đơn hàng COD đã được ghi nhận" }));
            navigate(`/order-success?orderId=${orderId}`);
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Không thể chọn COD" }));
        }
    };

    if (!orderId) {
        return (
            <div className="orders-page">
                <section className="orders-content">
                    <div className="orders-empty">
                        <h2>Không tìm thấy mã đơn</h2>
                        <Link to="/my-orders" className="orders-primary-btn">Về đơn hàng của tôi</Link>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="orders-page">
            <section className="orders-hero">
                <p className="orders-kicker">Thanh toán</p>
                <h1>Thanh toán đơn #{orderId}</h1>
                <p>Thông tin thanh toán của bạn đã được chuẩn bị sẵn sàng.</p>
            </section>

            <section className="orders-content payment-layout">
                <div className="payment-card">
                    <h2>Phương thức thanh toán: <strong>{getPaymentMethodVi(method)}</strong></h2>

                    {method === "qr" && (
                        <div className="payment-method-panel">
                            {paymentState.loading && !qrData ? (
                                <p>Đang khởi tạo thông tin chuyển khoản...</p>
                            ) : (
                                <>
                                    <p>Quét QR hoặc copy nội dung chuyển khoản bên dưới để hoàn tất đơn hàng.</p>
                                    <QRPaymentInfo
                                        qr={qrData?.qrContent}
                                        note={qrData?.note}
                                        qrImageUrl={qrData?.qrImageUrl}
                                        bankCode={qrData?.bankCode}
                                        accountNo={qrData?.accountNo}
                                        accountName={qrData?.accountName}
                                        amount={qrData?.amount}
                                    />
                                    {qrData?.qrImageUrl && (
                                        <div className="payment-summary-card" style={{ marginTop: 16 }}>
                                            <p>Sau khi chuyển khoản, hệ thống sẽ kiểm tra và cập nhật trạng thái đơn hàng của bạn.</p>
                                            <div className="order-card-actions">
                                                <Link to={`/orders/${orderId}`} className="orders-primary-btn">Xem chi tiết đơn</Link>
                                                <Link to="/my-orders" className="orders-outline-btn">Danh sách đơn hàng</Link>
                                                <Link to="/products" className="orders-outline-btn">Tiếp tục mua sắm</Link>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}

                    {method === "cod" && (
                        <div className="payment-method-panel">
                            {paymentState.loading ? (
                                <p>Đang xác nhận hình thức COD...</p>
                            ) : (
                                <>
                                    <p>Hệ thống đang ghi nhận yêu cầu thanh toán khi nhận hàng của bạn.</p>
                                    <div className="payment-summary-card" style={{ marginTop: 16 }}>
                                        <p><strong>Số tiền thu khi giao hàng:</strong> {formatPrice(currentOrder?.total_price)}</p>
                                        <div className="order-card-actions">
                                            <Link to={`/orders/${orderId}`} className="orders-primary-btn">Xem chi tiết đơn</Link>
                                            <Link to="/my-orders" className="orders-outline-btn">Danh sách đơn hàng</Link>
                                            <Link to="/products" className="orders-outline-btn">Tiếp tục mua sắm</Link>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <aside className="payment-summary-card">
                    <h3>Tổng quan đơn hàng</h3>
                    <p><strong>Mã đơn:</strong> #{orderId}</p>
                    <p><strong>Tổng tiền:</strong> {formatPrice(currentOrder?.total_price)}</p>
                    <p><strong>Trạng thái:</strong> {currentOrder?.status || "pending"}</p>
                    <p><strong>Thanh toán:</strong> {currentOrder?.payment_status || "pending"}</p>
                    <div className="order-card-actions">
                        <Link to={`/orders/${orderId}`} className="orders-outline-btn">Xem chi tiết đơn</Link>
                    </div>
                </aside>
            </section>

            <SiteFooter />
        </div>
    );
}

