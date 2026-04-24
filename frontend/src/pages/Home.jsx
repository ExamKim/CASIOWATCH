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
                setError(err?.response?.data?.message || 'Khong tai duoc san pham noi bat');
            }
        };

        loadFeatured();

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
                    <Link to="/products" className="home-category-card gshock">
                        <img src="/img/login1.jpg" alt="G-SHOCK" />
                        <span>G-SHOCK</span>
                    </Link>
                    <Link to="/products" className="home-category-card babyg">
                        <img src="/img/login1.jpg" alt="BABY-G" />
                        <span>BABY-G</span>
                    </Link>
                    <Link to="/products" className="home-category-card vintage">
                        <img src="/img/login1.jpg" alt="VINTAGE" />
                        <span>VINTAGE</span>
                    </Link>
                    <Link to="/products" className="home-category-card edifice">
                        <img src="/img/login1.jpg" alt="EDIFICE" />
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

                {status === 'loading' && <p className="home-status">Dang tai san pham...</p>}
                {status === 'failed' && <p className="home-error">{error}</p>}

                {status === 'succeeded' && (
                    <div className="home-products-grid">
                        {featuredProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}

                {status === 'succeeded' && featuredProducts.length === 0 && (
                    <p className="home-status">Chua co san pham de hien thi.</p>
                )}
            </section>

            <section className="home-cta">
                <div className="home-cta-inner">
                    <h2>Gia nhap cong dong nguoi choi dong ho Casio</h2>
                    <p>Nhan cap nhat bo suu tap moi, uu dai dinh ky va su kien doc quyen.</p>
                    <div className="home-cta-actions">
                        <Link to="/register" className="home-primary-btn">Dang ky ngay</Link>
                        <Link to="/products" className="home-secondary-btn">Xem san pham</Link>
                    </div>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Home;