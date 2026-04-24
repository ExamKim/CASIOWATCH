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
                    <h1>Ket noi voi Ban Bien TSp</h1>
                    <p>
                        Cong thong tin danh rieng cho nhung nha suu tam va dam me dong ho cao cap.
                    </p>
                </div>
            </section>

            <section className="contact-request">
                <span className="contact-accent top" aria-hidden="true" />
                <div className="contact-request-grid">
                    <article className="contact-request-form">
                        <p className="contact-kicker">Yeu cau ho tro</p>
                        <h1>Bat dau cuoc tro chuyen</h1>
                        <p className="contact-lead">
                            Du ban dang tim kiem mot mau dong ho hiem hay can tu van ky thuat ve dong
                            MR-G moi nhat, cac chuyen gia cua chung toi luon san long ho tro.
                        </p>

                        <form className="contact-form" aria-label="Support request form">
                            <div className="contact-row-two">
                                <label>
                                    Ho va ten
                                    <input type="text" placeholder="Nguyen Van A" />
                                </label>
                                <label>
                                    Dia chi email
                                    <input type="email" placeholder="email@example.com" />
                                </label>
                            </div>

                            <label>
                                Chu de quan tam
                                <input type="text" placeholder="Tu van mua hang" />
                            </label>

                            <label>
                                Loi nhan
                                <textarea rows="4" placeholder="Chung toi co the giup gi cho bo suu tap cua ban hom nay?" />
                            </label>

                            <button type="button">Gui yeu cau</button>
                        </form>
                    </article>

                    <aside className="contact-request-side">
                        <p className="contact-kicker">Dich vu dac quyen</p>
                        <h2>Trai nghiem mua sam Bespoke</h2>
                        <p>
                            Danh cho nhung nha suu tam tim kiem quyen tiep can cac phien ban gioi han
                            va xem truoc san pham, doi ngu co van rieng cua chung toi se ket noi truc
                            tiep voi ban.
                        </p>

                        <div className="contact-call-box">
                            <div>
                                <strong>Yeu cau goi lai</strong>
                                <span>Thong thuong duoc ket noi trong vong 2 gio</span>
                            </div>
                            <button type="button">Ket noi</button>
                        </div>

                        <div className="contact-support">
                            <p className="contact-support-kicker">Ho tro tuc thi</p>
                            <div className="contact-support-row">
                                <span>Ho tro toan cau</span>
                                <strong>+44 (0) 20 7946 0123</strong>
                            </div>
                            <div className="contact-support-row">
                                <span>Bao chi & Truyen thong</span>
                                <strong>press@horologyeditorial.com</strong>
                            </div>
                        </div>
                    </aside>
                </div>

                <span className="contact-accent bottom" aria-hidden="true" />
            </section>

            <section className="contact-stores">
                <p className="contact-kicker">He thong cua hang</p>
                <h2>Khong gian trai nghiem Casio</h2>

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
