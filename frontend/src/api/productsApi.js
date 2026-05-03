import axiosClient from "./axiosClient";

function buildQueryString(params = {}) {
    const searchParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
        if (value == null || value === "") return;

        if (Array.isArray(value)) {
            value.forEach((item) => {
                if (item != null && item !== "") {
                    searchParams.append(key, item);
                }
            });
            return;
        }

        searchParams.set(key, value);
    });

    return searchParams.toString();
}

const productsApi = {
    // query params: q, category, gender[], brand, minPrice, maxPrice, sort, page, limit
    getProducts: (params) => {
        const query = buildQueryString(params);
        return axiosClient.get(query ? `/products?${query}` : "/products");
    },
    getCategories: () => axiosClient.get("/products/categories"),
    getProductById: (id) => axiosClient.get(`/products/${id}`),
    createProduct: (payload) => axiosClient.post("/products", payload),
    updateProduct: (id, payload) => axiosClient.put(`/products/${id}`, payload),
    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
};

export default productsApi;