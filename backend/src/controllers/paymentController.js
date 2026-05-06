const paymentService = require("../services/paymentService");

// User chọn COD
exports.payCOD = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { orderId } = req.body;

        const order = await paymentService.setCODPayment({
            orderId: Number(orderId),
            userId: Number(userId),
        });

        res.json({ message: "COD selected", order });
    } catch (err) {
        next(err);
    }
};

// User tạo QR attempt
exports.createQR = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { orderId } = req.body;

        const data = await paymentService.createQRPayment({
            orderId: Number(orderId),
            userId: Number(userId),
        });

        res.json(data); // { note, qrContent }
    } catch (err) {
        next(err);
    }
};

// User xác nhận thanh toán online (QR/MoMo/Thẻ)
exports.confirmOnline = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const { orderId, method } = req.body;

        const order = await paymentService.confirmOnlinePayment({
            orderId: Number(orderId),
            userId: Number(userId),
            method: String(method || ""),
        });

        res.json({ message: "Payment confirmed", order });
    } catch (err) {
        next(err);
    }
};

// Card stub simulate
exports.simulateCard = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        const orderId = Number(req.params.orderId);
        const { result } = req.query; // success|fail

        const order = await paymentService.simulateCardPayment({
            orderId,
            userId: Number(userId),
            result: String(result || ""),
        });

        res.json({ message: "Card simulation done", order });
    } catch (err) {
        next(err);
    }
};