import React, { useEffect, useState, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import productsApi from '../api/productsApi';
import cartApi from '../api/cartApi';
import { fetchCartThunk } from '../store/cartSlice';
import { addToast } from '../store/uiSlice';
import { getProductImage } from '../utils/productImage';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import '../styles/offers.css';

function formatPrice(value) {
    const price = Number(value || 0);
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(price);
}

const Offers = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { token } = useSelector((state) => state.auth);
    const [products, setProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');

    useEffect(() => {
        const loadDiscountedProducts = async () => {
            try {
                setStatus('loading');
                const res = await productsApi.getProducts({ page: 1, limit: 100 });
                const allProducts = res?.data?.data || [];

                // Filter products with sale price
                const discounted = allProducts.filter(p => {
                    const salePrice = Number(p.sale_price || 0);
                    const price = Number(p.price || 0);
                    return salePrice > 0 && salePrice < price;
                }).sort((a, b) => {
                    const discountA = (1 - Number(a.sale_price) / Number(a.price)) * 100;
                    const discountB = (1 - Number(b.sale_price) / Number(b.price)) * 100;
                    return discountB - discountA;
                });

                setProducts(discounted);
                setStatus('succeeded');
            } catch (err) {
                setStatus('failed');
                setError(err?.response?.data?.message || 'Không tải được danh sách ưu đãi');
            }
        };

        loadDiscountedProducts();
    }, []);

    const maxDiscount = useMemo(() => {
        if (products.length === 0) return 0;
        return Math.max(...products.map(p => {
            const discount = (1 - Number(p.sale_price) / Number(p.price)) * 100;
            return Math.round(discount);
        }));
    }, [products]);

    return (
        <div className="offers-page">
            <section className="offers-hero">
                <div className="offers-hero-overlay" />
                <div className="offers-hero-inner">
                    <p className="offers-kicker">Ưu đãi đặc quyền</p>
                    <h1>
                        Giảm giá<br />
                        {maxDiscount > 0 && `tới ${maxDiscount}%`}
                    </h1>
                    <p>
                        Khám phá các sản phẩm đang được giảm giá. Ưu đãi có hạn, hãy mua ngay.
                    </p>
                    <div className="offers-hero-info">
                        <span>📍 {products.length} sản phẩm đang được ưu đãi</span>
                    </div>
                </div>
            </section>

            <section className="offers-section">
                <div className="offers-section-head">
                    <h2>Sản phẩm giảm giá</h2>
                    <span>{products.length} sản phẩm</span>
                </div>
                <span className="offers-heading-line" aria-hidden="true" />

                {status === 'loading' && <p className="offers-status">Đang tải danh sách ưu đãi...</p>}
                {status === 'failed' && <p className="offers-error">{error}</p>}
                {status === 'succeeded' && products.length === 0 && (
                    <div className="offers-empty">
                        <p>Hiện không có sản phẩm nào đang được ưu đãi.</p>
                        <Link to="/products" className="offers-hero-btn">Xem tất cả sản phẩm</Link>
                    </div>
                )}

                {status === 'succeeded' && products.length > 0 && (
                    <div className="offers-products-grid">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            <SiteFooter />
        </div>
    );
};

export default Offers;

