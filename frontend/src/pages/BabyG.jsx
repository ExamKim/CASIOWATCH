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

const BabyG = () => {
    const dispatch = useDispatch();
    const { items, pagination, filters, status, error } = useSelector((state) => state.products);
    const [heroImage, setHeroImage] = useState('/img/login1.jpg');

    useEffect(() => {
        dispatch(
            setProductsFilters({
                category: "Baby-G",
                page: 1,
                limit: 12,
            })
        );
    }, [dispatch]);

    useEffect(() => {
        let mounted = true;
        const loadHero = async () => {
            try {
                const res = await productsApi.getProducts({ category: 'Baby-G', page: 1, limit: 1 });
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

    const brands = useMemo(() => ["BABY-G"], [items]);

    const handleFilterChange = (key, value) => {
        dispatch(setProductsFilters({ [key]: value, page: 1 }));
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
            <section className="catalog-hero" style={{ backgroundImage: `linear-gradient(120deg, rgba(8, 8, 8, 0.96), rgba(8, 8, 8, 0.62)), url("${heroImage}")` }}>
                <div className="catalog-hero-overlay" />
                <div className="catalog-hero-inner">
                    <div className="catalog-hero-copy">
                        <p className="catalog-subheading">Bộ sưu tập Baby-G</p>
                        <h1>BABY-G Collection</h1>
                        <p>Nhung mau đồng hồ tre trung va nang dong cho phai nu.</p>

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
                                <strong>1 nam</strong>
                                <span>Bảo hành chính hãng</span>
                            </div>
                        </div>
                    </div>

                    <div className="catalog-hero-panel">
                        <img
                            src={heroImage}
                            alt="Baby-G showcase"
                            onError={(e) => (e.currentTarget.src = "/img/login1.jpg")}
                        />
                    </div>
                </div>
            </section>

            <section className="catalog-content">
                <Filters filters={filters} brands={brands} onFilterChange={handleFilterChange} onReset={handleResetFilters} />

                <div className="catalog-list-wrap">
                    <div className="catalog-toolbar">
                        <div>
                            <p className="catalog-kicker">Danh sách sản phẩm</p>
                            <h2>Đồng hồ Baby-G</h2>
                        </div>

                        <div className="catalog-toolbar-summary">
                            <span>{totalItems} sản phẩm</span>
                            <span>Trang {pagination.page || 1}</span>
                        </div>
                    </div>

                    {status === "loading" && <p className="catalog-status">Đang tải sản phẩm...</p>}
                    {status === "failed" && <p className="catalog-error">{error || 'Không thể tải sản phẩm'}.</p>}

                    <div className="catalog-grid">
                        {visibleProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>

                    {items.length > 0 && (
                        <Pagination page={pagination.page || 1} totalPages={pagination.totalPages || 0} onPageChange={handlePageChange} />
                    )}
                </div>
            </section>

            <SiteFooter />
        </div>
    );
};

export default BabyG;

