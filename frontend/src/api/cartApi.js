import axiosClient from "./axiosClient";

const cartApi = {
    getCarts: (params) => axiosClient.get("/carts", { params }),
    getCartById: (id) => axiosClient.get(`/carts/${id}`),
    addProductToCart: (cartId, productId, quantity) => axiosClient.post(`/carts/${cartId}/products`, { productId, quantity }),
    updateCartItem: (cartId, itemId, quantity) => axiosClient.put(`/carts/${cartId}/items/${itemId}`, { quantity }),
    removeItemFromCart: (cartId, itemId) => axiosClient.delete(`/carts/${cartId}/items/${itemId}`),
};

export default cartApi;