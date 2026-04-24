import React from "react";

function getVisiblePages(current, total) {
    if (total <= 7) {
        return Array.from({ length: total }, (_, idx) => idx + 1);
    }

    const pages = [1];
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i += 1) pages.push(i);
    if (end < total - 1) pages.push("...");

    pages.push(total);
    return pages;
}

const Pagination = ({ page, totalPages, onPageChange }) => {
    if (!totalPages || totalPages <= 1) return null;

    const pages = getVisiblePages(page, totalPages);

    return (
        <div className="catalog-pagination">
            <button
                type="button"
                className="catalog-page-btn"
                disabled={page <= 1}
                onClick={() => onPageChange(page - 1)}
            >
                Truoc
            </button>

            {pages.map((item, idx) => {
                if (item === "...") {
                    return (
                        <span key={`dots-${idx}`} className="catalog-page-dots">
                            ...
                        </span>
                    );
                }

                return (
                    <button
                        key={item}
                        type="button"
                        className={`catalog-page-btn ${item === page ? "active" : ""}`}
                        onClick={() => onPageChange(item)}
                    >
                        {item}
                    </button>
                );
            })}

            <button
                type="button"
                className="catalog-page-btn"
                disabled={page >= totalPages}
                onClick={() => onPageChange(page + 1)}
            >
                Sau
            </button>
        </div>
    );
};

export default Pagination;
