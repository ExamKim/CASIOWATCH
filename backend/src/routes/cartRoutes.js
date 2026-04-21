const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
} = require("../controllers/cartController");

router.get("/", authMiddleware, getCart);
router.post("/items", authMiddleware, addToCart);
router.put("/items/:productId", authMiddleware, updateCartItem);
router.delete("/items/:productId", authMiddleware, removeFromCart);

module.exports = router;