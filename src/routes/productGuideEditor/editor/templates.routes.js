const templateController = require('../../../controllers/productGuideEditor/editor/templates.controller');
const express = require('express');

const productGuideProductTemplate = express.Router();

productGuideProductTemplate.post('/product/add-new-product', templateController.addNewProduct);
productGuideProductTemplate.get('/product/get-products', templateController.getProducts);

module.exports = productGuideProductTemplate;