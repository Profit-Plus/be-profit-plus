const express = require('express');
const router = express.Router();

const productController = require('../../controllers/tariffControllers/productController');

router.get('/getProduct/:sheet_id', productController.getProductSheet);

module.exports = router;