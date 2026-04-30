import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import productsApi from '../api/productsApi';
import ProductCard from '../components/ProductCard';
import SiteFooter from '../components/SiteFooter';
import '../styles/Home.css';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [status, setStatus] = useState('loading');
    const [error, setError] = useState('');
    const [categoryImages, setCategoryImages] = useState({});

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
                // map label -> category value in DB
                const cats = [
                    { key: 'gshock', category: 'G-Shock' },
                    { key: 'baby-g', category: 'Baby-G' },
                    { key: 'edifice', category: 'Edifice' },
                ];

                const results = await Promise.all(
                    cats.map((c) => productsApi.getProducts({ category: c.category, page: 1, limit: 1 }))
                );

                const images = {};
                results.forEach((res, idx) => {
                    const c = cats[idx];
                    const item = res?.data?.data?.[0];
                    images[c.key] = item?.image_url || '/img/login1.jpg';
                });

                setCategoryImages(images);
            } catch (err) {
                // ignore, keep defaults
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
                    <Link to="/g-shock" className="home-category-card gshock">
                        <img src={categoryImages['gshock'] || '/img/login1.jpg'} alt="G-SHOCK" />
                        <span>G-SHOCK</span>
                    </Link>
                    <Link to="/baby-g" className="home-category-card babyg">
                        <img src={categoryImages['baby-g'] || '/img/login1.jpg'} alt="BABY-G" />
                        <span>BABY-G</span>
                    </Link>
                    <Link to="/edifice" className="home-category-card edifice">
                        <img src={categoryImages['edifice'] || '/img/login1.jpg'} alt="EDIFICE" />
                        <span>EDIFICE</span>
                    </Link>
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
