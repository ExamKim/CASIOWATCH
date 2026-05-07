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

    const handleCreateQR = async () => {
        try {
            await dispatch(createQR(Number(orderId))).unwrap();
            dispatch(addToast({ type: "success", message: "Đã tạo thông tin thanh toán QR" }));
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
                <p>Chọn phương thức thanh toán phù hợp và hoàn tất đơn hàng.</p>
            </section>

            <section className="orders-content payment-layout">
                <div className="payment-card">
                    <h2>Phương thức thanh toán: <strong>{getPaymentMethodVi(method)}</strong></h2>

                    {method === "qr" && (
                        <div className="payment-method-panel">
                            <p>Quét QR hoặc copy nội dung chuyển khoản bên dưới. Đơn sẽ ở trạng thái chờ thanh toán cho đến khi được đối soát.</p>
                            <button type="button" className="orders-primary-btn" onClick={handleCreateQR} disabled={paymentState.loading}>
                                {paymentState.loading ? "Đang tạo QR..." : "Tạo thông tin QR"}
                            </button>
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
                                    <p>Đơn hàng đã được ghi nhận. Sau khi chuyển khoản, hệ thống sẽ xử lý đơn theo trạng thái chờ thanh toán.</p>
                                    <div className="order-card-actions">
                                        <Link to={`/orders/${orderId}`} className="orders-outline-btn">Xem chi tiết đơn</Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {method === "cod" && (
                        <div className="payment-method-panel">
                            <p>Chọn COD nghĩa là bạn thanh toán khi nhận hàng. Đơn sẽ được chuyển sang trạng thái đang xử lý sau khi xác nhận.</p>
                            <button type="button" className="orders-primary-btn" onClick={handleCOD} disabled={paymentState.loading}>
                                {paymentState.loading ? "Đang xác nhận..." : "Xác nhận COD"}
                            </button>
                            <div className="payment-summary-card" style={{ marginTop: 16 }}>
                                <p><strong>Số tiền thu khi giao hàng:</strong> {formatPrice(currentOrder?.total_price)}</p>
                                <div className="order-card-actions">
                                    <Link to={`/orders/${orderId}`} className="orders-outline-btn">Xem chi tiết đơn</Link>
                                </div>
                            </div>
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

