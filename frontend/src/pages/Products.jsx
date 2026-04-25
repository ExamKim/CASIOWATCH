import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import SiteFooter from "../components/SiteFooter";
import {
    fetchProductsThunk,
    setProductsFilters,
    setProductsPage,
} from "../store/productSlice";
import "../styles/catalog.css";

const STATIC_BRANDS = ["CASIO", "G-SHOCK", "EDIFICE", "BABY-G", "SHEEN", "PRO TREK"];
const FALLBACK_PRODUCTS = [
    { id: "fallback-1", name: "G-SHOCK GM-3500GD", brand: "G-SHOCK", price: 520, sale_price: 450, image_url: "/img/login1.jpg" },
    { id: "fallback-2", name: "A168WEM-7EF Silver", brand: "CASIO", price: 89, sale_price: null, image_url: "/img/login1.jpg" },
    { id: "fallback-3", name: "EDIFICE EFR-556DB", brand: "EDIFICE", price: 210, sale_price: null, image_url: "/img/login1.jpg" },
    { id: "fallback-4", name: "BABY-G BA-110", brand: "BABY-G", price: 160, sale_price: 139, image_url: "/img/login1.jpg" },
];

const Products = () => {
    const dispatch = useDispatch();
    const { items, pagination, filters, status, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(fetchProductsThunk(filters));
    }, [dispatch, filters]);

    const brands = useMemo(() => {
        const fromData = items
            .map((item) => item?.brand)
            .filter(Boolean)
            .map((brand) => String(brand).trim());

        return Array.from(new Set([...STATIC_BRANDS, ...fromData]));
    }, [items]);

    const handleFilterChange = (key, value) => {
        dispatch(
            setProductsFilters({
                [key]: value,
                page: 1,
            })
        );
    };

    const handleResetFilters = () => {
        dispatch(
            setProductsFilters({
                q: "",
                brand: "",
                minPrice: "",
                maxPrice: "",
                sort: "",
                page: 1,
                limit: 12,
            })
        );
    };

    const handlePageChange = (nextPage) => {
        dispatch(setProductsPage(nextPage));
    };

    const visibleProducts = items.length > 0 ? items : FALLBACK_PRODUCTS;
    const isUsingFallback = items.length === 0 && status !== "loading";
    const totalItems = pagination.total || visibleProducts.length;

    return (
        <div className="catalog-page">
            <section className="catalog-hero">
                <div className="catalog-hero-overlay" />
                <div className="catalog-hero-inner">
                    <div className="catalog-hero-copy">
                        <p className="catalog-subheading">Bo suu tap 2026</p>
                        <h1>G-SHOCK. Bac thay che tac</h1>
                        <p>
                            Kham pha nhung mau dong ho noi bat voi thiet ke ben bi, tinh te va
                            mang dam nhan dien sang trong cua CASIO.
                        </p>

                        <div className="catalog-hero-stats">
                            <div>
                                <strong>{totalItems}</strong>
                                <span>San pham</span>
                            </div>
                            <div>
                                <strong>24h</strong>
                                <span>Giao hanh nhanh</span>
                            </div>
                            <div>
                                <strong>1 nam</strong>
                                <span>Bao hanh chinh hang</span>
                            </div>
                        </div>
                    </div>

                    <div className="catalog-hero-panel">
                        <img
                            src="/img/login1.jpg"
                            alt="Casio watch display"
                            onError={(e) => {
                                e.currentTarget.src = "/img/login1.jpg";
                            }}
                        />
                        <div className="catalog-hero-panel-copy">
                            <span>Limited edition</span>
                            <strong>Watch design lab</strong>
                        </div>
                    </div>
                </div>
            </section>

            <section className="catalog-content">
                <Filters
                    filters={filters}
                    brands={brands}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />

                <div className="catalog-list-wrap">
                    <div className="catalog-toolbar">
                        <div>
                            <p className="catalog-kicker">Danh sach san pham</p>
                            <h2>Dong ho the hien phong cach va do ben</h2>
                        </div>

                        <div className="catalog-toolbar-summary">
                            <span>{totalItems} san pham</span>
                            <span>Trang {pagination.page || 1}</span>
                        </div>
                    </div>

                    {status === "loading" && <p className="catalog-status">Dang tai san pham...</p>}
                    {status === "failed" && (
                        <p className="catalog-error">
                            {error || "Khong the tai san pham"}. Dang hien thi du lieu mau tam thoi.
                        </p>
                    )}

                    {status === "succeeded" && items.length === 0 && (
                        <p className="catalog-status">Khong tim thay san pham phu hop bo loc. Dang hien du lieu mau.</p>
                    )}

                    <div className="catalog-grid">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {!isUsingFallback && (
                        <Pagination
                            page={pagination.page || 1}
                            totalPages={pagination.totalPages || 0}
                            onPageChange={handlePageChange}
                        />
                    )}

                    <section className="catalog-promo">
                        <div className="catalog-promo-copy">
                            <p className="catalog-subheading">Dong ho cao cap</p>
                            <h2>Gia nhap cong dong dong ho cao cap.</h2>
                            <p>
                                Thuong thuc nhung bo suu tap duoc chon loc, noi bat voi ton mau
                                den, vang va co dien hien dai. Mot khong gian mua sam mang cam giac
                                nhu showroom that.
                            </p>

                            <div className="catalog-promo-form">
                                <input type="email" placeholder="Email cua ban" />
                                <button type="button">Dang ky nhan tin</button>
                            </div>
                        </div>

                        <div className="catalog-promo-media">
                            <img
                                src="/img/login1.jpg"
                                alt="Luxury watch showcase"
                                onError={(e) => {
                                    e.currentTarget.src = "/img/login1.jpg";
                                }}
                            />
                        </div>
                    </section>
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Products;
