const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const paymentController = require("../controllers/paymentController");

const {
    getMyOrders,
    getAllOrders,
    getOrderById,
    createOrder,
    updateOrderStatus,
} = require("../controllers/orderController");

router.get("/", authMiddleware, roleMiddleware("admin"), getAllOrders);
router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.put("/:id/status", authMiddleware, roleMiddleware("admin"), updateOrderStatus);
router.put(
    "/:id/confirm-payment",
    authMiddleware,
    roleMiddleware("admin"),
    paymentController.confirmOrderPayment
);
module.exports = router;