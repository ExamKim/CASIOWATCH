import axiosClient from "./axiosClient";

const ordersApi = {
    getMyOrders: (params) => axiosClient.get("/orders/my", { params }),
    getOrderById: (id) => axiosClient.get(`/orders/${id}`),
    createOrder: () => axiosClient.post("/orders", {}),
};

export default ordersApi;