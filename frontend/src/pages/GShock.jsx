import React, { useEffect, useMemo, useState } from "react";
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

import productsApi from "../api/productsApi";

const GShock = () => {
    const dispatch = useDispatch();
    const { items, pagination, filters, status, error } = useSelector((state) => state.products);
    const [heroImage, setHeroImage] = useState('/img/login1.jpg');

    useEffect(() => {
        // Apply category filter for G-Shock when this page mounts
        dispatch(
            setProductsFilters({
                category: "G-Shock",
                page: 1,
                limit: 12,
            })
        );
    }, [dispatch]);

    useEffect(() => {
        let mounted = true;
        const loadHero = async () => {
            try {
                const res = await productsApi.getProducts({ category: 'G-Shock', page: 1, limit: 1 });
                if (!mounted) return;
                const img = res?.data?.data?.[0]?.image_url || '/img/login1.jpg';
                setHeroImage(img);
            } catch (err) {
                // ignore
            }
        };

        loadHero();
        return () => {
            mounted = false;
        };
    }, []);

    useEffect(() => {
        dispatch(fetchProductsThunk(filters));
    }, [dispatch, filters]);

    const brands = useMemo(() => {
        return ["G-SHOCK"];
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

    const visibleProducts = items;
    const totalItems = pagination.total || 0;

    return (
        <div className="catalog-page">
            <section
                className="catalog-hero"
                style={{
                    backgroundImage: `linear-gradient(120deg, rgba(8, 8, 8, 0.96), rgba(8, 8, 8, 0.62)), url("${heroImage}")`,
                }}
            >
                <div className="catalog-hero-overlay" />
                <div className="catalog-hero-inner">
                    <div className="catalog-hero-copy">
                        <p className="catalog-subheading">Bộ sưu tập 2026</p>
                        <h1>G-SHOCK. Bậc thầy chế tác</h1>
                        <p>
                            Khám phá những mẫu đồng hồ nổi bật với thiết kế bền bỉ, tinh tế và
                            mang đậm nhận diện sang trọng của CASIO.
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
                            src={heroImage}
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
                            <p className="catalog-kicker">Danh sách sản phẩm</p>
                            <h2>Đồng hồ thể hiện phong cách và độ bền</h2>
                        </div>

                        <div className="catalog-toolbar-summary">
                            <span>{totalItems} sản phẩm</span>
                            <span>Trang {pagination.page || 1}</span>
                        </div>
                    </div>

                    {status === "loading" && <p className="catalog-status">Đang tải sản phẩm...</p>}
                    {status === "failed" && (
                        <p className="catalog-error">
                            {error || "Không thể tải sản phẩm"}.
                        </p>
                    )}

                    {status === "succeeded" && items.length === 0 && (
                        <p className="catalog-status">Không tìm thấy sản phẩm phù hợp bộ lọc.</p>
                    )}

                    <div className="catalog-grid">
                        {visibleProducts.map((product) => (
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
                                Thưởng thức những bộ sưu tập được chọn lọc, nổi bật với tông màu
                                đen, vàng và cổ điển hiện đại. Một không gian mua sắm mang cảm giác
                                như showroom thật.
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

export default GShock;

