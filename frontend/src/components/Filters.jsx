import React from "react";

const Filters = ({ filters, brands, onFilterChange, onReset }) => {
    return (
        <aside className="catalog-filters">
            <h3 className="catalog-filters-title">Bo loc</h3>

            <div className="catalog-filter-group">
                <label htmlFor="search">Tim kiem</label>
                <input
                    id="search"
                    type="text"
                    value={filters.q}
                    onChange={(e) => onFilterChange("q", e.target.value)}
                    placeholder="Ten dong ho..."
                />
            </div>

            <div className="catalog-filter-group">
                <label htmlFor="brand">Thuong hieu</label>
                <select
                    id="brand"
                    value={filters.brand}
                    onChange={(e) => onFilterChange("brand", e.target.value)}
                >
                    <option value="">Tat ca</option>
                    {brands.map((brand) => (
                        <option key={brand} value={brand}>
                            {brand}
                        </option>
                    ))}
                </select>
            </div>

            <div className="catalog-filter-group">
                <label htmlFor="sort">Sap xep</label>
                <select
                    id="sort"
                    value={filters.sort}
                    onChange={(e) => onFilterChange("sort", e.target.value)}
                >
                    <option value="">Mac dinh</option>
                    <option value="price_asc">Gia tang dan</option>
                    <option value="price_desc">Gia giam dan</option>
                    <option value="name_asc">Ten A-Z</option>
                    <option value="name_desc">Ten Z-A</option>
                </select>
            </div>

            <div className="catalog-filter-grid">
                <div className="catalog-filter-group">
                    <label htmlFor="minPrice">Gia tu</label>
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
                    <label htmlFor="maxPrice">Den</label>
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
                Dat lai bo loc
            </button>
        </aside>
    );
};

export default Filters;
