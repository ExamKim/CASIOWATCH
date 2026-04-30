import React from 'react';
import SiteFooter from '../components/SiteFooter';
import '../styles/contact.css';

const Contact = () => {
    const stores = [
        {
            city: 'London - Mayfair',
            lines: ['9-11 New Bond Street - W1S 3SU', 'Open: 10:00 - 19:00'],
            image: '',
        },
        {
            city: 'Tokyo - Ginza',
            lines: ['6 Chome-10-1 Ginza - Tokyo 104-0061', 'Open: 10:30 - 20:00'],
            image: '/img/login1.jpg',
        },
        {
            city: 'Geneva - Rhone',
            lines: ['17 Rue du Rhone - 1204', 'Open: 10:00 - 18:30'],
            image: '/img/login1.jpg',
        },
    ];

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-inner">
                    <h1>Kết nối với Ban Biên Tập</h1>
                    <p>
                        Cổng thông tin dành riêng cho những nhà sưu tầm và đam mê đồng hồ cao cấp.
                    </p>
                </div>
            </section>

            <section className="contact-request">
                <span className="contact-accent top" aria-hidden="true" />
                <div className="contact-request-grid">
                    <article className="contact-request-form">
                        <p className="contact-kicker">Yêu cầu hỗ trợ</p>
                        <h1>Bắt đầu cuộc trò chuyện</h1>
                        <p className="contact-lead">
                            Dù bạn đang tìm kiếm một mẫu đồng hồ hiếm hay cần tư vấn kỹ thuật về dòng
                            MR-G mới nhất, các chuyên gia của chúng tôi luôn sẵn lòng hỗ trợ.
                        </p>

                        <form className="contact-form" aria-label="Support request form">
                            <div className="contact-row-two">
                                <label>
                                    Họ và tên
                                    <input type="text" placeholder="Nguyen Van A" />
                                </label>
                                <label>
                                    Địa chỉ email
                                    <input type="email" placeholder="email@example.com" />
                                </label>
                            </div>

                            <label>
                                Chủ đề quan tâm
                                <input type="text" placeholder="Tư vấn mua hàng" />
                            </label>

                            <label>
                                Lời nhắn
                                <textarea rows="4" placeholder="Chúng tôi có thể giúp gì cho bộ sưu tập của bạn hôm nay?" />
                            </label>

                            <button type="button">Gửi yêu cầu</button>
                        </form>
                    </article>

                    <aside className="contact-request-side">
                        <p className="contact-kicker">Dịch vụ đặc quyền</p>
                        <h2>Trải nghiệm mua sắm Bespoke</h2>
                        <p>
                            Dành cho những nhà sưu tầm tìm kiếm quyền tiếp cận các phiên bản giới hạn
                            và xem trước sản phẩm, đội ngũ cố vấn riêng của chúng tôi sẽ kết nối trực
                            tiếp với bạn.
                        </p>

                        <div className="contact-call-box">
                            <div>
                                <strong>Yêu cầu gọi lại</strong>
                                <span>Thông thường được kết nối trong vòng 2 giờ</span>
                            </div>
                            <button type="button">Kết nối</button>
                        </div>

                        <div className="contact-support">
                            <p className="contact-support-kicker">Hỗ trợ tức thì</p>
                            <div className="contact-support-row">
                                <span>Hỗ trợ toàn cầu</span>
                                <strong>+44 (0) 20 7946 0123</strong>
                            </div>
                            <div className="contact-support-row">
                                <span>Báo chí & Truyền thông</span>
                                <strong>press@horologyeditorial.com</strong>
                            </div>
                        </div>
                    </aside>
                </div>

                <span className="contact-accent bottom" aria-hidden="true" />
            </section>

            <section className="contact-stores">
                <p className="contact-kicker">Hệ thống cửa hàng</p>
                <h2>Không gian trải nghiệm Casio</h2>

                <div className="contact-store-grid">
                    {stores.map((store) => (
                        <article className="contact-store-card" key={store.city}>
                            {store.image ? (
                                <img src={store.image} alt={store.city} />
                            ) : (
                                <div className="contact-store-placeholder" />
                            )}

                            <h3>{store.city}</h3>
                            {store.lines.map((line) => (
                                <p key={line}>{line}</p>
                            ))}
                        </article>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Contact;

