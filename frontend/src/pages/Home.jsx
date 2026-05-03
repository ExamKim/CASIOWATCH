import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productsApi from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import { getProductImage } from '../utils/productImage';
import '../styles/Home.css';

const FALLBACK_CATEGORIES = ['G-Shock', 'Baby-G', 'Edifice', 'Vintage', 'Classic', 'G-SQUAD', 'SHEEN', 'PRO TREK'];

const buildCategoryHref = (category) => {
    const normalized = String(category || '').trim();

    if (normalized === 'G-Shock') return '/g-shock';
    if (normalized === 'Baby-G') return '/baby-g';
    if (normalized === 'Edifice') return '/edifice';

    return `/products?category=${encodeURIComponent(normalized)}`;
};

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [categoryCards, setCategoryCards] = useState([]);

    useEffect(() => {
        let mounted = true;

        const loadFeatured = async () => {
            try {
                setStatus('loading');
                setError('');
                const res = await productsApi.getProducts({ page: 1, limit: 8 });
                if (!mounted) return;

                const items = res.data?.data || [];
                setFeaturedProducts(items.slice(0, 4));
                setStatus('succeeded');
            } catch (err) {
                if (!mounted) return;
                setStatus('failed');
                setError(err?.response?.data?.message || 'Không tải được sản phẩm nổi bật');
            }
        };

        const loadCategoryImages = async () => {
            try {
                const response = await productsApi.getCategories();
                const apiCategories = Array.isArray(response?.data?.data) ? response.data.data : [];
                const categories = apiCategories.length > 0 ? apiCategories : FALLBACK_CATEGORIES;

                const cards = await Promise.all(
                    categories.map(async (category) => {
                        try {
                            const res = await productsApi.getProducts({ category, page: 1, limit: 1 });
                            const item = res?.data?.data?.[0];

                            return {
                                label: category,
                                href: buildCategoryHref(category),
                                image: item ? getProductImage(item) : '/img/login1.jpg',
                            };
                        } catch (err) {
                            return {
                                label: category,
                                href: buildCategoryHref(category),
                                image: '/img/login1.jpg',
                            };
                        }
                    })
                );

                setCategoryCards(cards);
            } catch (err) {
                setCategoryCards(
                    FALLBACK_CATEGORIES.map((category) => ({
                        label: category,
                        href: buildCategoryHref(category),
                        image: '/img/login1.jpg',
                    }))
                );
            }
        };

        loadFeatured();
        loadCategoryImages();

        return () => {
            mounted = false;
        };
    }, []);

    return (
        <div className="home-page">
            <section className="home-hero">
                <div className="home-hero-overlay" />
                <div className="home-hero-inner">
                    <div className="home-hero-copy">
                        <p className="home-kicker">Nghệ thuật của thời gian</p>
                        <h1>
                            NGHỆ THUẬT CỦA <br />
                            THỜI GIAN.
                        </h1>
                        <p>
                            Khám phá những kiệt tác thời gian được chế tác tinh xảo, nơi kỹ thuật
                            và phong cách giao thoa trong một ngôn ngữ sang trọng.
                        </p>

                        <div className="home-hero-actions">
                            <Link to="/products" className="home-primary-btn">
                                Mua ngay
                            </Link>
                            <Link to="/products" className="home-secondary-btn">
                                Khám phá bộ sưu tập
                            </Link>
                        </div>
                    </div>

                    <div className="home-hero-visual">
                        <div className="home-hero-watch-frame">
                            <img src="/img/login1.jpg" alt="G-SHOCK premium watch" />
                        </div>
                        <div className="home-hero-tag">
                            <span>MR-G SERIES</span>
                            <strong>Gold collection</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="home-categories">
                <div className="home-category-grid">
                    {categoryCards.map((category) => (
                        <Link key={category.label} to={category.href} className="home-category-card">
                            <img src={category.image} alt={category.label} />
                            <span>{category.label}</span>
                        </Link>
                    ))}
                </div>
            </section>

            <section className="home-featured">
                <div className="home-featured-head">
                    <div>
                        <p className="home-kicker home-kicker-featured">LỰA CHỌN CỦA BIÊN TẬP VIÊN</p>
                        <h2>Kiệt Tác Nổi Bật</h2>
                    </div>
                    <Link to="/products" className="home-view-all">
                        Xem tất cả
                    </Link>
                </div>

                {status === 'loading' && <p className="home-status">Đang tải sản phẩm...</p>}
                {status === 'failed' && <p className="home-error">{error}</p>}

                {status === 'succeeded' && (
                    <div className="home-products-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {status === 'succeeded' && featuredProducts.length === 0 && (
                    <p className="home-status">Chưa có sản phẩm để hiển thị.</p>
                )}
            </section>

            <section className="home-cta">
                <div className="home-cta-inner">
                    <h2>Gia nhập cộng đồng người chơi đồng hồ Casio</h2>
                    <p>Nhận cập nhật bộ sưu tập mới, ưu đãi định kỳ và sự kiện độc quyền.</p>
                    <div className="home-cta-actions">
                        <Link to="/register" className="home-primary-btn">Đăng ký ngay</Link>
                        <Link to="/products" className="home-secondary-btn">Xem sản phẩm</Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Home;
