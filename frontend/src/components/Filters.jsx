import React from "react";

const GENDER_OPTIONS = [
    { label: "Nam", value: "men" },
    { label: "Nữ", value: "women" },
    { label: "Unisex", value: "unisex" },
];

const Filters = ({ filters, categories, brands, onFilterChange, onReset }) => {
    const categoryOptions = categories || brands || [];
    const selectedGenders = Array.isArray(filters.gender) ? filters.gender : [];

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
                <label htmlFor="category">Dòng sản phẩm</label>
                <select
                    id="category"
                    value={filters.category}
                    onChange={(e) => onFilterChange("category", e.target.value)}
                >
                    <option value="">Tất cả</option>
                    {categoryOptions.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            <div className="catalog-filter-group">
                <label>Giới tính</label>
                <div className="catalog-filter-checklist">
                    {GENDER_OPTIONS.map((option) => (
                        <label key={option.value} className="catalog-filter-check">
                            <input
                                type="checkbox"
                                checked={selectedGenders.includes(option.value)}
                                onChange={(e) => onFilterChange("gender", option.value, e.target.checked)}
                            />
                            <span>{option.label}</span>
                        </label>
                    ))}
                </div>
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

