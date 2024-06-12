const express = require('express');
const router = express.Router();

const productController = require('../../controllers/tariffControllers/productController');

router.post('/createProduct/:sheet_id', productController.createProductSheet);
router.get('/getProduct/:sheet_id', productController.getProductSheet);
router.get('/getTaxonomy', productController.getTaxonomy);
router.get('/getSubTaxonomy/:taxonomy_id', productController.getSubTaxonomy);
router.get('/getUser', productController.getUser);
router.get('/getUnit', productController.getUnit);
router.put('/updateProduct/:sheet_id', productController.updateProductSheet);

module.exports = router;