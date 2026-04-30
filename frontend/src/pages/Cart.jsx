import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cartApi from "../api/cartApi";
import { fetchCartThunk } from "../store/cartSlice";
import { getProductImage } from "../utils/productImage";
import { getGuestCart, updateGuestCartItem, removeGuestCartItem } from "../utils/guestCart";
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

const Cart = () => {
    const dispatch = useDispatch();
    const { items, status } = useSelector((state) => state.cart);
    const { token } = useSelector((state) => state.auth);
    const [actionLoadingId, setActionLoadingId] = useState(null);
    const [notice, setNotice] = useState("");
    const [guestItems, setGuestItems] = useState([]);

    useEffect(() => {
        if (token) {
            dispatch(fetchCartThunk());
        } else {
            setGuestItems(getGuestCart());
        }
    }, [dispatch, token]);

    const cartItems = useMemo(
        () => (token ? (Array.isArray(items) ? items : []) : guestItems),
        [token, items, guestItems]
    );

    const summary = useMemo(() => {
        const subtotal = cartItems.reduce((total, item) => {
            const price = Number(item.price || 0);
            const quantity = Number(item.quantity || 0);
            return total + price * quantity;
        }, 0);

        const shipping = subtotal > 0 ? 0 : 0;
        const discount = 0;

        return {
            subtotal,
            shipping,
            discount,
            total: subtotal + shipping - discount,
        };
    }, [cartItems]);

    const refreshCart = async () => {
        if (token) {
            await dispatch(fetchCartThunk());
        } else {
            setGuestItems(getGuestCart());
        }
    };

    const handleUpdateQuantity = async (productId, nextQuantity) => {
        if (nextQuantity < 1) return;
        try {
            setActionLoadingId(productId);
            setNotice("");
            if (token) {
                await cartApi.updateCartItem(productId, { quantity: nextQuantity });
            } else {
                updateGuestCartItem(productId, nextQuantity);
            }
            await refreshCart();
        } catch (err) {
            setNotice(err?.response?.data?.message || "Không thể cập nhật giỏ hàng");
        } finally {
            setActionLoadingId(null);
        }
    };

    const handleRemoveItem = async (productId) => {
        try {
            setActionLoadingId(productId);
            setNotice("");
            if (token) {
                await cartApi.removeFromCart(productId);
            } else {
                removeGuestCartItem(productId);
            }
            await refreshCart();
        } catch (err) {
            setNotice(err?.response?.data?.message || "Không thể xóa sản phẩm");
        } finally {
            setActionLoadingId(null);
        }
    };

    return (
        <div className="cart-page">
            <section className="cart-hero">
                <p className="cart-kicker">Giỏ hàng của bạn</p>
                <h1>Giỏ hàng của bạn</h1>
                <p>Kiểm tra, chỉnh số lượng và hoàn tất đơn hàng với các mẫu Casio bạn đã chọn.</p>
            </section>

            {notice && <div className="cart-notice">{notice}</div>}

            {token && status === "loading" && <p className="cart-status">Đang tải giỏ hàng...</p>}

            {status !== "loading" && cartItems.length === 0 && (
                <section className="cart-empty">
                    <h2>Giỏ hàng đang trống</h2>
                    <p>Bạn chưa thêm sản phẩm nào. Hãy khám phá bộ sưu tập để chọn mẫu yêu thích.</p>
                    <Link to="/products" className="cart-continue-btn">Tiếp tục mua sắm</Link>
                </section>
            )}

            {cartItems.length > 0 && (
                <section className="cart-layout">
                    <div className="cart-items-panel">
                        <div className="cart-panel-head">
                            <div>
                                <p className="cart-panel-kicker">Chi tiết đơn hàng</p>
                                <h2>Kỹ thuật và phong cách</h2>
                            </div>
                            <span className="cart-items-count">{cartItems.length} sản phẩm</span>
                        </div>

                        <div className="cart-items-list">
                            {cartItems.map((item) => {
                                const quantity = Number(item.quantity || 1);
                                const price = Number(item.price || 0);
                                const subtotal = price * quantity;

                                return (
                                    <article key={item.product_id} className="cart-item-card">
                                        <Link to={`/products/${item.product_id}`} className="cart-item-image-link">
                                            <img
                                                src={getProductImage(item)}
                                                alt={item.name}
                                                onError={(e) => {
                                                    e.currentTarget.src = getProductImage({ ...item, image_url: "" });
                                                }}
                                            />
                                        </Link>

                                        <div className="cart-item-info">
                                            <p className="cart-item-brand">CASIO</p>
                                            <Link to={`/products/${item.product_id}`} className="cart-item-name">
                                                {item.name}
                                            </Link>
                                            <p className="cart-item-note">
                                                Đồng hồ thể thao bền bỉ, phù hợp cho sử dụng hàng ngày.
                                            </p>

                                            <div className="cart-item-meta">
                                                <div className="cart-qty-control">
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.product_id, quantity - 1)}
                                                        disabled={actionLoadingId === item.product_id || quantity <= 1}
                                                    >
                                                        -
                                                    </button>
                                                    <span>{quantity}</span>
                                                    <button
                                                        type="button"
                                                        onClick={() => handleUpdateQuantity(item.product_id, quantity + 1)}
                                                        disabled={actionLoadingId === item.product_id}
                                                    >
                                                        +
                                                    </button>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="cart-remove-btn"
                                                    onClick={() => handleRemoveItem(item.product_id)}
                                                    disabled={actionLoadingId === item.product_id}
                                                >
                                                    Xóa
                                                </button>
                                            </div>
                                        </div>

                                        <div className="cart-item-price-wrap">
                                            <span className="cart-item-price">{formatPrice(subtotal)}</span>
                                            <span className="cart-item-unit">{formatPrice(price)} / sp</span>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>

                        <div className="cart-related">
                            <p className="cart-panel-kicker">Phụ kiện / gợi ý</p>
                            <div className="cart-related-list">
                                <span>MR-G Kachi-Iro</span>
                                <span>Oceanus Manta</span>
                                <span>G-SHOCK Metal</span>
                            </div>
                        </div>
                    </div>

                    <aside className="cart-summary-panel">
                        <p className="cart-panel-kicker">Tóm tắt</p>
                        <h2>Đơn hàng của bạn</h2>

                        <div className="cart-summary-lines">
                            <div>
                                <span>Tổng tạm tính</span>
                                <strong>{formatPrice(summary.subtotal)}</strong>
                            </div>
                            <div>
                                <span>Phí vận chuyển</span>
                                <strong>{summary.shipping === 0 ? "Miễn phí" : formatPrice(summary.shipping)}</strong>
                            </div>
                            <div>
                                <span>Giảm giá</span>
                                <strong>{summary.discount === 0 ? "0 đ" : formatPrice(summary.discount)}</strong>
                            </div>
                        </div>

                        <div className="cart-summary-total">
                            <span>Tổng cộng</span>
                            <strong>{formatPrice(summary.total)}</strong>
                        </div>

                        <Link to="/checkout" className="cart-checkout-btn">
                            Tiến hành thanh toán
                        </Link>

                        <div className="cart-summary-notes">
                            <p>Thanh toán an toàn và hỗ trợ đổi trả trong 7 ngày.</p>
                            <p>Hỗ trợ tư vấn sản phẩm qua điện thoại và chat trực tuyến.</p>
                        </div>
                    </aside>
                </section>
            )}

            <SiteFooter />
        </div>
    );
};

export default Cart;
