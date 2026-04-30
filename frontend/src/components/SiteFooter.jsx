import React from "react";

const SiteFooter = () => {
    return (
        <footer className="catalog-footer">
            <div className="catalog-footer-grid">
                <div className="catalog-footer-col">
                    <h2 className="catalog-footer-logo">CASIO</h2>
                    <p>
                        Nơi hội tụ những thiết kế đồng hồ biểu tượng, kết hợp tinh thần kỹ thuật và
                        ngôn ngữ thời trang hiện đại.
                    </p>
                    <div className="catalog-newsletter">
                        <input type="email" placeholder="Email của bạn" />
                        <button type="button">GỬI</button>
                    </div>
                </div>

                <div className="catalog-footer-col">
                    <h4>Collections</h4>
                    <ul>
                        <li>G-Shock</li>
                        <li>Edifice</li>
                        <li>Vintage</li>
                        <li>Baby-G</li>
                    </ul>
                </div>

                <div className="catalog-footer-col">
                    <h4>Services</h4>
                    <ul>
                        <li>Bảo hành toàn cầu</li>
                        <li>Chăm sóc đồng hồ</li>
                        <li>Tư vấn mua sắm</li>
                        <li>Cửa hàng</li>
                    </ul>
                </div>

                <div className="catalog-footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li>Câu chuyện thương hiệu</li>
                        <li>Tin tức</li>
                        <li>Sự kiện</li>
                        <li>Liên hệ</li>
                    </ul>
                </div>
            </div>

            <div className="catalog-footer-bottom">2026 CASIO ALL RIGHTS RESERVED</div>
        </footer>
    );
};

export default SiteFooter;

