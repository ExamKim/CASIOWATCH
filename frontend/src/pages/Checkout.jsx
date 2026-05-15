import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { createOrderThunk } from "../store/ordersSlice";
import { updateProfileThunk } from "../store/authSlice";
import { fetchCartThunk } from "../store/cartSlice";
import { addToast } from "../store/uiSlice";
import { getProductImage } from "../utils/productImage";
import { getEffectivePrice } from "../utils/pricing";
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
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { items: cartItems } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth);
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        note: "",
        paymentMethod: "qr",
    });
    const [saveToProfile, setSaveToProfile] = useState(false);

    useEffect(() => {
        dispatch(fetchCartThunk());
    }, [dispatch]);

    useEffect(() => {
        if (!user) return;

        setFormData((prev) => ({
            ...prev,
            fullName: user.username || user.fullName || prev.fullName,
            email: user.email || prev.email,
            phone: user.phone || prev.phone,
            address: user.address || prev.address,
        }));
    }, [user]);

    const selectedProductIds = useMemo(() => {
        const ids = Array.isArray(location.state?.selectedProductIds)
            ? location.state.selectedProductIds
            : [];
        return ids
            .map((value) => Number(value))
            .filter((value) => Number.isInteger(value) && value > 0);
    }, [location.state]);

    const buyNowProduct = useMemo(() => {
        const product = location.state?.buyNowProduct || null;
        if (!product) return null;
        return {
            ...product,
            quantity: Number(product.quantity || 1),
        };
    }, [location.state]);

    const directBuyNowId = useMemo(() => {
        const fromState = Number(buyNowProduct?.id ?? buyNowProduct?.product_id);
        if (Number.isInteger(fromState) && fromState > 0) return fromState;

        const fromQuery = Number(searchParams.get("buyNowProductId"));
        if (Number.isInteger(fromQuery) && fromQuery > 0) return fromQuery;

        return null;
    }, [buyNowProduct, searchParams]);

    const items = useMemo(() => {
        const allItems = Array.isArray(cartItems) ? cartItems : [];
        if (buyNowProduct) return [buyNowProduct];
        if (selectedProductIds.length === 0) return allItems;

        const selectedSet = new Set(selectedProductIds);
        return allItems.filter((item) => selectedSet.has(Number(item.product_id)));
    }, [cartItems, selectedProductIds, buyNowProduct]);

    const summary = useMemo(() => {
        const subtotal = items.reduce((total, item) => {
            const price = getEffectivePrice(item);
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

    const paymentMethods = [
        {
            value: "qr",
            title: "QR Code",
            description: "Quét mã để thanh toán nhanh",
        },
        {
            value: "cod",
            title: "COD",
            description: "Thanh toán khi nhận hàng",
        },
    ];

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setStatus("loading");
            setMessage("");

            if (items.length === 0 && !directBuyNowId) {
                setMessage("Giỏ hàng đang trống.");
                setStatus("idle");
                return;
            }

            if (!formData.address?.trim()) {
                setMessage("Vui lòng nhập địa chỉ giao hàng.");
                setStatus("idle");
                return;
            }

            if (!formData.phone?.trim()) {
                setMessage("Vui lòng nhập số điện thoại.");
                setStatus("idle");
                return;
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (formData.email && !emailRegex.test(formData.email)) {
                setMessage("Định dạng email không hợp lệ.");
                setStatus("idle");
                return;
            }

            const createPayload = {
                address: formData.address,
                phone: formData.phone,
                note: formData.note,
                // include both keys to be compatible with backend variants
                recipient: formData.fullName,
                recipient_name: formData.fullName,
            };

            if (Number.isInteger(directBuyNowId) && directBuyNowId > 0) {
                createPayload.buyNowProductId = directBuyNowId;
                createPayload.buyNowQuantity = buyNowProduct?.quantity || 1;
            } else if (selectedProductIds.length > 0) {
                createPayload.selectedProductIds = selectedProductIds;
            }

            if (saveToProfile) {
                try {
                    await dispatch(updateProfileThunk({
                        phone: formData.phone,
                        address: formData.address,
                    })).unwrap();
                } catch (profileErr) {
                    console.error("Failed to update profile:", profileErr);
                    // We don't block order creation if profile update fails
                }
            }

            const order = await dispatch(createOrderThunk(createPayload)).unwrap();

            if (!directBuyNowId) {
                await dispatch(fetchCartThunk());
            }

            dispatch(addToast({ type: "success", message: "Tạo đơn hàng thành công" }));

            if (formData.paymentMethod === "cod") {
                navigate(`/payment?orderId=${order?.id}`, {
                    state: {
                        paymentMethod: "cod",
                    },
                });
                return;
            }

            navigate(`/payment?orderId=${order?.id}`, {
                state: {
                    paymentMethod: formData.paymentMethod,
                },
            });
        } catch (err) {
            const content = typeof err === "string"
                ? err
                : (err?.message || err?.error || "Không thể tạo đơn hàng");
            setMessage(content);
            dispatch(addToast({ type: "error", message: content }));
        } finally {
            setStatus("idle");
        }
    };

    return (
        <div className="checkout-page">
            <section className="checkout-hero">
                <p className="checkout-kicker">Thanh toán</p>
                <h1>Thanh Toán</h1>
                <p>Hoàn tất đơn hàng của bạn để sản phẩm có thể được gửi đi ngay.</p>
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
                                <textarea name="address" rows="3" value={formData.address} onChange={handleChange} placeholder="Số nhà, tên đường, phường/xã, quận/huyện, tỉnh/thành phố" />
                            </label>
                            <label className="checkout-field checkout-field-full">
                                <span>Ghi chú đơn hàng</span>
                                <textarea name="note" rows="2" value={formData.note} onChange={handleChange} placeholder="Yêu cầu đặc biệt về giao hàng..." />
                            </label>
                            
                            <label className="checkout-checkbox-field">
                                <input 
                                    type="checkbox" 
                                    checked={saveToProfile} 
                                    onChange={(e) => setSaveToProfile(e.target.checked)} 
                                />
                                <span>Lưu làm địa chỉ và số điện thoại mặc định cho các lần mua sau</span>
                            </label>
                        </div>
                    </section>

                    <section className="checkout-card">
                        <div className="checkout-step-head">
                            <span className="checkout-step-badge">2</span>
                            <h2>Phương thức thanh toán</h2>
                        </div>

                        <div className="payment-options">
                            {paymentMethods.map((method) => (
                                <label
                                    key={method.value}
                                    className={`payment-option ${formData.paymentMethod === method.value ? "active" : ""}`}
                                >
                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value={method.value}
                                        checked={formData.paymentMethod === method.value}
                                        onChange={handleChange}
                                    />
                                    <div>
                                        <strong>{method.title}</strong>
                                        <span>{method.description}</span>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>
                </div>

                <aside className="checkout-summary">
                    <h2>Tóm tắt đơn hàng</h2>

                    <div className="checkout-summary-list">
                        {items.length === 0 ? (
                            <p className="checkout-empty-note">
                                {directBuyNowId ? "Đơn mua ngay sẽ được tạo trực tiếp cho sản phẩm đã chọn." : "Chưa có sản phẩm nào trong giỏ hàng."}
                            </p>
                        ) : (
                            items.map((item) => {
                                const quantity = Number(item.quantity || 1);
                                const price = getEffectivePrice(item);
                                const total = quantity * price;

                                return (
                                    <div className="checkout-summary-item" key={item.product_id || item.id}>
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
                        {status === "loading" ? "Đang xử lý..." : "Đặt hàng ngay"}
                    </button>

                    <p className="checkout-note">Thanh toán an toàn và hỗ trợ đổi trả trong 7 ngày.</p>
                </aside>
            </form>

            <SiteFooter />
        </div>
    );
};

export default Checkout;
