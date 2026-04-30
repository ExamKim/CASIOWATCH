import React from "react";

const Filters = ({ filters, brands, onFilterChange, onReset }) => {
    return (
        <aside className="catalog-filters">
            <h3 className="catalog-filters-title">Bộ lọc</h3>

            <div className="catalog-filter-group">
                <label htmlFor="search">Tìm kiếm</label>
                <input
                    id="search"
                    type="text"
                    value={filters.q}
                    onChange={(e) => onFilterChange("q", e.target.value)}
                    placeholder="Tên đồng hồ..."
                />
            </div>

            <div className="catalog-filter-group">
                <label htmlFor="brand">Thương hiệu</label>
                <select
                    id="brand"
                    value={filters.brand}
                    onChange={(e) => onFilterChange("brand", e.target.value)}
                >
                    <option value="">Tất cả</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>

            <div className="catalog-filter-group">
                <label htmlFor="sort">Sắp xếp</label>
                <select
                    id="sort"
                    value={filters.sort}
                    onChange={(e) => onFilterChange("sort", e.target.value)}
                >
                    <option value="">Mặc định</option>
                    <option value="price_asc">Giá tăng dần</option>
                    <option value="price_desc">Giá giảm dần</option>
                    <option value="name_asc">Tên A-Z</option>
                    <option value="name_desc">Tên Z-A</option>
                </select>
            </div>

            <div className="catalog-filter-grid">
                <div className="catalog-filter-group">
                    <label htmlFor="minPrice">Giá từ</label>
                    <input
                        id="minPrice"
                        type="number"
                        min="0"
                        value={filters.minPrice}
                        onChange={(e) => onFilterChange("minPrice", e.target.value)}
                        placeholder="0"
                    />
                </div>

                <div className="catalog-filter-group">
                    <label htmlFor="maxPrice">Đến</label>
                    <input
                        id="maxPrice"
                        type="number"
                        min="0"
                        value={filters.maxPrice}
                        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                        placeholder="1000"
                    />
                </div>
            </div>

            <button type="button" className="catalog-reset-btn" onClick={onReset}>
                Đặt lại bộ lọc
            </button>
        </aside>
    );
};

export default Filters;

