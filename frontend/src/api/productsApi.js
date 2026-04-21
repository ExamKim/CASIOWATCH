import axiosClient from "./axiosClient";

const productsApi = {
    // query params: q, brand, minPrice, maxPrice, sort, page, limit
    getProducts: (params) => axiosClient.get("/products", { params }),
    getProductById: (id) => axiosClient.get(`/products/${id}`),
};

export default productsApi;