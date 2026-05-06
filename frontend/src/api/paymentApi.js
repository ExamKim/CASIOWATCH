import axiosClient from './axiosClient';

const paymentApi = {
    payCOD: (orderId) =>
        axiosClient.post('/payments/cod', { orderId }),
    createQR: (orderId) =>
        axiosClient.post('/payments/qr', { orderId }),
    confirmOnline: async (orderId, method) => {
        try {
            return await axiosClient.post('/payments/confirm', { orderId, method });
        } catch (error) {
            if (error?.response?.status === 404) {
                return axiosClient.post('/payments/confirm-online', { orderId, method });
            }
            throw error;
        }
    },
    simulateCard: (orderId, result) =>
        axiosClient.get(`/payments/card/${orderId}/simulate`, { params: { result } }),
};

export default paymentApi;
