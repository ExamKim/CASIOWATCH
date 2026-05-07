import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToast } from '../store/uiSlice';
import SiteFooter from '../components/SiteFooter';
import '../styles/contact.css';

const Contact = () => {
    const dispatch = useDispatch();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const stores = [
        {
            city: 'Hà Nội',
            lines: ['123 Đường Hàng Bông, Quận Hoàn Kiếm', 'Mở cửa: 09:00 - 21:00'],
            phone: '(024) 3825 8888',
        },
        {
            city: 'Sài Gòn',
            lines: ['456 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'Mở cửa: 09:00 - 22:00'],
            phone: '(028) 3821 5555',
        },
        {
            city: 'Đà Nẵng',
            lines: ['789 Đường Nguyễn Văn Linh, Quận Hải Châu', 'Mở cửa: 09:00 - 21:00'],
            phone: '(0236) 3822 3333',
        },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.name || !formData.email || !formData.subject || !formData.message) {
            dispatch(addToast({ type: 'error', message: 'Vui lòng điền đầy đủ thông tin' }));
            return;
        }
        // TODO: Send email via API
        dispatch(addToast({ type: 'success', message: 'Gửi yêu cầu thành công. Chúng tôi sẽ liên hệ với bạn sớm!' }));
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="contact-page">
            <section className="contact-hero">
                <div className="contact-hero-inner">
                    <h1>Liên Hệ Với Chúng Tôi</h1>
                    <p>
                        Chúng tôi luôn sẵn sàng hỗ trợ và trả lời các câu hỏi của bạn về các sản phẩm Casio.
                    </p>
                </div>
            </section>

            <section className="contact-request">
                <span className="contact-accent top" aria-hidden="true" />
                <div className="contact-request-grid">
                    <article className="contact-request-form">
                        <p className="contact-kicker">Hỗ trợ khách hàng</p>
                        <h1>Gửi tin nhắn cho chúng tôi</h1>
                        <p className="contact-lead">
                            Có câu hỏi về sản phẩm, tư vấn mua sắm hoặc bất kỳ vấn đề nào khác?
                            Hãy liên hệ với chúng tôi ngay. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ.
                        </p>

                        <form className="contact-form" onSubmit={handleSubmit} aria-label="Support request form">
                            <div className="contact-row-two">
                                <label>
                                    Họ và tên
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Nguyễn Văn A"
                                    />
                                </label>
                                <label>
                                    Địa chỉ email
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="email@example.com"
                                    />
                                </label>
                            </div>

                            <label>
                                Chủ đề
                                <input
                                    type="text"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleInputChange}
                                    placeholder="Tư vấn mua hàng, bảo hành, v.v..."
                                />
                            </label>

                            <label>
                                Nội dung tin nhắn
                                <textarea
                                    rows="4"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleInputChange}
                                    placeholder="Hãy cho chúng tôi biết bạn cần giúp đỡ gì?"
                                />
                            </label>

                            <button type="submit">Gửi yêu cầu</button>
                        </form>
                    </article>

                    <aside className="contact-request-side">
                        <p className="contact-kicker">Thông tin liên lạc</p>
                        <h2>Hỗ Trợ Trực Tiếp</h2>
                        <p>
                            Liên hệ trực tiếp với chúng tôi qua điện thoại hoặc email
                            để được tư vấn nhanh chóng từ các chuyên gia Casio.
                        </p>

                        <div className="contact-support">
                            <div className="contact-support-row">
                                <span>Hỗ trợ khách hàng</span>
                                <strong>1800 1080</strong>
                            </div>
                            <div className="contact-support-row">
                                <span>Email</span>
                                <strong>support@casio.vn</strong>
                            </div>
                            <div className="contact-support-row">
                                <span>Thời gian phục vụ</span>
                                <strong>09:00 - 18:00 (T2-T7)</strong>
                            </div>
                        </div>
                    </aside>
                </div>

                <span className="contact-accent bottom" aria-hidden="true" />
            </section>

            <section className="contact-stores">
                <p className="contact-kicker">Hệ thống cửa hàng</p>
                <h2>Không Gian Trải Nghiệm Casio</h2>
                <p className="contact-stores-desc">Hãy ghé thăm các showroom của chúng tôi để trải nghiệm trực tiếp các sản phẩm Casio chính hãng</p>

                <div className="contact-store-grid">
                    {stores.map((store) => (
                        <article className="contact-store-card" key={store.city}>
                            <div className="contact-store-placeholder" />
                            <div className="contact-store-content">
                                <h3>{store.city}</h3>
                                {store.lines.map((line) => (
                                    <p key={line}>{line}</p>
                                ))}
                                <p className="contact-store-phone"><strong>Điện thoại:</strong> {store.phone}</p>
                            </div>
                        </article>
                    ))}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Contact;

