import axiosClient from "./axiosClient";

const cartApi = {
    getCart: () => axiosClient.get("/cart"),
    addToCart: (productId, quantity) => axiosClient.post("/cart/items", { productId, quantity }),
    updateCartItem: (productId, quantity) => axiosClient.put(`/cart/items/${productId}`, { quantity }),
    removeFromCart: (productId) => axiosClient.delete(`/cart/items/${productId}`),
};

export default cartApi;