import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import QRPaymentInfo from "../components/QRPaymentInfo";
import paymentApi from "../api/paymentApi";
import { fetchOrderByIdThunk } from "../store/ordersSlice";
import { clearPaymentState, createQR, payCOD } from "../store/paymentSlice";
import { addToast } from "../store/uiSlice";
import { normalizeApiError } from "../utils/apiError";
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
        if (method && ["qr", "momo", "card"].includes(String(method).toLowerCase())) {
            return String(method).toLowerCase();
        }
        return "qr";
    }, [location.state]);

    const [method, setMethod] = useState(paymentMethodFromState);
    const [cardLoading, setCardLoading] = useState(false);

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
            dispatch(addToast({ type: "success", message: "Da tao noi dung QR thành công" }));
            dispatch(fetchOrderByIdThunk(orderId));
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Không tạo được QR" }));
        }
    };

    const handleCOD = async () => {
        try {
            await dispatch(payCOD(Number(orderId))).unwrap();
            dispatch(addToast({ type: "success", message: "Da chon COD thành công" }));
            navigate(`/orders/${orderId}`);
        } catch (err) {
            dispatch(addToast({ type: "error", message: typeof err === "string" ? err : "Không thể chọn COD" }));
        }
    };

    const handleCardSimulate = async (result) => {
        try {
            setCardLoading(true);
            await paymentApi.simulateCard(Number(orderId), result);
            if (result === "success") {
                dispatch(addToast({ type: "success", message: "Thanh toán thẻ thành công" }));
                navigate(`/order-success?orderId=${orderId}`);
            } else {
                dispatch(addToast({ type: "warning", message: "Giao dịch thẻ thất bại (giả lập)" }));
                dispatch(fetchOrderByIdThunk(orderId));
            }
        } catch (err) {
            dispatch(addToast({ type: "error", message: normalizeApiError(err, "Thanh toán thẻ thất bại") }));
        } finally {
            setCardLoading(false);
        }
    };

    const handleConfirmOnline = async () => {
        try {
            setCardLoading(true);
            await paymentApi.confirmOnline(Number(orderId), method);
            dispatch(addToast({ type: "success", message: `Thanh toán ${method} thành công` }));
            navigate(`/order-success?orderId=${orderId}`);
        } catch (err) {
            dispatch(addToast({ type: "error", message: normalizeApiError(err, "Thanh toán thất bại") }));
        } finally {
            setCardLoading(false);
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
                    <h2>Phương thức thanh toán</h2>
                    <div className="payment-method-tabs">
                        <button type="button" className={method === "qr" ? "active" : ""} onClick={() => setMethod("qr")}>QR Code</button>
                        <button type="button" className={method === "momo" ? "active" : ""} onClick={() => setMethod("momo")}>MoMo</button>
                        <button type="button" className={method === "card" ? "active" : ""} onClick={() => setMethod("card")}>Thẻ</button>
                    </div>

                    {method === "qr" && (
                        <div className="payment-method-panel">
                            <p>Quet QR hoac copy noi dung thanh toán ben duoi.</p>
                            <button type="button" className="orders-primary-btn" onClick={handleCreateQR} disabled={paymentState.loading}>
                                {paymentState.loading ? "Đang tạo QR..." : "Tao thong tin QR"}
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
                            <button type="button" className="orders-primary-btn" onClick={handleConfirmOnline} disabled={cardLoading || !qrData?.qrImageUrl}>
                                {cardLoading ? "Đang xác nhận..." : "Đã thanh toán, xác nhận"}
                            </button>
                        </div>
                    )}

                    {method === "momo" && (
                        <div className="payment-method-panel">
                            <p>Sử dụng ứng dụng MoMo để quét mã QR hoặc nhập thông tin để thanh toán.</p>
                            <div style={{ marginBottom: 16, padding: 16, borderRadius: 8, background: "#f0f0f0" }}>
                                <strong style={{ display: "block", marginBottom: 8 }}>Thông tin thanh toán MoMo</strong>
                                <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.6 }}>
                                    <div><strong>Số tiền:</strong> {formatPrice(currentOrder?.total_price)}</div>
                                    <div><strong>Nội dung:</strong> CASIO_{orderId}</div>
                                </div>
                            </div>
                            <button type="button" className="orders-primary-btn" onClick={handleConfirmOnline} disabled={cardLoading}>
                                {cardLoading ? "Đang xác nhận..." : "Đã thanh toán, xác nhận"}
                            </button>
                        </div>
                    )}

                    {method === "card" && (
                        <div className="payment-method-panel">
                            <p>Nhập thông tin thẻ của bạn hoặc sử dụng thẻ được lưu để thanh toán.</p>
                            <div style={{ marginBottom: 16, padding: 16, borderRadius: 8, background: "#f0f0f0" }}>
                                <strong style={{ display: "block", marginBottom: 8 }}>Thông tin thanh toán Thẻ</strong>
                                <div style={{ fontSize: "14px", color: "#555", lineHeight: 1.6 }}>
                                    <div><strong>Số tiền:</strong> {formatPrice(currentOrder?.total_price)}</div>
                                    <div><strong>Loại thẻ:</strong> ATM / Visa / Mastercard</div>
                                </div>
                            </div>
                            <div className="payment-card-actions">
                                <button type="button" className="orders-primary-btn" onClick={handleConfirmOnline} disabled={cardLoading}>
                                    {cardLoading ? "Đang xác nhận..." : "Đã thanh toán, xác nhận"}
                                </button>
                                <button type="button" className="orders-outline-btn" onClick={() => handleCardSimulate("fail")} disabled={cardLoading}>
                                    Giả lập thất bại
                                </button>
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

