import React, { useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import cartApi from "../api/cartApi";
import { fetchCartThunk } from "../store/cartSlice";
import { addToast } from "../store/uiSlice";
import { getProductImage } from "../utils/productImage";

function formatPrice(value) {
    const price = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(price);
}

const ProductCard = ({ product }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);

    const baseImage = useMemo(() => getProductImage(product), [product]);
    const isOnSale = Number(product?.sale_price) > 0 && Number(product?.sale_price) < Number(product?.price);

    const addToCart = async () => {
        if (!token) {
            dispatch(addToast({ type: "info", message: "Vui lòng đăng nhập để thêm vào giỏ hàng" }));
            navigate("/login", {
                state: {
                    from: location.pathname + location.search,
                    message: "Vui lòng đăng nhập để tiếp tục",
                },
            });
            return false;
        }

        try {
            await cartApi.addToCart({ productId: product.id, quantity: 1 });
            await dispatch(fetchCartThunk());
            dispatch(addToast({ type: "success", message: "Đã thêm sản phẩm vào giỏ hàng" }));
            return true;
        } catch (err) {
            if (err?.response?.status === 401) {
                navigate("/login", {
                    state: {
                        from: location.pathname + location.search,
                        message: "Vui lòng đăng nhập để tiếp tục",
                    },
                });
                return false;
            }

            dispatch(addToast({ type: "error", message: "Không thể thêm sản phẩm vào giỏ" }));
            return false;
        }
    };

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

        const productId = Number(product?.id);
        navigate(`/checkout${Number.isInteger(productId) && productId > 0 ? `?buyNowProductId=${productId}` : ""}`, {
            state: {
                buyNowProduct: {
                    ...product,
                    quantity: 1,
                },
            },
        });
    };

    const handleAddToCart = async () => {
        await addToCart();
    };

    return (
        <article className="catalog-card">
            <Link to={`/products/${product.id}`} state={{ product }} className="catalog-card-image-link">
                <img
                    className="catalog-card-image"
                    src={baseImage}
                    alt={product?.name || "Product"}
                    onError={(e) => {
                        e.currentTarget.src = getProductImage({ ...product, image_url: "" });
                    }}
                />
            </Link>

            <div className="catalog-card-body">
                <p className="catalog-card-brand">{product?.brand || "CASIO"}</p>
                <Link to={`/products/${product.id}`} state={{ product }} className="catalog-card-name">
                    {product?.name}
                </Link>

                <div className="catalog-card-price-wrap">
                    {isOnSale ? (
                        <>
                            <span className="catalog-card-price-sale">{formatPrice(product.sale_price)}</span>
                            <span className="catalog-card-price-original">{formatPrice(product.price)}</span>
                        </>
                    ) : (
                        <span className="catalog-card-price">{formatPrice(product?.price)}</span>
                    )}
                </div>

                <div className="catalog-card-actions">
                    <button type="button" className="catalog-buy-btn" onClick={handleBuyNow}>
                        Mua ngay
                    </button>
                    <button type="button" className="catalog-icon-btn" aria-label="Thêm vào giỏ hàng" onClick={handleAddToCart}>
                        <svg viewBox="0 0 24 24" className="header-icon-svg" aria-hidden="true">
                            <path d="M4 5h2l2 10h10l2-7H7.2" />
                            <circle cx="10" cy="19" r="1.5" />
                            <circle cx="17" cy="19" r="1.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </article>
    );
};

export default ProductCard;
