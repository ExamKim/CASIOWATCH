import axiosClient from './axiosClient';

const paymentApi = {
    payCOD: (orderId) =>
        axiosClient.post('/payments/cod', { orderId }),
    createQR: (orderId) =>
        axiosClient.post('/payments/qr', { orderId }),
};

export default paymentApi;
