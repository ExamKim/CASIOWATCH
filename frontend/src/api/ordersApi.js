import axiosClient from "./axiosClient";

const ordersApi = {
    getOrders: (params) => axiosClient.get("/orders", { params }),
    getMyOrders: (params) => axiosClient.get("/orders/my", { params }),
    getOrderById: (id) => axiosClient.get(`/orders/${id}`),
    createOrder: () => axiosClient.post("/orders", {}),
    updateOrderStatus: (id, status) => axiosClient.put(`/orders/${id}/status`, { status }),
    confirmOrderPayment: (id) => axiosClient.put(`/orders/${id}/confirm-payment`),
};

export default ordersApi;