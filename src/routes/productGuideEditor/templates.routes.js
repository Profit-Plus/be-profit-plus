const templateController = require('../../controllers/productGuideEditor/templates.controller');
const express = require('express');

const productGuideProductTemplate = express.Router();

productGuideProductTemplate.post('/product/add-new-product', templateController.addNewProduct);

module.exports = productGuideProductTemplate;