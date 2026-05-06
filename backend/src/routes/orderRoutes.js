const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

const {
    getMyOrders,
    getOrderById,
    createOrder,
    cancelOrder,
} = require("../controllers/orderController");

router.get("/my", authMiddleware, getMyOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.post("/:id/cancel", authMiddleware, cancelOrder);

module.exports = router;
