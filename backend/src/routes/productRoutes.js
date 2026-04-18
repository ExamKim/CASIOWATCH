const express = require('express');
const { validateProduct } = require('../middlewares/validate.js');
const router = express.Router();
const {
    getAllProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    getSaleProducts
} = require('../controllers/productController');
router.get('/', getAllProducts);
router.get('/sale', getSaleProducts);
router.get('/:id', getProductById);
router.post("/", validateProduct, createProduct);
router.put('/:id', validateProduct, updateProduct);
router.delete('/:id', deleteProduct);
module.exports = router;