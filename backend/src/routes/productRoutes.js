const express = require('express');
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
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
module.exports = router;