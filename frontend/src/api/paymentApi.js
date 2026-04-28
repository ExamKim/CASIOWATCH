import axiosClient from './axiosClient';

const paymentApi = {
    payCOD: (orderId) =>
        axiosClient.post('/payments/cod', { orderId }),
    createQR: (orderId) =>
        axiosClient.post('/payments/qr', { orderId }),
    simulateCard: (orderId, result) =>
        axiosClient.get(`/payments/card/${orderId}/simulate`, { params: { result } }),
    adminConfirm: (orderId) =>
        axiosClient.put(`/payments/orders/${orderId}/confirm-payment`),
};

export default paymentApi;
