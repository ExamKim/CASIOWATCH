const orderService = require("../services/orderService");

exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const selectedProductIds = Array.isArray(req.body?.selectedProductIds)
            ? req.body.selectedProductIds
            : [];
        const buyNowProductId = Number(req.body?.buyNowProductId);
        const buyNowQuantity = Math.max(1, Number(req.body?.buyNowQuantity) || 1);
        const shippingInfo = {
            address: req.body?.address,
            phone: req.body?.phone,
            note: req.body?.note,
            recipient: req.body?.recipient || req.body?.fullName || req.body?.full_name || req.body?.recipient_name,
            buyNowQuantity,
        };
        const created = await orderService.createOrderFromCart(userId, selectedProductIds, buyNowProductId, shippingInfo);
        res.status(201).json(created);
    } catch (err) {
        next(err);
    }
};

exports.getMyOrders = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orders = await orderService.getMyOrders(userId);
        res.json(orders);
    } catch (err) {
        next(err);
    }
};

exports.getOrderById = async (req, res, next) => {
    try {
        const orderId = Number(req.params.id);
        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({ message: "Invalid order id" });
        }

        const order = await orderService.getOrderDetail(orderId);

        if (!order) return res.status(404).json({ message: "Order not found" });

        if (req.user.role !== "admin" && order.user_id !== req.user.id) {
            return res.status(403).json({ message: "Forbidden" });
        }

        res.json(order);
    } catch (err) {
        next(err);
    }
};

exports.cancelOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const orderId = Number(req.params.id);

        if (!Number.isInteger(orderId) || orderId <= 0) {
            return res.status(400).json({ message: "Invalid order id" });
        }

        const order = await orderService.cancelOrder({ orderId, userId });
        res.json({ message: "Order cancelled", order });
    } catch (err) {
        next(err);
    }
};
