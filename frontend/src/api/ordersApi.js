import axiosClient from "./axiosClient";

const ordersApi = {
    getOrders: (params) => axiosClient.get("/orders", { params }),
    getOrderById: (id) => axiosClient.get(`/orders/${id}`),
    createOrder: (orderData) => axiosClient.post("/orders", orderData),
    updateOrder: (id, orderData) => axiosClient.put(`/orders/${id}`, orderData),
    deleteOrder: (id) => axiosClient.delete(`/orders/${id}`),
};

export default ordersApi;