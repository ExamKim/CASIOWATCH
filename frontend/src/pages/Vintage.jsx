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

const Vintage = () => {
    const dispatch = useDispatch();
    const { items, pagination, filters, status, error } = useSelector((state) => state.products);

    useEffect(() => {
        dispatch(
            setProductsFilters({
                category: "Vintage",
                gender: [],
                page: 1,
                limit: 12,
            })
        );
    }, [dispatch]);

    useEffect(() => {
        dispatch(fetchProductsThunk(filters));
    }, [dispatch, filters]);

    const brands = useMemo(() => ["VINTAGE"], [items]);

    const handleFilterChange = (key, value, checked) => {
        if (key === "gender") {
            const current = Array.isArray(filters.gender) ? filters.gender : [];
            const nextGender = checked
                ? Array.from(new Set([...current, value]))
                : current.filter((item) => item !== value);

            dispatch(
                setProductsFilters({
                    ...filters,
                    gender: nextGender,
                    page: 1,
                })
            );
            return;
        }

        dispatch(setProductsFilters({ [key]: value, page: 1 }));
    };

    const handleResetFilters = () => {
        dispatch(
            setProductsFilters({
                q: "",
                brand: "",
                gender: [],
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
            <section className="catalog-hero">
                <div className="catalog-hero-overlay" />
                <div className="catalog-hero-inner">
                    <div className="catalog-hero-copy">
                        <p className="catalog-subheading">Bộ sưu tập Vintage</p>
                        <h1>Vintage Collection</h1>
                        <p>Khám phá các mẫu cổ điển với phong cách vượt thời gian.</p>
                        <div className="catalog-hero-stats">
                            <div>
                                <strong>{totalItems}</strong>
                                <span>Sản phẩm</span>
                            </div>
                        </div>
                    </div>
                    <div className="catalog-hero-panel">
                        <img src="/img/login1.jpg" alt="Vintage" onError={(e) => e.currentTarget.src = '/img/login1.jpg'} />
                    </div>
                </div>
            </section>

            <section className="catalog-content">
                <Filters filters={filters} brands={brands} onFilterChange={handleFilterChange} onReset={handleResetFilters} />
                <div className="catalog-list-wrap">
                    <div className="catalog-toolbar">
                        <div>
                            <p className="catalog-kicker">Danh sách sản phẩm</p>
                            <h2>Đồng hồ Vintage</h2>
                        </div>
                        <div className="catalog-toolbar-summary">
                            <span>{totalItems} sản phẩm</span>
                            <span>Trang {pagination.page || 1}</span>
                        </div>
                    </div>

                    {status === "loading" && <p className="catalog-status">Đang tải sản phẩm...</p>}
                    {status === "failed" && <p className="catalog-error">{error || 'Không thể tải sản phẩm'}.</p>}

                    <div className="catalog-grid">
                        {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
                    </div>

                    {items.length > 0 && <Pagination page={pagination.page || 1} totalPages={pagination.totalPages || 0} onPageChange={handlePageChange} />}

                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default Vintage;

