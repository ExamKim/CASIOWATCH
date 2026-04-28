const express = require("express");
const router = express.Router();

const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");
const paymentController = require("../controllers/paymentController");

// user payment actions
router.post("/cod", authMiddleware, paymentController.payCOD);
router.post("/qr", authMiddleware, paymentController.createQR);
router.get("/card/:orderId/simulate", authMiddleware, paymentController.simulateCard);

// admin confirm
router.put("/orders/:id/confirm-payment",
    authMiddleware,
    roleMiddleware("admin"),
    paymentController.confirmOrderPayment
);

module.exports = router;