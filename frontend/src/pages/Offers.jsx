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
                    <p className="offers-kicker">Bộ sưu tập ưu đãi</p>
                    <h1>
                        Chương trình <br />
                        Ưu đãi đặc quyền
                    </h1>
                    <p>
                        Khám phá những ưu đãi theo mùa, voucher riêng cho thành viên và các gói
                        đồng hành cao cấp trong hệ sinh thái Casio.
                    </p>
                    <Link to="/products" className="offers-hero-btn">
                        Kiểm tra ưu đãi ngay
                    </Link>
                </div>
            </section>

            <section className="offers-section">
                <div className="offers-section-head">
                    <h2>Danh mục ưu đãi</h2>
                    <span>Curated selection / winter 2024</span>
                </div>
                <span className="offers-heading-line" aria-hidden="true" />

                <div className="offers-curated-grid">
                    <article className="offer-tile offer-tile-intro">
                        <p className="offer-kicker">Limited time</p>
                        <h3>Flash Sale 20% cho dòng G-SHOCK</h3>
                        <p>
                            Sức mạnh của sự bền bỉ kết hợp cùng phong cách hiện đại. Ưu đãi lớn nhất
                            trong năm cho dòng sản phẩm biểu tượng.
                        </p>
                        <Link to="/products" className="offer-outline-btn">Chi tiết ưu đãi</Link>
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
                            <h3>Ưu đãi Heritage Collection</h3>
                            <p>
                                Dòng cổ điển mang tính biểu tượng, tái hiện những giá trị trường tồn
                                của Casio qua các thập kỷ.
                            </p>
                            <Link to="/products">Khám phá ngay</Link>
                        </div>
                    </article>

                    <article className="offer-tile offer-tile-edifice">
                        <div className="offer-tile-image offer-tile-edifice-image">
                            <img src="/img/login1.jpg" alt="Edifice combo" />
                        </div>
                        <div className="offer-subcopy">
                            <h3>Combo Quà tặng Edifice</h3>
                            <p>
                                Khi mua dòng Edifice cao cấp, nhận ngay bộ vệ sinh đồng hồ chuyên dụng
                                và bảo hành 5 năm.
                            </p>
                            <Link to="/products">Khám phá ngay</Link>
                        </div>
                    </article>

                    <article className="offer-tile offer-tile-image offer-tile-movement">
                        <img src="/img/login1.jpg" alt="Watch movement detail" />
                    </article>

                    <article className="offer-tile offer-tile-curators">
                        <p className="offer-kicker">Special access</p>
                        <h3>Thành viên Curators</h3>

                        <div className="offer-benefits-grid">
                            <p>Giảm thêm 5% cho mỗi đơn hàng</p>
                            <p>Miễn phí vận chuyển hỏa tốc</p>
                            <p>Truy cập sớm các bộ sưu tập mới</p>
                            <p>Mời tham dự private event</p>
                        </div>

                        <button type="button">Đăng ký thành viên</button>
                    </article>
                </div>

                <section className="offers-cta">
                    <h3>Không bao giờ bỏ lỡ các đợt phát hành giới hạn</h3>
                    <div className="offers-cta-row">
                        <input type="email" placeholder="Địa chỉ email của bạn" />
                        <button type="button">Đăng ký ngay</button>
                    </div>
                </section>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Offers;

