import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import orderApi from "../api/orderApi";
import { fetchCartThunk } from "../store/cartSlice";
import { clearGuestCart, getGuestCart } from "../utils/guestCart";
import { getProductImage } from "../utils/productImage";
import SiteFooter from "../components/SiteFooter";
import "../styles/catalog.css";

function formatPrice(value) {
    const price = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(price);
}

const Checkout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { items: cartItems } = useSelector((state) => state.cart);
    const [guestItems, setGuestItems] = useState([]);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "Nguyen Van A",
        phone: "090 123 4567",
        email: "email@casio-luxury.vn",
        address: "52 Tran Hung Dao, Quan 1, Ho Chi Minh",
        paymentMethod: "cod",
    });

    useEffect(() => {
        if (token) {
            dispatch(fetchCartThunk());
        } else {
            setGuestItems(getGuestCart());
        }
    }, [dispatch, token]);

    const items = useMemo(
        () => (token ? (Array.isArray(cartItems) ? cartItems : []) : guestItems),
        [token, cartItems, guestItems]
    );

    const summary = useMemo(() => {
        const subtotal = items.reduce((total, item) => {
            const price = Number(item.price || 0);
            const quantity = Number(item.quantity || 0);
            return total + price * quantity;
        }, 0);

        const shipping = subtotal > 0 ? 0 : 0;
        const total = subtotal + shipping;

        return { subtotal, shipping, total };
    }, [items]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setStatus("loading");
            setMessage("");

            if (items.length === 0) {
                setMessage("Gio hang dang trong.");
                setStatus("idle");
                return;
            }

            if (token) {
                const res = await orderApi.createOrder({
                    ...formData,
                    paymentMethod: formData.paymentMethod,
                });
                await dispatch(fetchCartThunk());
                setMessage("Dat hang thanh cong. Ma don: " + (res.data?.id || "N/A"));
                navigate("/products");
            } else {
                clearGuestCart();
                setGuestItems([]);
                setMessage("Dat hang thanh cong tren che do thu nghiem.");
            }
        } catch (err) {
            setMessage(err?.response?.data?.message || "Khong the tao don hang");
        } finally {
            setStatus("idle");
        }
    };

    return (
        <div className="checkout-page">
            <section className="checkout-hero">
                <p className="checkout-kicker">Thanh toán</p>
                <h1>Thanh Toán</h1>
                <p>Hoan tat don hang cua ban de san pham co the duoc gui di ngay.</p>
            </section>

            {message && <div className="checkout-message">{message}</div>}

            <form className="checkout-layout" onSubmit={handleSubmit}>
                <div className="checkout-main">
                    <section className="checkout-card">
                        <div className="checkout-step-head">
                            <span className="checkout-step-badge">1</span>
                            <h2>Thông tin giao hàng</h2>
                        </div>

                        <div className="checkout-form-grid">
                            <label className="checkout-field">
                                <span>Họ và tên</span>
                                <input name="fullName" value={formData.fullName} onChange={handleChange} />
                            </label>
                            <label className="checkout-field">
                                <span>Số điện thoại</span>
                                <input name="phone" value={formData.phone} onChange={handleChange} />
                            </label>
                            <label className="checkout-field checkout-field-full">
                                <span>Email</span>
                                <input name="email" value={formData.email} onChange={handleChange} />
                            </label>
                            <label className="checkout-field checkout-field-full">
                                <span>Địa chỉ giao hàng</span>
                                <textarea name="address" rows="4" value={formData.address} onChange={handleChange} />
                            </label>
                        </div>
                    </section>

                    <section className="checkout-card">
                        <div className="checkout-step-head">
                            <span className="checkout-step-badge">2</span>
                            <h2>Phương thức thanh toán</h2>
                        </div>

                        <div className="payment-options">
                            <label className={`payment-option ${formData.paymentMethod === "cod" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="cod"
                                    checked={formData.paymentMethod === "cod"}
                                    onChange={handleChange}
                                />
                                <div>
                                    <strong>COD</strong>
                                    <span>Thanh toán khi nhận hàng</span>
                                </div>
                            </label>

                            <label className={`payment-option ${formData.paymentMethod === "bank" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="bank"
                                    checked={formData.paymentMethod === "bank"}
                                    onChange={handleChange}
                                />
                                <div>
                                    <strong>Trực tuyến</strong>
                                    <span>Thanh toán qua ví / thẻ</span>
                                </div>
                            </label>
                        </div>
                    </section>
                </div>

                <aside className="checkout-summary">
                    <h2>Tóm tắt đơn hàng</h2>

                    <div className="checkout-summary-list">
                        {items.length === 0 ? (
                            <p className="checkout-empty-note">Chưa có sản phẩm nào trong giỏ hàng.</p>
                        ) : (
                            items.map((item) => {
                                const quantity = Number(item.quantity || 1);
                                const price = Number(item.price || 0);
                                const total = quantity * price;

                                return (
                                    <div className="checkout-summary-item" key={item.product_id}>
                                        <img
                                            src={getProductImage(item)}
                                            alt={item.name}
                                            onError={(e) => {
                                                e.currentTarget.src = getProductImage({ ...item, image_url: "" });
                                            }}
                                        />
                                        <div>
                                            <strong>{item.name}</strong>
                                            <span>{quantity} x {formatPrice(price)}</span>
                                        </div>
                                        <b>{formatPrice(total)}</b>
                                    </div>
                                );
                            })
                        )}
                    </div>

                    <div className="checkout-summary-lines">
                        <div>
                            <span>Tạm tính</span>
                            <strong>{formatPrice(summary.subtotal)}</strong>
                        </div>
                        <div>
                            <span>Phí vận chuyển</span>
                            <strong>{summary.shipping === 0 ? "Miễn phí" : formatPrice(summary.shipping)}</strong>
                        </div>
                    </div>

                    <div className="checkout-total">
                        <span>Tổng cộng</span>
                        <strong>{formatPrice(summary.total)}</strong>
                    </div>

                    <button type="submit" className="checkout-submit-btn" disabled={status === "loading"}>
                        {status === "loading" ? "Dang xu ly..." : "Dat hang ngay"}
                    </button>

                    <p className="checkout-note">Thanh toán an toàn và hỗ trợ đổi trả trong 7 ngày.</p>
                </aside>
            </form>

            <SiteFooter />
        </div>
    );
};

export default Checkout;