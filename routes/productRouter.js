const express = require('express');
const productController = require('./../controller/productController');

const router = express.Router();

// VIEW
router.get('/all', productController.getProducts);
router.get('/add', productController.addProduct);
router.get('/update/:id', productController.updateProduct);

module.exports = router;
