import axiosClient from "./axiosClient";

function resolveProductAndQty(arg1, arg2) {
    if (typeof arg1 === "object" && arg1 !== null) {
        return {
            productId: arg1.productId,
            quantity: arg1.quantity,
        };
    }

    return { productId: arg1, quantity: arg2 };
}

const cartApi = {
    getCart: () => axiosClient.get("/cart"),
    addToCart: (arg1, arg2) => {
        const { productId, quantity } = resolveProductAndQty(arg1, arg2);
        return axiosClient.post("/cart/items", { productId, quantity });
    },
    updateCartItem: (arg1, arg2) => {
        const { productId, quantity } = resolveProductAndQty(arg1, arg2);
        return axiosClient.put(`/cart/items/${productId}`, { quantity });
    },
    removeFromCart: (productId) => axiosClient.delete(`/cart/items/${productId}`),
};

export default cartApi;
