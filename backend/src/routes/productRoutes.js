const express = require("express");
const { validateProduct } = require("../middlewares/validate.js");
const authMiddleware = require("../middlewares/authMiddleware");
const roleMiddleware = require("../middlewares/roleMiddleware");

const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSaleProducts,
} = require("../controllers/productController");

router.get("/", getAllProducts);
router.get("/sale", getSaleProducts);
router.get("/:id", getProductById);

// admin CRUD
router.post("/", authMiddleware, roleMiddleware("admin"), validateProduct, createProduct);
router.put("/:id", authMiddleware, roleMiddleware("admin"), validateProduct, updateProduct);
router.delete("/:id", authMiddleware, roleMiddleware("admin"), deleteProduct);

module.exports = router;