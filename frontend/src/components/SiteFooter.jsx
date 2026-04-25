import React from "react";

const SiteFooter = () => {
    return (
        <footer className="catalog-footer">
            <div className="catalog-footer-grid">
                <div className="catalog-footer-col">
                    <h2 className="catalog-footer-logo">CASIO</h2>
                    <p>
                        Noi hoi tu nhung thiet ke dong ho bieu tuong, ket hop tinh than ky thuat va
                        ngon ngu thoi trang hien dai.
                    </p>
                    <div className="catalog-newsletter">
                        <input type="email" placeholder="Email cua ban" />
                        <button type="button">GUI</button>
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
                        <li>Bao hanh toan cau</li>
                        <li>Cham soc dong ho</li>
                        <li>Tu van mua sam</li>
                        <li>Cua hang</li>
                    </ul>
                </div>

                <div className="catalog-footer-col">
                    <h4>Company</h4>
                    <ul>
                        <li>Cau chuyen thuong hieu</li>
                        <li>Tin tuc</li>
                        <li>Su kien</li>
                        <li>Lien he</li>
                    </ul>
                </div>
            </div>

            <div className="catalog-footer-bottom">2026 CASIO ALL RIGHTS RESERVED</div>
        </footer>
    );
};

export default SiteFooter;
