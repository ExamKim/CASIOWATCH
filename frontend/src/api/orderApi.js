import axiosClient from "./axiosClient";

const orderApi = {
    getOrders(params) {
        return axiosClient.get("/orders/my", { params });
    },

    getOrderById(id) {
        return axiosClient.get(`/orders/${id}`);
    },

    createOrder(payload) {
        return axiosClient.post("/orders", payload);
    },

    updateOrderStatus(id, status) {
        return axiosClient.put(`/orders/${id}/status`, { status });
    },
};

export default orderApi;
