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

// Admin confirm payment cho order
exports.confirmOrderPayment = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        const order = await paymentService.confirmPayment({ orderId });
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