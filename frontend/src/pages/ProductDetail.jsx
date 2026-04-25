import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import productsApi from "../api/productsApi";
import cartApi from "../api/cartApi";
import ProductCard from "../components/ProductCard";
import SiteFooter from "../components/SiteFooter";
import { addGuestCartItem } from "../utils/guestCart";
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
                setError(err?.response?.data?.message || "Khong tai duoc chi tiet san pham");
            }
        };

        loadData();

        return () => {
            mounted = false;
        };
    }, [id, routeProduct]);

    const resolvedProduct = useMemo(() => product || routeProduct, [product, routeProduct]);

    if (status === "loading") {
        return <p className="catalog-status detail-status">Dang tai chi tiet san pham...</p>;
    }

    if (status === "failed") {
        return <p className="catalog-error detail-status">{error}</p>;
    }

    if (!resolvedProduct) {
        return <p className="catalog-status detail-status">San pham khong ton tai.</p>;
    }

    const hasSale = Number(resolvedProduct?.sale_price) > 0 && Number(resolvedProduct?.sale_price) < Number(resolvedProduct?.price);
    const heroTitle = String(resolvedProduct?.brand || "CASIO").toUpperCase();
    const productCode = String(resolvedProduct?.name || "").split(" ").slice(-2).join(" ") || resolvedProduct?.name || "MODEL";
    const shortName = resolvedProduct?.name?.replace(/^Casio\s+/i, "") || resolvedProduct?.name || "Watch";

    const handleAddToCart = async () => {
        try {
            setIsAdding(true);
            if (!token) {
                addGuestCartItem(resolvedProduct, 1);
            } else {
                await cartApi.addToCart({ productId: resolvedProduct.id, quantity: 1 });
            }
            navigate("/cart");
        } catch (err) {
            if (err?.response?.status === 401) {
                addGuestCartItem(resolvedProduct, 1);
                navigate("/cart");
                return;
            }

            navigate("/cart");
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

                    <div className="detail-actions">
                        <button type="button" className="detail-buy-btn" onClick={handleAddToCart} disabled={isAdding}>
                            {isAdding ? "Dang them..." : "Them vao gio hang"}
                        </button>
                        <button type="button" className="detail-icon-btn" aria-label="Yeu thich">
                            ♡
                        </button>
                        <button type="button" className="detail-icon-btn" aria-label="Chia se">
                            ↗
                        </button>
                    </div>

                    <div className="detail-meta">
                        <span>Giao hang 24h</span>
                        <span>Bao hanh chinh hang</span>
                        <span>Ho tro doi tra</span>
                    </div>
                </div>
            </section>

            <section className="detail-story-grid">
                <article className="detail-story-card detail-story-card-light">
                    <p className="detail-section-kicker">Cau chuyen che tac</p>
                    <h3>Cong nghe, do ben va hieu ung kim loai</h3>
                    <p>
                        Mau dong ho nay goi y cam giac cua mot mon trang suc ky thuat: chan thuc,
                        sang trong va tinh te. Cac duong net duoc goi gon de lam noi bat phan mat so,
                        day deo va bo vo cứng cáp.
                    </p>
                    <a href="#detail-specs" className="detail-text-link">Kham pha ky thuat</a>
                </article>

                <article className="detail-story-card detail-story-card-dark" id="detail-specs">
                    <p className="detail-section-kicker detail-section-kicker-gold">Thong so ky thuat</p>
                    <ul className="detail-spec-list">
                        <li><span>Chat lieu</span><strong>Thép không gỉ</strong></li>
                        <li><span>Bo may</span><strong>Tough Solar</strong></li>
                        <li><span>Chong nuoc</span><strong>200m Water</strong></li>
                        <li><span>Ket noi</span><strong>Bluetooth</strong></li>
                    </ul>
                    <div className="detail-spec-foot">Giu nguyen phong cach sang trong trong moi hoan canh.</div>
                </article>
            </section>

            <section className="detail-suggestions">
                <div className="detail-suggestions-head">
                    <div>
                        <p className="detail-section-kicker">Goi y cho ban</p>
                        <h2>Khám phá những lựa chọn khác từ Casio</h2>
                    </div>
                    <Link to="/products">Xem tat ca san pham</Link>
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
