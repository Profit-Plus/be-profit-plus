const express = require('express');
const router = express.Router();
const sheetController = require('../../controllers/tariffControllers/sheetController');

router.post('/product', sheetController.createSheet);
router.get('', sheetController.getSheet);
router.get('/product/:id', sheetController.getSheetById);
router.put('/product/:id', sheetController.updateSheet);
router.delete('/product/:id', sheetController.deleteSheet);

module.exports = router;


// const express = require('express');
// const router = express.Router();
// const productController = require('../../controllers/tariffControllers/sheetController');

// router.get('/product', productController.getProducts);
// router.get('/product/:id', productController.getProductById);
// router.post('/product', productController.createProduct);
// router.put('/product/:id', productController.updateProduct);
// router.delete('/product/:id', productController.deleteProduct);

// module.exports = router;