import axiosClient from './axiosClient';

const paymentApi = {
    payCOD: (orderId) =>
        axiosClient.post('/payments/cod', { orderId }),
    createQR: (orderId) =>
        axiosClient.post('/payments/qr', { orderId }),
    simulateCard: (orderId, result) =>
        axiosClient.get(`/payments/card/${orderId}/simulate`, { params: { result } }),
};

export default paymentApi;
