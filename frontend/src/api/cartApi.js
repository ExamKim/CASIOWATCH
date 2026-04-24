import axiosClient from "./axiosClient";

const cartApi = {
    getCart() {
        return axiosClient.get("/cart");
    },

    addToCart(payload) {
        return axiosClient.post("/cart/items", payload);
    },

    updateCartItem(productId, payload) {
        return axiosClient.put(`/cart/items/${productId}`, payload);
    },

    removeFromCart(productId) {
        return axiosClient.delete(`/cart/items/${productId}`);
    },
};

export default cartApi;
