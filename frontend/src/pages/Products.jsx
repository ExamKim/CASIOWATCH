import React, { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import Filters from "../components/Filters";
import ProductCard from "../components/ProductCard";
import Pagination from "../components/Pagination";
import SiteFooter from "../components/SiteFooter";
import { fetchProductsThunk, setProductsFilters, setProductsPage } from "../store/productSlice";
import "../styles/catalog.css";

const DEFAULT_FILTERS = {
    q: "",
    category: "",
    gender: [],
    minPrice: "",
    maxPrice: "",
    sort: "",
    page: 1,
    limit: 12,
};

const STATIC_CATEGORIES = ["G-Shock", "Edifice", "Baby-G", "Vintage", "Classic", "G-SQUAD", "SHEEN", "PRO TREK"];

const Products = () => {
    const dispatch = useDispatch();
    const { items, pagination, filters, status, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(setProductsFilters(DEFAULT_FILTERS));
        dispatch(fetchProductsThunk(DEFAULT_FILTERS));
    }, [dispatch]);

    const categories = useMemo(() => {
        const fromData = items
            .map((item) => item?.category)
            .filter(Boolean)
            .map((category) => String(category).trim());

        return Array.from(new Set([...STATIC_CATEGORIES, ...fromData]));
    }, [items]);

    const handleFilterChange = (key, value, checked) => {
        if (key === "gender") {
            const current = Array.isArray(filters.gender) ? filters.gender : [];
            const nextGender = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((item) => item !== value);

            const nextFilters = {
                ...filters,
                gender: nextGender,
                page: 1,
            };

            dispatch(setProductsFilters(nextFilters));
            dispatch(fetchProductsThunk(nextFilters));
            return;
        }

        const nextFilters = {
            ...filters,
            [key]: value,
            page: 1,
        };

        dispatch(setProductsFilters(nextFilters));
        dispatch(fetchProductsThunk(nextFilters));
    };

    const handleResetFilters = () => {
        dispatch(setProductsFilters(DEFAULT_FILTERS));
        dispatch(fetchProductsThunk(DEFAULT_FILTERS));
    };

    const handlePageChange = (nextPage) => {
        const nextFilters = {
            ...filters,
            page: nextPage,
        };

        dispatch(setProductsPage(nextPage));
        dispatch(fetchProductsThunk(nextFilters));
    };

    const totalItems = pagination.total || 0;

    return (
        <div className="catalog-page">
            <section className="catalog-hero">
                <div className="catalog-hero-overlay" />
                <div className="catalog-hero-inner">
                    <div className="catalog-hero-copy">
                        <p className="catalog-subheading">Danh mục tổng hợp</p>
                        <h1>CASIO. Chọn phong cách của bạn</h1>
                        <p>
                            Khám phá toàn bộ đồng hồ CASIO chính hãng từ G-SHOCK, BABY-G, EDIFICE đến nhiều dòng sản phẩm nổi bật khác.
                        </p>

                        <div className="catalog-hero-stats">
                            <div>
                                <strong>{totalItems}</strong>
                                <span>Sản phẩm</span>
                            </div>
                            <div>
                                <strong>24h</strong>
                                <span>Giao hàng nhanh</span>
                            </div>
                            <div>
                                <strong>1 năm</strong>
                                <span>Bảo hành chính hãng</span>
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
                    categories={categories}
                    onFilterChange={handleFilterChange}
                    onReset={handleResetFilters}
                />

                <div className="catalog-list-wrap">
                    <div className="catalog-toolbar">
                        <div>
                            <p className="catalog-kicker">Danh sách sản phẩm</p>
                            <h2>Tất cả sản phẩm đồng hồ CASIO</h2>
                        </div>

                        <div className="catalog-toolbar-summary">
                            <span>{totalItems} sản phẩm</span>
                            <span>Trang {pagination.page || 1}</span>
                        </div>
                    </div>

                    {status === "loading" && <p className="catalog-status">Đang tải sản phẩm...</p>}
                    {status === "failed" && <p className="catalog-error">{error || "Không thể tải sản phẩm"}.</p>}

                    {status === "succeeded" && items.length === 0 && (
                        <p className="catalog-status">Không tìm thấy sản phẩm phù hợp bộ lọc.</p>
                    )}

                    <div className="catalog-grid">
                        {items.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {items.length > 0 && (
                        <Pagination
                            page={pagination.page || 1}
                            totalPages={pagination.totalPages || 0}
                            onPageChange={handlePageChange}
                        />
                    )}

                    <section className="catalog-promo">
                        <div className="catalog-promo-copy">
                            <p className="catalog-subheading">Đồng hồ cao cấp</p>
                            <h2>Gia nhập cộng đồng đồng hồ cao cấp.</h2>
                            <p>
                                Thưởng thức những bộ sưu tập được chọn lọc, nổi bật với tông màu đen, vàng và cổ điển hiện đại. Một không gian mua sắm mang cảm giác như showroom thật.
                            </p>

                            <div className="catalog-promo-form">
                                <input type="email" placeholder="Email của bạn" />
                                <button type="button">Đăng ký nhận tin</button>
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

