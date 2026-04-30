import axiosClient from "./axiosClient";

const productsApi = {
    // query params: q, brand, minPrice, maxPrice, sort, page, limit
    getProducts: (params) => axiosClient.get("/products", { params }),
    getProductById: (id) => axiosClient.get(`/products/${id}`),
    createProduct: (payload) => axiosClient.post("/products", payload),
    updateProduct: (id, payload) => axiosClient.put(`/products/${id}`, payload),
    deleteProduct: (id) => axiosClient.delete(`/products/${id}`),
};

export default productsApi;