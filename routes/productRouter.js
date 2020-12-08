const express = require('express');
const productController = require('./../controller/productController');

const router = express.Router();

router.get('/all', productController.getAllProduct);
router.get('/add', productController.addProduct);

module.exports = router;
