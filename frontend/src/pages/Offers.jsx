import React from 'react';
import { Link } from 'react-router-dom';
import SiteFooter from '../components/SiteFooter';
import '../styles/offers.css';

const Offers = () => {
    return (
        <div className="offers-page">
            <section className="offers-hero">
                <div className="offers-hero-overlay" />
                <div className="offers-hero-inner">
                    <p className="offers-kicker">Bo suu tap uu dai</p>
                    <h1>
                        Chuong trinh <br />
                        Uu dai dac quyen
                    </h1>
                    <p>
                        Kham pha nhung uu dai theo mua, voucher rieng cho thanh vien va cac goi
                        dong hanh cao cap trong he sinh thai Casio.
                    </p>
                    <Link to="/products" className="offers-hero-btn">
                        Kiem tra uu dai ngay
                    </Link>
                </div>
            </section>

            <section className="offers-section">
                <div className="offers-section-head">
                    <h2>Danh muc Uu dai</h2>
                    <span>Curated selection / winter 2024</span>
                </div>
                <span className="offers-heading-line" aria-hidden="true" />

                <div className="offers-curated-grid">
                    <article className="offer-tile offer-tile-intro">
                        <p className="offer-kicker">Limited time</p>
                        <h3>Flash Sale 20% cho dong G-SHOCK</h3>
                        <p>
                            Suc manh cua su ben bi ket hop cung phong cach hien dai. Uu dai lon nhat
                            trong nam cho dong san pham bieu tuong.
                        </p>
                        <Link to="/products" className="offer-outline-btn">Chi tiet uu dai</Link>
                    </article>

                    <article className="offer-tile offer-tile-image offer-tile-gshock">
                        <img src="/img/login1.jpg" alt="G-SHOCK special offer" />
                    </article>

                    <article className="offer-tile offer-tile-heritage">
                        <div className="offer-tile-image offer-tile-heritage-image">
                            <span className="offer-badge">Heritage offer</span>
                            <img src="/img/login1.jpg" alt="Heritage collection" />
                        </div>
                        <div className="offer-subcopy">
                            <h3>Uu dai Heritage Collection</h3>
                            <p>
                                Dong co diem mang tinh bieu tuong, tai hien nhung gia tri truong ton
                                cua Casio qua cac thap ky.
                            </p>
                            <Link to="/products">Kham pha ngay</Link>
                        </div>
                    </article>

                    <article className="offer-tile offer-tile-edifice">
                        <div className="offer-tile-image offer-tile-edifice-image">
                            <img src="/img/login1.jpg" alt="Edifice combo" />
                        </div>
                        <div className="offer-subcopy">
                            <h3>Combo Qua tang Edifice</h3>
                            <p>
                                Khi mua dong Edifice cao cap, nhan ngay bo ve sinh dong ho chuyen dung
                                va bao hanh 5 nam.
                            </p>
                            <Link to="/products">Kham pha ngay</Link>
                        </div>
                    </article>

                    <article className="offer-tile offer-tile-image offer-tile-movement">
                        <img src="/img/login1.jpg" alt="Watch movement detail" />
                    </article>

                    <article className="offer-tile offer-tile-curators">
                        <p className="offer-kicker">Special access</p>
                        <h3>Thanh vien Curators</h3>

                        <div className="offer-benefits-grid">
                            <p>Giam them 5% cho moi don hang</p>
                            <p>Mien phi van chuyen hoa toc</p>
                            <p>Truy cap som cac bo suu tap moi</p>
                            <p>Moi tham du private event</p>
                        </div>

                        <button type="button">Dang ky thanh vien</button>
                    </article>
                </div>

                <section className="offers-cta">
                    <h3>Khong bao gio bo lo cac dot phat hanh gioi han</h3>
                    <div className="offers-cta-row">
                        <input type="email" placeholder="Dia chi email cua ban" />
                        <button type="button">Dang ky ngay</button>
                    </div>
                </section>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Offers;
