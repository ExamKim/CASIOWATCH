import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import productsApi from "../api/productsApi";
import cartApi from "../api/cartApi";
import ProductCard from "../components/ProductCard";
import SiteFooter from "../components/SiteFooter";
import { fetchCartThunk } from "../store/cartSlice";
import { addToast } from "../store/uiSlice";
import { getProductImage } from "../utils/productImage";
import "../styles/catalog.css";

function formatPrice(value) {
    const price = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(price);
}

const ProductDetail = () => {
    const dispatch = useDispatch();
    const { id } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const routeProduct = location.state?.product || null;
    const [product, setProduct] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        let mounted = true;

        const loadData = async () => {
            try {
                setStatus("loading");
                setError("");

                const [detailRes, suggestRes] = await Promise.all([
                    productsApi.getProductById(id).catch(() => null),
                    productsApi.getProducts({ page: 1, limit: 12 }).catch(() => null),
                ]);

                if (!mounted) return;

                const detailData = detailRes?.data || routeProduct;
                setProduct(detailData);

                const nextSuggestions = (suggestRes?.data?.data || []).filter(
                    (item) => String(item.id) !== String(id)
                );
                setSuggestions(nextSuggestions.slice(0, 8));
                setStatus("succeeded");
            } catch (err) {
                if (!mounted) return;
                setStatus("failed");
                setError(err?.response?.data?.message || "Không tải được chi tiết sản phẩm");
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [id, routeProduct]);

    const resolvedProduct = useMemo(() => product || routeProduct, [product, routeProduct]);

    if (status === "loading") {
        return <p className="catalog-status detail-status">Đang tải chi tiết sản phẩm...</p>;
    }

    if (status === "failed") {
        return <p className="catalog-error detail-status">{error}</p>;
    }

    if (!resolvedProduct) {
        return <p className="catalog-status detail-status">Sản phẩm không tồn tại.</p>;
    }

    const hasSale = Number(resolvedProduct?.sale_price) > 0 && Number(resolvedProduct?.sale_price) < Number(resolvedProduct?.price);
    const heroTitle = String(resolvedProduct?.brand || "CASIO").toUpperCase();
    const productCode = String(resolvedProduct?.name || "").split(" ").slice(-2).join(" ") || resolvedProduct?.name || "MODEL";
    const shortName = resolvedProduct?.name?.replace(/^Casio\s+/i, "") || resolvedProduct?.name || "Watch";

    const handleBuyNow = async () => {
        if (!token) {
            dispatch(addToast({ type: "info", message: "Vui lòng đăng nhập để mua hàng" }));
            navigate("/login", {
                state: {
                    from: location.pathname + location.search,
                    message: "Vui lòng đăng nhập để tiếp tục",
                },
            });
            return;
        }

        const productId = Number(resolvedProduct?.id);
        navigate(`/checkout${Number.isInteger(productId) && productId > 0 ? `?buyNowProductId=${productId}` : ""}`, {
            state: {
                buyNowProduct: {
                    ...resolvedProduct,
                    quantity: 1,
                },
            },
        });
    };

    const handleAddToCart = async () => {
        if (!token) {
            dispatch(addToast({ type: "info", message: "Vui lòng đăng nhập để thêm vào giỏ hàng" }));
            navigate("/login", {
                state: {
                    from: location.pathname + location.search,
                    message: "Vui lòng đăng nhập để tiếp tục",
                },
            });
            return;
        }

        try {
            setIsAdding(true);
            await cartApi.addToCart({ productId: resolvedProduct.id, quantity: 1 });
            await dispatch(fetchCartThunk());
            dispatch(addToast({ type: "success", message: "Đã thêm sản phẩm vào giỏ hàng" }));
        } catch (err) {
            if (err?.response?.status === 401) {
                navigate("/login", {
                    state: {
                        from: location.pathname + location.search,
                        message: "Vui lòng đăng nhập để tiếp tục",
                    },
                });
                return;
            }

            dispatch(addToast({ type: "error", message: "Không thể thêm sản phẩm vào giỏ" }));
        } finally {
            setIsAdding(false);
        }
    };

    return (
        <div className="detail-page">
            <section className="detail-hero">
                <div className="detail-hero-image-shell">
                    <div className="detail-hero-image-card">
                        <img
                            src={getProductImage(resolvedProduct)}
                            alt={resolvedProduct.name}
                            onError={(e) => {
                                e.currentTarget.src = getProductImage({ ...resolvedProduct, image_url: "" });
                            }}
                        />
                    </div>
                </div>

                <div className="detail-hero-copy">
                    <p className="detail-eyebrow">Tâm điểm bộ sưu tập</p>
                    <p className="detail-brand">{heroTitle}</p>
                    <h1>
                        {shortName}
                    </h1>
                    <h2>{productCode}</h2>

                    <div className="detail-price">
                        {hasSale ? (
                            <>
                                <span className="detail-sale-price">{formatPrice(resolvedProduct.sale_price)}</span>
                                <span className="detail-original-price">{formatPrice(resolvedProduct.price)}</span>
                            </>
                        ) : (
                            <span className="detail-regular-price">{formatPrice(resolvedProduct.price)}</span>
                        )}
                    </div>

                    <p className="detail-description">
                        Sự tinh giản và độ bền được đặt lên hàng đầu. Thiết kế kim loại mạnh mẽ,
                        tông màu vàng sang trọng và cảm giác đeo chắc tay tạo nên một điểm nhấn rất Casio.
                    </p>

                    <div className="detail-stock-info" style={{ marginBottom: 16, fontSize: '0.95rem', color: resolvedProduct.stock > 0 ? '#27ae60' : '#eb5757', fontWeight: 600 }}>
                        {resolvedProduct.stock > 0 ? `Hiện còn: ${resolvedProduct.stock} sản phẩm` : "Sản phẩm hiện đang hết hàng"}
                    </div>

                    <div className="detail-actions">
                        <button 
                            type="button" 
                            className="detail-buy-btn" 
                            onClick={handleAddToCart} 
                            disabled={isAdding || resolvedProduct.stock <= 0}
                            style={{ opacity: resolvedProduct.stock <= 0 ? 0.6 : 1, cursor: resolvedProduct.stock <= 0 ? 'not-allowed' : 'pointer' }}
                        >
                            {isAdding ? "Đang thêm..." : (resolvedProduct.stock > 0 ? "Thêm vào giỏ hàng" : "Hết hàng")}
                        </button>
                        <button 
                            type="button" 
                            className="detail-icon-btn" 
                            aria-label="Thêm vào giỏ hàng" 
                            onClick={handleAddToCart} 
                            disabled={isAdding || resolvedProduct.stock <= 0}
                            style={{ opacity: resolvedProduct.stock <= 0 ? 0.6 : 1, cursor: resolvedProduct.stock <= 0 ? 'not-allowed' : 'pointer' }}
                        >
                            <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
                                <path d="M4 5h2l2 10h10l2-7H7.2" />
                                <circle cx="10" cy="19" r="1.5" />
                                <circle cx="17" cy="19" r="1.5" />
                            </svg>
                        </button>
                    </div>

                    <div className="detail-meta">
                        <span>Giao hàng 24h</span>
                        <span>Bảo hành chính hãng</span>
                        <span>Hỗ trợ đổi trả</span>
                    </div>
                </div>
            </section>

            <section className="detail-story-grid">
                <article className="detail-story-card detail-story-card-light">
                    <p className="detail-section-kicker">Câu chuyện chế tác</p>
                    <h3>Công nghệ, độ bền và hiệu ứng kim loại</h3>
                    <p>
                        Mẫu đồng hồ này gợi ý cảm giác của một món trang sức kỹ thuật: chân thực,
                        sang trọng và tinh tế. Các đường nét được gói gọn để làm nổi bật phần mặt số,
                        dây đeo và bộ vỏ cứng cáp.
                    </p>
                    <a href="#detail-specs" className="detail-text-link">Khám phá kỹ thuật</a>
                </article>

                <article className="detail-story-card detail-story-card-dark" id="detail-specs">
                    <p className="detail-section-kicker detail-section-kicker-gold">Thông số kỹ thuật</p>
                    <ul className="detail-spec-list">
                        <li><span>Chất liệu</span><strong>Thép không gỉ</strong></li>
                        <li><span>Bộ máy</span><strong>Tough Solar</strong></li>
                        <li><span>Chống nước</span><strong>200m Water</strong></li>
                        <li><span>Kết nối</span><strong>Bluetooth</strong></li>
                    </ul>
                    <div className="detail-spec-foot">Giữ nguyên phong cách sang trọng trong mọi hoàn cảnh.</div>
                </article>
            </section>

            <section className="detail-suggestions">
                <div className="detail-suggestions-head">
                    <div>
                        <p className="detail-section-kicker">Gợi ý cho bạn</p>
                        <h2>Khám phá những lựa chọn khác từ Casio</h2>
                    </div>
                    <Link to="/products">Xem tất cả sản phẩm</Link>
                </div>

                <div className="catalog-grid">
                    {suggestions.map((item) => (
                        <ProductCard key={item.id} product={item} />
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default ProductDetail;

