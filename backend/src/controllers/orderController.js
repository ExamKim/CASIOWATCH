const orderService = require("../services/orderService");

exports.createOrder = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const created = await orderService.createOrderFromCart(userId);
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