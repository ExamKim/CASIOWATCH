import axiosClient from "./axiosClient";

const ordersApi = {
    getMyOrders: (params) => axiosClient.get("/orders/my", { params }),
    getOrderById: (id) => axiosClient.get(`/orders/${id}`),
    createOrder: (payload = {}) => axiosClient.post("/orders", payload),
    cancelOrder: (id) => axiosClient.post(`/orders/${id}/cancel`),
};

export default ordersApi;
